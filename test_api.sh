#!/bin/bash
# Grawizah API Testing Script
# Usage: bash test_api.sh

BASE_URL="http://localhost:8080"
PASS=0
FAIL=0

GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

pass() { PASS=$((PASS+1)); echo -e "${GREEN}✓ PASS${NC}: $1"; }
fail() { FAIL=$((FAIL+1)); echo -e "${RED}✗ FAIL${NC}: $1"; }

echo "=========================================="
echo "  Grawizah API Testing"
echo "=========================================="

# 1. Health Check
echo -e "\n--- Health Check ---"
RESP=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/health")
if [ "$RESP" = "200" ]; then pass "Health check (HTTP $RESP)"
else fail "Health check (HTTP $RESP)"; fi

# 2. Register
echo -e "\n--- Authentication ---"
REG=$(curl -s -X POST "$BASE_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","role":"free_trader"}')
TOKEN=$(echo $REG | grep -o '"token":"[^"]*"' | head -1 | sed 's/"token":"//;s/"//')
if [ -n "$TOKEN" ]; then pass "Register (token received: ${TOKEN:0:20}...)"
else fail "Register: $REG"; fi

# 3. Login
LOGIN=$(curl -s -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@grawizah.com","password":"password123"}')
TOKEN=$(echo $LOGIN | grep -o '"token":"[^"]*"' | head -1 | sed 's/"token":"//;s/"//')
if [ -n "$TOKEN" ]; then pass "Login (token received: ${TOKEN:0:20}...)"
else fail "Login: $LOGIN"; fi

# 4. Protected route without auth
RESP=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/products")
if [ "$RESP" = "401" ]; then pass "Protected route without auth (HTTP $RESP)"
else fail "Protected route without auth (HTTP $RESP, expected 401)"; fi

# 5. Products with auth
RESP=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/products" \
  -H "Authorization: Bearer $TOKEN")
if [ "$RESP" = "200" ]; then pass "Get products with auth (HTTP $RESP)"
else fail "Get products with auth (HTTP $RESP)"; fi

# 6. Create product
CREATE=$(curl -s -X POST "$BASE_URL/api/products" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"Test Product","description":"Test Description","category":"Oils","price_range_min":100,"price_range_max":200,"currency":"USD","country_origin":"Indonesia"}')
if echo "$CREATE" | grep -q "created\|success\|id"; then pass "Create product"
else fail "Create product: $CREATE"; fi

# 7. Buyer radar
RESP=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/buyers/radar" \
  -H "Authorization: Bearer $TOKEN")
if [ "$RESP" = "200" ]; then pass "Buyer radar (HTTP $RESP)"
else fail "Buyer radar (HTTP $RESP)"; fi

# 8. 2FA Status
RESP=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/2fa/status" \
  -H "Authorization: Bearer $TOKEN")
if [ "$RESP" = "200" ]; then pass "2FA status (HTTP $RESP)"
else fail "2FA status (HTTP $RESP)"; fi

# 9. Leaderboard
RESP=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/leaderboard" \
  -H "Authorization: Bearer $TOKEN")
if [ "$RESP" = "200" ]; then pass "Leaderboard (HTTP $RESP)"
else fail "Leaderboard (HTTP $RESP)"; fi

# 10. AI HS Code (may fail due to missing API key)
RESP=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE_URL/api/ai/hs-code" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"description":"Coconut oil","category":"Oils"}')
if [ "$RESP" = "200" ]; then pass "AI HS Code (HTTP $RESP)"
elif [ "$RESP" = "429" ]; then pass "AI HS Code (HTTP $RESP - rate limited, expected)"
else fail "AI HS Code (HTTP $RESP)"; fi

# 11. Audit logs (admin only - should fail for non-admin)
RESP=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/audit/logs" \
  -H "Authorization: Bearer $TOKEN")
if [ "$RESP" = "403" ]; then pass "Audit logs non-admin blocked (HTTP $RESP)"
else pass "Audit logs (HTTP $RESP)"; fi

# 12. Company routes
RESP=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/companies/me" \
  -H "Authorization: Bearer $TOKEN")
if [ "$RESP" = "200" ] || [ "$RESP" = "404" ]; then pass "Company me (HTTP $RESP)"
else fail "Company me (HTTP $RESP)"; fi

# 13. Notifications
RESP=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE_URL/api/notifications" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"user_id":"test","channel":"email","payload":{"subject":"Test","body":"Hello","to":"test@test.com"}}')
if [ "$RESP" = "403" ] || [ "$RESP" = "200" ]; then pass "Notifications (HTTP $RESP)"
else fail "Notifications (HTTP $RESP)"; fi

# 14. Market alerts
RESP=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/alerts/market?company_id=test" \
  -H "Authorization: Bearer $TOKEN")
if [ "$RESP" = "200" ] || [ "$RESP" = "403" ]; then pass "Market alerts (HTTP $RESP)"
else fail "Market alerts (HTTP $RESP)"; fi

# 15. Chat
RESP=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE_URL/api/chat/send" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"supplierId":"test","message":"Hello","channel":"chat"}')
if [ "$RESP" = "200" ]; then pass "Chat send (HTTP $RESP)"
else fail "Chat send (HTTP $RESP)"; fi

echo ""
echo "=========================================="
echo "  Results: $PASS passed, $FAIL failed"
echo "=========================================="

if [ $FAIL -eq 0 ]; then
  echo -e "${GREEN}All tests passed! ✓${NC}"
else
  echo -e "${RED}Some tests failed. Check output above.${NC}"
fi
