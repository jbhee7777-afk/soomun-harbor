<#
  Canva 그림 자동 가져오기 (asset inbox)

  흐름
    1. 그림을 만들 때 Claude 가 assets/inbox/manifest.json 에 이번 묶음(이름·순서·Canva 파일 이름)을 적는다.
    2. 사용자는 Canva 에서 그림을 다운로드만 한다 (이름 그대로, 기본 다운로드 폴더).
    3. 이 스크립트가 다운로드 폴더에서 이번 묶음 파일을 찾아 assets/ 로 "복사"하고 이름을 붙인다.
       - 먼저 Canva 파일 이름으로 정확히 짝을 짓는다 (다운로드 순서와 무관, " (1)" 같은 꼬리도 허용).
       - 이름으로 못 찾은 것은, 묶음을 만든 뒤 새로 생긴 그림 수가 정확히 남은 수와 같을 때만 시간 순서로 짝짓는다.
       - 애매하면 아무것도 복사하지 않고 후보만 보여 준다 (종료 코드 2).
    4. -Apply 일 때만 복사하고, 이어서 scripts/process-assets.js (투명화·webp·목록·테스트)를 실행한다.

  안전
    - 다운로드 폴더 원본은 지우거나 옮기지 않는다 (복사만).
    - 실제 파일 형식(JPG/PNG/WebP)을 내용으로 판별해 그 확장자를 쓴다.
    - assets 에 같은 이름의 다른 파일이 있으면 덮어쓰지 않는다 (-Force 로만).

  사용
    powershell -ExecutionPolicy Bypass -File scripts/import-assets.ps1            # 미리 보기 (복사 안 함)
    powershell -ExecutionPolicy Bypass -File scripts/import-assets.ps1 -Apply     # 복사 + 후처리 + 테스트
#>
param(
  [switch]$Apply,
  [switch]$Force,
  [switch]$NoProcess,
  [string]$Downloads = (Join-Path $env:USERPROFILE 'Downloads'),
  [string]$AssetsDir = '',
  [string]$Manifest = '',
  [int]$WindowMinutes = 360
)
$ErrorActionPreference = 'Stop'
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$root = Split-Path -Parent $PSScriptRoot
if (-not $AssetsDir) { $AssetsDir = Join-Path $root 'assets' }
if (-not $Manifest) { $Manifest = Join-Path $AssetsDir 'inbox\manifest.json' }

function Get-ImageType([string]$path) {
  $fs = [System.IO.File]::OpenRead($path)
  try { $b = New-Object byte[] 12; $n = $fs.Read($b, 0, 12) } finally { $fs.Close() }
  if ($n -ge 3 -and $b[0] -eq 0xFF -and $b[1] -eq 0xD8 -and $b[2] -eq 0xFF) { return 'jpg' }
  if ($n -ge 8 -and $b[0] -eq 0x89 -and $b[1] -eq 0x50 -and $b[2] -eq 0x4E -and $b[3] -eq 0x47) { return 'png' }
  if ($n -ge 12 -and [System.Text.Encoding]::ASCII.GetString($b, 0, 4) -eq 'RIFF' -and [System.Text.Encoding]::ASCII.GetString($b, 8, 4) -eq 'WEBP') { return 'webp' }
  return $null
}
function BaseName([string]$name) { return [System.IO.Path]::GetFileNameWithoutExtension($name) }
function Same-Name([string]$fileName, [string]$canvaName) {
  if (-not $canvaName) { return $false }
  $a = BaseName $fileName; $c = BaseName $canvaName
  if ($a -eq $c) { return $true }
  return ($a -match ('^' + [regex]::Escape($c) + '\s*\(\d+\)$'))   # 브라우저가 붙이는 " (1)"
}

if (-not (Test-Path $Manifest)) { Write-Host "manifest 가 없어요: $Manifest"; exit 1 }
$m = Get-Content $Manifest -Raw -Encoding UTF8 | ConvertFrom-Json
$items = @($m.items)
if ($items.Count -eq 0) { Write-Host '이번 묶음에 가져올 그림이 없어요.'; exit 1 }
$created = [DateTime]::Parse($m.createdAt).ToLocalTime()
Write-Host ("묶음 '{0}' · {1}개 · 만든 시각 {2:MM-dd HH:mm:ss} · 상태 {3}" -f $m.batch, $items.Count, $created, $m.status)

# 묶음을 만든 뒤(2분 여유) 다운로드 폴더에 생긴 그림 파일만 후보로
$since = $created.AddMinutes(-2)
$until = $created.AddMinutes($WindowMinutes)
$cands = @(Get-ChildItem -LiteralPath $Downloads -File | Where-Object { $_.LastWriteTime -ge $since -and $_.LastWriteTime -le $until } |
  ForEach-Object { $t = Get-ImageType $_.FullName; if ($t) { [pscustomobject]@{ File = $_; Type = $t } } } |
  Sort-Object { $_.File.LastWriteTime })

Write-Host ''
Write-Host ("다운로드 폴더의 후보 그림 ({0}개, {1:MM-dd HH:mm} 이후):" -f $cands.Count, $since)
if ($cands.Count -eq 0) { Write-Host '  (없음) 아직 다운로드하지 않았거나 시간 범위 밖이에요.'; exit 2 }
$cands | ForEach-Object { Write-Host ("  {0:MM-dd HH:mm:ss}  {1,7:N0} KB  {2,-4}  {3}" -f $_.File.LastWriteTime, ($_.File.Length / 1KB), $_.Type, $_.File.Name) }

# 1) Canva 파일 이름으로 짝짓기
$plan = @(); $used = @{}
foreach ($it in $items) {
  $hit = $cands | Where-Object { -not $used.ContainsKey($_.File.FullName) -and (Same-Name $_.File.Name $it.canvaName) } | Select-Object -Last 1
  if ($hit) { $used[$hit.File.FullName] = 1; $plan += [pscustomobject]@{ Item = $it; Cand = $hit; How = '이름' } }
  else { $plan += [pscustomobject]@{ Item = $it; Cand = $null; How = '' } }
}
# 2) 남은 것은, 남은 새 그림 수가 정확히 같을 때만 시간 순서로
$missing = @($plan | Where-Object { -not $_.Cand })
$rest = @($cands | Where-Object { -not $used.ContainsKey($_.File.FullName) })
$ambiguous = $false
if ($missing.Count -gt 0) {
  if ($rest.Count -eq $missing.Count) {
    for ($i = 0; $i -lt $missing.Count; $i++) { $missing[$i].Cand = $rest[$i]; $missing[$i].How = '시간순' }
  } else { $ambiguous = $true }
}

Write-Host ''
Write-Host '가져올 계획:'
foreach ($p in $plan) {
  if ($p.Cand) {
    $dest = $p.Item.target + '.' + $p.Cand.Type
    Write-Host ("  {0,-24} <- {1}  [{2}, {3:HH:mm:ss}]" -f $dest, $p.Cand.File.Name, $p.How, $p.Cand.File.LastWriteTime)
  } else { Write-Host ("  {0,-24} <- (찾지 못함)" -f $p.Item.target) }
}
if ($ambiguous) {
  Write-Host ''
  Write-Host ("애매해서 자동으로 가져오지 않았어요: 이름으로 못 찾은 그림 {0}개, 새로 생긴 다른 그림 {1}개." -f $missing.Count, $rest.Count)
  Write-Host '위 후보 목록을 확인해 주세요. (다른 그림도 함께 다운로드했거나, 아직 덜 다운로드했을 수 있어요)'
  exit 2
}
if (-not $Apply) { Write-Host ''; Write-Host '미리 보기만 했어요. 실제로 가져오려면 -Apply 를 붙여 실행해요.'; exit 0 }

# 3) 복사 (원본은 그대로)
$done = @()
foreach ($p in $plan) {
  $dest = Join-Path $AssetsDir ($p.Item.target + '.' + $p.Cand.Type)
  $other = @(Get-ChildItem -LiteralPath $AssetsDir -File -Filter ($p.Item.target + '.*') -ErrorAction SilentlyContinue)
  if ($other.Count -gt 0) {
    $same = $false
    foreach ($o in $other) { if ((Get-FileHash $o.FullName).Hash -eq (Get-FileHash $p.Cand.File.FullName).Hash) { $same = $true } }
    if ($same) { Write-Host ("  이미 같은 파일이 있어요: {0}" -f $other[0].Name); $done += $dest; continue }
    if (-not $Force) { Write-Host ("  다른 내용의 {0} 이(가) 이미 있어서 멈췄어요. (-Force 로 덮어쓰기)" -f $other[0].Name); exit 3 }
    $other | ForEach-Object { Remove-Item -LiteralPath $_.FullName }
  }
  Copy-Item -LiteralPath $p.Cand.File.FullName -Destination $dest
  Write-Host ("  복사함: {0}" -f (Split-Path -Leaf $dest))
  $done += $dest
}
$m.status = 'imported'
$m | Add-Member -NotePropertyName importedAt -NotePropertyValue ((Get-Date).ToUniversalTime().ToString('o')) -Force
$m | Add-Member -NotePropertyName imported -NotePropertyValue @($plan | ForEach-Object { [pscustomobject]@{ target = $_.Item.target; file = ($_.Item.target + '.' + $_.Cand.Type); from = $_.Cand.File.Name; how = $_.How } }) -Force
[System.IO.File]::WriteAllText($Manifest, ($m | ConvertTo-Json -Depth 6), (New-Object System.Text.UTF8Encoding($false)))

if ($NoProcess) { exit 0 }
Write-Host ''
Write-Host '후처리 시작 (투명화 · webp · 그림 목록 · 테스트)...'
& node (Join-Path $root 'scripts\process-assets.js') --assets $AssetsDir --manifest $Manifest
exit $LASTEXITCODE
