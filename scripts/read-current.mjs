#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { packageRoot } from '../src/toolchain.mjs';
import { validateIndex } from '../src/catalog.mjs';
import { observeAsset } from '../src/current-read.mjs';
const args=process.argv.slice(2);let root=packageRoot,indexPath,id,mode='catalog',judgmentId=null,budgetBytes=1000000,allowRead=false;
for(let i=0;i<args.length;i++){
  if(args[i]==='--allow-read')allowRead=true;
  else if(['--root','--index','--id','--mode','--judgment-id','--budget'].includes(args[i])&&args[i+1]){
    const key=args[i],value=args[++i];
    if(key==='--root')root=resolve(value);else if(key==='--index')indexPath=resolve(value);else if(key==='--id')id=value;
    else if(key==='--mode')mode=value;else if(key==='--judgment-id')judgmentId=value;
    else {if(!/^(0|[1-9][0-9]*)$/.test(value))throw new Error('ASSETS_BUDGET_INVALID');budgetBytes=Number(value);}
  }else throw new Error('Usage: read-current.mjs --id catalog-id [--root directory] [--index file] [--allow-read] [--mode catalog|whole_asset|exact_selection] [--judgment-id id] [--budget bytes]');
}
const index=JSON.parse(readFileSync(indexPath??resolve(root,'index/current.json')));validateIndex(index,{root});
const entry=index.assets.find(x=>x.id===id);if(!entry)throw new Error('ASSETS_ENTRY_NOT_FOUND');
const result=await observeAsset({root,entry,allowRead,mode,judgmentId,budgetBytes});
console.log(JSON.stringify(result,null,2));
if(result.read.channel!=='read_envelope'||result.read.envelope.status!=='ready')process.exitCode=1;
