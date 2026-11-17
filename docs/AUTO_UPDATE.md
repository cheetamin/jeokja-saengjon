# 앱 내 업데이트

## 사용자
Windows 사용자는 0.1.5의 `JeokjaSaengjon-Setup-0.1.5.exe`를 한 번 설치합니다. 기존 ZIP 또는 Install.cmd 설치본은 업데이트용 설치 정보가 없으므로 앱에 수동 설치 안내가 나타납니다. 설치 파일은 사용자별 `Programs/JeokjaSaengjon`에 설치하고 같은 바탕화면 바로가기를 만듭니다. 상담 자료는 별도의 기존 `AppData/Roaming/JeokjaSaengjon`에 유지합니다. 처음 전환 전에는 앱에서 암호화 백업을 저장하세요.

설정 → 프로그램 업데이트 → **업데이트 확인 → 업데이트 다운로드 → 재시작하여 적용** 순서입니다. 확인만으로 파일을 다운로드하거나 앱을 종료하지 않습니다. 내려받은 파일은 electron-updater의 SHA-512 검증을 통과해야 적용할 수 있습니다. 다운로드 후 일반 종료만으로 자동 설치하지 않습니다. 다운로드 중에는 계속 상담을 작성하고 저장할 수 있습니다. 적용 전 확인창에서 동의하면 작성 내용을 저장하고 `update-backups`에 암호화 백업을 만든 뒤 재시작합니다. 백업에는 Google OAuth 정보가 제외됩니다. 원래 보관함 비밀번호로 복원할 수 있습니다. 저장·백업 실패 시 설치를 시작하지 않습니다.

Google 인증 또는 동기화가 진행 중이면 해당 작업을 마친 뒤 적용하세요. 네트워크·권한 오류는 실패로 표시하고 기존 앱을 유지합니다. 이 자동 백업은 같은 컴퓨터에 있으므로 별도 저장 장치에 보관하는 수동 백업도 유지하세요. 이전 버전으로 되돌릴 때 새 보관함 형식을 지원하는지 확인하세요.

현재 Mac 빌드는 정식 Apple Developer ID 서명이 없어 **확인 및 수동 설치 파일 다운로드만 제공**합니다. 자동 교체 완료로 표시하지 않습니다. 정식 서명·공증한 빌드를 응용 프로그램 폴더에 한 번 설치한 이후에 Mac 자동 적용 경로를 사용할 수 있도록 구현했습니다. 해당 서명 경로의 실제 실행 검증은 인증서 설정 후 추가로 필요합니다.

## 배포 담당자
정식 업데이트 대상은 `cheetamin/jeokja-saengjon` GitHub Releases입니다. 공개 시범 버전(prerelease)도 확인하되, 프로그램 버전은 `0.1.5`처럼 숫자 세 자리 형식을 사용합니다. 다운그레이드와 자동 설치를 허용하지 않습니다. GitHub 토큰이나 상담·인증 정보는 배포 클라이언트에 넣지 않습니다. 기본 HTTPS 검증 및 업데이트 패키지 검증을 변경하지 않습니다.

Windows는 NSIS 설치 파일, `.blockmap`, `latest.yml`을 함께 게시합니다. 현재 Windows 배포에는 정식 서명 인증서가 설정되지 않았습니다. 따라서 SHA-512 일치 검사는 제공하지만 게시자 Authenticode 인증과 동일하다고 주장하지 않습니다. Windows 인증서를 준비하면 GitHub Actions의 `WINDOWS_CSC_LINK`, `WINDOWS_CSC_KEY_PASSWORD` 보안 설정을 통해 서명합니다. 자격 정보는 소스·이슈·채팅에 올리지 마세요.

Mac 정식 자동 업데이트에는 Apple Developer ID 인증서와 공증 자격이 필요합니다. Actions 보안 설정 이름은 `MAC_CSC_LINK`, `MAC_CSC_KEY_PASSWORD`, `APPLE_ID`, `APPLE_APP_SPECIFIC_PASSWORD`, `APPLE_TEAM_ID`입니다. 인증서가 존재할 때만 워크플로가 앱 내부 `macSigned` 정책을 활성화하고 DMG·ZIP·`latest-mac.yml`을 생성합니다. 인증서가 없으면 기존 ad-hoc 서명 시범 앱을 만들고 `macSigned=false`로 자동 교체를 차단합니다. 인증서 설정만으로 검증 완료를 의미하지 않습니다. 정식 서명 빌드 두 버전 사이의 실제 교체 시험을 별도로 수행하세요.

Windows CI의 `tools/build-update-fixture.mjs`는 다음 패치 버전의 임시 설치 파일을 만들어 로컬 서버에서 실제 업데이트를 시험합니다. 이 파일은 공개 아티팩트 업로드 경로에서 제외됩니다. `tools/native-update-smoke.mjs`는 설치, 다운로드·검증, NSIS 교체, 자동 재실행, 기록·초안·암호화 백업 보존을 검사합니다. 실패하면 공개 배포가 중단됩니다.

참고: https://www.electron.build/v26/docs/features/auto-update/
참고: https://www.electronjs.org/docs/latest/api/auto-updater
