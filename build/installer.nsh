; Keep the legacy desktop shortcut install location on the first NSIS install.
; Later updates follow the existing NSIS registry path.
!macro customInit
  ReadRegStr $0 HKCU "${INSTALL_REGISTRY_KEY}" InstallLocation
  ${If} $0 == ""
    StrCpy $INSTDIR "$LOCALAPPDATA\Programs\JeokjaSaengjon"
  ${EndIf}
!macroend
