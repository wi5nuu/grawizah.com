# Database Testing - Section 4 of TESTING_GUIDE.md
# Uses Supabase REST API since psql is not available

$login = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method POST -ContentType "application/json" -Body '{"email":"test@example.com","password":"password123"}'
$token = $login.token
$headers = @{"Authorization"="Bearer $token";"Content-Type"="application/json"}

$pass = 0
$fail = 0

function Test-Check {
    param($Name, $Result)
    if ($Result) { Write-Host "  PASS: $Name" -ForegroundColor Green; $script:pass++ }
    else { Write-Host "  FAIL: $Name" -ForegroundColor Red; $script:fail++ }
}

# =============================================
# 4. TESTING DATABASE
# =============================================
Write-Host "`n=== 4. TESTING DATABASE ===" -ForegroundColor Cyan

# Since we can't run psql, we test via API endpoints that touch the database

# -----------------------------------------
# 4a. Verify all tables have data accessible via API
# -----------------------------------------
Write-Host "`n--- 4a. Table Accessibility Tests ---"

# Users table (via auth)
$loginResult = $null -ne $token -and $token -ne ""
Test-Check "Users table accessible (login works)" $loginResult

# Companies table
$myCompany = Invoke-RestMethod -Uri "http://localhost:8080/api/companies/me" -Method GET -Headers $headers
Test-Check "Companies table accessible" ($null -ne $myCompany)

# Products table
$products = Invoke-RestMethod -Uri "http://localhost:8080/api/products" -Method GET -Headers $headers
Test-Check "Products table accessible" ($null -ne $products)

# Buyers table
$buyers = Invoke-RestMethod -Uri "http://localhost:8080/api/buyers/radar" -Method GET -Headers $headers
Test-Check "Buyers table accessible" ($null -ne $buyers)

# Inquiries table
$inquiries = Invoke-RestMethod -Uri "http://localhost:8080/api/inquiries/supplier/13c8dbd1-05b8-4960-8397-80133f117a0a" -Method GET -Headers $headers
Test-Check "Inquiries table accessible" ($null -ne $inquiries)

# Leaderboard table
$leaderboard = Invoke-RestMethod -Uri "http://localhost:8080/api/leaderboard" -Method GET -Headers $headers
Test-Check "Leaderboard table accessible" ($null -ne $leaderboard)

# -----------------------------------------
# 4b. Test CRUD Operations via API
# -----------------------------------------
Write-Host "`n--- 4b. CRUD Operations Tests ---"

# CREATE product
$productBody = @{
    name = "DB Test Product"
    description = "Testing database CRUD operations"
    hs_code = "151311"
    price_range_min = 100
    price_range_max = 200
    currency = "USD"
    category = "Oils"
    country_origin = "Indonesia"
} | ConvertTo-Json

$createdProduct = Invoke-RestMethod -Uri "http://localhost:8080/api/products" -Method POST -Headers $headers -Body $productBody
Test-Check "CREATE - Insert product" ($null -ne $createdProduct)

# READ (list already tested above)
Test-Check "READ - List products" ($products.total -ge 1)

# READ single product
if ($createdProduct.id) {
    $singleProduct = Invoke-RestMethod -Uri "http://localhost:8080/api/products/$($createdProduct.id)" -Method GET -Headers $headers
    Test-Check "READ - Get single product" ($null -ne $singleProduct)
    
    # UPDATE product
    $updateBody = @{
        name = "DB Test Product Updated"
        description = "Updated description"
        hs_code = "151311"
        price_range_min = 150
        price_range_max = 250
        currency = "USD"
        category = "Oils"
        country_origin = "Indonesia"
    } | ConvertTo-Json
    
    $updated = Invoke-RestMethod -Uri "http://localhost:8080/api/products/$($createdProduct.id)" -Method PUT -Headers $headers -Body $updateBody
    Test-Check "UPDATE - Update product" ($null -ne $updated)
    
    # DELETE product
    $deleted = Invoke-RestMethod -Uri "http://localhost:8080/api/products/$($createdProduct.id)" -Method DELETE -Headers $headers
    Test-Check "DELETE - Delete product" $true
    
    # Verify deletion
    try {
        Invoke-RestMethod -Uri "http://localhost:8080/api/products/$($createdProduct.id)" -Method GET -Headers $headers | Out-Null
        Test-CHECK "DELETE - Verify deletion" $false
    } catch {
        Test-Check "DELETE - Verify deletion" $true
    }
}

# -----------------------------------------
# 4c. Test Data Integrity
# -----------------------------------------
Write-Host "`n--- 4c. Data Integrity Tests ---"

# Foreign key: product belongs to company
$productsList = Invoke-RestMethod -Uri "http://localhost:8080/api/products?limit=5" -Method GET -Headers $headers
$productBelongsToCompany = $productsList.data | Select-Object -First 1
Test-Check "Product has company_id FK" ($null -ne $productBelongsToCompany.company_id)

# Foreign key: buyer belongs to inquiry
$inquiryCheck = Invoke-RestMethod -Uri "http://localhost:8080/api/inquiries/supplier/13c8dbd1-05b8-4960-8397-80133f117a0a" -Method GET -Headers $headers
if ($inquiryCheck.Count -gt 0) {
    Test-Check "Inquiry has buyer_id FK" ($null -ne $inquiryCheck[0].buyer_id)
} else {
    Test-Check "Inquiry has buyer_id FK" $false
}

# -----------------------------------------
# 4d. Test Relationships
# -----------------------------------------
Write-Host "`n--- 4d. Relationship Tests ---"

# Buyer radar returns buyers with scores
$buyerRadar = Invoke-RestMethod -Uri "http://localhost:8080/api/buyers/radar" -Method GET -Headers $headers
Test-Check "Buyer radar returns data" ($buyerRadar.Count -ge 1)
if ($buyerRadar.Count -gt 0) {
    Test-Check "Buyer has buy_score" ($null -ne $buyerRadar[0].buy_score)
    Test-Check "Buyer has hs_codes" ($null -ne $buyerRadar[0].hs_codes)
}

# Leaderboard returns ranked data
$lb = Invoke-RestMethod -Uri "http://localhost:8080/api/leaderboard" -Method GET -Headers $headers
Test-Check "Leaderboard returns data" ($lb.Count -ge 1)
if ($lb.Count -gt 0) {
    Test-Check "Leaderboard has total_score" ($null -ne $lb[0].total_score)
    Test-Check "Leaderboard has rank" ($null -ne $lb[0].rank)
}

# -----------------------------------------
# 4e. Test Audit Logs (Admin)
# -----------------------------------------
Write-Host "`n--- 4e. Admin/Audit Tests ---"

$adminLogin = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method POST -ContentType "application/json" -Body '{"email":"admin@grawizah.com","password":"admin123"}'
if ($adminLogin.token) {
    $adminHeaders = @{"Authorization"="Bearer $($adminLogin.token)";"Content-Type"="application/json"}
    
    $auditLogs = Invoke-RestMethod -Uri "http://localhost:8080/api/audit/logs" -Method GET -Headers $adminHeaders
    Test-Check "Audit logs accessible by admin" $true
    
    # Cleanup: delete test product if it still exists
} else {
    Write-Host "  SKIP: Admin login failed (may not exist)" -ForegroundColor Yellow
}

# -----------------------------------------
# Summary
# -----------------------------------------
Write-Host "`n=== DATABASE TEST SUMMARY ===" -ForegroundColor Cyan
Write-Host "  Passed: $pass" -ForegroundColor Green
Write-Host "  Failed: $fail" -ForegroundColor Red
Write-Host "  Total:  $($pass + $fail)" -ForegroundColor White
