# ForReal

A high-fidelity real-time chat application built with Next.js 14, Tailwind CSS, and Supabase.

## Features
- **Real-time Messaging**: Instant message delivery using Supabase Realtime.
- **Authentication**: Secure login/signup.
- **Media Support**: Image uploads and previews.
- **Modern Aesthetic**: Faithful recreation of a premium chat UI/UX.
- **Message Status**: Sent, Delivered, Read indicators.

## Setup Instructions

### 1. Supabase Setup
1.  Create a new project on [Supabase](https://supabase.com/).
2.  Go to the **SQL Editor** and run the contents of `schema.sql`.
3.  Go to **Storage** and create a new public bucket named `media`.
4.  Get your **Project URL** and **Anon Key** from Project Settings > API.

### 2. Environment Variables
Create a `.env.local` file in the root directory:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 3. Run Locally
```bash
npm install
npm run dev
```

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, Shadcn/ui
- **Backend**: Supabase (Auth, DB, Realtime, Storage)
- **Icons**: Lucide-react
