import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdtempSync,copyFileSync,mkdirSync,symlinkSync,cpSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {packageRoot,sha256,verifyToolchain,optionalToolchainGraph} from '../src/toolchain.mjs';
import {validateIndex,auditIndex} from '../src/catalog.mjs';
import {observeAsset,verifyEntryFiles,resolveEntryFile,summarizeRead} from '../src/current-read.mjs';
const original=JSON.parse(readFileSync(join(packageRoot,'index/current.json')));
const fixtureDir=join(packageRoot,'tests/current-fixtures/native-0.6');
const HISTORICAL_REFERENCES=['@aikdna/laozi-wuwei','@aikdna/epictetus-control-and-character'];
const PLATFORM_OPTIONAL_PACKAGES=[
  '@cbor-extract/cbor-extract-darwin-arm64',
  '@cbor-extract/cbor-extract-darwin-x64',
  '@cbor-extract/cbor-extract-linux-arm',
  '@cbor-extract/cbor-extract-linux-arm64',
  '@cbor-extract/cbor-extract-linux-x64',
  '@cbor-extract/cbor-extract-win32-x64',
  'cbor-extract',
  'detect-libc',
  'node-gyp-build-optional-packages',
];
const PLATFORM_OPTIONAL_SCOPES=['@cbor-extract'];

function toolchainCopy(){
  const root=mkdtempSync(join(tmpdir(),'kdna-assets-toolchain-'));
  for(const file of ['toolchain-files.json','public-contract-binding.json','package-lock.json'])copyFileSync(join(packageRoot,file),join(root,file));
  cpSync(join(packageRoot,'node_modules'),join(root,'node_modules'),{recursive:true,verbatimSymlinks:true});
  return root;
}

function simulatePlatformOptionalPackage(root){
  const dir=join(root,'node_modules/@cbor-extract/cbor-extract-linux-x64');mkdirSync(dir,{recursive:true});
  writeFileSync(join(dir,'package.json'),'{"name":"@cbor-extract/cbor-extract-linux-x64","version":"2.2.2"}\n');
}

function syntheticEntry(id='synthetic-read-observation'){
  const root=mkdtempSync(join(tmpdir(),'kdna-assets-synthetic-'));mkdirSync(join(root,'synthetic'));
  for(const file of ['asset.kdna','LICENSE'])copyFileSync(join(fixtureDir,file),join(root,'synthetic',file));
  const files=['asset.kdna','LICENSE'].map(name=>{
    const path='synthetic/'+name;
    const bytes=readFileSync(join(root,path));
    return {path,bytes:bytes.length,sha256:sha256(bytes)};
  });
  const entry={
    kind:'kdna-asset',
    id,
    publisher:{name:'AIKDNA',url:'https://aikdna.com'},
    creator:{name:'OpenAI Codex agent'},
    access:'public',
    license:{id:'Apache-2.0',path:files[1].path,scope:'asset-content-and-distribution',repository_license_applies:false},
    version:'1.0.0',
    digest:{algorithm:'sha256',value:files[0].sha256},
    artifact:{path:files[0].path,media_type:'application/vnd.kdna.asset'},
    evidence_claims:[],
    files,
    observation:{
      checked_at:'2026-10-27T00:00:00.000Z',
      method:'public_node_adapter',
      core:{status:'accepted',reason:null},
      read:{channel:'retained_failure',status:'rejected',diagnostics:['READ_CORE_CAPABILITY_UNAVAILABLE'],read_permission:'denied',delivery:'not_delivered',detail:'authority_denied'},
      scope:'Synthetic native container 0.6 fixture only; local explicit read permission, no transferable authority or remote acknowledgment.',
    },
    publication_status:'unpublished_candidate',
    proof_limits:{creation:'not_evaluated',identity:'not_evaluated',action_authorization:'not_evaluated',legal_clearance:'not_evaluated'},
  };
  return {root,entry};
}

function rejectedEntry(id='synthetic-rejected-observation'){
  const x=syntheticEntry(id),asset=join(x.root,'synthetic/asset.kdna'),bytes=readFileSync(asset);
  bytes[Math.floor(bytes.length/2)]^=0xff;writeFileSync(asset,bytes);
  const files=['asset.kdna','LICENSE'].map(name=>{
    const path='synthetic/'+name;
    const value=readFileSync(join(x.root,path));
    return {path,bytes:value.length,sha256:sha256(value)};
  });
  x.entry.files=files;
  x.entry.digest.value=files[0].sha256;
  return x;
}

function fixture(){return syntheticEntry();}

test('public inventory keeps the historical reference rejections and records the accepted native candidate',async()=>{
  assert.equal(original.assets.length,0,'the committed index must list no public asset');
  for(const id of HISTORICAL_REFERENCES)assert.equal(original.assets.some(entry=>entry.id===id),false,`withdrawn entry must stay withdrawn: ${id}`);
  assert.equal(original.assets.some(entry=>entry.id==='@aikdna/verification-scope'),false,'the withdrawn candidate must stay withdrawn');
  assert.equal(validateIndex(original).assets,0);
  const emptyAudit=await auditIndex(original,{allowRead:true});assert.equal(emptyAudit.results.length,0);

  const ok=fixture();
  const okRead=await observeAsset({...ok,allowRead:true});
  assert.equal(okRead.admission.status,'accepted');
  assert.equal(okRead.read.envelope.status,'catalog_only');
  ok.entry.observation.core={status:okRead.admission.status,reason:okRead.admission.reason};
  ok.entry.observation.read=summarizeRead(okRead.read);
  const okIndex={...original,assets:[ok.entry]};
  assert.equal(validateIndex(okIndex,{root:ok.root}).assets,1);
  const okAudit=await auditIndex(okIndex,{root:ok.root,allowRead:true});
  assert.equal(okAudit.results[0].admission.status,'accepted');
  assert.equal(okAudit.results[0].read.envelope.status,'catalog_only');
  assert.equal(okAudit.results[0].read.envelope.states.read_permission,'allowed');

  const bad=rejectedEntry();
  const badRead=await observeAsset({...bad,allowRead:true});
  assert.equal(badRead.admission.status,'rejected');
  assert.equal(badRead.read.channel,'admission_rejection');
  bad.entry.observation.core={status:badRead.admission.status,reason:badRead.admission.reason};
  bad.entry.observation.read=summarizeRead(badRead.read);
  const badIndex={...original,assets:[bad.entry]};
  assert.equal(validateIndex(badIndex,{root:bad.root}).assets,1);
  const badAudit=await auditIndex(badIndex,{root:bad.root,allowRead:true});
  assert.equal(badAudit.results[0].admission.status,'rejected');
  assert.equal(badAudit.results[0].read.channel,'admission_rejection');
});

test('native retained reads distinguish catalog-only, selection, whole-asset, and explicit denial',async()=>{
  const x=fixture();
  const denied=await observeAsset(x);
  assert.equal(denied.admission.status,'accepted');
  assert.equal(denied.read.channel,'retained_failure');
  assert.deepEqual(summarizeRead(denied.read),{
    channel:'retained_failure',
    status:'rejected',
    diagnostics:['READ_CORE_CAPABILITY_UNAVAILABLE'],
    read_permission:'denied',
    delivery:'not_delivered',
    detail:'authority_denied',
  });

  const catalog=await observeAsset({...x,allowRead:true});
  assert.equal(catalog.read.channel,'read_envelope');
  assert.equal(catalog.read.envelope.status,'catalog_only');
  const items=catalog.read.envelope.content.catalog;
  assert.equal(items.length,3);

  const selected=await observeAsset({...x,allowRead:true,mode:'exact_selection',judgmentId:items[1].judgment_id});
  assert.equal(selected.read.envelope.status,'ready');
  const judgments=selected.read.envelope.content.closure.filter(node=>node.role==='judgment');
  assert.equal(judgments.length,1);
  assert.equal(judgments[0].value.id,items[1].judgment_id);
  assert.equal(selected.read.envelope.content.selected.judgment_ids[0],items[1].judgment_id);
  assert.equal(selected.read.envelope.states.action_authorization,'not_evaluated');

  const whole=await observeAsset({...x,allowRead:true,mode:'whole_asset'});
  assert.equal(whole.read.envelope.status,'ready');
  assert.equal(whole.read.envelope.content.catalog.length,3);
  assert.ok(whole.read.envelope.content.closure.length>0);
  assert.equal(whole.read.envelope.content.closure.some(node=>node.role==='judgment'),false);
  assert.ok(whole.read.envelope.content.declarations.length);
  assert.equal(whole.read.envelope.omissions.filter(item=>item.field==='judgment'&&item.reason==='not_requested').length,3);

  const missing=await observeAsset({...x,allowRead:true,mode:'exact_selection',judgmentId:'judgment:missing'});
  assert.equal(missing.read.channel,'retained_failure');
  const missingSummary=summarizeRead(missing.read);
  assert.equal(missingSummary.status,'rejected');
  assert.deepEqual(missingSummary.diagnostics,['READ_SELECTION_NOT_FOUND']);
  assert.equal(missingSummary.read_permission,'not_evaluated');

  const zero=await observeAsset({...x,allowRead:true,budgetBytes:0});
  assert.equal(zero.read.channel,'no_body_control');
  assert.equal(summarizeRead(zero.read).status,'no_body');
});

test('artifact, license, path and inventory claims are checked before reading',()=>{
  const x=fixture();assert.ok(verifyEntryFiles(x.root,x.entry));
  const bad=structuredClone(x.entry);bad.digest.value='0'.repeat(64);assert.throws(()=>verifyEntryFiles(x.root,bad),/ASSETS_DIGEST_MISMATCH/);
  const noLicense=structuredClone(x.entry);noLicense.files=noLicense.files.slice(0,1);assert.throws(()=>verifyEntryFiles(x.root,noLicense),/ASSETS_LICENSE_OR_ARTIFACT_MISSING/);
  writeFileSync(join(x.root,'synthetic/LICENSE'),'changed');assert.throws(()=>verifyEntryFiles(x.root,x.entry),/ASSETS_FILE_CHANGED/);
  for(const path of ['../asset.kdna','/asset.kdna','synthetic/../asset.kdna','synthetic//asset.kdna','synthetic\\asset.kdna'])assert.throws(()=>resolveEntryFile(x.root,path),/ASSETS_PATH_INVALID/);
  symlinkSync('asset.kdna',join(x.root,'synthetic/link'));assert.throws(()=>resolveEntryFile(x.root,'synthetic/link'),/ASSETS_PATH_SYMLINK/);
  const base=syntheticEntry();
  const duplicates={...structuredClone(original),assets:[structuredClone(base.entry),structuredClone(base.entry)]};assert.throws(()=>validateIndex(duplicates,{checkFiles:false}),/ASSETS_DUPLICATE_ENTRY/);
  const invalid={...structuredClone(original),assets:[structuredClone(base.entry)]};
  invalid.assets[0].observation.core={status:'rejected',reason:'READ_CORE_INVALID'};
  invalid.assets[0].observation.read={channel:'read_envelope',status:'catalog_only',diagnostics:[],read_permission:'allowed',delivery:'delivered'};
  assert.throws(()=>validateIndex(invalid,{checkFiles:false}),/ASSETS_OBSERVATION_CONFLICT/);
  const stale=structuredClone(original);stale.toolchain_binding_sha256='0'.repeat(64);assert.throws(()=>validateIndex(stale,{checkFiles:false}),/ASSETS_INDEX_TOOLCHAIN_MISMATCH/);
});

test('the platform-optional allow-set is exactly the optional packages the committed lock declares',()=>{
  const {packages,scopes}=optionalToolchainGraph();
  assert.deepEqual([...packages].sort(),[...PLATFORM_OPTIONAL_PACKAGES].sort());
  assert.deepEqual([...scopes].sort(),[...PLATFORM_OPTIONAL_SCOPES].sort());
  assert.deepEqual([...packages].filter(name=>scopes.has(name)),[]);
  const manifest=JSON.parse(readFileSync(join(packageRoot,'toolchain-files.json'),'utf8'));
  const required=new Set();
  for(const {path} of manifest.files){const parts=path.split('/');parts.pop();while(parts.length){required.add(parts.join('/'));parts.pop();}}
  for(const name of manifest.packages.map(entry=>entry.name))required.add(name);
  for(const dir of [...packages,...scopes])assert.ok(!required.has(dir),`${dir} is required, so it may not be waved through`);
});

test('extra and changed executable dependency bytes fail exact graph validation',()=>{
  const manifest=JSON.parse(readFileSync(join(packageRoot,'toolchain-files.json'),'utf8'));
  const expectedFiles=manifest.files.length;
  assert.equal(verifyToolchain().files,expectedFiles);
  const root=toolchainCopy();
  assert.equal(verifyToolchain(root).files,expectedFiles);
  const file=join(root,'node_modules/@aikdna/kdna-cli/LICENSE');writeFileSync(file,'modified');assert.throws(()=>verifyToolchain(root),/ASSETS_TOOLCHAIN_CHANGED/);
  copyFileSync(join(packageRoot,'node_modules/@aikdna/kdna-cli/LICENSE'),file);writeFileSync(join(root,'node_modules/@aikdna/kdna-cli/extra.js'),'throw new Error("must not execute")');assert.throws(()=>verifyToolchain(root),/ASSETS_TOOLCHAIN_CHANGED/);
});

test('a platform-optional package may be present or absent, and only that class is exempt',()=>{
  const expectedFiles=JSON.parse(readFileSync(join(packageRoot,'toolchain-files.json'),'utf8')).files.length;
  const emptyScope=toolchainCopy();
  mkdirSync(join(emptyScope,'node_modules/@cbor-extract'),{recursive:true});
  assert.equal(verifyToolchain(emptyScope).files,expectedFiles);
  const linux=toolchainCopy();
  simulatePlatformOptionalPackage(linux);
  assert.equal(verifyToolchain(linux).files,expectedFiles);
  const macos=toolchainCopy();
  assert.equal(verifyToolchain(macos).files,expectedFiles);
  const stray=toolchainCopy();
  mkdirSync(join(stray,'node_modules/leftover-native-package'));writeFileSync(join(stray,'node_modules/leftover-native-package/index.js'),'module.exports=1;\n');
  assert.throws(()=>verifyToolchain(stray),{message:'ASSETS_TOOLCHAIN_EXTRA_DIRECTORY: leftover-native-package'});
  const strayScoped=toolchainCopy();
  mkdirSync(join(strayScoped,'node_modules/@aikdna/leftover-native-package'));
  assert.throws(()=>verifyToolchain(strayScoped),{message:'ASSETS_TOOLCHAIN_EXTRA_DIRECTORY: @aikdna/leftover-native-package'});
  const smuggledAmongOptional=toolchainCopy();
  simulatePlatformOptionalPackage(smuggledAmongOptional);
  mkdirSync(join(smuggledAmongOptional,'node_modules/@cbor-extract/smuggled'));
  writeFileSync(join(smuggledAmongOptional,'node_modules/@cbor-extract/smuggled/index.js'),'module.exports=1;\n');
  assert.throws(()=>verifyToolchain(smuggledAmongOptional),{message:'ASSETS_TOOLCHAIN_EXTRA_DIRECTORY: @cbor-extract/smuggled'});
  const smuggledFileAmongOptional=toolchainCopy();
  simulatePlatformOptionalPackage(smuggledFileAmongOptional);
  writeFileSync(join(smuggledFileAmongOptional,'node_modules/@cbor-extract/smuggled.js'),'module.exports=1;\n');
  assert.throws(()=>verifyToolchain(smuggledFileAmongOptional),{message:'ASSETS_TOOLCHAIN_CHANGED: @cbor-extract/smuggled.js'});
  const tampered=toolchainCopy();
  simulatePlatformOptionalPackage(tampered);
  writeFileSync(join(tampered,'node_modules/cbor-x/package.json'),'{}');
  assert.throws(()=>verifyToolchain(tampered),/ASSETS_TOOLCHAIN_CHANGED: cbor-x\/package\.json/);
  const insideDeclaredOptional=toolchainCopy();
  simulatePlatformOptionalPackage(insideDeclaredOptional);
  writeFileSync(join(insideDeclaredOptional,'node_modules/@cbor-extract/cbor-extract-linux-x64/index.js'),'module.exports=1;\n');
  assert.equal(verifyToolchain(insideDeclaredOptional).files,expectedFiles);
});

test('an accepted asset must match the exact indexed version before any Read result',async()=>{
  const x=fixture();
  const matching=await observeAsset({...x,allowRead:true});
  assert.equal(matching.admission.asset.asset_version,x.entry.version);
  const index=structuredClone(original);index.assets=[structuredClone(x.entry)];
  index.assets[0].observation.core={status:'accepted',reason:null};
  index.assets[0].observation.read=summarizeRead(matching.read);
  const audited=await auditIndex(index,{root:x.root,allowRead:true});
  assert.equal(audited.results[0].read.envelope.status,'catalog_only');
  for(const version of ['9.9.9','1.0.0+other']){
    const changed=structuredClone(index);changed.assets[0].version=version;
    await assert.rejects(auditIndex(changed,{root:x.root,allowRead:true}),{message:'ASSETS_ENTRY_VERSION_MISMATCH'});
    await assert.rejects(observeAsset({...x,entry:changed.assets[0]}),{message:'ASSETS_ENTRY_VERSION_MISMATCH'});
  }
});

test('version mismatch does not replace the original native admission rejection',async()=>{
  const rejected=rejectedEntry(),entry=rejected.entry,changed=structuredClone(entry);changed.version='9.9.9';
  for(const allowRead of [false,true]){
    const expected=await observeAsset({root:rejected.root,entry,allowRead});
    const actual=await observeAsset({root:rejected.root,entry:changed,allowRead});
    assert.deepEqual(actual.admission,expected.admission);
    assert.equal(actual.admission.status,'rejected');
    assert.equal(actual.read.channel,'admission_rejection');
    assert.deepEqual(summarizeRead(actual.read),summarizeRead(expected.read));
  }
  const index={...structuredClone(original),assets:[changed]};
  index.assets[0].observation.core={status:'rejected',reason:'READ_CORE_INVALID'};
  index.assets[0].observation.read={channel:'admission_rejection',status:'rejected',diagnostics:['READ_CORE_INVALID'],read_permission:'not_evaluated',delivery:'not_delivered'};
  const audited=await auditIndex(index,{root:rejected.root,allowRead:true});
  assert.equal(audited.results[0].read.channel,'admission_rejection');
});

test('public binding and archive receipts describe the exact stable native graph',()=>{
  const binding=JSON.parse(readFileSync(join(packageRoot,'public-contract-binding.json'),'utf8'));
  assert.deepEqual(binding.tuple,{
    container:'0.6.0',
    payload_profile:'kdna.payload.judgment',
    payload_version:'0.5.1',
    core:'kdna.core/0.8.2',
    ir:'kdna.canonical-ir/0.6.1',
    runtime:'kdna.runtime-capsule/0.3.1',
    plan:'kdna.consumption-plan/0.3.1',
    host:'kdna.agent-host/0.3.1',
    trace:'kdna.judgment-trace/0.3.1',
    read:'kdna.read/0.7.0-candidate',
  });
  for(const [name,version] of [
    ['@aikdna/kdna-core','0.37.9'],
    ['@aikdna/kdna-read','0.13.3'],
    ['@aikdna/kdna-cli','0.43.2'],
  ]){
    const row=binding.packages.find(entry=>entry.name===name);
    assert.ok(row);
    assert.equal(row.version,version);
    const bytes=readFileSync(join(packageRoot,row.archive));
    assert.equal(bytes.length,row.bytes);
    assert.equal(sha256(bytes),row.sha256);
  }
  const cliBinding=JSON.parse(readFileSync(join(packageRoot,'node_modules/@aikdna/kdna-cli/public-contract-binding.json'),'utf8'));
  assert.deepEqual(binding.tuple,cliBinding.tuple);
  assert.equal(verifyToolchain().binding.toolchain_files_sha256,sha256(readFileSync(join(packageRoot,'toolchain-files.json'))));
});
