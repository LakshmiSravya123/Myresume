# 🪁 Deploy Your Portfolio to Fly.io - Complete Guide

Fly.io offers global edge deployment with excellent performance and a generous free tier.

---

## 📋 Prerequisites

- ✅ GitHub repository: `https://github.com/LakshmiSravya123/Myresume`
- ✅ Fly.io account (sign up at https://fly.io)
- ✅ flyctl CLI installed on your computer
- ✅ Environment variables ready

---

## 🚀 Step-by-Step Deployment

### **Step 1: Install Fly.io CLI** (5 minutes)

**On Mac:**
```bash
curl -L https://fly.io/install.sh | sh
```

**On Windows (PowerShell):**
```powershell
powershell -Command "iwr https://fly.io/install.ps1 -useb | iex"
```

**On Linux:**
```bash
curl -L https://fly.io/install.sh | sh
```

**Verify installation:**
```bash
flyctl version
```

---

### **Step 2: Sign Up & Login** (2 minutes)

1. **Sign up** at https://fly.io (use GitHub login for easier setup)

2. **Login via CLI:**
```bash
flyctl auth login
```

This opens your browser to authenticate.

---

### **Step 3: Clone Your Repository** (2 minutes)

**Option A: If you haven't cloned locally yet:**
```bash
git clone https://github.com/LakshmiSravya123/Myresume.git
cd Myresume
```

**Option B: If you already have it:**
```bash
cd /path/to/Myresume
```

---

### **Step 4: Launch Your App** (3 minutes)

Run this command in your project directory:

```bash
flyctl launch
```

**You'll be asked several questions:**

1. **Choose an app name:** 
   - Type: `lakshmi-portfolio` (or any name you prefer)
   - Press Enter

2. **Choose a region:**
   - Select one close to you (e.g., `sjc` for San Jose, `iad` for Virginia)
   - Type the region code and press Enter

3. **Would you like to set up a PostgreSQL database?**
   - Type: `N` (No - you're using in-memory storage)
   - Press Enter

4. **Would you like to set up an Upstash Redis database?**
   - Type: `N` (No)
   - Press Enter

5. **Would you like to deploy now?**
   - Type: `N` (No - we need to add environment variables first)
   - Press Enter

---

### **Step 5: Add Environment Variables** (3 minutes)

Set your secrets one by one:

```bash
flyctl secrets set ES_CLOUD_ID="your_elasticsearch_cloud_id"
flyctl secrets set ELASTICSEARCH_USERNAME="your_username"
flyctl secrets set ELASTICSEARCH_PASSWORD="your_password"
flyctl secrets set ELASTIC_INDEX="stocks"
flyctl secrets set FINNHUB_API_KEY="your_finnhub_api_key"
flyctl secrets set NODE_ENV="production"
```

**Get these values from your Replit Secrets:**
- Open Replit → Click 🔑 Secrets icon
- Copy each value

---

### **Step 6: Deploy!** (3-5 minutes)

Now deploy your app:

```bash
flyctl deploy
```

**What happens:**
1. ✅ Builds Docker image
2. ✅ Uploads to Fly.io
3. ✅ Creates machine
4. ✅ Starts your app
5. ✅ Gives you a live URL!

---

### **Step 7: Get Your Live URL** (1 minute)

After deployment completes, run:

```bash
flyctl status
```

You'll see output like:
```
Hostname: lakshmi-portfolio.fly.dev
```

**Your portfolio is live at:** `https://lakshmi-portfolio.fly.dev` 🎉

---

## ✅ **What Works on Fly.io:**

After deployment, you'll have:
- ✅ **All Pages** - Home, About, Projects, Contact
- ✅ **Featured Projects** - Stock Analytics, Dream Weaver, Grafana, Tesla
- ✅ **AI Assistant** - Full chatbot functionality
- ✅ **Stock Analytics** - Real-time data with Elasticsearch
- ✅ **Background Services** - Stock ingestion running
- ✅ **Fallback Data** - Works even if APIs are down
- ✅ **Professional Design** - Blue/purple color scheme
- ✅ **HTTPS** - Automatic SSL certificate
- ✅ **Global CDN** - Fast worldwide access

---

## 🔄 **Updating Your App**

When you make changes:

1. **Push to GitHub:**
```bash
git add -A
git commit -m "Update portfolio"
git push origin main
```

2. **Deploy updates:**
```bash
flyctl deploy
```

That's it! Fly.io rebuilds and deploys automatically.

---

## 📊 **Monitor Your App**

**View logs:**
```bash
flyctl logs
```

**Check status:**
```bash
flyctl status
```

**Open in browser:**
```bash
flyctl open
```

**SSH into machine:**
```bash
flyctl ssh console
```

---

## 💰 **Fly.io Free Tier**

**What you get FREE:**
- ✅ 3 shared-cpu-1x machines (256MB RAM)
- ✅ 160GB outbound data transfer
- ✅ Automatic SSL certificates
- ✅ Global deployment

**Your portfolio uses:**
- 1 machine (512MB RAM)
- ~2-5GB bandwidth/month
- **Easily fits in free tier!**

---

## ⚙️ **Advanced Configuration**

### **Scale Your App**

**Increase resources:**
```bash
flyctl scale memory 1024
```

**Add more machines:**
```bash
flyctl scale count 2
```

**Set auto-start/stop:**
```bash
flyctl scale count 1 --max-per-region 3
```

### **Custom Domain**

1. **Add your domain:**
```bash
flyctl certs create yourdomain.com
```

2. **Add DNS records** (shown after running command)

3. **Wait for verification** (usually 5-10 minutes)

---

## 🔧 **Troubleshooting**

### **Build Failed?**

**Check logs:**
```bash
flyctl logs
```

**Common issues:**

**1. Out of memory during build:**
```bash
# Edit fly.toml, increase memory:
[build]
  [build.args]
    NODE_OPTIONS="--max-old-space-size=2048"
```

**2. Port binding error:**
- Make sure your app uses `process.env.PORT` (already configured!)

**3. Dependencies missing:**
```bash
# Rebuild with cache cleared:
flyctl deploy --no-cache
```

### **App Not Starting?**

**Check machine status:**
```bash
flyctl status
```

**View detailed logs:**
```bash
flyctl logs -a lakshmi-portfolio
```

**Restart machine:**
```bash
flyctl machine restart
```

### **Environment Variables Missing?**

**List secrets:**
```bash
flyctl secrets list
```

**Update a secret:**
```bash
flyctl secrets set FINNHUB_API_KEY="new_value"
```

---

## 🎯 **Quick Commands Reference**

| Command | What it does |
|---------|-------------|
| `flyctl launch` | Initialize new app |
| `flyctl deploy` | Deploy your app |
| `flyctl open` | Open app in browser |
| `flyctl logs` | View live logs |
| `flyctl status` | Check app status |
| `flyctl secrets set KEY=value` | Add environment variable |
| `flyctl secrets list` | View all secrets |
| `flyctl ssh console` | SSH into machine |
| `flyctl scale memory 1024` | Increase RAM |
| `flyctl destroy` | Delete app |

---

## 🌍 **Available Regions**

Choose a region close to your users:

| Code | Location |
|------|----------|
| `iad` | Virginia, USA |
| `ord` | Chicago, USA |
| `sjc` | San Jose, USA |
| `lax` | Los Angeles, USA |
| `ewr` | New Jersey, USA |
| `lhr` | London, UK |
| `ams` | Amsterdam, Netherlands |
| `fra` | Frankfurt, Germany |
| `syd` | Sydney, Australia |
| `nrt` | Tokyo, Japan |
| `sin` | Singapore |

---

## 📝 **Files Created for Deployment**

- ✅ `Dockerfile` - Docker build instructions
- ✅ `fly.toml` - Fly.io configuration
- ✅ `.dockerignore` - Files to exclude from build
- ✅ `FLY_DEPLOYMENT.md` - This guide!

---

## 🎉 **You're Done!**

Once deployed, your portfolio will be live at:
`https://lakshmi-portfolio.fly.dev`

**Benefits of Fly.io:**
- 🌍 Global edge deployment
- ⚡ Fast performance worldwide
- 💰 Generous free tier
- 🔒 Automatic HTTPS
- 🚀 Zero-downtime deploys
- 📊 Built-in monitoring

**Share your new URL:**
- Add to resume
- Share on LinkedIn
- Include in GitHub README
- Use in job applications

**Congratulations on deploying to Fly.io!** 🚀
