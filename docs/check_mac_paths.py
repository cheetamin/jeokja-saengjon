import sys,plistlib
from pathlib import Path
app=Path(sys.argv[1]);seen=0
for p in app.rglob('Info.plist'):
 if p.is_symlink():continue
 try:d=plistlib.loads(p.read_bytes())
 except:continue
 exe=d.get('CFBundleExecutable')
 if not exe:continue
 if p==app/'Contents/Info.plist' or p.parent.parent.suffix=='.app':
  assert exe.isascii(),f'Non-ASCII executable path: {exe}'
  assert (p.parent/'MacOS'/exe).exists(),f'Missing executable: {exe}'
  seen+=1
assert seen==5,seen
print('PASS: main and four helper names are ASCII and match Info.plist executable paths')
