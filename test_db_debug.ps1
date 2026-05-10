$login = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method POST -ContentType "application/json" -Body '{"email":"test@example.com","password":"password123"}'
$token = $login.token
$headers = @{"Authorization"="Bearer $token";"Content-Type"="application/json"}

# Check product creation response format
$productBody = @{
    name = "DB Test Product Debug"
    description = "Testing"
    hs_code = "151311"
    price_range_min = 100
    price_range_max = 200
    currency = "USD"
    category = "Oils"
    country_origin = "Indonesia"
} | ConvertTo-Json

$createdProduct = Invoke-RestMethod -Uri "http://localhost:8080/api/products" -Method POST -Headers $headers -Body $productBody
Write-Host "Created product response:"
$createdProduct | ConvertTo-Json
