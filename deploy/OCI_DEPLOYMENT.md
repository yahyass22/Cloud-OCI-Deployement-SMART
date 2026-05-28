# OCI Ubuntu Deployment

This app deploys as a monorepo on one OCI Ubuntu VPS:

- `classroom-frontend`: Vite React static app served by Nginx.
- `classroom-backend`: Express API running under PM2 on port `8000`.
- Database stays on Neon PostgreSQL.

## 1. Server Packages

```bash
sudo apt update
sudo apt install -y nginx git curl ufw certbot python3-certbot-nginx
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g pm2
```

## 2. Firewall

Open these ports in OCI Security List or Network Security Group:

```text
22/tcp
80/tcp
443/tcp
```

Then on Ubuntu:

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

Do not expose backend port `8000` publicly.

## 3. Clone

```bash
sudo mkdir -p /var/www/classroom
sudo chown -R $USER:$USER /var/www/classroom
cd /var/www/classroom
git clone https://github.com/yahyass22/Cloud-OCI-Deployement-SMART.git app
cd app
```

## 4. Environment Files

Backend:

```bash
cd /var/www/classroom/app/classroom-backend
cp .env.example .env
nano .env
```

Set real values for:

```text
DATABASE_URL
FRONTEND_URL
BETTER_AUTH_URL
BETTER_AUTH_SECRET
ARCJET_KEY
```

Neon URL must include `sslmode=require`.

Frontend:

```bash
cd /var/www/classroom/app/classroom-frontend
cp .env.production.example .env.production
nano .env.production
```

Use the same production origin as backend:

```text
VITE_BACKEND_BASE_URL=https://your-domain.com/api/
VITE_API_URL=https://your-domain.com
```

## 5. Build

```bash
cd /var/www/classroom/app/classroom-backend
npm ci
npm run build

cd /var/www/classroom/app/classroom-frontend
npm ci
npm run build
```

## 6. PM2 Backend

```bash
cd /var/www/classroom/app/classroom-backend
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```

Run the command printed by `pm2 startup`.

## 7. Nginx

```bash
sudo cp /var/www/classroom/app/deploy/nginx/classroom.conf /etc/nginx/sites-available/classroom
sudo nano /etc/nginx/sites-available/classroom
```

Replace `your-domain.com`.

Enable:

```bash
sudo ln -s /etc/nginx/sites-available/classroom /etc/nginx/sites-enabled/classroom
sudo nginx -t
sudo systemctl reload nginx
```

## 8. HTTPS

Make sure DNS points to the OCI public IP first.

```bash
sudo certbot --nginx -d your-domain.com
sudo certbot renew --dry-run
```

## 9. Test

```bash
curl -I https://your-domain.com
curl https://your-domain.com/api/
pm2 status
pm2 logs classroom-backend
```

Then test login and authenticated pages in the browser.

## IP-Only Temporary Test

If you do not have a domain yet, use the server IP with HTTP temporarily:

```text
FRONTEND_URL=http://SERVER_IP
BETTER_AUTH_URL=http://SERVER_IP
VITE_BACKEND_BASE_URL=http://SERVER_IP/api/
VITE_API_URL=http://SERVER_IP
```

For real production login cookies, use a domain with HTTPS.
