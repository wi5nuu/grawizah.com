# 🚀 GRAWIZAH — PRODUCTION DEPLOYMENT GUIDE (DEVOPS)
**Architecture:** Go 1.21 (Backend) + Next.js (Frontend) + Supabase + Redis + Nginx + Docker

---

## 🏗️ 1. SERVER PREPARATION (VPS)

1. Provision a fresh Ubuntu 22.04 or 24.04 server.
2. Ensure you have added your SSH Public Key to `~/.ssh/authorized_keys` for the `root` user.
3. SCP the setup script to the server and run it:
   ```bash
   scp scripts/setup-server.sh root@YOUR_SERVER_IP:/root/
   ssh root@YOUR_SERVER_IP "bash /root/setup-server.sh"
   ```
4. This script will:
   - Install dependencies (Nginx, Certbot, Docker).
   - Configure UFW firewall (Ports 22, 80, 443 open).
   - Set up Fail2Ban.
   - Disable SSH password authentication.
   - Create a non-root user `grawizah`.

---

## 🐋 2. DEPLOYMENT (DOCKER COMPOSE)
**Recommendation:** We use the Docker Compose strategy because it isolates dependencies, simplifies environment management, bounds resources, and ensures exactly reproducible builds across environments. Both backend (Go Alpine) and frontend (Next.js Standalone) Dockerfiles are highly optimized.

1. SSH into the server as the new user:
   ```bash
   ssh root@YOUR_SERVER_IP
   su - grawizah
   ```
2. Clone the repository:
   ```bash
   git clone https://github.com/your-org/grawizah.git /opt/grawizah
   cd /opt/grawizah
   ```
3. Create the Production Environment File:
   ```bash
   nano .env.prod
   ```
   *Paste all variables defined in `backend/.env.production` and `frontend/.env.example` into this single file. Ensure `DATABASE_URL`, `SUPABASE_JWT_SECRET`, and `GROQ_API_KEY` are correct.*

4. Start the stack:
   ```bash
   docker-compose -f docker-compose.prod.yml up -d --build
   ```

---

## 🌐 3. NGINX & SSL (REVERSE PROXY)

1. Copy the Nginx configuration:
   ```bash
   # (Run as root or use sudo)
   sudo cp nginx/grawizah.conf /etc/nginx/sites-available/grawizah
   ```
2. **[GANTI INI]** Edit the configuration and replace `[YOURDOMAIN.com]` with your actual domain:
   ```bash
   sudo nano /etc/nginx/sites-available/grawizah
   ```
3. Enable the site and restart Nginx:
   ```bash
   sudo ln -s /etc/nginx/sites-available/grawizah /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```
4. Install SSL via Certbot:
   ```bash
   sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
   ```
   *Certbot will automatically modify the Nginx config to include the SSL cert paths and set up a renewal cron job.*

---

## 🔄 4. CI/CD PIPELINE (GITHUB ACTIONS)

The repository contains `.github/workflows/deploy.yml`. To enable automated deployments:
1. Go to your GitHub Repository → Settings → Secrets and variables → Actions.
2. Add the following secrets:
   - `SERVER_HOST`: Your VPS IP address.
   - `SERVER_USER`: `grawizah`
   - `SERVER_SSH_KEY`: The private SSH key for the `grawizah` user.
   - `NEXT_PUBLIC_API_URL`: `https://yourdomain.com`
   - `NEXT_PUBLIC_SUPABASE_URL`: `https://your-project.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: `eyJhbG...`
3. Pushing to the `main` branch will now automatically test, build, and deploy.

---

## 📊 5. MONITORING & HEALTH CHECKS

A comprehensive health endpoint is available at `GET /api/health`.
You can set up a simple cron job to monitor it, or use a tool like UptimeRobot.

```bash
# Example monitor script
curl -s https://yourdomain.com/api/health | jq .
```
Expected output:
```json
{
  "service": "grawizah-api",
  "status": "healthy",
  "uptime": "24h0m0s",
  "version": "1.0.0",
  "checks": {
    "database": "healthy",
    "redis": "healthy",
    "groq_ai": "healthy"
  }
}
```

---

## 🛠️ 6. TROUBLESHOOTING 5 COMMON ERRORS

1. **`502 Bad Gateway` on domain access**
   - *Cause:* The backend or frontend container is not running, or crashed.
   - *Fix:* Run `docker-compose -f docker-compose.prod.yml ps`. Check logs with `docker logs grawizah-api` or `docker logs grawizah-web`.
2. **Backend logs show `WARNING: GO_ENV=production but DB_SSL_MODE=disable`**
   - *Cause:* You forgot to set `DB_SSL_MODE=require` in `.env.prod`.
   - *Fix:* Update `.env.prod` and run `docker-compose up -d`.
3. **Frontend builds fail in CI/CD / Docker**
   - *Cause:* Missing `NEXT_PUBLIC_` environment variables during the Docker build stage.
   - *Fix:* Ensure GitHub secrets are correctly passed via the `deploy.yml` workflow env block.
4. **WebSocket connections failing (Chat Realtime not updating)**
   - *Cause:* Nginx is dropping the upgrade headers, or Supabase connection string is incorrect.
   - *Fix:* Ensure `proxy_set_header Upgrade $http_upgrade;` is intact in `grawizah.conf`.
5. **Unauthorized (401) on all protected routes immediately after deploy**
   - *Cause:* `SUPABASE_JWT_SECRET` is wrong or missing. The Go backend rejects tokens it cannot verify.
   - *Fix:* Copy the exact JWT Secret from Supabase Dashboard → Settings → API.

---

## 📋 7. FINAL GO-LIVE CHECKLIST

Complete these steps sequentially BEFORE announcing the launch:

- [ ] Domain DNS (A Record) sudah pointing ke server IP.
- [ ] SSL certificate aktif dan auto-renewal berjalan (test dengan `curl -I https://yourdomain.com`).
- [ ] Semua environment variables production sudah diset di `.env.prod`.
- [ ] `GO_ENV=production` ter-set di backend container.
- [ ] Database migration (`001_add_rating_column.sql`) sudah dijalankan.
- [ ] Redis container berjalan (`docker logs grawizah-redis` bersih dari error).
- [ ] `GET /api/health` mengembalikan status "healthy" untuk DB, Redis, dan Groq.
- [ ] Test register akun baru berhasil dari UI browser.
- [ ] Test login berhasil dan dapat JWT valid (verifikasi di Application > Local Storage).
- [ ] Test upload dokumen berhasil (pastikan volume `/app/uploads/documents` writable).
- [ ] Test realtime chat berjalan (buka 2 tab browser berbeda, kirim pesan).
- [ ] Test AI suggest berjalan di halaman Inquiries.
- [ ] Coba akses `https://yourdomain.com/api/documents` tanpa auth di curl → harus return `401`.
- [ ] Coba kirim `mock-jwt-token-for-dev-only` via header Authorization di production → harus return `401`.
- [ ] Load test sederhana: `ab -n 50 -c 10 https://yourdomain.com/api/products` (membutuhkan `apache2-utils`).
- [ ] Backup database pertama (dump manual dari Supabase Dashboard) sudah diamankan.
