from pathlib import Path
import zipfile,shutil
root=Path('.');out=Path('release/JeokjaSaengjon-Windows-0.1.1.zip');app=Path('release/win-unpacked')
assert (app/'JeokjaSaengjon.exe').exists()
shutil.copy('assets/icon.ico',app/'icon.ico')
with zipfile.ZipFile(out,'w',zipfile.ZIP_DEFLATED,compresslevel=3) as z:
 for p in app.rglob('*'):
  if p.is_file():z.write(p,'JeokjaSaengjon/app/'+str(p.relative_to(app)))
 for p in Path('windows').iterdir():z.write(p,'JeokjaSaengjon/'+p.name)
 for f in ['USER_GUIDE.md','TEST_RESULTS.md']:z.write(Path('docs')/f,'JeokjaSaengjon/'+f)
 z.writestr('JeokjaSaengjon/START-HERE.txt','ZIP 전체 압축 해제 → Install.cmd 실행 → 바탕화면 적자생존 실행.\n설치 스크립트가 조직 정책으로 차단되면 관리자에게 확인하세요.\napp/JeokjaSaengjon.exe로도 실행할 수 있습니다.\n최초 실행은 가상 학생으로 확인하세요. Google 연동은 별도 승인 환경 설정이 필요합니다.\n')
with zipfile.ZipFile(out) as z:assert z.testzip() is None
print(out)
