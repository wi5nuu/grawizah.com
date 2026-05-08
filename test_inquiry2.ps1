$login = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method POST -ContentType "application/json" -Body '{"email":"test@example.com","password":"password123"}'
$token = $login.token

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

# First, let's get a valid buyer ID
Write-Host "--- Getting buyers ---"
try {
    $buyers = Invoke-RestMethod -Uri "http://localhost:8080/api/buyers/radar" -Method GET -Headers $headers
    $buyers | ConvertTo-Json
    $buyerId = $buyers[0].id
    Write-Host "`nFirst buyer ID: $buyerId"
} catch {
    Write-Host "Error: $($_.Exception.Message)"
}

# Get products to find a valid product ID
Write-Host "`n--- Getting products ---"
try {
    $products = Invoke-RestMethod -Uri "http://localhost:8080/api/products?limit=5" -Method GET -Headers $headers
    $products | ConvertTo-Json
} catch {
    Write-Host "Error getting products: $($_.Exception.Message)"
    $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
    $reader.BaseStream.Position = 0
    $reader.DiscardBufferedData()
    $errBody = $reader.ReadToEnd()
    Write-Host "Response: $errBody"
}

# Now create inquiry with ALL empty fields to isolate which one fails
Write-Host "`n--- Test 1: inquiry with no product_id field at all ---"
$body1 = @{
    buyer_id = "3e7a1234-5678-9abc-def0-123456789001"
    supplier_id = "13c8dbd1-05b8-4960-8397-80133f117a0a"
    message = "Test inquiry"
    source_type = "rfq"
} | ConvertTo-Json

try {
    $resp = Invoke-RestMethod -Uri "http://localhost:8080/api/inquiries" -Method POST -Headers $headers -Body $body1
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

# Create inquiry with empty strings for all nullable UUIDs
Write-Host "`n--- Test 2: inquiry with all fields as empty strings ---"
$body2 = @{
    buyer_id = ""
    supplier_id = "13c8dbd1-05b8-4960-8397-80133f117a0a"
    product_id = ""
    message = "Test"
    source_type = "rfq"
} | ConvertTo-Json

try {
    $resp = Invoke-RestMethod -Uri "http://localhost:8080/api/inquiries" -Method POST -Headers $headers -Body $body2
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
