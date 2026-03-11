import { MainLayout } from "@/frontend/components/layout/MainLayout";
import { LandingPage } from "@/frontend/components/landing/LandingPage";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export default async function Home() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'dummy_url',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dummy_key',
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return <LandingPage />;
  }

  return (
    <main className="h-screen-safe w-screen overflow-hidden">
      <MainLayout />
    </main>
  );
}
