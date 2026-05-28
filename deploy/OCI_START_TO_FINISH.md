# OCI Start-To-Finish Deployment Guide

This guide deploys the Classroom app to an OCI Ubuntu VPS.

Architecture:

```text
Browser
  -> Nginx on OCI VPS
      -> serves classroom-frontend/dist
      -> proxies /api to Express backend on 127.0.0.1:8000
  -> Neon PostgreSQL stays hosted on Neon
```

The OCI server does not run PostgreSQL.

## 0. Before You Start

You need:

- An Oracle Cloud account.
- A working payment/bank card for Oracle account verification.
- Your Neon PostgreSQL connection string.
- Your GitHub repo:
  `https://github.com/yahyass22/Cloud-OCI-Deployement-SMART`
- A domain name if you want real HTTPS production deployment.

If your Oracle account is not activated yet, finish the card/account activation first. After activation, return to this guide.

## 1. Generate An SSH Key On Windows

Open PowerShell:

```powershell
New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\.ssh"
ssh-keygen -t ed25519 -a 100 -f "$env:USERPROFILE\.ssh\oci_classroom"
Get-Content "$env:USERPROFILE\.ssh\oci_classroom.pub"
```

Copy the public key printed by the last command. You will paste it into OCI.

Keep the private key safe:

```text
C:\Users\YOUR_USER\.ssh\oci_classroom
```

## 2. Create The OCI VPS

In Oracle Cloud Console:

1. Go to **Compute** -> **Instances**.
2. Click **Create instance**.
3. Name it:

```text
classroom-vps
```

4. Image:
   - Choose **Ubuntu**.
   - Use Ubuntu 24.04 LTS or 22.04 LTS.

5. Shape:
   - Recommended: `VM.Standard.A1.Flex` if available.
   - Use at least:

```text
1 OCPU
6 GB RAM
```

Avoid very small 1 GB machines because frontend/backend builds can fail from low memory.

6. Networking:
   - Use or create a VCN.
   - Use a public subnet.
   - Enable **Assign public IPv4 address**.

7. SSH keys:
   - Choose **Paste public keys**.
   - Paste the public key from step 1.

8. Boot volume:
   - 50 GB is fine.

9. Click **Create**.

Wait until the instance state is **Running**.

## 3. Open OCI Network Ports

In OCI, open the security rules for the instance network.

You may find this under:

```text
Instance -> Primary VNIC -> Subnet -> Security Lists
```

or under a Network Security Group if your instance uses one.

Add inbound/ingress rules:

```text
TCP 22   source: your IP if possible, otherwise 0.0.0.0/0 temporarily
TCP 80   source: 0.0.0.0/0
TCP 443  source: 0.0.0.0/0
```

Do not open port `8000` to the internet. The backend should only be reached through Nginx.

## 4. SSH Into The Server

Copy the instance public IP from OCI.

From PowerShell:

```powershell
ssh -i "$env:USERPROFILE\.ssh\oci_classroom" ubuntu@YOUR_OCI_PUBLIC_IP
```

If Windows asks whether to trust the host, type:

```text
yes
```

## 5. Install Server Packages

Run on the OCI server:

```bash
sudo apt update
sudo apt install -y nginx git curl ufw certbot python3-certbot-nginx
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g pm2
```

Check versions:

```bash
node -v
npm -v
pm2 -v
nginx -v
```

## 6. Configure Ubuntu Firewall

Run:

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
sudo ufw status
```

Expected allowed services:

```text
OpenSSH
Nginx Full
```

## 7. Clone The App

Run:

```bash
sudo mkdir -p /var/www/classroom
sudo chown -R $USER:$USER /var/www/classroom
cd /var/www/classroom
git clone https://github.com/yahyass22/Cloud-OCI-Deployement-SMART.git app
cd app
```

Expected folders:

```bash
ls
```

You should see:

```text
classroom-backend
classroom-frontend
deploy
README.md
```

## 8. Create Backend Environment File

Run:

```bash
cd /var/www/classroom/app/classroom-backend
cp .env.example .env
nano .env
```

Fill it like this, using your real values:

```env
NODE_ENV=production
PORT=8000
DATABASE_URL=postgresql://USER:PASSWORD@HOST.neon.tech/DB?sslmode=require
FRONTEND_URL=https://your-domain.com
BETTER_AUTH_URL=https://your-domain.com
BETTER_AUTH_SECRET=replace-with-a-strong-random-secret
ARCJET_KEY=replace-with-your-arcjet-key
ARCJET_ENV=production
```

Generate a strong Better Auth secret on the server:

```bash
openssl rand -base64 32
```

Copy the output into:

```text
BETTER_AUTH_SECRET
```

Important:

- Do not commit `.env`.
- Neon usually requires `sslmode=require` in the database URL.
- `FRONTEND_URL` and `BETTER_AUTH_URL` must match your real browser origin.

## 9. Create Frontend Environment File

Run:

```bash
cd /var/www/classroom/app/classroom-frontend
cp .env.production.example .env.production
nano .env.production
```

For a domain deployment:

```env
VITE_BACKEND_BASE_URL=https://your-domain.com/api/
VITE_API_URL=https://your-domain.com
VITE_ACCESS_TOKEN_KEY=accessToken
VITE_REFRESH_TOKEN_KEY=refreshToken
```

If you use Cloudinary uploads, also fill:

```env
VITE_CLOUDINARY_UPLOAD_URL=https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload
VITE_CLOUDINARY_CLOUD_NAME=your-cloud-name
VITE_CLOUDINARY_UPLOAD_PRESET=your-unsigned-upload-preset
```

## 10. Temporary IP-Only Setup

If you do not have a domain yet, you can test with the server IP temporarily.

Backend `.env`:

```env
FRONTEND_URL=http://YOUR_OCI_PUBLIC_IP
BETTER_AUTH_URL=http://YOUR_OCI_PUBLIC_IP
```

Frontend `.env.production`:

```env
VITE_BACKEND_BASE_URL=http://YOUR_OCI_PUBLIC_IP/api/
VITE_API_URL=http://YOUR_OCI_PUBLIC_IP
```

Use this only for temporary testing. For production login cookies, use a domain with HTTPS.

## 11. Install Dependencies And Build

Backend:

```bash
cd /var/www/classroom/app/classroom-backend
npm ci
npm run build
```

Expected:

```text
dist/index.js
```

Frontend:

```bash
cd /var/www/classroom/app/classroom-frontend
npm ci
npm run build
```

Expected:

```text
dist/index.html
dist/assets/
```

## 12. Database Migrations

Your Neon database is already filled, so do not run seed scripts.

Do not run:

```bash
npm run db:seed
npm run db:seed:full
npm run db:seed:mega
```

Only run migrations if you are sure the Neon schema needs them:

```bash
cd /var/www/classroom/app/classroom-backend
npm run db:migrate
```

Before running migrations on production Neon:

1. Take a Neon backup or create a Neon branch.
2. Confirm the schema change is expected.
3. Never run destructive reset/drop commands against production.

If your Neon schema is already correct, skip migrations.

## 13. Start Backend With PM2

Run:

```bash
cd /var/www/classroom/app/classroom-backend
pm2 start ecosystem.config.cjs
pm2 status
pm2 logs classroom-backend
```

Save PM2 process list:

```bash
pm2 save
pm2 startup
```

`pm2 startup` prints a command. Copy and run that printed command.

## 14. Configure Nginx

Copy the provided config:

```bash
sudo cp /var/www/classroom/app/deploy/nginx/classroom.conf /etc/nginx/sites-available/classroom
sudo nano /etc/nginx/sites-available/classroom
```

Replace:

```text
your-domain.com
```

with your domain, or with `_` for temporary IP-only testing:

```nginx
server_name _;
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/classroom /etc/nginx/sites-enabled/classroom
sudo nginx -t
sudo systemctl reload nginx
```

If the default Nginx page still appears, disable the default site:

```bash
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

## 15. DNS Setup For Domain

At your domain provider, create an `A` record:

```text
Type: A
Name: @
Value: YOUR_OCI_PUBLIC_IP
TTL: Auto or 300
```

Optional `www`:

```text
Type: A
Name: www
Value: YOUR_OCI_PUBLIC_IP
TTL: Auto or 300
```

Wait for DNS propagation.

Check from your computer:

```powershell
nslookup your-domain.com
```

It should return your OCI public IP.

## 16. Configure HTTPS With Certbot

Only do this after DNS points to the OCI server.

Run:

```bash
sudo certbot --nginx -d your-domain.com
```

If you also configured `www`:

```bash
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

Test renewal:

```bash
sudo certbot renew --dry-run
```

## 17. Test The Deployment

Run on the server:

```bash
curl -I https://your-domain.com
curl https://your-domain.com/api/
pm2 status
pm2 logs classroom-backend --lines 50
sudo nginx -t
```

In the browser:

1. Open `https://your-domain.com`.
2. Sign up or sign in.
3. Check dashboard/classes/subjects/discussions.
4. If uploads are enabled, test one upload.

## 18. Updating The App Later

Run:

```bash
cd /var/www/classroom/app
git pull

cd classroom-backend
npm ci
npm run build
pm2 restart classroom-backend

cd ../classroom-frontend
npm ci
npm run build

sudo nginx -t
sudo systemctl reload nginx
```

## 19. Common Problems

### Cannot SSH

Check:

- OCI instance is running.
- Public IP is correct.
- Security rule allows TCP `22`.
- You are using the correct key:

```powershell
ssh -i "$env:USERPROFILE\.ssh\oci_classroom" ubuntu@YOUR_OCI_PUBLIC_IP
```

### Browser Shows Nginx Default Page

Run:

```bash
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

### API Fails

Check backend:

```bash
pm2 status
pm2 logs classroom-backend --lines 100
```

Check env:

```bash
cd /var/www/classroom/app/classroom-backend
printenv | grep NODE_ENV
```

Do not print secrets into screenshots or public chats.

### CORS Error

Make sure backend `.env` has exactly the browser origin:

```env
FRONTEND_URL=https://your-domain.com
BETTER_AUTH_URL=https://your-domain.com
```

Then restart:

```bash
pm2 restart classroom-backend
```

### Frontend Calls Wrong API URL

Edit:

```bash
nano /var/www/classroom/app/classroom-frontend/.env.production
```

Then rebuild:

```bash
cd /var/www/classroom/app/classroom-frontend
npm run build
sudo systemctl reload nginx
```

### Neon Connection Error

Check:

- `DATABASE_URL` is correct.
- It includes `sslmode=require`.
- Neon project is active.
- Password is URL-encoded if it contains special characters.

### Login Cookie Not Working

Use a domain with HTTPS.

Check:

```env
NODE_ENV=production
FRONTEND_URL=https://your-domain.com
BETTER_AUTH_URL=https://your-domain.com
```

Then:

```bash
pm2 restart classroom-backend
```

## 20. Final Go-Live Checklist

- OCI instance running.
- OCI ingress rules allow `22`, `80`, `443`.
- Ubuntu UFW allows OpenSSH and Nginx Full.
- Backend `.env` exists and contains real production values.
- Frontend `.env.production` exists and contains production API URLs.
- Backend build passes.
- Frontend build passes.
- PM2 backend is online.
- Nginx config passes `sudo nginx -t`.
- Domain points to OCI public IP.
- Certbot HTTPS works.
- Neon database is connected.
- Seed scripts were not run against production.
- Login works in browser.
- Main app pages load.
