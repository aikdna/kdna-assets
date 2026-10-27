import { readFileSync, lstatSync } from 'node:fs';
import { resolve, relative, isAbsolute, join, dirname } from 'node:path';
import { randomUUID } from 'node:crypto';
import { createRequire } from 'node:module';
import { isDeepStrictEqual } from 'node:util';
import { packageRoot, verifyToolchain, sha256 } from './toolchain.mjs';
const require=createRequire(import.meta.url);
export function resolveEntryFile(root,rel){
  if(typeof rel!=='string'||!rel||rel.includes('\\')||rel.includes('\0')||isAbsolute(rel)||rel.split('/').some(x=>!x||x==='.'||x==='..'))throw new Error('ASSETS_PATH_INVALID');
  const base=resolve(root);let p=base;
  if(lstatSync(base).isSymbolicLink()||!lstatSync(base).isDirectory())throw new Error('ASSETS_ROOT_INVALID');
  for(const part of rel.split('/')){p=join(p,part);if(lstatSync(p).isSymbolicLink())throw new Error('ASSETS_PATH_SYMLINK');}
  if(relative(base,p).startsWith('..')||!lstatSync(p).isFile())throw new Error('ASSETS_PATH_INVALID');
  return p;
}
export function verifyEntryFiles(root,entry){
  if(!Array.isArray(entry.files)||!entry.files.length)throw new Error('ASSETS_FILES_REQUIRED');
  const seen=new Set();const assetDirectory=dirname(entry.artifact.path);
  let asset,license;
  for(const f of entry.files){
    if(seen.has(f.path)||dirname(f.path)!==assetDirectory&&!f.path.startsWith(assetDirectory+'/'))throw new Error('ASSETS_FILE_SCOPE_INVALID');
    seen.add(f.path);const p=resolveEntryFile(root,f.path);
    if(lstatSync(p).size>64*1024*1024)throw new Error('ASSETS_FILE_TOO_LARGE');
    const bytes=readFileSync(p);
    if(bytes.length!==f.bytes||sha256(bytes)!==f.sha256)throw new Error('ASSETS_FILE_CHANGED: '+f.path);
    if(f.path===entry.artifact.path)asset={bytes,path:p,sha256:f.sha256};
    if(f.path===entry.license.path)license=f;
  }
  if(!asset||!license||entry.license.repository_license_applies!==false||entry.license.scope!=='asset-content-and-distribution'||!entry.license.id)throw new Error('ASSETS_LICENSE_OR_ARTIFACT_MISSING');
  if(asset.sha256!==entry.digest.value||entry.digest.algorithm!=='sha256')throw new Error('ASSETS_DIGEST_MISMATCH');
  return asset;
}
export function summarizeRead(r){
  if(r.channel==='read_envelope')return {channel:r.channel,status:r.envelope.status,diagnostics:r.envelope.diagnostics.map(d=>d.code),read_permission:r.envelope.states.read_permission,delivery:r.envelope.receipt.delivery};
  if(r.channel==='admission_rejection'){
    const failure=r.admission_rejection;
    const status=failure?.status==='unsupported'?'unsupported':'rejected';
    const diagnostics=[failure?.reason??failure?.diagnostic?.code].filter(value=>typeof value==='string'&&value);
    return {channel:r.channel,status,diagnostics,read_permission:'not_evaluated',delivery:'not_delivered'};
  }
  if(r.channel==='retained_failure'){
    const failure=r.retained_failure;
    const summary={channel:r.channel,status:'rejected',diagnostics:[failure?.diagnostic?.code??'READ_CORE_CAPABILITY_UNAVAILABLE'],read_permission:failure?.detail==='authority_denied'?'denied':'not_evaluated',delivery:'not_delivered'};
    if(typeof failure?.detail==='string'&&failure.detail)summary.detail=failure.detail;
    return summary;
  }
  if(r.channel==='no_body_control')return {channel:r.channel,status:'no_body',diagnostics:[r.control.code],read_permission:'not_evaluated',delivery:'not_delivered'};
  if(r.channel==='transport_failure')return {channel:r.channel,status:'failed',diagnostics:[r.transport_failure.code],read_permission:'not_evaluated',delivery:'not_delivered'};
  throw new Error('ASSETS_UNKNOWN_READ_CHANNEL');
}
export async function observeAsset({root=packageRoot,entry,allowRead=false,mode='catalog',judgmentId=null,budgetBytes=1000000}){
  if(typeof allowRead!=='boolean'||!Number.isSafeInteger(budgetBytes)||budgetBytes<0)throw new Error('ASSETS_READ_OPTIONS_INVALID');
  if(!['catalog','whole_asset','exact_selection'].includes(mode))throw new Error('ASSETS_READ_MODE_UNAVAILABLE');
  if(mode==='exact_selection'?(typeof judgmentId!=='string'||!judgmentId):judgmentId!==null)throw new Error('ASSETS_SELECTION_INVALID');
  const {binding}=verifyToolchain();
  const input=verifyEntryFiles(root,entry);
  if(input.bytes.length>64*1024*1024)throw new Error('ASSETS_FILE_TOO_LARGE');
  // Execute only the exact installed public graph, after its full byte check.
  const {admitSectionRequest,inspectWholeSectionSnapshot}=require('@aikdna/kdna-core/sections-node');
  const {createNativeSectionByteReadAuthority,admitSectionBytesNode}=require('@aikdna/kdna-core/sections-bytes-node');
  const {admitRetainedSectionRequest,createRetainedSectionReadAuthority,prepareRetainedSectionRead}=require('@aikdna/kdna-core/retained-sections-node');
  const {createTrustedHostReadProvider,readRetainedSection}=require('@aikdna/kdna-read/retained-sections-node');
  const admissionRequest=admitSectionRequest({request_id:'assets-admit:'+randomUUID(),tuple:binding.tuple,budget_bytes:budgetBytes,mode:'whole_asset',selection:null,handle:null});
  const admitted=await admitSectionBytesNode(input.bytes,admissionRequest,createNativeSectionByteReadAuthority(()=>true));
  if(admitted.status!=='accepted'){
    const admission={status:admitted.status,reason:admitted.reason,stage:admitted.stage,diagnostic:admitted.diagnostic,io:admitted.io};
    const read={channel:'admission_rejection',admission_rejection:admission,envelope:null,control:null,transport_failure:null};
    return {checked_at:new Date().toISOString(),artifact:{path:entry.artifact.path,bytes:input.bytes.length,sha256:input.sha256},admission,read,context:{policy:'kdna-assets:explicit-local-read',allow_read:allowRead,permission_scope:'this_call_and_exact_bytes',delivery_boundary:'in_process_return',action_authorization:'not_evaluated'}};
  }
  const view=inspectWholeSectionSnapshot(admitted.snapshot);
  if(!view)throw new Error('ASSETS_CORE_VIEW_UNAVAILABLE');
  if(!isDeepStrictEqual(view.tuple,binding.tuple))throw new Error('ASSETS_TUPLE_MISMATCH');
  if(entry.version!==view.asset.asset_version)throw new Error('ASSETS_ENTRY_VERSION_MISMATCH');
  const admission={status:'accepted',reason:null,asset:view.asset,digests:view.digests,judgment_count:view.ir.catalog.length,diagnostics:[]};
  const retainedRequest=admitRetainedSectionRequest({
    request_id:'assets-read:'+randomUUID(),tuple:binding.tuple,budget_bytes:budgetBytes,mode,
    selection:mode==='exact_selection'?{asset_id:view.asset.asset_id,asset_version:view.asset.asset_version,judgment_ids:[judgmentId]}:null,
    handle:null,
  });
  if(retainedRequest.status!=='admitted_request'){
    const read={channel:'retained_failure',retained_failure:retainedRequest,envelope:null,admission_rejection:null,control:null,transport_failure:null};
    return {checked_at:new Date().toISOString(),artifact:{path:entry.artifact.path,bytes:input.bytes.length,sha256:input.sha256},admission,read,context:{policy:'kdna-assets:explicit-local-read',allow_read:allowRead,permission_scope:'this_call_and_exact_bytes',delivery_boundary:'in_process_return',action_authorization:'not_evaluated'}};
  }
  const authority=createRetainedSectionReadAuthority(()=>allowRead);
  const preparation=await prepareRetainedSectionRead(admitted.snapshot,retainedRequest.request,authority);
  if(preparation.status!=='prepared'){
    const read={channel:'retained_failure',retained_failure:preparation,envelope:null,admission_rejection:null,control:null,transport_failure:null};
    return {checked_at:new Date().toISOString(),artifact:{path:entry.artifact.path,bytes:input.bytes.length,sha256:input.sha256},admission,read,context:{policy:'kdna-assets:explicit-local-read',allow_read:allowRead,permission_scope:'this_call_and_exact_bytes',delivery_boundary:'in_process_return',action_authorization:'not_evaluated'}};
  }
  const host=createTrustedHostReadProvider({
    observe({request,preparation}){
      const observedAt=Date.now();
      return {host_id:'kdna-assets:local',host_epoch:'process:'+process.pid,decision_id:'decision:'+request.request_id,
        operation_id:preparation.intent.operation_id,request_id:request.request_id,request_digest:preparation.request_digest,
        origin:preparation.origin,intent_digest:preparation.intent_digest,asset:preparation.asset,tuple:preparation.tuple,
        scope:view.ir.nodes.map(node=>node.id),issued_at:observedAt,expires_at:observedAt+60000,
        decision:allowRead?'allow':'deny',policy_id:'kdna-assets:explicit-local-read',current_ms:observedAt};
    },
    deliver(){return true;},
  });
  // Read the already checked bytes: no second path open or container parser.
  const read=await readRetainedSection(preparation.prepared,host);
  return {checked_at:new Date().toISOString(),artifact:{path:entry.artifact.path,bytes:input.bytes.length,sha256:input.sha256},admission,read,context:{policy:'kdna-assets:explicit-local-read',allow_read:allowRead,permission_scope:'this_call_and_exact_bytes',delivery_boundary:'in_process_return',action_authorization:'not_evaluated'}};
}
