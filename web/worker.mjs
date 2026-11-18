import {validEnvelope} from '../desktop/cloud-codec.mjs';
const response=(value,status=200,headers={})=>new Response(JSON.stringify(value),{status,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer',...headers}});
const MAX=2900000;
async function readBounded(request){const reader=request.body?.getReader();if(!reader)throw Error('body');let chunks=[],n=0;for(;;){let {done,value}=await reader.read();if(done)break;n+=value.length;if(n>MAX){await reader.cancel();throw Error('size')}chunks.push(value)}const bytes=new Uint8Array(n);let i=0;for(const c of chunks){bytes.set(c,i);i+=c.length}return JSON.parse(new TextDecoder().decode(bytes))}
export async function api(request,env){const url=new URL(request.url),id=request.headers.get('oai-authenticated-user-id');if(!id)return response({error:'로그인 후 사용할 수 있습니다.'},401);if(!env.BUCKET)return response({error:'저장 환경 연결이 준비되지 않았습니다.'},503);const hash=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(id))),n=>n.toString(16).padStart(2,'0')).join('');const key=`vault-v1/${hash}`;
 if(request.method==='GET'){const object=await env.BUCKET.get(key);return response({userId:id,email:request.headers.get('oai-authenticated-user-email')||'',etag:object?.etag||null,envelope:object?await object.json():null});}
 if(request.method!=='PUT')return response({error:'허용되지 않는 요청입니다.'},405,{'Allow':'GET, PUT'});
 if(request.headers.get('origin')!==url.origin||!request.headers.get('content-type')?.startsWith('application/json')||['cross-site','same-site'].includes(request.headers.get('sec-fetch-site')))return response({error:'허용되지 않는 요청입니다.'},403);
 if(Number(request.headers.get('content-length')||0)>MAX)return response({error:'보관함 크기 제한을 초과했습니다. 암호화 백업으로 보관하세요.'},413);
 let input;try{input=await readBounded(request)}catch{return response({error:'자료 크기 또는 형식을 확인하세요.'},400)}
 if(!validEnvelope(input?.envelope)||!(input.etag===null||typeof input.etag==='string'&&/^[a-f0-9]{32}$/.test(input.etag)))return response({error:'암호화 자료 형식이 올바르지 않습니다.'},400);
 // Atomic R2 conditional write: a concurrent save never silently overwrites a row.
 const onlyIf=new Headers(input.etag?{'If-Match':`"${input.etag}"`}:{'If-None-Match':'*'});
 const saved=await env.BUCKET.put(key,JSON.stringify(input.envelope),{onlyIf,httpMetadata:{contentType:'application/json'}});
 if(!saved)return response({conflict:true},409);return response({etag:saved.etag});
}
export function makeWorker(assets){return {async fetch(request,env){try{const url=new URL(request.url);if(url.pathname==='/api/vault')return await api(request,env);if(url.pathname.startsWith('/api/'))return response({error:'없는 경로입니다.'},404);const asset=assets[url.pathname]||(!url.pathname.includes('.')?assets['/index.html']:null);if(!asset)return new Response('Not found',{status:404});const bytes=Uint8Array.from(atob(asset.data),c=>c.charCodeAt(0));return new Response(bytes,{headers:{'Content-Type':asset.type,'Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer','Content-Security-Policy':"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; font-src 'self'; object-src 'none'; base-uri 'none'; form-action 'self'"}});}catch{return response({error:'저장 서버에 연결하지 못했습니다. 입력한 내용은 이 기기의 암호화 보관함에 유지됩니다.'},503);}}}

}
