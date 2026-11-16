$ErrorActionPreference = 'Stop'
try {
    $source = Join-Path $env:JEOKJA_INSTALL_SOURCE 'app'
    $target = Join-Path $env:LOCALAPPDATA 'Programs\JeokjaSaengjon'
    $title = -join ([char[]](0xC801,0xC790,0xC0DD,0xC874))
    $exe = Join-Path $target 'JeokjaSaengjon.exe'
    if (!(Test-Path (Join-Path $source 'JeokjaSaengjon.exe'))) { throw 'Extract the entire ZIP first. The app folder is missing.' }
    if (Get-Process -ErrorAction SilentlyContinue | Where-Object { $_.Path -eq $exe }) { throw 'Close JeokjaSaengjon before installing or updating.' }
    New-Item -ItemType Directory -Force -Path $target | Out-Null
    Copy-Item -Path (Join-Path $source '*') -Destination $target -Recurse -Force
    $shell = New-Object -ComObject WScript.Shell
    foreach ($folder in @([Environment]::GetFolderPath('DesktopDirectory'), [Environment]::GetFolderPath('Programs'))) {
        $shortcut = $shell.CreateShortcut((Join-Path $folder ($title + '.lnk')))
        $shortcut.TargetPath = $exe
        $shortcut.WorkingDirectory = $target
        $shortcut.IconLocation = (Join-Path $target 'icon.ico')
        $shortcut.Description = 'Private counseling notebook'
        $shortcut.Save()
    }
    Write-Host 'Installed. Open the desktop shortcut to start.'
    Start-Process -FilePath $exe -WorkingDirectory $target
} catch { Write-Host ('Installation failed: ' + $_.Exception.Message); exit 1 }
