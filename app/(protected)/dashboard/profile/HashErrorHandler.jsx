'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function HashErrorHandler() {
    const router = useRouter()

    useEffect(() => {
        // Check if there's an error in the URL hash (from expired confirmation links)
        const hash = window.location.hash
        if (hash.includes('error=')) {
            // Clear the error hash from the URL
            window.history.replaceState({}, '', window.location.pathname)

            // Optionally show a toast or notification that the link was expired
            console.log('Expired confirmation link detected and cleared')
            const errorToken = crypto.randomUUID()
            let redirectError = 'link_expired'
            sessionStorage.setItem('confirmation_error', JSON.stringify({ token: errorToken, type: redirectError }))

            router.push(`/signup?error=${errorToken}`)
        }
    }, [])

    return null // This component doesn't render anything
}
