# ausMasters - Setup & Deployment Guide

Complete guide to get ausMasters running locally and deployed to `ausmasters.eswaraditya.in` with Google Authentication.

---

## 1. Local Development Setup

### Prerequisites
- Node.js 18+ installed
- npm or pnpm
- Git

### Steps

```bash
# 1. Navigate to the project
cd /Users/eswaraditya/Development/ausMasters

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env.local
```

### Required Environment Variables

Edit `.env.local` with your values:

| Variable | Description | Where to get |
|----------|-------------|--------------|
| `MONGODB_URI` | MongoDB connection string | [MongoDB Atlas](https://mongodb.com/cloud/atlas) |
| `OPENAI_API_KEY` | OpenAI API key | [platform.openai.com](https://platform.openai.com/api-keys) |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | [Google Cloud Console](https://console.cloud.google.com) |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | Google Cloud Console |
| `NEXTAUTH_SECRET` | NextAuth signing secret | Run: `openssl rand -base64 32` |
| `NEXTAUTH_URL` | App base URL | `http://localhost:3000` (dev) |

### Run Development Server

```bash
npm run dev
```

Open `http://localhost:3000`

---

## 2. Google OAuth Setup

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Click **Create Project** (or select existing)
3. Name it `ausMasters` or any name you prefer
4. Wait for project creation

### Step 2: Enable Google+ API

1. Go to **APIs & Services** → **Library**
2. Search for **Google+ API**
3. Click **Enable**

### Step 3: Configure OAuth Consent Screen

1. Go to **APIs & Services** → **OAuth consent screen**
2. Select **External** user type
3. Fill in:
   - **App name**: `ausMasters`
   - **User support email**: Your email
   - **Developer contact email**: Your email
4. Click **Save and Continue**
5. **Scopes**: Add `email`, `profile`, `openid`
6. Click **Save and Continue**
7. **Test users**: Add your email for testing
8. Click **Save and Continue**

### Step 4: Create OAuth Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth client ID**
3. Application type: **Web application**
4. Name: `ausMasters Web`
5. **Authorized JavaScript origins**:
   - `http://localhost:3000` (development)
   - `https://ausmasters.eswaraditya.in` (production)
6. **Authorized redirect URIs**:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://ausmasters.eswaraditya.in/api/auth/callback/google` (production)
7. Click **Create**
8. Copy the **Client ID** and **Client Secret**

### Step 5: Add to Environment

```env
GOOGLE_CLIENT_ID=your_client_id_here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret_here
```

---

## 3. MongoDB Atlas Setup (Free Tier)

1. Go to [MongoDB Atlas](https://mongodb.com/cloud/atlas)
2. Sign up / Log in
3. Click **Build a Database** → **Shared (Free)**
4. Choose a provider and region close to your users (e.g., AWS Sydney)
5. Set cluster name → **Create Cluster**
6. Create a database user with username and password
7. Add IP address `0.0.0.0/0` (allow from anywhere) for now
8. Click **Connect** → **Connect your application**
9. Copy the connection string
10. Replace `<password>` with your database user password
11. Add to `.env.local`:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/ausmasters?retryWrites=true&w=majority
```

---

## 4. OpenAI API Key

1. Go to [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Create a new secret key
3. Add to `.env.local`:

```env
OPENAI_API_KEY=sk-proj-...
```

**Note**: Without this key, the chat will use built-in fallback responses.

---

## 5. Vercel Deployment (24/7 Hosting)

### Step 1: Push to GitHub

```bash
cd /Users/eswaraditya/Development/ausMasters

# Initialize git if not already done
git init
git add .
git commit -m "Initial commit: ausMasters"

# Create repo on GitHub (github.com/new)
# Then push:
git remote add origin https://github.com/<your-username>/ausmasters.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy on Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign up with your GitHub account
3. Click **Add New** → **Project**
4. Import your `ausmasters` repository
5. **Configure Project**:
   - **Framework Preset**: Next.js
   - **Build Command**: `next build`
   - **Output Directory**: `.next`
6. **Environment Variables** — add all from `.env.local`:
   ```
   MONGODB_URI=mongodb+srv://...
   OPENAI_API_KEY=sk-proj-...
   GOOGLE_CLIENT_ID=...
   GOOGLE_CLIENT_SECRET=...
   NEXTAUTH_SECRET=<run: openssl rand -base64 32>
   NEXTAUTH_URL=https://ausmasters.eswaraditya.in
   ```
7. Click **Deploy**

Your app is now live at `https://ausmasters-<random>.vercel.app`

---

## 6. Connect Custom Domain: `ausmasters.eswaraditya.in`

### Step 1: Add Domain in Vercel

1. In your Vercel project, go to **Settings** → **Domains**
2. Enter `ausmasters.eswaraditya.in`
3. Click **Add**
4. Vercel will show you the DNS record to add

### Step 2: Configure DNS

Go to wherever you purchased `eswaraditya.in` (GoDaddy, Namecheap, Cloudflare, etc.) and add:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| `CNAME` | `ausmasters` | `cname.vercel-dns.com` | Auto |

**Example screenshots:**

- **GoDaddy**: DNS Management → Add Record → CNAME → `ausmasters` → `cname.vercel-dns.com`
- **Namecheap**: Advanced DNS → Add Record → CNAME → `ausmasters` → `cname.vercel-dns.com`
- **Cloudflare**: DNS → Add Record → CNAME → `ausmasters` → `cname.vercel-dns.com` → Proxied: ON

### Step 3: Wait for DNS Propagation

DNS changes take 5 minutes to 48 hours to propagate. You can check at:
- [dnschecker.org](https://dnschecker.org)
- Search `ausmasters.eswaraditya.in`

### Step 4: Verify

Once propagated, visit `https://ausmasters.eswaraditya.in` — Vercel auto-provisions a free SSL certificate.

---

## 7. Production Checklist

- [ ] All environment variables set in Vercel
- [ ] Google OAuth redirect URI updated to production URL
- [ ] DNS CNAME record added and propagated
- [ ] Custom domain verified in Vercel
- [ ] MongoDB Atlas allows Vercel IPs (0.0.0.0/0 or specific)
- [ ] Google OAuth consent screen set to **Production** (not Testing)
- [ ] Test Google Sign-In on production URL
- [ ] Test chat, GS form, checklist, SOP helper

---

## 8. Common Issues

### Google Sign-In Not Working

1. Check redirect URI matches exactly: `https://ausmasters.eswaraditya.in/api/auth/callback/google`
2. Check Google OAuth consent screen is published (not in testing)
3. Check environment variables in Vercel are set correctly

### DNS Not Propagating

- Wait at least 1-2 hours
- Clear DNS cache: `sudo dscacheutil -flushcache` (Mac)
- Try incognito mode

### MongoDB Connection Failed

- Check if IP `0.0.0.0/0` is allowed in Atlas Network Access
- Verify connection string has correct password
- Check cluster is not paused (free tier pauses after inactivity)

---

## 9. Maintenance

### View Logs
```bash
# Vercel Dashboard → Your Project → Logs
# Or via CLI:
vercel logs ausmasters
```

### Redeploy
Push to `main` branch → Vercel auto-deploys

### Update Environment Variables
Vercel Dashboard → Settings → Environment Variables → Edit → Redeploy

---

## Quick Start Summary

```bash
# 1. Setup locally
cd ausMasters
npm install
cp .env.example .env.local  # Fill in your values
npm run dev

# 2. Deploy
git push origin main
# Vercel auto-deploys

# 3. Connect domain
# Add CNAME: ausmasters → cname.vercel-dns.com
# Add domain in Vercel settings
```

Your app will be live at: **https://ausmasters.eswaraditya.in**
