// CI-only next-version installer. Never uploaded as a public release.
import fs from 'node:fs';import path from 'node:path';import {execFileSync}from'node:child_process';
const file='package.json',original=fs.readFileSync(file,'utf8'),p=JSON.parse(original),parts=p.version.split('.').map(Number);parts[2]++;p.version=parts.join('.');
const env={...process.env};if(!env.CSC_LINK){delete env.CSC_LINK;delete env.CSC_KEY_PASSWORD}
try{fs.writeFileSync(file,JSON.stringify(p,null,2));execFileSync(process.execPath,[path.resolve('node_modules/electron-builder/cli.js'),'--win','nsis','--x64','--publish','never','--config.directories.output=release/update-fixture'],{stdio:'inherit',env});}finally{fs.writeFileSync(file,original)}
