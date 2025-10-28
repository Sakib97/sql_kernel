import { createClient } from "@/lib/supabaseServer";
import { redirect } from "next/navigation";

export default async function ProtectedLayout({ children }) {
  const supabase = await createClient();

  // Check if user is authenticated
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    redirect('/signup');
  }

  return (
    <div>
      {children}
    </div>
  );
}
