param(
  [string]$BaseUrl = "http://127.0.0.1:3001",
  [switch]$SkipCleanup,
  [switch]$WithNegativeChecks,
  [switch]$WithMobileEmployee,
  [string]$ReportPath
)

$ErrorActionPreference = "Stop"

function Assert-Status {
  param(
    [Parameter(Mandatory=$true)][int]$Actual,
    [Parameter(Mandatory=$true)][int[]]$Expected,
    [Parameter(Mandatory=$true)][string]$Label
  )
  if ($Expected -notcontains $Actual) {
    throw "$Label expected HTTP $($Expected -join ',') but got $Actual"
  }
}

function Read-DotEnvValue {
  param(
    [Parameter(Mandatory=$true)][string]$Path,
    [Parameter(Mandatory=$true)][string]$Key
  )

  if (!(Test-Path $Path)) { return $null }

  $line = Get-Content $Path | Where-Object { $_ -match "^\s*${Key}\s*=" } | Select-Object -First 1
  if (-not $line) { return $null }

  $value = ($line -split "=", 2)[1]
  if ($null -eq $value) { return $null }

  $value = $value.Trim()
  if (($value.StartsWith('"') -and $value.EndsWith('"')) -or ($value.StartsWith("'") -and $value.EndsWith("'"))) {
    $value = $value.Substring(1, $value.Length - 2)
  }

  return $value
}

function CurlJson {
  param(
    [Parameter(Mandatory=$true)][string]$Method,
    [Parameter(Mandatory=$true)][string]$Url,
    [string]$CookieFile,
    [string]$Data,
    [string[]]$Headers
  )

  $args = @('-sS','-X', $Method)
  if ($CookieFile) { $args += @('-b', $CookieFile, '-c', $CookieFile) }
  if ($Headers) { foreach($h in $Headers){ $args += @('-H', $h) } }
  $tempBodyPath = $null
  try {
    if ($Data) {
      # Always send via a UTF-8 temp file to avoid quoting/escaping issues on Windows.
      $tempBodyPath = Join-Path ([IO.Path]::GetTempPath()) ("e2e-body-{0}.json" -f ([Guid]::NewGuid().ToString('N')))
      Set-Content -Path $tempBodyPath -Value $Data -Encoding utf8
      $args += @('--data-binary', ("@{0}" -f $tempBodyPath))
    }

    $args += $Url

    $out = & curl.exe @args
    if ($LASTEXITCODE -ne 0) { throw "curl failed ($LASTEXITCODE) for $Method $Url" }
    return $out | ConvertFrom-Json
  } finally {
    if ($tempBodyPath -and (Test-Path $tempBodyPath)) { Remove-Item -Force $tempBodyPath -ErrorAction SilentlyContinue }
  }
}

function CurlJsonWithStatus {
  param(
    [Parameter(Mandatory=$true)][string]$Method,
    [Parameter(Mandatory=$true)][string]$Url,
    [string]$CookieFile,
    [string]$Data,
    [string[]]$Headers
  )

  $args = @('-sS','-i','-X', $Method)
  if ($CookieFile) { $args += @('-b', $CookieFile, '-c', $CookieFile) }
  if ($Headers) { foreach($h in $Headers){ $args += @('-H', $h) } }

  $tempBodyPath = $null
  try {
    if ($Data) {
      $tempBodyPath = Join-Path ([IO.Path]::GetTempPath()) ("e2e-body-{0}.json" -f ([Guid]::NewGuid().ToString('N')))
      Set-Content -Path $tempBodyPath -Value $Data -Encoding utf8
      $args += @('--data-binary', ("@{0}" -f $tempBodyPath))
    }
    $args += $Url

    $raw = & curl.exe @args
    if ($LASTEXITCODE -ne 0) { throw "curl failed ($LASTEXITCODE) for $Method $Url" }

    $rawText = $raw -join "`n"
    $code = 0
    if ($rawText -match "HTTP/\d\.\d\s+(\d{3})") {
      $code = [int]$Matches[1]
    }
    $bodyText = ($rawText -split "\r?\n\r?\n", 2)[1]
    $json = $null
    if ($bodyText) {
      try { $json = $bodyText | ConvertFrom-Json } catch { $json = $null }
    }
    return [pscustomobject]@{ status = $code; body = $json; rawBody = $bodyText }
  } finally {
    if ($tempBodyPath -and (Test-Path $tempBodyPath)) { Remove-Item -Force $tempBodyPath -ErrorAction SilentlyContinue }
  }
}

function CurlForm {
  param(
    [Parameter(Mandatory=$true)][string]$Url,
    [Parameter(Mandatory=$true)][string]$CookieFile,
    [Parameter(Mandatory=$true)][hashtable]$Form
  )

  $pairs = @()
  foreach($k in $Form.Keys){
    $pairs += ("{0}={1}" -f [uri]::EscapeDataString($k), [uri]::EscapeDataString([string]$Form[$k]))
  }
  $body = $pairs -join '&'

  $args = @('-sS','-i','-X','POST','-b', $CookieFile,'-c', $CookieFile,'-H','Content-Type: application/x-www-form-urlencoded','--data', $body, $Url)
  $out = & curl.exe @args
  if ($LASTEXITCODE -ne 0) { throw "curl failed ($LASTEXITCODE) for POST $Url" }
  return $out
}

function CurlStatus {
  param(
    [Parameter(Mandatory=$true)][string]$Method,
    [Parameter(Mandatory=$true)][string]$Url,
    [string]$CookieFile,
    [string]$Data,
    [string[]]$Headers
  )

  $args = @('-sS','-o','NUL','-w','%{http_code}','-X', $Method)
  if ($CookieFile) { $args += @('-b', $CookieFile, '-c', $CookieFile) }
  if ($Headers) { foreach($h in $Headers){ $args += @('-H', $h) } }
  $tempBodyPath = $null
  try {
    if ($Data) {
      $tempBodyPath = Join-Path ([IO.Path]::GetTempPath()) ("e2e-body-{0}.json" -f ([Guid]::NewGuid().ToString('N')))
      Set-Content -Path $tempBodyPath -Value $Data -Encoding utf8
      $args += @('--data-binary', ("@{0}" -f $tempBodyPath))
    }
    $args += $Url

    $code = & curl.exe @args
    if ($LASTEXITCODE -ne 0) { throw "curl failed ($LASTEXITCODE) for $Method $Url" }
    return [int]$code
  } finally {
    if ($tempBodyPath -and (Test-Path $tempBodyPath)) { Remove-Item -Force $tempBodyPath -ErrorAction SilentlyContinue }
  }
}

function Login-NextAuth {
  param(
    [Parameter(Mandatory=$true)][string]$Email,
    [Parameter(Mandatory=$true)][string]$Password,
    [Parameter(Mandatory=$true)][string]$CookieFile
  )

  $csrf = CurlJson -Method 'GET' -Url ("$BaseUrl/api/auth/csrf") -CookieFile $CookieFile
  if (-not $csrf.csrfToken) { throw "No csrfToken from /api/auth/csrf" }

  $resp = CurlForm -Url ("$BaseUrl/api/auth/callback/credentials") -CookieFile $CookieFile -Form @{
    csrfToken = $csrf.csrfToken
    email = $Email
    password = $Password
    callbackUrl = "$BaseUrl/dashboard"
    json = 'true'
  }

  $respText = $resp -join "`n"

  # NextAuth may respond with 200 (json=true) or 302/303 redirect.
  if ($respText -notmatch "HTTP/\d\.\d\s+(200|30[23])") {
    Write-Host "Login raw response (first 40 lines):" -ForegroundColor Yellow
    ($respText -split "`n" | Select-Object -First 40) | ForEach-Object { Write-Host $_ -ForegroundColor DarkYellow }
    throw "Unexpected login response"
  }
}

$repoRoot = Split-Path -Parent $PSScriptRoot
$dotenv = Join-Path $repoRoot ".env"

$superEmail = Read-DotEnvValue -Path $dotenv -Key "SUPER_ADMIN_EMAIL"
$superPass = Read-DotEnvValue -Path $dotenv -Key "SUPER_ADMIN_PASSWORD"

if (-not $superEmail -or -not $superPass) {
  throw "Missing SUPER_ADMIN_EMAIL / SUPER_ADMIN_PASSWORD in .env (needed for automated login)"
}

$tmpDir = Join-Path $repoRoot "tmp"
New-Item -ItemType Directory -Force -Path $tmpDir | Out-Null

$runId = [Guid]::NewGuid().ToString('N').Substring(0,8)

$superCookie = Join-Path $tmpDir "e2e-super-$runId.cookies.txt"
$tenantAdminCookie = Join-Path $tmpDir "e2e-tenant-admin-$runId.cookies.txt"
$userCookie = Join-Path $tmpDir "e2e-user-$runId.cookies.txt"

if (-not $ReportPath) {
  $ReportPath = Join-Path $tmpDir "e2e-report-$runId.json"
}

$report = [ordered]@{
  runId = $runId
  baseUrl = $BaseUrl
  startedAt = (Get-Date).ToString('o')
  tenant = $null
  tenantAdmin = $null
  user = $null
  mobileEmployee = $null
  negativeChecks = @()
}

Write-Host "[1/6] Login as SUPER_ADMIN" -ForegroundColor Cyan

# Ensure SUPER_ADMIN password matches .env (endpoint reads server env). This is safe locally and idempotent.
try {
  $null = CurlStatus -Method 'POST' -Url ("$BaseUrl/api/bootstrap/super-admin") -Data '' -Headers @('Content-Type: application/json')
} catch {
  # If bootstrap isn't configured, continue and rely on existing credentials.
}

Login-NextAuth -Email $superEmail -Password $superPass -CookieFile $superCookie

if ($WithNegativeChecks) {
  $code = CurlStatus -Method 'GET' -Url ("$BaseUrl/api/admin/tenants") -CookieFile $superCookie
  Assert-Status -Actual $code -Expected @(200) -Label "SUPER_ADMIN can list tenants"
  $report.negativeChecks += [ordered]@{ label = 'super_admin_list_tenants'; status = $code }
}

Write-Host "[2/6] Create tenant (company)" -ForegroundColor Cyan
$tenantSlug = "e2e-$runId"
$tenantBody = @{
  name = "E2E Company $runId"
  nameAr = "شركة اختبار $runId"
  slug = $tenantSlug
  plan = "trial"
  maxEmployees = 10
} | ConvertTo-Json -Compress

$tenantRes = CurlJson -Method 'POST' -Url ("$BaseUrl/api/admin/tenants") -CookieFile $superCookie -Data $tenantBody -Headers @('Content-Type: application/json')
if (-not $tenantRes.success -or -not $tenantRes.data.id) {
  throw "Failed to create tenant"
}
$tenantId = $tenantRes.data.id
Write-Host "  tenantId=$tenantId slug=$tenantSlug" -ForegroundColor DarkGray
$report.tenant = [ordered]@{ id = $tenantId; slug = $tenantSlug }

Write-Host "[3/6] Bootstrap tenant admin (DEV-only endpoint)" -ForegroundColor Cyan
$tenantAdminEmail = "tenant.admin+$runId@example.com"
$tenantAdminPass = "Test12345!"
$bootstrapBody = @{
  email = $tenantAdminEmail
  password = $tenantAdminPass
  firstName = "Tenant"
  lastName = "Admin"
} | ConvertTo-Json -Compress

$bootRes = CurlJson -Method 'POST' -Url ("$BaseUrl/api/admin/tenants/$tenantId/bootstrap-admin") -CookieFile $superCookie -Data $bootstrapBody -Headers @('Content-Type: application/json')
if (-not $bootRes -or -not $bootRes.data -or -not $bootRes.data.user -or -not $bootRes.data.user.id) {
  Write-Host "Bootstrap tenant admin response (debug):" -ForegroundColor Yellow
  try {
    ($bootRes | ConvertTo-Json -Depth 20) | ForEach-Object { Write-Host $_ -ForegroundColor DarkYellow }
  } catch {
    Write-Host "(Failed to stringify response: $($_.Exception.Message))" -ForegroundColor DarkYellow
  }
  throw "Failed to bootstrap tenant admin"
}

$report.tenantAdmin = [ordered]@{ email = $tenantAdminEmail }

Write-Host "[4/6] Login as TENANT_ADMIN" -ForegroundColor Cyan
Login-NextAuth -Email $tenantAdminEmail -Password $tenantAdminPass -CookieFile $tenantAdminCookie

if ($WithNegativeChecks) {
  $body = (@{ name = "Should Fail"; slug = "forbidden-$runId"; plan = "trial"; maxEmployees = 1 } | ConvertTo-Json -Compress)
  $code = CurlStatus -Method 'POST' -Url ("$BaseUrl/api/admin/tenants") -CookieFile $tenantAdminCookie -Data $body -Headers @('Content-Type: application/json')
  Assert-Status -Actual $code -Expected @(403) -Label "TENANT_ADMIN cannot create tenants"
  $report.negativeChecks += [ordered]@{ label = 'tenant_admin_create_tenant_forbidden'; status = $code }
}

Write-Host "[5/6] Create a tenant user via /api/users" -ForegroundColor Cyan
$appUserEmail = "user+$runId@example.com"
$appUserPass = "Test12345!"
$userBody = @{
  firstName = "E2E"
  lastName = "User"
  email = $appUserEmail
  password = $appUserPass
  role = "HR_MANAGER"
  phone = "0500000000"
} | ConvertTo-Json -Compress

$userRes = CurlJson -Method 'POST' -Url ("$BaseUrl/api/users") -CookieFile $tenantAdminCookie -Data $userBody -Headers @('Content-Type: application/json')
if (-not $userRes.data.id) { throw "Failed to create user" }
$userId = $userRes.data.id
Write-Host "  userId=$userId email=$appUserEmail" -ForegroundColor DarkGray
$report.user = [ordered]@{ id = $userId; email = $appUserEmail }

if ($WithMobileEmployee) {
  Write-Host "[5b] Create a demo EMPLOYEE user + linked Employee record (for mobile attendance)" -ForegroundColor Cyan

  $mobileEmail = "employee+$runId@example.com"
  $mobilePass = "Test12345!"

  $mobileUserBody = @{
    firstName = "Mobile"
    lastName = "Employee"
    email = $mobileEmail
    password = $mobilePass
    role = "EMPLOYEE"
    phone = "0500000001"
  } | ConvertTo-Json -Compress

  $mobileUserRes = CurlJson -Method 'POST' -Url ("$BaseUrl/api/users") -CookieFile $tenantAdminCookie -Data $mobileUserBody -Headers @('Content-Type: application/json')
  if (-not $mobileUserRes.data.id) { throw "Failed to create mobile employee user" }
  $mobileUserId = $mobileUserRes.data.id

  $employeeBody = @{
    userId = $mobileUserId
    firstName = "Mobile"
    lastName = "Employee"
    email = $mobileEmail
    hireDate = (Get-Date).ToString('o')
    employmentType = "FULL_TIME"
  } | ConvertTo-Json -Compress

  $employeeRes = CurlJson -Method 'POST' -Url ("$BaseUrl/api/employees") -CookieFile $tenantAdminCookie -Data $employeeBody -Headers @('Content-Type: application/json')
  if (-not $employeeRes.data.id) { throw "Failed to create employee record linked to user" }
  $employeeId = $employeeRes.data.id

  # Verify mobile login + today endpoint (employee context required)
  $deviceId = "e2e-device-$runId"
  $loginBody = @{ email = $mobileEmail; password = $mobilePass } | ConvertTo-Json -Compress
  $loginRes = CurlJson -Method 'POST' -Url ("$BaseUrl/api/mobile/auth/login") -Data $loginBody -Headers @(
    'Content-Type: application/json',
    ("x-device-id: $deviceId"),
    'x-device-platform: android',
    'x-device-name: e2e',
    'x-app-version: 1.0.0'
  )

  $accessToken = $loginRes.data.accessToken
  if (-not $accessToken) { throw "Mobile login did not return accessToken" }
  if (-not $loginRes.data.user.employeeId) { throw "Mobile login missing employeeId" }

  $todayRes = CurlJsonWithStatus -Method 'GET' -Url ("$BaseUrl/api/mobile/attendance/today") -Headers @(
    ("Authorization: Bearer $accessToken"),
    ("x-device-id: $deviceId")
  )
  Assert-Status -Actual $todayRes.status -Expected @(200) -Label "Mobile attendance today"

  $report.mobileEmployee = [ordered]@{
    email = $mobileEmail
    password = $mobilePass
    userId = $mobileUserId
    employeeId = $employeeId
    deviceId = $deviceId
  }
}

Write-Host "[6/6] Login as the new user and hit a tenant-scoped endpoint" -ForegroundColor Cyan
Login-NextAuth -Email $appUserEmail -Password $appUserPass -CookieFile $userCookie

if ($WithNegativeChecks) {
  $code = CurlStatus -Method 'GET' -Url ("$BaseUrl/api/admin/tenants") -CookieFile $userCookie
  Assert-Status -Actual $code -Expected @(403,401) -Label "Non-super user cannot list tenants"
  $report.negativeChecks += [ordered]@{ label = 'user_list_tenants_forbidden'; status = $code }

  $code = CurlStatus -Method 'GET' -Url ("$BaseUrl/api/users") -CookieFile $userCookie
  Assert-Status -Actual $code -Expected @(200) -Label "Tenant user can list users"
  $report.negativeChecks += [ordered]@{ label = 'user_list_users_ok'; status = $code }
}

$org = CurlJson -Method 'GET' -Url ("$BaseUrl/api/organization") -CookieFile $userCookie
if (-not $org.profile -or -not $org.profile.tenantId) { throw "Organization endpoint failed" }
Write-Host "  organization.tenantId=$($org.profile.tenantId)" -ForegroundColor DarkGray
$report.organizationTenantId = $org.profile.tenantId

Write-Host "\nE2E OK" -ForegroundColor Green
Write-Host "- Tenant slug: $tenantSlug" -ForegroundColor Green
Write-Host "- Tenant admin: $tenantAdminEmail" -ForegroundColor Green
Write-Host "- User: $appUserEmail" -ForegroundColor Green

$report.finishedAt = (Get-Date).ToString('o')
$report.success = $true
($report | ConvertTo-Json -Depth 20) | Set-Content -Path $ReportPath -Encoding utf8
Write-Host "Report: $ReportPath" -ForegroundColor DarkGray

if (-not $SkipCleanup) {
  try {
    Write-Host "\nCleanup: cancelling tenant" -ForegroundColor Yellow
    $null = CurlJson -Method 'DELETE' -Url ("$BaseUrl/api/admin/tenants/$tenantId") -CookieFile $superCookie
    Write-Host "Cleanup OK" -ForegroundColor Yellow
  } catch {
    Write-Host "Cleanup failed: $($_.Exception.Message)" -ForegroundColor Yellow
  }
}
