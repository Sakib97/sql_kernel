// "use client";
// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { createClient } from '@/lib/supabaseBrowser';

// // Quick synchronous check for session in cookies/localStorage
// function hasQuickSession() {
//   if (typeof window === 'undefined') return false;
  
//   // Check for Supabase auth cookies
//   const cookies = document.cookie.split(';');
//   const hasAuthCookie = cookies.some(cookie => 
//     cookie.trim().startsWith('sb-') && cookie.includes('-auth-token')
//   );
  
//   return hasAuthCookie;
// }

// export default function AuthLayout({ children }) {
//   const router = useRouter();
//   const supabase = createClient();
  
//   // Only show loading if we detect a possible session
//   const [isChecking, setIsChecking] = useState(hasQuickSession());
//   const [isRedirecting, setIsRedirecting] = useState(false);

//   useEffect(() => {
//     const checkUser = async () => {
//       const { data: { session } } = await supabase.auth.getSession();
      
//       if (session) {
//         // User is already logged in, show loading and redirect to dashboard
//         setIsRedirecting(true);
//         router.push('/dashboard/profile');
//       } else {
//         // No session, allow access to auth page
//         setIsChecking(false);
//       }
//     };

//     checkUser();

//     // Listen for auth state changes
//     const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
//       if (session) {
//         setIsRedirecting(true);
//         router.push('/dashboard/profile');
//       }
//     });

//     return () => subscription.unsubscribe();
//   }, [router, supabase]);

//   // Show minimal loading during initial check
//   if (isChecking || isRedirecting) {
//     return (
//       <div style={{ 
//         display: 'flex', 
//         justifyContent: 'center', 
//         alignItems: 'center', 
//         minHeight: '100vh',
//         fontSize: '18px',
//         color: '#6b7280',
//         fontFamily: 'var(--font-domine)',
//         flexDirection: 'column',
//         gap: '16px'
//       }}>
//         <div style={{ 
//           width: '40px', 
//           height: '40px', 
//           border: '4px solid #e5e7eb',
//           borderTop: '4px solid #667eea',
//           borderRadius: '50%',
//           animation: 'spin 1s linear infinite'
//         }} />
//         <style jsx>{`
//           @keyframes spin {
//             0% { transform: rotate(0deg); }
//             100% { transform: rotate(360deg); }
//           }
//         `}</style>
//         <span>{isRedirecting ? 'Redirecting to dashboard...' : 'Loading...'}</span>
//       </div>
//     );
//   }

//   return <>{children}</>;
// }

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
