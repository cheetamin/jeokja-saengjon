"""Remove document authorship and printer metadata without changing counseling cells or reference lists."""
import re,sys,zipfile
from pathlib import Path

def sanitize(path):
    path=Path(path)
    with zipfile.ZipFile(path) as src: files={n:src.read(n) for n in src.namelist()}
    files['docProps/core.xml']=b'<?xml version="1.0" encoding="UTF-8"?><cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:creator>JeokjaSaengjon</dc:creator></cp:coreProperties>'
    for name in list(files):
        if name.startswith('xl/printerSettings/') or name=='docProps/custom.xml':del files[name];continue
        if name.startswith('xl/comments') and name.endswith('.xml'):
            files[name]=re.sub(rb'<author>[^<]*</author>',b'<author>JeokjaSaengjon</author>',files[name])
        if name.startswith('xl/worksheets/') and name.endswith('.xml') and '/_rels/' not in name:
            files[name]=re.sub(rb'(<pageSetup\b[^>]*?)\s+r:id="[^"]*"',rb'\1',files[name])
        if name.endswith('.rels'):
            files[name]=re.sub(rb'<Relationship\b[^>]*Type="[^"]*/printerSettings"[^>]*/>',b'',files[name])
        if name=='[Content_Types].xml':
            files[name]=re.sub(rb'<Default\b[^>]*Extension="bin"[^>]*/>',b'',files[name])
    with zipfile.ZipFile(path,'w',zipfile.ZIP_DEFLATED) as out:
        for name,data in files.items():out.writestr(name,data)

if __name__=='__main__':
    for path in sys.argv[1:]:sanitize(path)
