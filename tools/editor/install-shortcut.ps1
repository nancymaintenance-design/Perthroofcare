$ErrorActionPreference = 'Stop'
$editorRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$desktopRoot = [Environment]::GetFolderPath('Desktop')
$shortcutPath = Join-Path $desktopRoot 'Perth Roof Care 本地后台.lnk'
$shortcutShell = New-Object -ComObject WScript.Shell
if (Test-Path -LiteralPath $shortcutPath) {
    $existingShortcut = $shortcutShell.CreateShortcut($shortcutPath)
    if ($existingShortcut.Arguments -notlike '*Perth Roof Care*open-editor.vbs*') { throw '桌面已有同名入口，请人工核对，不覆盖。' }
}
$shortcut = $shortcutShell.CreateShortcut($shortcutPath)
$shortcut.TargetPath = Join-Path $env:WINDIR 'System32/wscript.exe'
$shortcut.Arguments = '"' + (Join-Path $editorRoot 'open-editor.vbs') + '"'
$shortcut.WorkingDirectory = Split-Path -Parent (Split-Path -Parent $editorRoot)
$shortcut.Description = 'Perth Roof Care 本地中文草稿编辑；不会自动上线'
$shortcut.Save()
Write-Output $shortcutPath
