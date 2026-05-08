$login = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method POST -ContentType "application/json" -Body '{"email":"test@example.com","password":"password123"}'
$token = $login.token
Write-Host "Token: $token"

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

$body = @{
    buyer_id = "3e7a1234-5678-9abc-def0-123456789001"
    supplier_id = "13c8dbd1-05b8-4960-8397-80133f117a0a"
    message = "Test inquiry for coconut oil, need 5000 MT shipment to Germany"
    source_type = "rfq"
    source_metadata = @{channel="web"; priority="high"}
} | ConvertTo-Json

Write-Host "`n--- Creating inquiry ---"
try {
    $resp = Invoke-RestMethod -Uri "http://localhost:8080/api/inquiries" -Method POST -Headers $headers -Body $body
    $resp | ConvertTo-Json
} catch {
    Write-Host "Error: $($_.Exception.Message)"
    $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
    $reader.BaseStream.Position = 0
    $reader.DiscardBufferedData()
    $errBody = $reader.ReadToEnd()
    Write-Host "Response: $errBody"
}

Write-Host "`n--- Getting inquiries for supplier ---"
try {
    $resp2 = Invoke-RestMethod -Uri "http://localhost:8080/api/inquiries/supplier/13c8dbd1-05b8-4960-8397-80133f117a0a" -Method GET -Headers $headers
    $resp2 | ConvertTo-Json
} catch {
    Write-Host "Error: $($_.Exception.Message)"
}
