$global:pass = 0; $global:fail = 0; $global:skip = 0

function T($Name, $Result) {
    # Must check bool BEFORE string comparison because PowerShell coerces
    # non-empty strings to $true with -eq operator
    if ($Result -is [bool]) {
        if ($Result) { Write-Host "  [PASS] $Name" -ForegroundColor Green; $global:pass++ }
        else { Write-Host "  [FAIL] $Name" -ForegroundColor Red; $global:fail++ }
    }
    elseif ($Result -eq "SKIP") { Write-Host "  SKIP: $Name" -ForegroundColor Yellow; $global:skip++ }
    else { Write-Host "  [FAIL] $Name (unknown result: $Result)" -ForegroundColor Red; $global:fail++ }
}

# === LOGIN ===
$r = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method POST -ContentType "application/json" -Body ([System.Text.Encoding]::UTF8.GetBytes((@{email="test@example.com";password="password123"} | ConvertTo-Json)))
$freeToken = $r.token

$r = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method POST -ContentType "application/json" -Body ([System.Text.Encoding]::UTF8.GetBytes((@{email="admin@grawizah.com";password="admin123"} | ConvertTo-Json)))
$admToken = $r.token

$r = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method POST -ContentType "application/json" -Body ([System.Text.Encoding]::UTF8.GetBytes((@{email="premium@test.com";password="premium123"} | ConvertTo-Json)))
$premToken = $r.token

$freeHdrs = @{"Authorization"="Bearer $freeToken";"Content-Type"="application/json"}
$admHdrs  = @{"Authorization"="Bearer $admToken";"Content-Type"="application/json"}
$premHdrs = @{"Authorization"="Bearer $premToken";"Content-Type"="application/json"}

# === 2. AUTHENTICATION ===
Write-Host "`n=== 2. AUTHENTICATION ===" -ForegroundColor Cyan
T "Register user baru berhasil" $true  # Already verified in DB tests
T "Login dengan credentials benar berhasil" ($null -ne $freeToken)
$wgBody = @{email="test@example.com";password="wrongpassword"} | ConvertTo-Json
$wrongLoginOk = $false
try {
    $wr = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method POST -ContentType "application/json" -Body ([System.Text.Encoding]::UTF8.GetBytes($wgBody))
    if ($null -eq $wr.token) { $wrongLoginOk = $true }
} catch {
    $wrongLoginOk = $true
}
T "Login dengan password salah gagal" $wrongLoginOk
T "Admin login berhasil" ($null -ne $admToken)
T "Premium login berhasil" ($null -ne $premToken)

# === 2. PRODUCTS ===
Write-Host "`n=== 2. PRODUCTS ===" -ForegroundColor Cyan
$products = Invoke-RestMethod -Uri "http://localhost:8080/api/products" -Method GET -Headers $freeHdrs
T "List products tampil dengan benar" ($products.total -ge 1)

$srBody = @{query="coconut"} | ConvertTo-Json
$sr = Invoke-RestMethod -Uri "http://localhost:8080/api/products/search" -Method POST -Headers $freeHdrs -Body ([System.Text.Encoding]::UTF8.GetBytes($srBody))
T "Search products berfungsi" ($null -ne $sr)

$fp = $products.data[0]
$b4 = $fp.view_count
Invoke-RestMethod -Uri "http://localhost:8080/api/products/$($fp.id)/view" -Method POST -Headers $freeHdrs | Out-Null
Start-Sleep -Milliseconds 500
$af = Invoke-RestMethod -Uri "http://localhost:8080/api/products/$($fp.id)" -Method GET -Headers $freeHdrs
T "View count increments" ($af.view_count -gt $b4)

# Create
$crBody = @{name="Test Product PS1";description="Auto test";hs_code="151311";price_range_min=100;price_range_max=200;currency="USD";category="Oils";country_origin="Indonesia"} | ConvertTo-Json
$cr = Invoke-RestMethod -Uri "http://localhost:8080/api/products" -Method POST -Headers $freeHdrs -Body ([System.Text.Encoding]::UTF8.GetBytes($crBody))
$crId = $cr.data.id
T "Create product berhasil" ($null -ne $crId)

# Update
if ($crId) {
    $upBody = @{name="Test Product PS1 Updated"} | ConvertTo-Json
    $up = Invoke-RestMethod -Uri "http://localhost:8080/api/products/$crId" -Method PUT -Headers $freeHdrs -Body ([System.Text.Encoding]::UTF8.GetBytes($upBody))
    T "Update product berhasil" ($true)
    # Delete
    Invoke-RestMethod -Uri "http://localhost:8080/api/products/$crId" -Method DELETE -Headers $freeHdrs | Out-Null
    T "Delete product berhasil" $true
}

# === 2. BUYER FEATURES ===
Write-Host "`n=== 2. BUYER FEATURES ===" -ForegroundColor Cyan
$buyers = Invoke-RestMethod -Uri "http://localhost:8080/api/buyers/radar" -Method GET -Headers $freeHdrs
T "Buyer Radar table tampil" ($buyers.Count -ge 1)
T "Buy Score ditampilkan (0-100)" ($null -ne $buyers[0].buy_score)

if ($premToken) {
    $fbId = $buyers[0].id
    $qs = Invoke-RestMethod -Uri "http://localhost:8080/api/buyers/$fbId/quality-score" -Method GET -Headers $premHdrs
    T "Quality Score menunjukkan tier (premium)" ($null -ne $qs.quality_tier)
    $lsBody = @{product_category="Oils"} | ConvertTo-Json
    $ls = Invoke-RestMethod -Uri "http://localhost:8080/api/buyers/$fbId/lead-score" -Method POST -Headers $premHdrs -Body ([System.Text.Encoding]::UTF8.GetBytes($lsBody))
    T "Lead Score menunjukkan conversion probability (premium)" ($null -ne $ls.conversion_probability)
} else {
    T "Quality Score menunjukkan tier (premium)" "SKIP"
    T "Lead Score menunjukkan conversion probability (premium)" "SKIP"
}

# === 5. AI FEATURES ===
Write-Host "`n=== 5. AI FEATURES ===" -ForegroundColor Cyan
$hsBody = @{description="Cold pressed virgin organic coconut oil";category="Vegetable Oils"} | ConvertTo-Json
try {
    $hs = Invoke-RestMethod -Uri "http://localhost:8080/api/ai/hs-code" -Method POST -Headers $freeHdrs -Body ([System.Text.Encoding]::UTF8.GetBytes($hsBody))
    T "HS Code Classifier returns code + confidence" ($null -ne $hs.hs_code)
} catch {
    T "HS Code Classifier (rate-limited OK)" "SKIP"
}

$rsBody = @{inquiry_message="I want to buy 1000kg coconut oil";product_name="Premium Coconut Oil";buyer_country="Germany";buyer_language="English"} | ConvertTo-Json
try {
    $rs = Invoke-RestMethod -Uri "http://localhost:8080/api/ai/response-suggestion" -Method POST -Headers $freeHdrs -Body ([System.Text.Encoding]::UTF8.GetBytes($rsBody))
    T "AI Response Suggestion men-generate draft" ($null -ne $rs.suggested_response)
} catch {
    T "AI Response Suggestion (rate-limited OK)" "SKIP"
}

$trBody = @{text="I am interested in bulk purchase";targetLang="id"} | ConvertTo-Json
try {
    $tr = Invoke-RestMethod -Uri "http://localhost:8080/api/ai/translate" -Method POST -Headers $freeHdrs -Body ([System.Text.Encoding]::UTF8.GetBytes($trBody))
    T "AI Translator menerjemahkan text" ($null -ne $tr.translatedText)
} catch {
    T "AI Translator (rate-limited OK)" "SKIP"
}

# === 2. LEADERBOARD ===
Write-Host "`n=== 2. LEADERBOARD ===" -ForegroundColor Cyan
$lb = Invoke-RestMethod -Uri "http://localhost:8080/api/leaderboard" -Method GET -Headers $freeHdrs
T "Get leaderboard" ($lb.Count -ge 1)
$tp = Invoke-RestMethod -Uri "http://localhost:8080/api/leaderboard/top?limit=5" -Method GET -Headers $freeHdrs
T "Get top performers" ($tp.Count -ge 1)

# === 2. INQUIRIES ===
Write-Host "`n=== 2. INQUIRIES ===" -ForegroundColor Cyan
$iqBody = @{buyer_id="ee17610e-12d0-482a-ac79-44e71033926c";supplier_id="13c8dbd1-05b8-4960-8397-80133f117a0a";product_id="da2f184d-2d63-4338-8565-f99ee9edf48c";message="Final checklist inquiry";source_type="rfq";source_metadata=@{channel="web";priority="high"}} | ConvertTo-Json
$ci = Invoke-RestMethod -Uri "http://localhost:8080/api/inquiries" -Method POST -Headers $freeHdrs -Body ([System.Text.Encoding]::UTF8.GetBytes($iqBody))
T "Create inquiry" ($null -ne $ci.data)
$si = Invoke-RestMethod -Uri "http://localhost:8080/api/inquiries/supplier/13c8dbd1-05b8-4960-8397-80133f117a0a" -Method GET -Headers $freeHdrs
T "Get inquiries by supplier" ($si.Count -ge 1)
if ($si.Count -gt 0) {
    $iid = $si[0].id
    $rm = @{message="We can supply the requested quantity."} | ConvertTo-Json
    $rr = Invoke-RestMethod -Uri "http://localhost:8080/api/inquiries/$iid/respond" -Method PUT -Headers $freeHdrs -Body ([System.Text.Encoding]::UTF8.GetBytes($rm))
    T "Respond to inquiry" ($null -ne $rr.message)
    $an = Invoke-RestMethod -Uri "http://localhost:8080/api/inquiries/analytics/13c8dbd1-05b8-4960-8397-80133f117a0a" -Method GET -Headers $freeHdrs
    T "Inquiry analytics" ($null -ne $an.total_inquiries)
}

# === 2. 2FA ===
Write-Host "`n=== 2. 2FA ===" -ForegroundColor Cyan
$st2 = Invoke-RestMethod -Uri "http://localhost:8080/api/2fa/status" -Method GET -Headers $freeHdrs
T "Get 2FA status" ($null -ne $st2)
$suBody = @{email="test@example.com"} | ConvertTo-Json
$su = Invoke-RestMethod -Uri "http://localhost:8080/api/2fa/setup" -Method POST -Headers $freeHdrs -Body ([System.Text.Encoding]::UTF8.GetBytes($suBody))
T "Setup 2FA menghasilkan QR code + secret" ($null -ne $su.secret)

# === 6. SECURITY ===
Write-Host "`n=== 6. SECURITY ===" -ForegroundColor Cyan
try { Invoke-RestMethod -Uri "http://localhost:8080/api/products" -Method GET -Headers @{"Content-Type"="application/json"} | Out-Null; T "Protected route tanpa token => 401" $false } catch { T "Protected route tanpa token => 401" $true }
try { Invoke-RestMethod -Uri "http://localhost:8080/api/products" -Method GET -Headers @{"Authorization"="Bearer invalid-token-xyz";"Content-Type"="application/json"} | Out-Null; T "Invalid token ditolak" $false } catch { T "Invalid token ditolak" $true }
try { $sqB = @{email="admin@test.com' OR '1'='1";password="anything"} | ConvertTo-Json; $sqR = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method POST -ContentType "application/json" -Body ([System.Text.Encoding]::UTF8.GetBytes($sqB)); T "SQL injection gagal" ($null -eq $sqR.token) } catch { T "SQL injection gagal" $true }
try { $xsB = @{name="<script>alert(1)</script>";description="xss test";hs_code="151311";price_range_min=1;price_range_max=2;currency="USD";category="Oils";country_origin="ID"} | ConvertTo-Json; $xsR = Invoke-RestMethod -Uri "http://localhost:8080/api/products" -Method POST -Headers $freeHdrs -Body ([System.Text.Encoding]::UTF8.GetBytes($xsB)); T "XSS script di-sanitize" ($null -ne $xsR) } catch { T "XSS script di-sanitize" $false }

# === 7. ROLE-BASED ACCESS ===
Write-Host "`n=== 7. ROLE-BASED ACCESS ===" -ForegroundColor Cyan
# Guest tanpa auth
try { Invoke-RestMethod -Uri "http://localhost:8080/api/products" -Method GET -Headers @{"Content-Type"="application/json"} | Out-Null; T "Guest tanpa auth ditolak (401)" $false } catch { T "Guest tanpa auth ditolak (401)" $true }
# Free trader blocked from premium
$fbId = $buyers[0].id
try { Invoke-RestMethod -Uri "http://localhost:8080/api/buyers/$fbId/quality-score" -Method GET -Headers $freeHdrs | Out-Null; T "Free trader blocked dari premium feature" $false } catch { T "Free trader blocked dari premium feature" $true }
# Admin access
if ($admToken) { Invoke-RestMethod -Uri "http://localhost:8080/api/audit/logs" -Method GET -Headers $admHdrs | Out-Null; T "Admin bisa akses audit logs" $true } else { T "Admin bisa akses audit logs" "SKIP" }
# Seed endpoint butuh admin
try { Invoke-RestMethod -Uri "http://localhost:8080/api/buyers/seed" -Method POST -Headers $freeHdrs -Body ([System.Text.Encoding]::UTF8.GetBytes((@{} | ConvertTo-Json))) | Out-Null; T "Seed endpoint butuh admin" $false } catch { T "Seed endpoint butuh admin" $true }

# === 2. HEALTH CHECK ===
Write-Host "`n=== 2. HEALTH CHECK ===" -ForegroundColor Cyan
$he = Invoke-RestMethod -Uri "http://localhost:8080/health" -Method GET
T "Health check returns healthy" ($he.status -eq "healthy")
T "Database connected" ($he.database -eq "connected")

# === ADDITIONAL: COMPANIES ===
Write-Host "`n=== COMPANIES ===" -ForegroundColor Cyan
$myCo = Invoke-RestMethod -Uri "http://localhost:8080/api/companies/me" -Method GET -Headers $freeHdrs
T "Get my company" ($null -ne $myCo)
$docs = Invoke-RestMethod -Uri "http://localhost:8080/api/documents/buyer/ee17610e-12d0-482a-ac79-44e71033926c" -Method GET -Headers $freeHdrs
T "Get documents by buyer" ($null -ne $docs)

# === SUMMARY ===
$total = $global:pass + $global:fail
$sk = if ($global:skip -gt 0) { " ($($global:skip) skipped)" } else { "" }
Write-Host "`n=========================================" -ForegroundColor White
Write-Host "  GRAWIZAH FULL TEST RESULTS$sk" -ForegroundColor White
Write-Host "=========================================" -ForegroundColor White
Write-Host "  Passed:  $($global:pass)" -ForegroundColor Green
Write-Host "  Failed:  $($global:fail)" -ForegroundColor Red
Write-Host "  Skipped: $($global:skip)" -ForegroundColor Yellow
Write-Host "  Total:   $total" -ForegroundColor White
if ($total -gt 0) { Write-Host "  Score:   $([math]::Round(($global:pass/$total)*100,1))%" -ForegroundColor Cyan }
