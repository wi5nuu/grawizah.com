@echo off
curl -s -X POST http://localhost:8080/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"test@example.com\",\"password\":\"password123\"}" > login_resp.txt
type login_resp.txt
echo.
echo --- Now creating inquiry ---
curl -s -X POST http://localhost:8080/api/inquiries -H "Content-Type: application/json" -H "file://login_resp.txt" -d "{\"buyer_id\":\"3e7a1234-5678-9abc-def0-123456789001\",\"supplier_id\":\"13c8dbd1-05b8-4960-8397-80133f117a0a\",\"message\":\"Test inquiry for coconut oil, need 5000 MT shipment to Germany\",\"source_type\":\"rfq\"}"
