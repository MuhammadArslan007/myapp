# Production Deployment Guide
# DevOps Portfolio — arslan.dice13.online
# Azure VM + Nginx + SSL (Let's Encrypt)
# WITHOUT Docker (Direct Install)

---

## Architecture (Docker ke bina)

```
Internet
   │
   ▼
arslan.dice13.online (DNS → Azure VM IP)
   │
   ▼
Azure VM — Ubuntu 22.04
   │
   ├── Nginx (Port 80 → 443 redirect)
   ├── Nginx (Port 443 → SSL)
   │     ├── /api/*  → FastAPI (localhost:8000)
   │     └── /*      → React build (static files)
   │
   ├── FastAPI (uvicorn directly — systemd service)
   └── SQLite DB (ek file — portfolio.db)
```

---

## STEP 1 — Azure VM Banana

Azure Portal → Virtual Machines → Create:
- **Resource Group:** rg-portfolio
- **VM Name:** vm-portfolio
- **Region:** East US
- **Image:** Ubuntu Server 22.04 LTS
- **Size:** Standard_B2s (2 vCPU, 4GB) ya B1s (1 vCPU, 1GB) bhi chalega
- **Authentication:** SSH public key
- **Inbound Ports:** SSH (22), HTTP (80), HTTPS (443)

SSH key (apne PC pe):
```bash
ssh-keygen -t rsa -b 4096
cat ~/.ssh/id_rsa.pub   # yeh Azure mein paste karo
```

---

## STEP 2 — DNS Setup

Domain provider (dice13.online) ke DNS panel mein:
```
Type   Name     Value              TTL
A      arslan   <Azure VM IP>      300
```

Check karo:
```bash
nslookup arslan.dice13.online
```

---

## STEP 3 — VM se Connect karo

```bash
ssh azureuser@arslan.dice13.online
```

System update:
```bash
sudo apt update && sudo apt upgrade -y
```

---

## STEP 4 — Python Install karo

```bash
sudo apt install python3 python3-pip python3-venv -y
python3 --version   # 3.10+ hona chahiye
```

---

## STEP 5 — Node.js Install karo (Frontend build ke liye)

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install nodejs -y
node --version   # v20+ hona chahiye
```

---

## STEP 6 — Nginx + Certbot Install karo

```bash
sudo apt install nginx -y
sudo apt install certbot python3-certbot-nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx
```

---

## STEP 7 — Project Upload karo

### Option A — Git se (Recommended):
```bash
cd /var/www
sudo git clone https://github.com/yourusername/portfolio.git myapp
sudo chown -R azureuser:azureuser /var/www/myapp
```

### Option B — SCP se (apne PC se):
```bash
# Apne Windows PC pe PowerShell ya Git Bash mein:
scp -r C:/Users/muham/OneDrive/Desktop/devops_learning/myapp azureuser@arslan.dice13.online:/var/www/
```

---

## STEP 8 — Backend Setup (FastAPI)

```bash
cd /var/www/myapp/backend

# Virtual environment banana
python3 -m venv venv
source venv/bin/activate

# Dependencies install
pip install -r requirements.txt

# Test karo ek baar
uvicorn app.main:app --host 127.0.0.1 --port 8000
# Ctrl+C se band karo — bas test tha
```

---

## STEP 9 — Backend ko Service banana (Systemd)

Yeh step sabse important hai — VM restart hone ke baad bhi FastAPI apne aap start ho jaaye.

```bash
sudo nano /etc/systemd/system/portfolio-backend.service
```

Yeh paste karo:
```ini
[Unit]
Description=Portfolio FastAPI Backend
After=network.target

[Service]
User=azureuser
WorkingDirectory=/var/www/myapp/backend
ExecStart=/var/www/myapp/backend/venv/bin/uvicorn app.main:app --host 127.0.0.1 --port 8000
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
```

Service enable aur start karo:
```bash
sudo systemctl daemon-reload
sudo systemctl start portfolio-backend
sudo systemctl enable portfolio-backend

# Status check
sudo systemctl status portfolio-backend
```

Green "active (running)" dikhna chahiye.

---

## STEP 10 — Frontend Build karo

```bash
cd /var/www/myapp/frontend

# Dependencies install
npm install

# Production build
npm run build

# Build files ko nginx folder mein copy karo
sudo mkdir -p /var/www/html/portfolio
sudo cp -r dist/* /var/www/html/portfolio/
sudo chown -R www-data:www-data /var/www/html/portfolio
```

---

## STEP 11 — Nginx Config (pehle HTTP)

```bash
sudo nano /etc/nginx/sites-available/portfolio
```

Yeh paste karo:
```nginx
server {
    listen 80;
    server_name arslan.dice13.online;

    root /var/www/html/portfolio;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable karo:
```bash
sudo ln -s /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

Test karo:
```bash
curl http://arslan.dice13.online/api/profile
```

---

## STEP 12 — SSL Certificate (Free — Let's Encrypt)

```bash
sudo certbot --nginx -d arslan.dice13.online
```

Prompts:
- Email dalo: `gillani.saira002@gmail.com`
- Agree to terms: `Y`
- Redirect HTTP to HTTPS: `2` (Yes — zaroor karo)

Certbot apne aap Nginx config update kar dega SSL ke saath.

Auto-renewal check:
```bash
sudo certbot renew --dry-run
```

---

## STEP 13 — Final Production Nginx Config

SSL ke baad yeh full production config set karo:

```bash
sudo nano /etc/nginx/sites-available/portfolio
```

```nginx
# HTTP → HTTPS redirect
server {
    listen 80;
    server_name arslan.dice13.online;
    return 301 https://$host$request_uri;
}

# Main HTTPS server
server {
    listen 443 ssl http2;
    server_name arslan.dice13.online;

    # SSL — Certbot ne add kiya hoga
    ssl_certificate /etc/letsencrypt/live/arslan.dice13.online/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/arslan.dice13.online/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # React Frontend
    root /var/www/html/portfolio;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # FastAPI Backend
    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 90s;
    }

    # Static files caching
    location ~* \.(js|css|png|jpg|ico|svg|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript;

    # Security
    location ~ /\. { deny all; }
}
```

```bash
sudo nginx -t && sudo systemctl reload nginx
```

---

## STEP 14 — Firewall

```bash
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
sudo ufw status
```

Azure Portal mein NSG bhi check karo:
- Port 22 (SSH) ✅
- Port 80 (HTTP) ✅
- Port 443 (HTTPS) ✅

---

## Final Verification

```bash
# 1. Site live hai?
curl -I https://arslan.dice13.online

# 2. API kaam kar rahi?
curl https://arslan.dice13.online/api/profile

# 3. Login test
curl -X POST https://arslan.dice13.online/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"arslan","password":"Arslan@123"}'

# 4. Backend service status
sudo systemctl status portfolio-backend

# 5. Nginx status
sudo systemctl status nginx

# 6. Logs
sudo journalctl -u portfolio-backend -f
sudo tail -f /var/log/nginx/error.log
```

---

## Update Deploy Karna (Future mein)

```bash
ssh azureuser@arslan.dice13.online

# Code update
cd /var/www/myapp
git pull origin main

# Backend restart (agar code change hua)
sudo systemctl restart portfolio-backend

# Frontend rebuild (agar UI change hua)
cd frontend
npm install
npm run build
sudo cp -r dist/* /var/www/html/portfolio/

echo "Done!"
```

---

## Docker wala version (Optional — agar kabhi chahiye)

```bash
# Docker install karo
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker azureuser
newgrp docker

# Backend container
cd /var/www/myapp/backend
docker build -t portfolio-backend .
docker run -d \
  --name backend \
  --restart unless-stopped \
  -p 127.0.0.1:8000:8000 \
  -v /var/www/myapp/backend:/app/data \
  portfolio-backend

# Baaki sab same — Nginx + SSL same steps
```

---

## Cost Estimate

| Resource           | Type          | Cost/month |
|--------------------|---------------|------------|
| Azure VM           | Standard_B1s  | ~$8        |
| Azure VM           | Standard_B2s  | ~$30       |
| Public IP          | Basic         | ~$4        |
| SSL Certificate    | Let's Encrypt | FREE       |
| Domain             | dice13.online | ~$1/month  |

**B1s (1 vCPU, 1GB RAM) bhi portfolio ke liye kaafi hai.**

---

## Production Checklist

- [ ] Azure VM banana
- [ ] DNS set karna (arslan → VM IP)
- [ ] Python + Node.js install
- [ ] Nginx + Certbot install
- [ ] Code upload (git/scp)
- [ ] Backend venv + pip install
- [ ] Systemd service banana (auto-restart)
- [ ] Frontend build + copy to /var/www/html
- [ ] Nginx config (HTTP)
- [ ] SSL certificate (certbot)
- [ ] Production Nginx config (HTTPS + headers)
- [ ] Firewall (UFW + Azure NSG)
- [ ] Final test — site live!
- [ ] Admin password change karo production mein

---

*Muhammad Arslan | PSEB DevOps Program | Instructor: Asad Muhammad*
*Domain: arslan.dice13.online*
