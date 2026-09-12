import { readFileSync, lstatSync } from 'node:fs';
import { resolve, relative, isAbsolute, join, dirname } from 'node:path';
import { randomUUID } from 'node:crypto';
import { createRequire } from 'node:module';
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
  if(r.channel==='admission_rejection')return {channel:r.channel,status:'rejected',diagnostics:[r.admission_rejection.code],read_permission:'not_evaluated',delivery:'not_delivered'};
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
  const {admitNode}=require('@aikdna/kdna-core/node');
  const {inspectSnapshot}=require('@aikdna/kdna-core/read-boundary');
  const {readNode}=require('@aikdna/kdna-read/node');
  const {createTrustedReadControlProvider,createTrustedHostReadProvider}=require('@aikdna/kdna-read/embedding');
  const admitted=await admitNode(input.bytes);
  const view=admitted.status==='accepted'?inspectSnapshot(admitted.snapshot):null;
  if(admitted.status==='accepted'&&!view)throw new Error('ASSETS_CORE_VIEW_UNAVAILABLE');
  if(view&&entry.version!==view.asset.asset_version)throw new Error('ASSETS_ENTRY_VERSION_MISMATCH');
  const admission=view?{status:'accepted',reason:null,asset:view.asset,digests:view.digests,judgment_count:view.ir.catalog.length,diagnostics:[]}:{status:'rejected',reason:admitted.reason,states:admitted.states,component_failure:admitted.component_failure,diagnostics:admitted.diagnostics};
  const request={request_id:'assets:'+randomUUID(),tuple:binding.tuple,budget_bytes:budgetBytes,mode,selection:mode==='exact_selection'?{asset_id:view?.asset.asset_id??entry.id,asset_version:view?.asset.asset_version??entry.version,judgment_id:judgmentId}:null,handle:null};
  const control=createTrustedReadControlProvider(()=>({admission_response_limit_bytes:4096}));
  const host=createTrustedHostReadProvider({observe({request,snapshot}){
    const current=inspectSnapshot(snapshot);const time=Date.now();
    return {host_id:'kdna-assets:local',host_epoch:'process:'+process.pid,decision_id:'decision:'+request.request_id,request_id:request.request_id,snapshot_id:current.snapshot_id,A:current.digests.A.observed,C:current.digests.C.observed,scope:current.ir.nodes.map(n=>n.id),issued_at:time,expires_at:time+60000,decision:allowRead?'allow':'deny',policy_id:'kdna-assets:explicit-local-read',current_ms:time};
  }});
  // Read the already checked bytes: no second path open or container parser.
  const read=await readNode(input.bytes,request,control,host);
  return {checked_at:new Date().toISOString(),artifact:{path:entry.artifact.path,bytes:input.bytes.length,sha256:input.sha256},admission,read,context:{policy:'kdna-assets:explicit-local-read',allow_read:allowRead,permission_scope:'this_call_and_exact_bytes',delivery_boundary:'in_process_return',action_authorization:'not_evaluated'}};
}
