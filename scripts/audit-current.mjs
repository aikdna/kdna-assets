#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { packageRoot } from '../src/toolchain.mjs';
import { auditIndex, validateIndex } from '../src/catalog.mjs';
const args=process.argv.slice(2);let root=packageRoot,indexPath,allowRead=false,validateOnly=false;
for(let i=0;i<args.length;i++){
  if(args[i]==='--root'&&args[i+1])root=resolve(args[++i]);
  else if(args[i]==='--index'&&args[i+1])indexPath=resolve(args[++i]);
  else if(args[i]==='--allow-read')allowRead=true;
  else if(args[i]==='--validate-only')validateOnly=true;
  else throw new Error('Usage: audit-current.mjs [--root directory] [--index file] [--allow-read] [--validate-only]');
}
const index=JSON.parse(readFileSync(indexPath??resolve(root,'index/current.json')));
console.log(JSON.stringify(validateOnly?validateIndex(index,{root}):await auditIndex(index,{root,allowRead}),null,2));
