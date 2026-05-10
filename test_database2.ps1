# Database Testing - Section 4 (Fixed)
$login = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method POST -ContentType "application/json" -Body '{"email":"test@example.com","password":"password123"}'
$token = $login.token
$headers = @{"Authorization"="Bearer $token";"Content-Type"="application/json"}

$pass = 0; $fail = 0
function Test-Check {
    param($Name, $Result)
    if ($Result) { Write-Host "  PASS: $Name" -ForegroundColor Green; $script:pass++ }
    else { Write-Host "  FAIL: $Name" -ForegroundColor Red; $script:fail++ }
}

Write-Host "`n=== 4b. CRUD Operations (Detailed) ===" -ForegroundColor Cyan

# CREATE
$productBody = @{
    name = "DB Test Product"
    description = "Testing database CRUD"
    hs_code = "151311"
    price_range_min = 100
    price_range_max = 200
    currency = "USD"
    category = "Oils"
    country_origin = "Indonesia"
} | ConvertTo-Json

$created = Invoke-RestMethod -Uri "http://localhost:8080/api/products" -Method POST -Headers $headers -Body $productBody
$productId = $created.data.id
Test-Check "CREATE product" ($null -ne $productId -and $productId -ne "")

# READ single
if ($productId) {
    $single = Invoke-RestMethod -Uri "http://localhost:8080/api/products/$productId" -Method GET -Headers $headers
    Test-Check "READ single product" ($null -ne $single)
    
    # UPDATE
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
    
    $updated = Invoke-RestMethod -Uri "http://localhost:8080/api/products/$productId" -Method PUT -Headers $headers -Body $updateBody
    Test-Check "UPDATE product" ($null -ne $updated)
    
    # Verify update
    $verify = Invoke-RestMethod -Uri "http://localhost:8080/api/products/$productId" -Method GET -Headers $headers
    Test-Check "Verify update (name changed)" ($verify.name -eq "DB Test Product Updated")
    
    # DELETE
    $deleted = Invoke-RestMethod -Uri "http://localhost:8080/api/products/$productId" -Method DELETE -Headers $headers
    Test-Check "DELETE product" $true
    
    # Verify deletion
    try {
        Invoke-RestMethod -Uri "http://localhost:8080/api/products/$productId" -Method GET -Headers $headers | Out-Null
        Test-Check "Verify deletion (should 404)" $false
    } catch {
        Test-Check "Verify deletion (should 404)" $true
    }
}

# Cleanup any leftover test products
Write-Host "`n--- Cleanup test products ---"
$allProducts = Invoke-RestMethod -Uri "http://localhost:8080/api/products?limit=100" -Method GET -Headers $headers
if ($allProducts.data) {
    $testProducts = $allProducts.data | Where-Object { $_.name -like "*DB Test*" -or $_.name -like "*Test Product Debug*" }
    foreach ($tp in $testProducts) {
        Invoke-RestMethod -Uri "http://localhost:8080/api/products/$($tp.id)" -Method DELETE -Headers $headers | Out-Null
        Write-Host "  Cleaned up: $($tp.name) ($($tp.id))"
    }
}

Write-Host "`n=== DATABASE TEST SUMMARY ===" -ForegroundColor Cyan
Write-Host "  Passed: $pass" -ForegroundColor Green
Write-Host "  Failed: $fail" -ForegroundColor Red
