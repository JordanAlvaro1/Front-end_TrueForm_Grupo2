$ErrorActionPreference = 'Stop'
npm install
if ($LASTEXITCODE -ne 0) { throw 'Fallo npm install' }
npm run build
if ($LASTEXITCODE -ne 0) { throw 'Fallo la compilacion Angular' }
$origen = '.\dist\TrueForm\browser'
if (!(Test-Path "$origen\index.html")) { throw 'No se encontro index.html en dist/TrueForm/browser' }
if (Test-Path '.\docs') { Remove-Item '.\docs' -Recurse -Force }
New-Item -ItemType Directory -Path '.\docs' | Out-Null
Copy-Item "$origen\*" '.\docs' -Recurse -Force
New-Item -ItemType File -Path '.\docs\.nojekyll' -Force | Out-Null
Write-Host 'LISTO: carpeta docs generada. Sube docs y src al repositorio existente.'
