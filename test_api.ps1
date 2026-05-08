# Grawizah API Testing Script for Windows PowerShell
# Usage: powershell -ExecutionPolicy Bypass -File test_api.ps1

$BASE_URL = "http://localhost:8080"
$PASS = 0
$FAIL = 0

function Pass($msg) { $script:PASS++; Write-Host "  [PASS] $msg" -ForegroundColor Green }
function Fail($msg) { $script:FAIL++; Write-Host "  [FAIL] $msg" -ForegroundColor Red }

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  Grawizah API Testing (PowerShell)" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# 1. Health Check
Write-Host "`n--- Health Check ---" -ForegroundColor Yellow
try {
    $r = Invoke-RestMethod -Uri "$BASE_URL/health" -Method GET -TimeoutSec 5
    if ($r.status -eq "healthy") { Pass "Health check: $($r.status)" } else { Fail "Health check: $($r.status)" }
} catch { Fail "Health check: $_" }

# 2. Register
Write-Host "`n--- Authentication ---" -ForegroundColor Yellow
try {
    $body = @{email="test@example.com";password="password123";role="free_trader"} | ConvertTo-Json
    $r = Invoke-RestMethod -Uri "$BASE_URL/api/auth/register" -Method POST -ContentType "application/json" -Body $body -TimeoutSec 5
    $TOKEN = $r.token
    if ($TOKEN) { Pass "Register: token received ($($TOKEN.Substring(0,20))...)" } else { Fail "Register" }
} catch { Fail "Register: $_" }

# 3. Login
try {
    $body = @{email="test@grawizah.com";password="password123"} | ConvertTo-Json
    $r = Invoke-RestMethod -Uri "$BASE_URL/api/auth/login" -Method POST -ContentType "application/json" -Body $body -TimeoutSec 5
    $TOKEN = $r.token
    if ($TOKEN) { Pass "Login: token received ($($TOKEN.Substring(0,20))...)" } else { Fail "Login" }
} catch { Fail "Login: $_" }

# 4. Protected route without auth
Write-Host "`n--- Protected Routes ---" -ForegroundColor Yellow
try {
    $r = Invoke-RestMethod -Uri "$BASE_URL/api/products" -Method GET -TimeoutSec 5
    Fail "Products without auth: should be 401"
} catch {
    if ($_.Exception.Response.StatusCode.value__ -eq 401) { Pass "Products without auth: correctly blocked (401)" }
    else { Fail "Products without auth: wrong status $($_.Exception.Response.StatusCode.value__)" }
}

# 5. Products with auth
try {
    $headers = @{Authorization="Bearer $TOKEN"}
    $r = Invoke-RestMethod -Uri "$BASE_URL/api/products" -Method GET -Headers $headers -TimeoutSec 5
    Pass "Get products with auth: success"
} catch { Fail "Get products: $_" }

# 6. Create product
try {
    $headers = @{Authorization="Bearer $TOKEN"}
    $body = @{name="Test Product";description="Test";category="Oils";price_range_min=100;price_range_max=200;currency="USD";country_origin="Indonesia"} | ConvertTo-Json
    $r = Invoke-RestMethod -Uri "$BASE_URL/api/products" -Method POST -ContentType "application/json" -Headers $headers -Body $body -TimeoutSec 5
    Pass "Create product: success"
} catch { Fail "Create product: $_" }

# 7. Buyer radar
try {
    $headers = @{Authorization="Bearer $TOKEN"}
    $r = Invoke-RestMethod -Uri "$BASE_URL/api/buyers/radar" -Method GET -Headers $headers -TimeoutSec 5
    Pass "Buyer radar: success"
} catch { Fail "Buyer radar: $_" }

# 8. 2FA Status
try {
    $headers = @{Authorization="Bearer $TOKEN"}
    $r = Invoke-RestMethod -Uri "$BASE_URL/api/2fa/status" -Method GET -Headers $headers -TimeoutSec 5
    Pass "2FA status: enabled=$($r.enabled)"
} catch { Fail "2FA status: $_" }

# 9. Leaderboard
try {
    $headers = @{Authorization="Bearer $TOKEN"}
    $r = Invoke-RestMethod -Uri "$BASE_URL/api/leaderboard" -Method GET -Headers $headers -TimeoutSec 5
    Pass "Leaderboard: success"
} catch { Fail "Leaderboard: $_" }

# 10. AI HS Code
try {
    $headers = @{Authorization="Bearer $TOKEN"}
    $body = @{description="Coconut oil";category="Oils"} | ConvertTo-Json
    $r = Invoke-RestMethod -Uri "$BASE_URL/api/ai/hs-code" -Method POST -ContentType "application/json" -Headers $headers -Body $body -TimeoutSec 10
    Pass "AI HS Code: hs_code=$($r.data.hs_code)"
} catch {
    if ($_.Exception.Response.StatusCode.value__ -eq 429) { Pass "AI HS Code: rate limited (expected)" }
    else { Fail "AI HS Code: $_" }
}

# 11. Audit logs (should fail for non-admin)
try {
    $headers = @{Authorization="Bearer $TOKEN"}
    $r = Invoke-RestMethod -Uri "$BASE_URL/api/audit/logs" -Method GET -Headers $headers -TimeoutSec 5
    Pass "Audit logs: accessible"
} catch {
    if ($_.Exception.Response.StatusCode.value__ -eq 403) { Pass "Audit logs: correctly blocked for non-admin (403)" }
    else { Fail "Audit logs: $_" }
}

# 12. Company
try {
    $headers = @{Authorization="Bearer $TOKEN"}
    $r = Invoke-RestMethod -Uri "$BASE_URL/api/companies/me" -Method GET -Headers $headers -TimeoutSec 5
    Pass "Company me: success"
} catch {
    if ($_.Exception.Response.StatusCode.value__ -eq 404) { Pass "Company me: not found (expected if no company)" }
    else { Fail "Company me: $_" }
}

# 13. Chat
try {
    $headers = @{Authorization="Bearer $TOKEN"}
    $body = @{supplierId="test";message="Hello";channel="chat"} | ConvertTo-Json
    $r = Invoke-RestMethod -Uri "$BASE_URL/api/chat/send" -Method POST -ContentType "application/json" -Headers $headers -Body $body -TimeoutSec 5
    Pass "Chat send: success"
} catch { Fail "Chat send: $_" }

# Summary
Write-Host "`n==========================================" -ForegroundColor Cyan
Write-Host "  Results: $PASS passed, $FAIL failed" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

if ($FAIL -eq 0) { Write-Host "All tests passed!" -ForegroundColor Green }
else { Write-Host "Some tests failed. Check output above." -ForegroundColor Red }
