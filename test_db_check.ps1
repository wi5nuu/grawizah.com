# Check if product_id is nullable by trying to insert NULL directly via the API
# Let's also check the actual error by testing with a valid product_id

$login = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method POST -ContentType "application/json" -Body '{"email":"test@example.com","password":"password123"}'
$token = $login.token

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

# Test with valid product_id
Write-Host "--- Test: inquiry with valid product_id ---"
$body = @{
    buyer_id = "ee17610e-12d0-482a-ac79-44e71033926c"
    supplier_id = "13c8dbd1-05b8-4960-8397-80133f117a0a"
    product_id = "da2f184d-2d63-4338-8565-f99ee9edf48c"
    message = "Test inquiry with valid product"
    source_type = "rfq"
} | ConvertTo-Json

try {
    $resp = Invoke-RestMethod -Uri "http://localhost:8080/api/inquiries" -Method POST -Headers $headers -Body $body
    $resp | ConvertTo-Json
    Write-Host "SUCCESS!"
} catch {
    Write-Host "Error: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $reader.BaseStream.Position = 0
        $reader.DiscardBufferedData()
        $errBody = $reader.ReadToEnd()
        Write-Host "Response: $errBody"
    }
}
