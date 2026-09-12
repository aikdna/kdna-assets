import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { createRequire } from 'node:module';
import { isDeepStrictEqual } from 'node:util';
import { packageRoot, verifyToolchain } from './toolchain.mjs';
import { verifyEntryFiles, observeAsset, summarizeRead } from './current-read.mjs';
const require=createRequire(import.meta.url);
export function validateIndex(index,{root=packageRoot,checkFiles=true}={}){
  const toolchain=verifyToolchain();
  const Ajv2020=require('ajv/dist/2020.js').default;const addFormats=require('ajv-formats');
  const ajv=new Ajv2020({allErrors:true,strict:true});addFormats(ajv);
  const check=ajv.compile(JSON.parse(readFileSync(join(packageRoot,'schemas/public-read-index.schema.json'))));
  if(!check(index))throw new Error('ASSETS_INDEX_INVALID: '+ajv.errorsText(check.errors));
  if(index.toolchain_binding_sha256!==toolchain.binding_sha256)throw new Error('ASSETS_INDEX_TOOLCHAIN_MISMATCH');
  const ids=new Set(),paths=new Set();
  for(const e of index.assets){
    if(ids.has(e.id)||paths.has(e.artifact.path))throw new Error('ASSETS_DUPLICATE_ENTRY');ids.add(e.id);paths.add(e.artifact.path);
    const o=e.observation;
    if(o.read.status==='ready'&&(o.core.status!=='accepted'||o.read.channel!=='read_envelope'||o.read.read_permission!=='allowed'||o.read.delivery!=='delivered'))throw new Error('ASSETS_OBSERVATION_CONFLICT');
    if(o.core.status==='rejected'&&(o.core.reason===null||o.read.status==='ready'))throw new Error('ASSETS_OBSERVATION_CONFLICT');
    if(checkFiles)verifyEntryFiles(root,e);
  }
  return {assets:index.assets.length,toolchain_files:toolchain.files};
}
export async function auditIndex(index,{root=packageRoot,allowRead=false}={}){
  validateIndex(index,{root});const results=[];
  for(const entry of index.assets){
    const actual=await observeAsset({root,entry,allowRead});
    if(actual.admission.status!==entry.observation.core.status||(actual.admission.reason??null)!==entry.observation.core.reason)throw new Error('ASSETS_ADMISSION_CHANGED: '+entry.id);
    if(allowRead&&!isDeepStrictEqual(summarizeRead(actual.read),entry.observation.read))throw new Error('ASSETS_READ_OBSERVATION_CHANGED: '+entry.id);
    results.push({id:entry.id,...actual});
  }
  return {at:new Date().toISOString(),permission:'local call only; not transferable',read_requested:allowRead,results};
}
