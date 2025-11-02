import { redirect } from 'next/navigation'
// import { createClient } from '@/lib/supabaseBrowser';
import { createClient } from '@/lib/supabaseServer';

export default async function AuthLayout({ children }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // If already authenticated → send to dashboard
  if (user) {
    redirect('/dashboard/profile')
  }

  return <>{children}</>
}
