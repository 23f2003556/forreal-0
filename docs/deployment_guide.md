# Deployment Guide: Going Live with ForReal

To deploy your application and make it accessible to everyone, we recommend using **Vercel**. It's the easiest way to host Next.js apps.

## Step 1: Push to GitHub
1. Create a new repository on [GitHub](https://github.com/new).
2. Push your local code to this repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

## Step 2: Deploy to Vercel
1. Go to [Vercel](https://vercel.com/new) and import your GitHub repository (`forreal-0`).
2. During the "Configure Project" step, look for the **Environment Variables** section.
3. Open your local `.env.local` file in your code editor.
4. For each of the following, copy the **Key** and the **Value** from your file and paste them into Vercel:

| Key | Where to find it in `.env.local` |
| :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Look for the line starting with `NEXT_PUBLIC_SUPABASE_URL=` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Look for the line starting with `NEXT_PUBLIC_SUPABASE_ANON_KEY=` |
| `GROQ_API_KEY` | Look for the line starting with `GROQ_API_KEY=` (Get free at https://console.groq.com) |

5. Click **Add** after entering each one.
6. Once all three are added, click **Deploy**.

> [!TIP]
> Make sure there are no extra spaces or quotes when you copy the values!

## Step 3: Update Redirect URIs
Once your app is deployed, you'll get a production URL (e.g., `https://your-app.vercel.app`). You **must** update your authentication settings:

### 1. Supabase Dashboard
- Go to **Authentication** -> **URL Configuration**.
- Add your Vercel URL to the **Redirect URLs** list.

### 2. Google Cloud Console
- Go to your OAuth 2.0 Client ID.
- Add your production callback URL to **Authorized redirect URIs**:
  `https://ssqeoltyagwjhlpoikmy.supabase.co/auth/v1/callback`
  *(Note: This URL usually stays the same as it points to your Supabase project, but ensure your Vercel URL is allowed in Supabase first.)*

## Step 4: Test Your Live App
Visit your Vercel URL and try logging in with Google or email. Your "ForReal" app is now live!
