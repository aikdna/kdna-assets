import { readFileSync, readdirSync, lstatSync, readlinkSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { createHash } from 'node:crypto';
export const packageRoot=resolve(import.meta.dirname,'..');
export const sha256=bytes=>createHash('sha256').update(bytes).digest('hex');
export function verifyToolchain(root=packageRoot){
  const manifest=JSON.parse(readFileSync(join(root,'toolchain-files.json'),'utf8'));
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
        if(!directories.has(rel))throw new Error('ASSETS_TOOLCHAIN_EXTRA_DIRECTORY: '+rel);
        walk(path,rel);
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
