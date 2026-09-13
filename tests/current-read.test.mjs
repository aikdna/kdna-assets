import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdtempSync,copyFileSync,mkdirSync,symlinkSync,cpSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {packageRoot,sha256,verifyToolchain,optionalToolchainGraph} from '../src/toolchain.mjs';
import {validateIndex,auditIndex} from '../src/catalog.mjs';
import {observeAsset,verifyEntryFiles,resolveEntryFile,summarizeRead} from '../src/current-read.mjs';
const original=JSON.parse(readFileSync(join(packageRoot,'index/current.json')));
const HISTORICAL_REFERENCES=['@aikdna/laozi-wuwei','@aikdna/epictetus-control-and-character'];
// The lock resolves `@cbor-extract/cbor-extract-<platform>` with `optional:
// true`, so the Linux runners that raised the original failure saw a
// `node_modules` directory this macOS machine never installs. The allow-set is
// the lock's own declaration, spelled out here so any change to it has to be
// reviewed in a diff.
//
// Two different waivers, and the difference matters: a declared optional
// package is skipped whole (its recorded shape does not exist, because it
// differs per platform), while its scope directory is still walked (so an
// undeclared sibling inside it is an extra directory like anywhere else).
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
 for(const f of ['toolchain-files.json','public-contract-binding.json','package-lock.json'])copyFileSync(join(packageRoot,f),join(root,f));
 cpSync(join(packageRoot,'node_modules'),join(root,'node_modules'),{recursive:true,verbatimSymlinks:true});
 return root;
}
// `@cbor-extract/cbor-extract-linux-x64` is the shape the ubuntu runner
// installs; materialising it turns this macOS checkout into the failing runner.
function simulatePlatformOptionalPackage(root){
 const dir=join(root,'node_modules/@cbor-extract/cbor-extract-linux-x64');mkdirSync(dir,{recursive:true});
 writeFileSync(join(dir,'package.json'),'{"name":"@cbor-extract/cbor-extract-linux-x64","version":"2.2.2"}\n');
}
function fixture(){
 const root=mkdtempSync(join(tmpdir(),'kdna-assets-synthetic-'));mkdirSync(join(root,'synthetic'));
 for(const f of ['asset.kdna','LICENSE'])copyFileSync(join(packageRoot,'tests/current-fixtures/synthetic',f),join(root,'synthetic',f));
 const files=['asset.kdna','LICENSE'].map(n=>{const path='synthetic/'+n,b=readFileSync(join(root,path));return{path,bytes:b.length,sha256:sha256(b)}});
 const entry=structuredClone(original.assets[0]);entry.id='synthetic-read-observation';entry.version='1.0.0';entry.artifact.path=files[0].path;entry.files=files;entry.digest.value=files[0].sha256;entry.license.path=files[1].path;entry.license.id='Apache-2.0';
 return{root,entry};
}
test('public inventory keeps the historical reference rejections and records the accepted candidate',async()=>{
 // The historical references must keep their original bytes and their exact
 // recorded rejection whenever the inventory grows. A current-contract
 // candidate is added beside them, never in place of them.
 const historical=original.assets.filter(entry=>entry.publication_status==='existing_reference');
 assert.deepEqual(historical.map(entry=>entry.id).sort(),[...HISTORICAL_REFERENCES].sort());
 // The inventory is allowed to grow (the current-contract candidate is added
 // beside the historical references), so the gate is per entry rather than a
 // fixed total: every indexed entry must pass the real audit on its own and
 // must keep its own recorded outcome.
 for(const entry of original.assets)assert.equal(validateIndex({...original,assets:[entry]}).assets,1);
 const r=await auditIndex(original,{allowRead:true});assert.equal(r.results.length,original.assets.length);
 for(const entry of original.assets){
  const result=r.results.find(candidate=>candidate.id===entry.id);
  assert.ok(result,`indexed entry must have its own audit result: ${entry.id}`);
  assert.equal(result.admission.status,entry.observation.core.status);
  assert.equal(result.admission.reason??null,entry.observation.core.reason??null);
  assert.equal(result.read.envelope.status,entry.observation.read.status);
 }
 for(const x of r.results.filter(result=>HISTORICAL_REFERENCES.includes(result.id))){assert.equal(x.admission.status,'rejected');assert.equal(x.admission.reason,'READ_CORE_INVALID');assert.equal(x.read.envelope.status,'rejected');}
 const candidate=r.results.find(result=>result.id==='@aikdna/verification-scope');
 assert.equal(candidate.admission.status,'accepted');
 assert.equal(candidate.read.envelope.status,'ready');
 assert.equal(candidate.read.envelope.states.read_permission,'allowed');
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
test('the platform-optional allow-set is exactly the optional packages the committed lock declares',()=>{
 const {packages,scopes}=optionalToolchainGraph();
 assert.deepEqual([...packages].sort(),[...PLATFORM_OPTIONAL_PACKAGES].sort());
 assert.deepEqual([...scopes].sort(),[...PLATFORM_OPTIONAL_SCOPES].sort());
 assert.deepEqual([...packages].filter(name=>scopes.has(name)),[]);
 // The waiver may never cover a package the manifest requires: every allow
 // entry is outside the required tree, so a required package keeps its exact
 // bytes and a required directory keeps its extra-directory rejection.
 const manifest=JSON.parse(readFileSync(join(packageRoot,'toolchain-files.json'),'utf8'));
 const required=new Set();
 for(const {path} of manifest.files){const parts=path.split('/');parts.pop();while(parts.length){required.add(parts.join('/'));parts.pop();}}
 for(const name of manifest.packages.map(x=>x.name))required.add(name);
 for(const dir of [...packages,...scopes])assert.ok(!required.has(dir),`${dir} is required, so it may not be waved through`);
});

test('extra and changed executable dependency bytes fail exact graph validation',()=>{
 assert.equal(verifyToolchain().files,945);
 const root=toolchainCopy();
 assert.equal(verifyToolchain(root).files,945);
 const file=join(root,'node_modules/@aikdna/kdna-cli/LICENSE');writeFileSync(file,'modified');assert.throws(()=>verifyToolchain(root),/ASSETS_TOOLCHAIN_CHANGED/);
 copyFileSync(join(packageRoot,'node_modules/@aikdna/kdna-cli/LICENSE'),file);writeFileSync(join(root,'node_modules/@aikdna/kdna-cli/extra.js'),'throw new Error("must not execute")');assert.throws(()=>verifyToolchain(root),/ASSETS_TOOLCHAIN_CHANGED/);
});

test('a platform-optional package may be present or absent, and only that class is exempt',()=>{
 // Positive: the runner shape that failed (optional package present) is green,
 // both as the empty scope directory an installer may leave behind and as the
 // real platform package.
 const emptyScope=toolchainCopy();
 // Recursive because the runner this test has to pass on may already have that
 // directory: this file must not assume the host platform's shape either.
 mkdirSync(join(emptyScope,'node_modules/@cbor-extract'),{recursive:true});
 assert.equal(verifyToolchain(emptyScope).files,945);
 const linux=toolchainCopy();
 simulatePlatformOptionalPackage(linux);
 assert.equal(verifyToolchain(linux).files,945);
 // Removing it again is the macOS shape and is equally green.
 const macos=toolchainCopy();
 assert.equal(verifyToolchain(macos).files,945);
 // Reverse: an extra directory that no lock entry marks optional still fails,
 // at the top level, inside a required scope, and as a sibling of a declared
 // optional package inside that package's own scope - the exemption covers the
 // optional package, never the scope around it.
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
 // Reverse: the optional allowance does not relax a required file's exact bytes.
 const tampered=toolchainCopy();
 simulatePlatformOptionalPackage(tampered);
 writeFileSync(join(tampered,'node_modules/cbor-x/package.json'),'{}');
 assert.throws(()=>verifyToolchain(tampered),/ASSETS_TOOLCHAIN_CHANGED: cbor-x\/package\.json/);
 // The one thing that is genuinely not checked, stated rather than implied: the
 // inside of a declared optional package. No recorded shape of it exists -
 // that is what "optional" means here - so its members cannot be compared.
 const insideDeclaredOptional=toolchainCopy();
 simulatePlatformOptionalPackage(insideDeclaredOptional);
 writeFileSync(join(insideDeclaredOptional,'node_modules/@cbor-extract/cbor-extract-linux-x64/index.js'),'module.exports=1;\n');
 assert.equal(verifyToolchain(insideDeclaredOptional).files,945);
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
