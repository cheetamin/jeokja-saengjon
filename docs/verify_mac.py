from pathlib import Path
import struct,plistlib,hashlib,sys
app=Path(sys.argv[1]);count=0
for p in app.rglob('*'):
 if p.is_symlink() or not p.is_file():continue
 b=p.read_bytes()
 if b[:4]!=b'\xcf\xfa\xed\xfe':continue
 o=32;blobs={}
 for _ in range(struct.unpack_from('<I',b,16)[0]):
  cmd,size=struct.unpack_from('<II',b,o)
  if cmd==0x1d:
   off,ln=struct.unpack_from('<II',b,o+8);blob=b[off:off+ln]
   for j in range(struct.unpack_from('>I',blob,8)[0]):
    typ,bo=struct.unpack_from('>II',blob,12+j*8);le=struct.unpack_from('>I',blob,bo+4)[0];blobs[typ]=blob[bo:bo+le]
  o+=size
 ent=plistlib.loads(blobs[5][8:]);assert ent['com.apple.security.cs.allow-jit'] and ent['com.apple.security.cs.disable-library-validation']
 cd=blobs[0];ho=struct.unpack_from('>I',cd,16)[0];nc=struct.unpack_from('>I',cd,28)[0];limit=struct.unpack_from('>I',cd,32)[0];hs,ht,_,pg=struct.unpack_from('BBBB',cd,36);digest={1:hashlib.sha1,2:hashlib.sha256,3:hashlib.sha256,4:hashlib.sha384}[ht];page=1<<pg
 assert nc==(limit+page-1)//page
 for i in range(nc):assert cd[ho+i*hs:ho+(i+1)*hs]==digest(b[i*page:min((i+1)*page,limit)]).digest()[:hs],(p,i)
 assert cd[ho-5*hs:ho-4*hs]==digest(blobs[5]).digest()[:hs],p
 count+=1
for p in app.rglob('CodeResources'):
 if p.is_symlink():continue
 d=plistlib.loads(p.read_bytes());content=p.parent.parent
 for rel,e in d.get('files2',{}).items():
  if isinstance(e,dict) and 'hash2' in e:
   assert hashlib.sha256((content/rel).read_bytes()).digest()==e['hash2'],rel
print(f'PASS: {count} Mach-O code-page and entitlement hashes; sealed resource hashes')
