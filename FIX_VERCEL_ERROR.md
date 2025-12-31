# 🚨 URGENT: Fix Deployed Website Error

## Error You're Seeing:
```
Groq API Key is missing. Please add GROQ_API_KEY to .env.local and restart the server.
```

## ✅ Solution: Add Environment Variable to Vercel

### Step-by-Step Instructions:

#### 1. Go to Vercel Dashboard
Visit: https://vercel.com/dashboard

#### 2. Find Your Project
- Look for your project (probably named `forreal-0` or similar)
- Click on it to open

#### 3. Go to Settings
- Click **"Settings"** tab at the top
- Click **"Environment Variables"** in the left sidebar

#### 4. Add the Missing Variable
Click **"Add New"** and enter:

**Name:**
```
GROQ_API_KEY
```

**Value:**
```
gsk_...
```

**Environments:**
- ✅ Check **Production**
- ✅ Check **Preview**
- ✅ Check **Development**

#### 5. Save
Click **"Save"** button

#### 6. Redeploy Your App
- Go to **"Deployments"** tab
- Find the latest deployment
- Click the **three dots (...)** on the right
- Click **"Redeploy"**
- Wait 1-2 minutes for redeployment

---

## 🎯 Quick Checklist

- [ ] Go to Vercel Dashboard
- [ ] Open your project
- [ ] Settings → Environment Variables
- [ ] Add `GROQ_API_KEY` with the value above
- [ ] Select all environments (Production, Preview, Development)
- [ ] Save
- [ ] Redeploy from Deployments tab
- [ ] Wait for deployment to complete
- [ ] Test your website again

---

## 🔍 Verify It's Fixed

After redeployment:
1. Visit your deployed website
2. Try using the AI features (✨ Sparkles icon)
3. The error should be gone
4. AI suggestions should work

---

## 📝 All Environment Variables You Need

Make sure these are ALL set in Vercel:

| Variable Name | Where to Get It |
|---------------|-----------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Dashboard → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Dashboard → Settings → API |
| `GROQ_API_KEY` | Use the value above (already provided) |

---

## 🆘 Still Having Issues?

### Check 1: Verify All Variables Are Set
- Go to Settings → Environment Variables
- Make sure all 3 variables are listed
- Make sure they're enabled for "Production"

### Check 2: Check Deployment Logs
- Go to Deployments tab
- Click on the latest deployment
- Check the logs for any errors

### Check 3: Clear Cache
- Try opening your website in incognito/private mode
- Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)

---

**The fix is simple: Add the GROQ_API_KEY to Vercel and redeploy!** 🚀
