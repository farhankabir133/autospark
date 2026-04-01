# 🚀 Deploy Payment Backend to DigitalOcean

## Overview

You can host the Next.js payment backend on DigitalOcean in multiple ways:

| Option | Type | Cost | Effort | Best For |
|--------|------|------|--------|----------|
| **App Platform** | Managed | $12+/month | ⭐ Easy | Recommended |
| **Droplet** | VPS | $6+/month | ⭐⭐ Medium | Full control |
| **App Platform (Free)** | Managed | Free | ⭐ Easy | Testing |

---

## ✅ Option 1: DigitalOcean App Platform (Recommended)

**Pros:**
- Easiest deployment (just connect GitHub)
- Auto HTTPS/SSL included
- Auto scaling
- PostgreSQL database available
- Free tier with $200 credit

**Cons:**
- Slightly more expensive than Droplet
- Less control over infrastructure

### Step 1: Create DigitalOcean Account

1. Go to https://digitalocean.com
2. Sign up (get $200 free credit for 60 days)
3. Add payment method

### Step 2: Create App Platform Project

1. Click **"Create"** → **"Apps"**
2. **Connect GitHub** to your account
3. Select repository: `farhankabir133/autospark`
4. Click **"Next"**

### Step 3: Configure Application

1. **Source Settings:**
   - Repository: `farhankabir133/autospark`
   - Branch: `main`
   - Source Directory: `next-sslcommerz`

2. **Build Settings:**
   - Buildpack: **Node.js**
   - Build Command: `npm run build`
   - Run Command: `npm start`

3. **Environment Variables:**
   ```
   STORE_ID=autos69cccc023b067
   STORE_PASS=autos69cccc023b067@ssl
   IS_LIVE=false
   APP_URL=https://your-app.ondigitalocean.app
   SUPABASE_URL=https://hcdwfxnvmvvkbpeshbqk.supabase.co
   SUPABASE_ANON_KEY=sb_publishable_o4V4NsBTa1omeSCyl8GuuA_UppA17sl
   NODE_ENV=production
   ```

4. **HTTP Routes:**
   - Path: `/`
   - Use default settings

### Step 4: Review and Deploy

1. Review configuration
2. Click **"Create Resources"**
3. Click **"Deploy"**

DigitalOcean will:
- Build your Next.js app
- Deploy to a URL like: `https://autospark-payment-xxx.ondigitalocean.app`
- Provide automatic HTTPS
- Auto-scale if needed

### Step 5: Update Configuration

Once deployed, you'll get a URL like:
```
https://autospark-payment-abc123.ondigitalocean.app
```

Update these:

**SSLCommerz Callback URLs:**
```
Success: https://autospark-payment-abc123.ondigitalocean.app/api/payment/success
Fail:    https://autospark-payment-abc123.ondigitalocean.app/api/payment/fail
Cancel:  https://autospark-payment-abc123.ondigitalocean.app/api/payment/cancel
```

**Your Frontend (.env.local):**
```
VITE_API_URL=https://autospark-payment-abc123.ondigitalocean.app
```

---

## ⭐ Option 2: DigitalOcean Droplet (VPS)

**Pros:**
- Cheapest option ($6-7/month)
- Full control
- Can host multiple apps
- Can use custom domain easier

**Cons:**
- Need to manage Node.js, nginx, PM2, SSL, etc.
- More setup required
- You manage updates/security

### Step 1: Create Droplet

1. Click **"Create"** → **"Droplets"**
2. **Choose Image:** Ubuntu 22.04 LTS
3. **Choose Size:** Basic ($6/month is fine)
4. **Choose Datacenter Region:** Singapore or closest to Bangladesh
5. **Authentication:** Add SSH key or password
6. Click **"Create Droplet"**

### Step 2: Connect via SSH

```bash
# Replace with your droplet IP
ssh root@YOUR_DROPLET_IP

# First time, update system
apt update && apt upgrade -y
```

### Step 3: Install Node.js & npm

```bash
# Install Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
apt install -y nodejs

# Verify
node -v  # v20.x.x
npm -v   # 10.x.x
```

### Step 4: Clone Your Repository

```bash
# Install git
apt install -y git

# Clone your repo
cd /var/www
git clone https://github.com/farhankabir133/autospark.git
cd autospark/next-sslcommerz

# Install dependencies
npm install
```

### Step 5: Install & Configure PM2 (Process Manager)

```bash
# Install PM2 globally
npm install -g pm2

# Start your app
pm2 start npm --name "payment-api" -- start

# Auto-restart on boot
pm2 startup
pm2 save

# View logs
pm2 logs payment-api
```

### Step 6: Install & Configure Nginx (Reverse Proxy)

```bash
# Install nginx
apt install -y nginx

# Create config file
cat > /etc/nginx/sites-available/payment-api << 'EOF'
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

# Enable the config
ln -s /etc/nginx/sites-available/payment-api /etc/nginx/sites-enabled/
rm /etc/nginx/sites-enabled/default

# Test config
nginx -t

# Restart nginx
systemctl restart nginx
```

### Step 7: Setup Free HTTPS with Let's Encrypt

```bash
# Install Certbot
apt install -y certbot python3-certbot-nginx

# Get certificate (replace with your domain)
certbot certonly --standalone -d your-domain.com

# Update nginx config with SSL
certbot --nginx -d your-domain.com

# Auto-renew
systemctl enable certbot.timer
```

### Step 8: Add Environment Variables

```bash
# Create .env file in your app directory
cat > /var/www/autospark/next-sslcommerz/.env.local << 'EOF'
STORE_ID=autos69cccc023b067
STORE_PASS=autos69cccc023b067@ssl
IS_LIVE=false
APP_URL=https://your-domain.com
SUPABASE_URL=https://hcdwfxnvmvvkbpeshbqk.supabase.co
SUPABASE_ANON_KEY=sb_publishable_o4V4NsBTa1omeSCyl8GuuA_UppA17sl
NODE_ENV=production
EOF

# Restart app
pm2 restart payment-api
```

### Step 9: Setup Auto-Deployment (Optional)

Create a GitHub Actions workflow to auto-deploy on push:

**`.github/workflows/deploy-digitalocean.yml`:**

```yaml
name: Deploy to DigitalOcean

on:
  push:
    branches: [main]
    paths:
      - 'next-sslcommerz/**'

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Deploy to DigitalOcean
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.DO_HOST }}
          username: root
          key: ${{ secrets.DO_SSH_KEY }}
          script: |
            cd /var/www/autospark
            git pull origin main
            cd next-sslcommerz
            npm install
            npm run build
            pm2 restart payment-api
```

---

## 📊 Comparison

| Feature | App Platform | Droplet |
|---------|-------------|---------|
| **Cost** | $12+/month | $6+/month |
| **Setup Time** | 5 minutes | 30 minutes |
| **SSL/HTTPS** | Auto ✅ | Manual (certbot) |
| **Scaling** | Auto ✅ | Manual |
| **Database** | Optional | You manage |
| **Monitoring** | Built-in | Manual |
| **Backups** | Optional | Manual |
| **Best For** | Production | Dev/Testing |

---

## 🎯 Recommended Setup for You

**I recommend: App Platform**

```
Reasons:
1. Easiest (just click and deploy)
2. Auto HTTPS included
3. Auto scaling
4. $200 free credit covers 16+ months
5. You can upgrade to Droplet later if needed
```

---

## 🔗 Integration with Frontend

After deploying backend to DigitalOcean, update your Autospark frontend:

**Create `src/pages/PaymentPage.tsx`:**

```typescript
'use client';
import { useState } from 'react';

// Your DigitalOcean backend URL
const API_URL = 'https://autospark-payment.ondigitalocean.app';

export default function PaymentPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePayment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      total_amount: parseFloat(formData.get('amount') as string),
      cus_name: formData.get('name') as string,
      cus_email: formData.get('email') as string,
      cus_phone: formData.get('phone') as string,
      product_name: formData.get('product') as string,
    };

    try {
      const response = await fetch(`${API_URL}/api/payment/initiate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      
      if (result.url) {
        window.location.href = result.url;
      } else {
        setError(result.error || 'Payment initiation failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error processing payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Make Payment</h1>
      
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <form onSubmit={handlePayment} className="space-y-4">
        <div>
          <label className="block font-semibold mb-2">Name</label>
          <input
            type="text"
            name="name"
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block font-semibold mb-2">Email</label>
          <input
            type="email"
            name="email"
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block font-semibold mb-2">Phone</label>
          <input
            type="tel"
            name="phone"
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block font-semibold mb-2">Product</label>
          <input
            type="text"
            name="product"
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block font-semibold mb-2">Amount (BDT)</label>
          <input
            type="number"
            name="amount"
            step="0.01"
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded font-semibold disabled:opacity-50"
        >
          {loading ? 'Processing...' : '💳 Pay Now'}
        </button>
      </form>
    </div>
  );
}
```

---

## ✅ Deployment Checklist

### For App Platform:
- [ ] Create DigitalOcean account
- [ ] Connect GitHub repository
- [ ] Configure source directory: `next-sslcommerz`
- [ ] Add environment variables
- [ ] Deploy
- [ ] Get DigitalOcean App URL
- [ ] Update SSLCommerz callback URLs
- [ ] Update frontend API URL
- [ ] Test payment flow

### For Droplet:
- [ ] Create Droplet
- [ ] SSH into Droplet
- [ ] Install Node.js
- [ ] Clone repository
- [ ] Install dependencies
- [ ] Configure PM2
- [ ] Configure nginx
- [ ] Setup SSL with certbot
- [ ] Add .env file
- [ ] Test payment flow

---

## 🆘 Troubleshooting

### App Platform: Deployment Failed
1. Check build logs in App Platform dashboard
2. Verify environment variables are set
3. Ensure `.env.local.example` is used as template

### Droplet: App Won't Start
```bash
# Check PM2 logs
pm2 logs payment-api

# Check nginx logs
tail -f /var/log/nginx/error.log

# Check if port 3000 is in use
lsof -i :3000
```

### HTTPS Not Working
```bash
# Check certificate
certbot certificates

# Renew certificate
certbot renew

# Check nginx config
nginx -t
```

---

## 🎯 Next Steps

**Tell me which option you choose:**
1. **App Platform** (easiest) - Just deploy and go
2. **Droplet** (cheapest) - Need more setup but full control

Then I'll help you:
1. Deploy the backend
2. Get your backend URL
3. Integrate payment form into frontend
4. Update SSLCommerz callbacks
5. Test the full payment flow

Which would you prefer? 🚀
