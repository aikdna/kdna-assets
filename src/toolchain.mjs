import { readFileSync, readdirSync, lstatSync, readlinkSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { createHash } from 'node:crypto';
export const packageRoot=resolve(import.meta.dirname,'..');
export const sha256=bytes=>createHash('sha256').update(bytes).digest('hex');
// Installed node_modules is not the same shape on every platform: a package the
// lock resolves with `optional: true` (a native platform binary, for one) is
// allowed to be present or absent, and which one an installer materialises is a
// property of the runner, not of this repository. The committed lockfile is the
// explicit, reviewable source of that allow-set. It waives exactly two things:
// the declared optional package's own subtree, whose recorded shape does not
// exist because it differs per platform, and the scope directories that exist
// only to hold such packages. The scope directories are not skipped - they are
// still walked, so an undeclared sibling beside an optional package is an extra
// directory like anywhere else.
export function optionalToolchainGraph(root=packageRoot){
  const lock=JSON.parse(readFileSync(join(root,'package-lock.json'),'utf8'));
  const packages=new Set();
  const scopes=new Set();
  for(const [path,row] of Object.entries(lock.packages??{})){
    if(!path.startsWith('node_modules/')||row.optional!==true)continue;
    const parts=path.slice('node_modules/'.length).split('/');
    packages.add(parts.join('/'));
    parts.pop();
    while(parts.length){scopes.add(parts.join('/'));parts.pop();}
  }
  // A declared optional package is skipped whole, so it is not also a scope to
  // walk into.
  for(const name of packages)scopes.delete(name);
  return {packages,scopes};
}
export function verifyToolchain(root=packageRoot){
  const manifest=JSON.parse(readFileSync(join(root,'toolchain-files.json'),'utf8'));
  const {packages:optionalPackages,scopes:optionalScopes}=optionalToolchainGraph(root);
  const modules=join(root,'node_modules');
  const expected=new Map(manifest.files.map(x=>[x.path,x]));
  const directories=new Set();
  for(const path of expected.keys()){
    const parts=path.split('/');parts.pop();
    while(parts.length){directories.add(parts.join('/'));parts.pop();}
  }
  const actual=[];
  function walk(dir,prefix=''){
    for(const name of readdirSync(dir).sort()){
      if(!prefix && (name==='.bin'||name==='.package-lock.json'))continue;
      const rel=prefix?prefix+'/'+name:name;const path=join(dir,name);const stat=lstatSync(path);
      if(stat.isSymbolicLink())throw new Error('ASSETS_TOOLCHAIN_SYMLINK: '+rel);
      if(stat.isDirectory()){
        // A directory the manifest requires is walked and verified. A declared
        // optional package is the installing runner's platform shape, so its
        // own subtree is left alone either way. A scope that only holds such
        // packages is still walked, so an undeclared sibling beside one is an
        // extra directory, exactly as it would be anywhere else.
        if(directories.has(rel))walk(path,rel);
        else if(optionalPackages.has(rel))continue;
        else if(optionalScopes.has(rel))walk(path,rel);
        else throw new Error('ASSETS_TOOLCHAIN_EXTRA_DIRECTORY: '+rel);
      }
      else if(stat.isFile()){
        const row=expected.get(rel);
        if(!row||row.bytes!==stat.size||row.mode!==(stat.mode&0o777)||row.sha256!==sha256(readFileSync(path)))throw new Error('ASSETS_TOOLCHAIN_CHANGED: '+rel);
        actual.push(rel);
      }else throw new Error('ASSETS_TOOLCHAIN_NONREGULAR: '+rel);
    }
  }
  if(lstatSync(modules).isSymbolicLink())throw new Error('ASSETS_TOOLCHAIN_SYMLINK');
  walk(modules);
  const binRoot=join(modules,'.bin');
  if(lstatSync(binRoot).isSymbolicLink())throw new Error('ASSETS_TOOLCHAIN_BIN_CHANGED');
  if(JSON.stringify(readdirSync(binRoot).sort())!==JSON.stringify(Object.keys(manifest.bins).sort()))throw new Error('ASSETS_TOOLCHAIN_BIN_CHANGED');
  for(const [name,target] of Object.entries(manifest.bins)){
    const path=join(binRoot,name);
    if(!lstatSync(path).isSymbolicLink()||readlinkSync(path)!==target)throw new Error('ASSETS_TOOLCHAIN_BIN_CHANGED');
  }
  if(actual.length!==expected.size)throw new Error('ASSETS_TOOLCHAIN_MISSING');
  const bindingBytes=readFileSync(join(root,'public-contract-binding.json'));
  const binding=JSON.parse(bindingBytes);
  if(binding.toolchain_files_sha256!==sha256(readFileSync(join(root,'toolchain-files.json'))))throw new Error('ASSETS_TOOLCHAIN_MANIFEST_CHANGED');
  return {binding,binding_sha256:sha256(bindingBytes),files:actual.length};
}
