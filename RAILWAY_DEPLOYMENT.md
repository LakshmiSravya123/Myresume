# 🚂 Deploy Your Portfolio to Railway - Complete Guide

Railway is perfect for your full-stack portfolio because it supports:
- ✅ Long-running Express server
- ✅ Background services (stock ingestion)
- ✅ Environment variables
- ✅ Automatic HTTPS
- ✅ Free tier available

---

## 📋 Prerequisites

Make sure you have:
- ✅ GitHub repository: `https://github.com/LakshmiSravyaVedantham/Myresume`
- ✅ Railway account (sign up with GitHub at https://railway.app)
- ✅ Environment variables ready:
  - `ES_CLOUD_ID`
  - `ELASTICSEARCH_USERNAME`
  - `ELASTICSEARCH_PASSWORD`
  - `ELASTIC_INDEX`
  - `FINNHUB_API_KEY`

---

## 🚀 Step-by-Step Deployment

### **Step 1: Sign Up for Railway**

1. Go to **https://railway.app**
2. Click **"Login"** → **"Login with GitHub"**
3. Authorize Railway to access your GitHub

### **Step 2: Create New Project**

1. Click **"New Project"** (purple button)
2. Select **"Deploy from GitHub repo"**
3. If this is your first time:
   - Click **"Configure GitHub App"**
   - Select your repositories or give access to all
4. Choose your repository: **`LakshmiSravyaVedantham/Myresume`**

### **Step 3: Railway Auto-Detection**

Railway will automatically detect:
- ✅ Node.js project
- ✅ Build command from package.json
- ✅ Start command from package.json

**Railway will use:**
- Build: `npm run build`
- Start: `npm start`

### **Step 4: Add Environment Variables**

1. In your Railway project, click on your service
2. Go to **"Variables"** tab
3. Click **"+ New Variable"** and add each one:

```
ES_CLOUD_ID=your_elasticsearch_cloud_id
ELASTICSEARCH_USERNAME=your_username
ELASTICSEARCH_PASSWORD=your_password
ELASTIC_INDEX=stocks
FINNHUB_API_KEY=your_finnhub_api_key
NODE_ENV=production
PORT=5000
```

**Important:** Replace the values with your actual credentials!

### **Step 5: Deploy**

1. Railway automatically starts deploying
2. Watch the **"Deployments"** tab for progress
3. You'll see:
   - ✅ Installing dependencies...
   - ✅ Building application...
   - ✅ Starting server...
   - ✅ Deployment successful!

### **Step 6: Get Your Public URL**

1. Click **"Settings"** tab
2. Scroll to **"Networking"** section
3. Click **"Generate Domain"**
4. Railway gives you a URL like: `your-app-production.up.railway.app`
5. Click the URL to view your live portfolio! 🎉

---

## ⚙️ Configuration Details

### **Environment Variables You Need:**

| Variable | Description | Example |
|----------|-------------|---------|
| `ES_CLOUD_ID` | Elasticsearch cloud ID | `your-cluster:dXMt...` |
| `ELASTICSEARCH_USERNAME` | Elasticsearch username | `elastic` |
| `ELASTICSEARCH_PASSWORD` | Elasticsearch password | `your-password` |
| `ELASTIC_INDEX` | Index name for stock data | `stocks` |
| `FINNHUB_API_KEY` | Finnhub API key for stock data | `your-api-key` |
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | Server port (Railway sets this automatically) | `5000` |

**Note:** Railway automatically provides `PORT` - you don't need to set it manually.

---

## ✅ What Will Work After Deployment

After deploying to Railway, your portfolio will have:

- ✅ **All Pages**: Home, About, Projects, Contact
- ✅ **Featured Projects**: Stock Analytics, Dream Weaver, Grafana, Tesla Dashboard
- ✅ **AI Assistant**: Full chatbot functionality with intelligent responses
- ✅ **Live Stock Analytics**: Real-time data from Elasticsearch
- ✅ **Background Services**: Stock data ingestion running continuously
- ✅ **Fallback System**: If Elasticsearch is down, fallback data displays
- ✅ **Professional Design**: Full blue/purple color scheme
- ✅ **HTTPS**: Automatic SSL certificate

---

## 🔧 Troubleshooting

### **Deployment Failed?**

**Check the logs:**
1. Go to **"Deployments"** tab
2. Click on the failed deployment
3. Read the error message

**Common issues:**

**1. Build fails:**
```bash
# Solution: Make sure all dependencies are in package.json
```

**2. Port binding error:**
```bash
# Solution: Railway sets PORT automatically, make sure your code uses:
const port = process.env.PORT || 5000;
```

**3. Environment variables missing:**
```bash
# Solution: Double-check all variables are added in Railway dashboard
```

### **App deployed but not working?**

1. **Check service logs:**
   - Click on your service
   - Go to **"Observability"** → **"Logs"**
   - Look for errors

2. **Check Elasticsearch connection:**
   - Make sure credentials are correct
   - Verify Elasticsearch cluster is running

3. **Check start command:**
   - Should be `npm start`
   - Runs: `NODE_ENV=production node dist/index.js`

---

## 🔄 Making Updates

After initial deployment:

1. **Push changes to GitHub:**
   ```bash
   git add -A
   git commit -m "Update portfolio"
   git push origin main
   ```

2. **Railway auto-deploys:**
   - Detects GitHub push
   - Rebuilds automatically
   - Deploys new version
   - Zero downtime!

---

## 💰 Pricing

**Free Tier:**
- $5 credit per month
- Perfect for portfolio sites
- No credit card required

**If you need more:**
- Hobby Plan: $5/month
- Includes $5 usage credit
- Great for production apps

Your portfolio should easily fit in the free tier!

---

## 📊 Monitor Your App

Railway provides:
- **Real-time logs**: See all server output
- **Metrics**: CPU, Memory, Network usage
- **Deployments**: History of all deployments
- **Variables**: Manage environment variables

Access all of these from your Railway dashboard.

---

## 🎉 You're Done!

Once deployed, share your portfolio URL:
- Add to your resume
- Share on LinkedIn
- Include in GitHub README
- Use in job applications

Your live URL will be something like:
`https://your-portfolio-production.up.railway.app`

**Congratulations on deploying your portfolio!** 🚀
