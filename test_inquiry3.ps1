$login = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method POST -ContentType "application/json" -Body '{"email":"test@example.com","password":"password123"}'
$token = $login.token

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

# Test 1: Valid inquiry with all required fields and source_metadata
Write-Host "--- Test 1: Valid inquiry with all fields ---"
$body1 = @{
    buyer_id = "ee17610e-12d0-482a-ac79-44e71033926c"
    supplier_id = "13c8dbd1-05b8-4960-8397-80133f117a0a"
    product_id = "da2f184d-2d63-4338-8565-f99ee9edf48c"
    message = "We need 5000 MT of premium coconut oil for our distribution network in Germany"
    source_type = "rfq"
    source_metadata = @{channel="web"; priority="high"; urgency="normal"}
} | ConvertTo-Json

try {
    $resp = Invoke-RestMethod -Uri "http://localhost:8080/api/inquiries" -Method POST -Headers $headers -Body $body1
    Write-Host "SUCCESS!" 
    $resp | ConvertTo-Json
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

# Test 2: Valid inquiry WITHOUT product_id and WITHOUT source_metadata
Write-Host "`n--- Test 2: Inquiry without product_id/source_metadata ---"
$body2 = @{
    buyer_id = "ea9aaa7c-2ef3-45b8-890d-634e3b40319b"
    supplier_id = "13c8dbd1-05b8-4960-8397-80133f117a0a"
    message = "General inquiry about palm oil products"
    source_type = "email"
} | ConvertTo-Json

try {
    $resp = Invoke-RestMethod -Uri "http://localhost:8080/api/inquiries" -Method POST -Headers $headers -Body $body2
    Write-Host "SUCCESS!" 
    $resp | ConvertTo-Json
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
