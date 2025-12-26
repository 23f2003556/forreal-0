---
description: how to deploy the application to Vercel
---

1. Ensure all changes are committed to git.
2. Push the code to a GitHub repository.
3. Connect the GitHub repository to Vercel.
4. Add the required environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `GEMINI_API_KEY`
5. Update Supabase and Google Cloud redirect URIs with the new production domain.
