# Debug login issue
try {
    $body = @{email="test@example.com";password="password123"} | ConvertTo-Json
    Write-Host "Request body: $body"
    $login = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method POST -ContentType "application/json; charset=utf-8" -Body $body
    Write-Host "Login response:"
    $login | ConvertTo-Json
    Write-Host "Token: $($login.token)"
    
    $headers = @{
        "Authorization" = "Bearer $($login.token)"
        "Content-Type" = "application/json"
    }
    
    Write-Host "`nTesting products with token..."
    $products = Invoke-RestMethod -Uri "http://localhost:8080/api/products" -Method GET -Headers $headers
    Write-Host "Products: $($products | ConvertTo-Json -Depth 3)"
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
