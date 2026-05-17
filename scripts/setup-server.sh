#!/bin/bash
# ==============================================================================
# GRAWIZAH - Ubuntu Server Setup Script
# Run as root on a fresh Ubuntu 22.04/24.04 server
# ==============================================================================

set -e

echo "🚀 Starting server preparation..."

# 1. Update system
apt update && apt upgrade -y

# 2. Install dependencies (Nginx, Certbot, Fail2ban, Curl, UFW)
apt install -y nginx certbot python3-certbot-nginx fail2ban ufw curl git jq

# 3. Install Docker (Official)
if ! command -v docker &> /dev/null; then
    echo "🐳 Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh
fi

# 4. Create non-root user 'grawizah'
if ! id "grawizah" &>/dev/null; then
    echo "👤 Creating non-root user 'grawizah'..."
    adduser --disabled-password --gecos "" grawizah
    usermod -aG docker grawizah
fi

# 5. Configure Firewall (UFW)
echo "🛡️ Configuring Firewall..."
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

# 6. Setup Fail2Ban
echo "🔒 Configuring Fail2Ban..."
cat <<EOF > /etc/fail2ban/jail.local
[sshd]
enabled = true
port = ssh
filter = sshd
logpath = /var/log/auth.log
maxretry = 3
bantime = 3600
EOF
systemctl restart fail2ban

# 7. Disable SSH Password Auth (Assuming key is already in authorized_keys)
# CAUTION: Ensure your SSH key is set up before running this!
echo "🔑 Hardening SSH..."
sed -i 's/#PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
sed -i 's/PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
systemctl restart sshd

echo "✅ Server setup complete!"
echo "Switch to the application user using: su - grawizah"
