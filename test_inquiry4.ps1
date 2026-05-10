$login = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method POST -ContentType "application/json" -Body '{"email":"test@example.com","password":"password123"}'
$token = $login.token

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

# Test: Get inquiries for supplier
Write-Host "--- GET /inquiries/supplier/:id ---"
try {
    $resp = Invoke-RestMethod -Uri "http://localhost:8080/api/inquiries/supplier/13c8dbd1-05b8-4960-8397-80133f117a0a" -Method GET -Headers $headers
    $resp | ConvertTo-Json
    Write-Host "SUCCESS! Count: $($resp.Count)"
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

# Test: Respond to inquiry
Write-Host "`n--- PUT /inquiries/:id/respond ---"
# We need an inquiry ID - let's get it from the list
try {
    $inquiries = Invoke-RestMethod -Uri "http://localhost:8080/api/inquiries/supplier/13c8dbd1-05b8-4960-8397-80133f117a0a" -Method GET -Headers $headers
    if ($inquiries.Count -gt 0) {
        $inqId = $inquiries[0].id
        Write-Host "Responding to inquiry: $inqId"
        $body = @{message = "Thank you for your inquiry. We can supply 5000 MT of premium coconut oil at $1200/MT FOB Jakarta."} | ConvertTo-Json
        $resp = Invoke-RestMethod -Uri "http://localhost:8080/api/inquiries/$inqId/respond" -Method PUT -Headers $headers -Body $body
        $resp | ConvertTo-Json
        Write-Host "SUCCESS!"
    } else {
        Write-Host "No inquiries found to respond to"
    }
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

# Test: Get analytics
Write-Host "`n--- GET /inquiries/analytics/:supplier_id ---"
try {
    $resp = Invoke-RestMethod -Uri "http://localhost:8080/api/inquiries/analytics/13c8dbd1-05b8-4960-8397-80133f117a0a" -Method GET -Headers $headers
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

# Test: Convert inquiry to deal
Write-Host "`n--- PUT /inquiries/:id/convert ---"
try {
    $inquiries = Invoke-RestMethod -Uri "http://localhost:8080/api/inquiries/supplier/13c8dbd1-05b8-4960-8397-80133f117a0a" -Method GET -Headers $headers
    if ($inquiries.Count -gt 0) {
        $inqId = $inquiries[0].id
        Write-Host "Converting inquiry: $inqId"
        $resp = Invoke-RestMethod -Uri "http://localhost:8080/api/inquiries/$inqId/convert" -Method PUT -Headers $headers
        $resp | ConvertTo-Json
        Write-Host "SUCCESS!"
    }
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
