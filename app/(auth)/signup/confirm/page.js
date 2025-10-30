'use client'
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function Page() {
    const router = useRouter()
    const [verifying, setVerifying] = useState(true)
    const [hasHash, setHasHash] = useState(false)

    useEffect(() => {
        const confirmSignUp = async () => {
            console.log("I am inside confirm");

            // Verify the session is valid using getUser() for fresh auth state
            // if (user) {
            //     console.log("I am inside confirm user ");

            //     router.push('/dashboard/profile')
            // }

            // Parse hash params from URL
            const hash = window.location.hash.substring(1)
            if (!hash) {
                // No hash means direct access - just redirect to signup without error
                router.push('/signup')
                return
            }

            setHasHash(true)
            const hashParams = new URLSearchParams(hash)

            // Check for Supabase errors
            const error = hashParams.get('error')
            const errorCode = hashParams.get('error_code')

            if (error) {
                console.error('Supabase error:', error, errorCode);
                const errorToken = crypto.randomUUID()
                let redirectError = 'confirmation_failed'

                // Determine the appropriate error type
                if (errorCode === 'otp_expired') {
                    redirectError = 'link_expired'
                } else if (errorCode === 'otp_disabled' || error === 'access_denied') {
                    redirectError = 'invalid_link'
                }

                sessionStorage.setItem('confirmation_error', JSON.stringify({ token: errorToken, type: redirectError }))
                router.push(`/signup?error=${errorToken}`)
                return
            }

            // Get tokens from the URL hash (set by Supabase after verification)
            const accessToken = hashParams.get('access_token')
            const refreshToken = hashParams.get('refresh_token')

            // If tokens are missing, treat as invalid link
            if (!accessToken || !refreshToken) {
                const errorToken = crypto.randomUUID()
                sessionStorage.setItem('confirmation_error', JSON.stringify({ token: errorToken, type: 'invalid_link' }))
                router.push(`/signup?error=${errorToken}`)
                return
            }

            // Persist the session client-side using tokens from the URL
            const { error: setSessionError } = await supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken,
            })

            if (setSessionError) {
                console.error('Failed to set session from confirmation link:', setSessionError)
                const errorToken = crypto.randomUUID()
                const errorType = setSessionError.message?.includes('expired') ? 'link_expired' : 'invalid_link'
                sessionStorage.setItem('confirmation_error', JSON.stringify({ token: errorToken, type: errorType }))
                router.push(`/signup?error=${errorToken}`)
                return
            }

            
            const { data: { user }, error: userError } = await supabase.auth.getUser()
            if (userError || !user) {
                // Session is invalid or corrupted - check if it's an expiry issue
                console.error('User validation error:', userError);
                const errorToken = crypto.randomUUID()
                // If there was an error in hash but we reached here, it's likely corrupted not expired
                const errorType = userError?.message?.includes('expired') ? 'link_expired' : 'invalid_link'
                sessionStorage.setItem('confirmation_error', JSON.stringify({ token: errorToken, type: errorType }))
                router.push(`/signup?error=${errorToken}`)
                return
            }

            // Clean up the URL to remove sensitive tokens
            // window.history.replaceState({}, '', window.location.pathname)

            // Create one-time confirmation token and redirect
            const confirmationToken = crypto.randomUUID()
            sessionStorage.setItem('email_confirmed', confirmationToken)
            router.push(`/signup?confirmed=${confirmationToken}`)
            setVerifying(false)
        }

        confirmSignUp()
    }, [router])

    // Don't show message if there's no hash (direct access)
    if (!hasHash) {
        return null
    }

    return (
        <div style={{ textAlign: 'center', fontWeight: 'bold' }}>Confirming your email...</div>
    )
}


// 'use client'
// import { useRouter } from "next/navigation"
// import { useEffect, useState } from "react"
// import { supabase } from "@/lib/supabaseClient"

// export default function Page() {
//   const router = useRouter()
//   const [status, setStatus] = useState("Verifying your email...")

//   useEffect(() => {
//     const handleEmailConfirmation = async () => {
//       const hash = window.location.hash
//       if (!hash) {
//         router.push("/signup")
//         return
//       }

//       // Exchange the code in URL for a Supabase session
//       const { data, error } = await supabase.auth.exchangeCodeForSession(window.location.href)

//       if (error) {
//         console.error("Email confirmation failed:", error.message)
//         router.push("/signup?error=confirmation_failed")
//         return
//       }

//       // Optional: verify user exists
//       const { data: { user }, error: userError } = await supabase.auth.getUser()
//       if (userError || !user) {
//         console.error("User validation failed:", userError)
//         router.push("/signup?error=user_validation_failed")
//         return
//       }

//       setStatus("Email confirmed successfully! Redirecting...")

//       // Redirect user to dashboard or profile
//       setTimeout(() => {
//         router.push("/dashboard/profile")
//       }, 1500)
//     }

//     handleEmailConfirmation()
//   }, [router])

//   return (
//     <div style={{ textAlign: "center", fontWeight: "bold", marginTop: "3rem" }}>
//       {status}
//     </div>
//   )
// }
