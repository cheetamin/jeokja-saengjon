$ErrorActionPreference = 'Stop'
$title = -join ([char[]](0xC801,0xC790,0xC0DD,0xC874))
$target = Join-Path $env:LOCALAPPDATA 'Programs\JeokjaSaengjon'
$exe = Join-Path $target 'JeokjaSaengjon.exe'
if (Get-Process -ErrorAction SilentlyContinue | Where-Object { $_.Path -eq $exe }) { Write-Host 'Close the app first.'; exit 1 }
Write-Host 'This removes the app and shortcuts. Encrypted records and backups are kept.'
if ((Read-Host 'Type REMOVE to continue') -ne 'REMOVE') { exit }
if (Test-Path $target) { Remove-Item -LiteralPath $target -Recurse -Force }
foreach ($folder in @([Environment]::GetFolderPath('DesktopDirectory'),[Environment]::GetFolderPath('Programs'))) {
 $shortcut = Join-Path $folder ($title + '.lnk')
 if (Test-Path $shortcut) { Remove-Item -LiteralPath $shortcut -Force }
}
Write-Host 'App removed. Data remains in AppData\Roaming\JeokjaSaengjon.'
