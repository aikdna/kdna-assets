import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdtempSync,copyFileSync,mkdirSync,symlinkSync,cpSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {packageRoot,sha256,verifyToolchain} from '../src/toolchain.mjs';
import {validateIndex,auditIndex} from '../src/catalog.mjs';
import {observeAsset,verifyEntryFiles,resolveEntryFile,summarizeRead} from '../src/current-read.mjs';
const original=JSON.parse(readFileSync(join(packageRoot,'index/current.json')));
function fixture(){
 const root=mkdtempSync(join(tmpdir(),'kdna-assets-synthetic-'));mkdirSync(join(root,'synthetic'));
 for(const f of ['asset.kdna','LICENSE'])copyFileSync(join(packageRoot,'tests/current-fixtures/synthetic',f),join(root,'synthetic',f));
 const files=['asset.kdna','LICENSE'].map(n=>{const path='synthetic/'+n,b=readFileSync(join(root,path));return{path,bytes:b.length,sha256:sha256(b)}});
 const entry=structuredClone(original.assets[0]);entry.id='synthetic-read-observation';entry.version='1.0.0';entry.artifact.path=files[0].path;entry.files=files;entry.digest.value=files[0].sha256;entry.license.path=files[1].path;entry.license.id='Apache-2.0';
 return{root,entry};
}
test('public inventory keeps the two actually rejected historical references',async()=>{
 assert.equal(validateIndex(original).assets,2);
 const r=await auditIndex(original,{allowRead:true});assert.equal(r.results.length,2);
 for(const x of r.results){assert.equal(x.admission.status,'rejected');assert.equal(x.admission.reason,'READ_CORE_INVALID');assert.equal(x.read.envelope.status,'rejected');}
});
test('explicit permission discloses one complete selected judgment; default denies',async()=>{
 const x=fixture(),denied=await observeAsset(x);assert.equal(denied.admission.status,'accepted');assert.equal(denied.read.envelope.states.read_permission,'denied');assert.equal(denied.read.envelope.content,null);
 const catalog=await observeAsset({...x,allowRead:true});assert.equal(catalog.read.envelope.status,'ready');const items=catalog.read.envelope.content.catalog;assert.equal(items.length,2);
 const selected=await observeAsset({...x,allowRead:true,mode:'exact_selection',judgmentId:items[1].judgment_id});
 assert.equal(selected.read.envelope.status,'ready');const js=selected.read.envelope.content.closure.filter(n=>n.role==='judgment');assert.equal(js.length,1);assert.equal(js[0].value.id,items[1].judgment_id);assert.equal(selected.read.envelope.states.action_authorization,'not_evaluated');
 const whole=await observeAsset({...x,allowRead:true,mode:'whole_asset'});assert.equal(whole.read.envelope.content.catalog.length,2);assert.deepEqual(whole.read.envelope.content.closure,[]);assert.ok(whole.read.envelope.content.declarations.length);assert.equal(whole.read.envelope.omissions.filter(x=>x.field==='judgment'&&x.reason==='not_in_mode').length,2);
 const missing=await observeAsset({...x,allowRead:true,mode:'exact_selection',judgmentId:'judgment:missing'});assert.equal(missing.read.envelope.status,'rejected');assert.equal(missing.read.envelope.content,null);
 const zero=await observeAsset({...x,allowRead:true,budgetBytes:0});assert.equal(zero.read.channel,'no_body_control');assert.equal(summarizeRead(zero.read).status,'no_body');
});
test('artifact, license, path and inventory claims are checked before reading',()=>{
 const x=fixture();assert.ok(verifyEntryFiles(x.root,x.entry));
 const bad=structuredClone(x.entry);bad.digest.value='0'.repeat(64);assert.throws(()=>verifyEntryFiles(x.root,bad),/ASSETS_DIGEST_MISMATCH/);
 const noLicense=structuredClone(x.entry);noLicense.files=noLicense.files.slice(0,1);assert.throws(()=>verifyEntryFiles(x.root,noLicense),/ASSETS_LICENSE_OR_ARTIFACT_MISSING/);
 writeFileSync(join(x.root,'synthetic/LICENSE'),'changed');assert.throws(()=>verifyEntryFiles(x.root,x.entry),/ASSETS_FILE_CHANGED/);
 for(const p of ['../asset.kdna','/asset.kdna','synthetic/../asset.kdna','synthetic//asset.kdna','synthetic\\asset.kdna'])assert.throws(()=>resolveEntryFile(x.root,p),/ASSETS_PATH_INVALID/);
 symlinkSync('asset.kdna',join(x.root,'synthetic/link'));assert.throws(()=>resolveEntryFile(x.root,'synthetic/link'),/ASSETS_PATH_SYMLINK/);
 const duplicates=structuredClone(original);duplicates.assets.push(duplicates.assets[0]);assert.throws(()=>validateIndex(duplicates,{checkFiles:false}),/ASSETS_DUPLICATE_ENTRY/);
 const invalid=structuredClone(original);invalid.assets[0].observation.read.status='ready';assert.throws(()=>validateIndex(invalid,{checkFiles:false}),/ASSETS_OBSERVATION_CONFLICT/);
 const stale=structuredClone(original);stale.toolchain_binding_sha256='0'.repeat(64);assert.throws(()=>validateIndex(stale,{checkFiles:false}),/ASSETS_INDEX_TOOLCHAIN_MISMATCH/);
});
test('extra and changed executable dependency bytes fail exact graph validation',()=>{
 assert.equal(verifyToolchain().files,945);const root=mkdtempSync(join(tmpdir(),'kdna-assets-toolchain-'));
 for(const f of ['toolchain-files.json','public-contract-binding.json'])copyFileSync(join(packageRoot,f),join(root,f));cpSync(join(packageRoot,'node_modules'),join(root,'node_modules'),{recursive:true,verbatimSymlinks:true});
 assert.equal(verifyToolchain(root).files,945);
 const file=join(root,'node_modules/@aikdna/kdna-cli/LICENSE');writeFileSync(file,'modified');assert.throws(()=>verifyToolchain(root),/ASSETS_TOOLCHAIN_CHANGED/);
 copyFileSync(join(packageRoot,'node_modules/@aikdna/kdna-cli/LICENSE'),file);writeFileSync(join(root,'node_modules/@aikdna/kdna-cli/extra.js'),'throw new Error("must not execute")');assert.throws(()=>verifyToolchain(root),/ASSETS_TOOLCHAIN_CHANGED/);
});

test('an accepted asset must match the exact indexed version before any Read result',async()=>{
 const x=fixture();
 const matching=await observeAsset({...x,allowRead:true});
 assert.equal(matching.admission.asset.asset_version,x.entry.version);
 const index=structuredClone(original);index.assets=[structuredClone(x.entry)];
 index.assets[0].observation.core={status:'accepted',reason:null};
 index.assets[0].observation.read=summarizeRead(matching.read);
 const audited=await auditIndex(index,{root:x.root,allowRead:true});assert.equal(audited.results[0].read.envelope.status,'ready');
 for(const version of ['9.9.9','1.0.0+other']){
  const changed=structuredClone(index);changed.assets[0].version=version;
  await assert.rejects(auditIndex(changed,{root:x.root,allowRead:true}),{message:'ASSETS_ENTRY_VERSION_MISMATCH'});
  await assert.rejects(observeAsset({...x,entry:changed.assets[0]}),{message:'ASSETS_ENTRY_VERSION_MISMATCH'});
 }
});
test('version mismatch does not replace the original Core rejection',async()=>{
 const entry=structuredClone(original.assets[0]),changed=structuredClone(entry);changed.version='9.9.9';
 for(const allowRead of [false,true]){
  const expected=await observeAsset({entry,allowRead});
  const actual=await observeAsset({entry:changed,allowRead});
  assert.deepEqual(actual.admission,expected.admission);
  assert.equal(actual.admission.status,'rejected');assert.equal(actual.admission.reason,'READ_CORE_INVALID');
  assert.deepEqual(summarizeRead(actual.read),summarizeRead(expected.read));
 }
 const index=structuredClone(original);index.assets[0].version='9.9.9';
 assert.equal((await auditIndex(index,{allowRead:true})).results[0].admission.reason,'READ_CORE_INVALID');
});


test('rejected admission preserves public Core phase and component failure without interpretation',async()=>{
 const x=fixture();const bytes=readFileSync(join(packageRoot,'tests/current-fixtures/component-cycle/asset.kdna'));writeFileSync(join(x.root,'synthetic/asset.kdna'),bytes);x.entry.files[0]={path:'synthetic/asset.kdna',bytes:bytes.length,sha256:sha256(bytes)};x.entry.digest.value=sha256(bytes);
 const cycle=await observeAsset({...x,allowRead:true});assert.deepEqual(cycle.admission.states,{core:'valid',interpretation:'blocked'});assert.equal(cycle.admission.reason,'READ_COMPONENT_GRAPH_CYCLE');assert.deepEqual(cycle.admission.component_failure,{judgment_ref:'judgment-engineering',component_ref:'taxonomy-process',status:'invalid',body:null,code:'READ_COMPONENT_GRAPH_CYCLE'});assert.equal(cycle.read.envelope.content,null);assert.equal(cycle.read.envelope.status,'rejected');
 const invalid=await observeAsset({entry:original.assets[0],allowRead:true});assert.deepEqual(invalid.admission.states,{core:'invalid',interpretation:'not_evaluated'});assert.equal(invalid.admission.component_failure,null);assert.equal(invalid.read.envelope.content,null);
});
