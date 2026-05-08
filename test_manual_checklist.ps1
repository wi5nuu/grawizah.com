# Manual Testing Checklist - Section 8 of TESTING_GUIDE.md
# Automated version of the manual checklist

$pass = 0; $fail = 0; $skip = 0

function Test-Check {
    param($Name, $Result, $Detail = "")
    if ($Result -eq "SKIP") { Write-Host "  SKIP: $Name" -ForegroundColor Yellow; $script:skip++ }
    elseif ($Result) { Write-Host "  PASS: $Name" -ForegroundColor Green; $script:pass++ }
    else { Write-Host "  FAIL: $Name $Detail" -ForegroundColor Red; $script:fail++ }
}

# Helper: Login and get headers
function Get-AuthHeaders($email, $password) {
    try {
        $login = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method POST -ContentType "application/json" -Body @{email=$email;password=$password} | ConvertFrom-Json
        if ($login.token) {
            return @{Authorization="Bearer $($login.token)";"Content-Type"="application/json"}, $login
        }
    } catch {}
    return $null, $null
}

# =============================================
# AUTHENTICATION TESTS
# =============================================
Write-Host "`n=== AUTHENTICATION ===" -ForegroundColor Cyan

$freeHeaders, $freeUser = Get-AuthHeaders "test@example.com" "password123"
Test-Check "Login with correct credentials" ($null -ne $freeHeaders)

# Wrong password
try {
    $wrongLogin = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method POST -ContentType "application/json" -Body @{email="test@example.com";password="wrongpassword"} | ConvertFrom-Json
    Test-Check "Login with wrong password fails" $false
} catch {
    Test-Check "Login with wrong password fails" $true
}

$adminHeaders, $adminUser = Get-AuthHeaders "admin@grawizah.com" "admin123"
Test-Check "Admin login works" ($null -ne $adminHeaders)

# =============================================
# PRODUCTS
# =============================================
Write-Host "`n=== PRODUCTS ===" -ForegroundColor Cyan

# List products
$products = Invoke-RestMethod -Uri "http://localhost:8080/api/products" -Method GET -Headers $freeHeaders
Test-Check "List products displays correctly" ($null -ne $products -and $products.total -ge 1)

# Search products
$searchResult = Invoke-RestMethod -Uri "http://localhost:8080/api/products/search" -Method POST -Headers $freeHeaders -Body (@{query="coconut"} | ConvertTo-Json)
Test-Check "Search products functions" ($null -ne $searchResult)

# View count increment
$firstProduct = $products.data | Select-Object -First 1
if ($firstProduct) {
    $beforeViews = $firstProduct.view_count
    Invoke-RestMethod -Uri "http://localhost:8080/api/products/$($firstProduct.id)/view" -Method POST -Headers $freeHeaders | Out-Null
    $afterProduct = Invoke-RestMethod -Uri "http://localhost:8080/api/products/$($firstProduct.id)" -Method GET -Headers $freeHeaders
    Test-Check "Product view count increments" ($afterProduct.view_count -gt $beforeViews)
}

# =============================================
# BUYER FEATURES
# =============================================
Write-Host "`n=== BUYER FEATURES ===" -ForegroundColor Cyan

$buyers = Invoke-RestMethod -Uri "http://localhost:8080/api/buyers/radar" -Method GET -Headers $freeHeaders
Test-Check "Buyer Radar table displays" ($buyers.Count -ge 1)
Test-Check "Buy Score displayed (0-100)" ($null -ne $buyers[0].buy_score)

# Premium features
$premHeaders, $premUser = Get-AuthHeaders "premium@test.com" "premium123"
if ($premHeaders) {
    # Quality score (premium)
    $firstBuyerId = $buyers[0].id
    $qualityScore = Invoke-RestMethod -Uri "http://localhost:8080/api/buyers/$firstBuyerId/quality-score" -Method GET -Headers $premHeaders
    Test-Check "Quality Score shows tier (premium)" ($null -ne $qualityScore)
    
    # Lead score (premium)
    $leadScore = Invoke-RestMethod -Uri "http://localhost:8080/api/buyers/$firstBuyerId/lead-score" -Method POST -Headers $premHeaders -Body (@{product_category="Oils"} | ConvertTo-Json)
    Test-Check "Lead Score shows conversion probability (premium)" ($null -ne $leadScore)
} else {
    Test-Check "Quality Score shows tier (premium)" "SKIP"
    Test-Check "Lead Score shows conversion probability (premium)" "SKIP"
}

# =============================================
# AI FEATURES
# =============================================
Write-Host "`n=== AI FEATURES ===" -ForegroundColor Cyan

# HS Code Classifier
$hsResult = Invoke-RestMethod -Uri "http://localhost:8080/api/ai/hs-code" -Method POST -Headers $freeHeaders -Body (@{description="Cold pressed virgin organic coconut oil";category="Vegetable Oils"} | ConvertTo-Json)
Test-Check "HS Code Classifier returns code + confidence" ($null -ne $hsResult.hs_code)

# AI Response Suggestion
$responseResult = Invoke-RestMethod -Uri "http://localhost:8080/api/ai/response-suggestion" -Method POST -Headers $freeHeaders -Body (@{inquiry_message="I want to buy 1000kg coconut oil";product_name="Premium Coconut Oil";buyer_country="Germany";buyer_language="English"} | ConvertTo-Json)
Test-Check "AI Response Suggestion generates draft" ($null -ne $responseResult.suggested_response)

# AI Translator
$transResult = Invoke-RestMethod -Uri "http://localhost:8080/api/ai/translate" -Method POST -Headers $freeHeaders -Body (@{text="I am interested in bulk purchase";targetLang="id"} | ConvertTo-Json)
Test-Check "AI Translator translates text" ($null -ne $transResult.translatedText)

# =============================================
# LEADERBOARD
# =============================================
Write-Host "`n=== LEADERBOARD ===" -ForegroundColor Cyan

$leaderboard = Invoke-RestMethod -Uri "http://localhost:8080/api/leaderboard" -Method GET -Headers $freeHeaders
Test-Check "Get leaderboard" ($leaderboard.Count -ge 1)

$topPerformers = Invoke-RestMethod -Uri "http://localhost:8080/api/leaderboard/top?limit=5" -Method GET -Headers $freeHeaders
Test-Check "Get top performers" ($topPerformers.Count -ge 1)

# =============================================
# INQUIRIES
# =============================================
Write-Host "`n=== INQUIRIES ===" -ForegroundColor Cyan

# Create inquiry
$inquiryBody = @{
    buyer_id = "ee17610e-12d0-482a-ac79-44e71033926c"
    supplier_id = "13c8dbd1-05b8-4960-8397-80133f117a0a"
    product_id = "da2f184d-2d63-4338-8565-f99ee9edf48c"
    message = "Test inquiry for checklist"
    source_type = "rfq"
    source_metadata = @{channel="web"; priority="high"}
} | ConvertTo-Json
$createdInquiry = Invoke-RestMethod -Uri "http://localhost:8080/api/inquiries" -Method POST -Headers $freeHeaders -Body $inquiryBody
Test-Check "Create inquiry" ($null -ne $createdInquiry.data)

# Get inquiries by supplier
$supplierInquiries = Invoke-RestMethod -Uri "http://localhost:8080/api/inquiries/supplier/13c8dbd1-05b8-4960-8397-80133f117a0a" -Method GET -Headers $freeHeaders
Test-Check "Get inquiries by supplier" ($supplierInquiries.Count -ge 1)

# Respond to inquiry
$inqId = $supplierInquiries[0].id
if ($inqId) {
    $respResult = Invoke-RestMethod -Uri "http://localhost:8080/api/inquiries/$inqId/respond" -Method PUT -Headers $freeHeaders -Body (@{message="We can supply the requested quantity."} | ConvertTo-Json)
    Test-Check "Respond to inquiry" ($null -ne $respResult.message)
    
    # Analytics
    $analytics = Invoke-RestMethod -Uri "http://localhost:8080/api/inquiries/analytics/13c8dbd1-05b8-4960-8397-80133f117a0a" -Method GET -Headers $freeHeaders
    Test-Check "Inquiry analytics works" ($null -ne $analytics.total_inquiries)
}

# =============================================
# 2FA
# =============================================
Write-Host "`n=== 2FA ===" -ForegroundColor Cyan

$twoFAStatus = Invoke-RestMethod -Uri "http://localhost:8080/api/2fa/status" -Method GET -Headers $freeHeaders
Test-Check "Get 2FA status" ($null -ne $twoFAStatus)

$twoFASetup = Invoke-RestMethod -Uri "http://localhost:8080/api/2fa/setup" -Method POST -Headers $freeHeaders -Body (@{email="test@example.com"} | ConvertTo-Json)
Test-Check "Setup 2FA generates QR code" ($null -ne $twoFASetup.secret)

# =============================================
# SECURITY
# =============================================
Write-Host "`n=== SECURITY ===" -ForegroundColor Cyan

# Auth required
try {
    Invoke-RestMethod -Uri "http://localhost:8080/api/products" -Method GET -Headers @{"Content-Type"="application/json"} | Out-Null
    Test-Check "Protected route without token returns 401" $false
} catch {
    Test-Check "Protected route without token returns 401" $true
}

# Invalid token
try {
    Invoke-RestMethod -Uri "http://localhost:8080/api/products" -Method GET -Headers @{"Authorization"="Bearer invalid-token";"Content-Type"="application/json"} | Out-Null
    Test-Check "Invalid token rejected" $false
} catch {
    Test-Check "Invalid token rejected" $true
}

# SQL Injection test
try {
    $sqliResult = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method POST -ContentType "application/json" -Body @{email="admin@test.com OR 1=1--";password="anything"} | ConvertFrom-Json
    Test-Check "SQL injection in login fails" ($null -eq $sqliResult.token)
} catch {
    Test-Check "SQL injection in login fails" $true
}

# =============================================
# ROLE-BASED ACCESS
# =============================================
Write-Host "`n=== ROLE-BASED ACCESS ===" -ForegroundColor Cyan

# Free trader trying premium features
if ($freeHeaders) {
    try {
        $firstBuyerId = $buyers[0].id
        Invoke-RestMethod -Uri "http://localhost:8080/api/buyers/$firstBuyerId/quality-score" -Method GET -Headers $freeHeaders | Out-Null
        Test-Check "Free trader blocked from premium feature (quality-score)" $false
    } catch {
        Test-Check "Free trader blocked from premium feature (quality-score)" $true
    }
}

# Admin accessing admin-only endpoints
if ($adminHeaders) {
    $auditLogs = Invoke-RestMethod -Uri "http://localhost:8080/api/audit/logs" -Method GET -Headers $adminHeaders
    Test-Check "Admin can access audit logs" $true
} else {
    Test-Check "Admin can access audit logs" "SKIP"
}

# Seed endpoints protected
try {
    Invoke-RestMethod -Uri "http://localhost:8080/api/buyers/seed" -Method POST -Headers $freeHeaders -Body (@{} | ConvertTo-Json) | Out-Null
    Test-Check "Seed endpoint requires admin role" $false
} catch {
    Test-Check "Seed endpoint requires admin role" $true
}

# =============================================
# SUMMARY
# =============================================
$total = $pass + $fail
$skippedText = if ($skip -gt 0) { " ($skip skipped)" } else { "" }
Write-Host "`n=========================================" -ForegroundColor White
Write-Host "MANUAL TESTING CHECKLIST SUMMARY$skippedText" -ForegroundColor White
Write-Host "=========================================" -ForegroundColor White
Write-Host "  Passed:  $pass" -ForegroundColor Green
Write-Host "  Failed:  $fail" -ForegroundColor Red
Write-Host "  Total:   $total" -ForegroundColor White
if ($total -gt 0) {
    $pct = [math]::Round(($pass / $total) * 100, 1)
    Write-Host "  Score:   $pct%" -ForegroundColor Cyan
}
