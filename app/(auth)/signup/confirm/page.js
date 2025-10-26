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
                const redirectError = errorCode === 'otp_expired' ? 'link_expired' : 'confirmation_failed'
                sessionStorage.setItem('confirmation_error', JSON.stringify({ token: errorToken, type: redirectError }))
                router.push(`/signup?error=${errorToken}`)
                return
            }

            // Get access token (session already set by Supabase)
            const accessToken = hashParams.get('access_token')
            
            if (!accessToken) {
                const errorToken = crypto.randomUUID()
                sessionStorage.setItem('confirmation_error', JSON.stringify({ token: errorToken, type: 'invalid_link' }))
                router.push(`/signup?error=${errorToken}`)
                return
            }

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
