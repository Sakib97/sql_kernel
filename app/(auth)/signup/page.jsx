'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from './page.module.css';
import LoginForm from './LoginForm';
import RegForm from './RegForm';

function AuthPageContent() {
    const [authState, setAuthState] = useState('login'); // 'login' or 'signup'
    const [successMessage, setSuccessMessage] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const searchParams = useSearchParams()

    useEffect(() => {
        const confirmToken = searchParams.get('confirmed')
        const errorToken = searchParams.get('error')

        if (confirmToken) {
            // Verify the token exists in sessionStorage
            const storedToken = sessionStorage.getItem('email_confirmed')
            if (storedToken === confirmToken) {
                setSuccessMessage('Email confirmed successfully! You can now log in.')
                // Clear the token so it can't be reused
                sessionStorage.removeItem('email_confirmed')
                // Clean up URL
                window.history.replaceState({}, '', '/signup')
                setAuthState('login')
            }
        }

        if (errorToken) {
            // Verify the error token exists in sessionStorage
            const storedError = sessionStorage.getItem('confirmation_error')
            if (storedError) {
                try {
                    const { token, type } = JSON.parse(storedError)
                    if (token === errorToken) {
                        // Display appropriate error message
                        if (type === 'link_expired') {
                            setErrorMessage('Confirmation link has expired. Please sign up again to receive a new link.')
                        } else if (type === 'confirmation_failed') {
                            setErrorMessage('Email confirmation failed. Please try again or contact support.')
                        } else if (type === 'invalid_link') {
                            setErrorMessage('Invalid confirmation link. Please try again or contact support.')
                        }
                        // Clear the error token
                        sessionStorage.removeItem('confirmation_error')
                        // Clean up URL
                        window.history.replaceState({}, '', '/signup')
                    }
                } catch (e) {
                    console.error('Error parsing stored error:', e)
                }
            }
        }
    }, [searchParams])

    return (
        <div className={styles.pageBackground}>
            <div className={styles.authContainer}>
                <div>
                    <div className={styles.authLinks}>
                        <div
                            className={authState === 'login' ? styles.activeTab : ''}
                            onClick={() => {
                                setAuthState('login')
                                setSuccessMessage('')
                                setErrorMessage('')
                            }}
                        >
                            Log In
                        </div>
                        <div
                            className={authState === 'signup' ? styles.activeTab : ''}
                            onClick={() => {
                                setAuthState('signup')
                                setSuccessMessage('')
                                setErrorMessage('')
                            }}

                        >
                            Sign Up
                        </div>
                    </div>

                    {/* Success/Error Messages */}
                    {successMessage && (
                        <div className={styles.successMessage}>
                            <i className="fi fi-rr-check-circle"></i>
                            {successMessage}
                        </div>
                    )}
                    {errorMessage && (
                        <div className={styles.errorMessage}>
                            <i className="fi fi-rr-cross-circle"></i>
                            {errorMessage}
                        </div>
                    )}

                    <div>
                        {authState === 'login' ? <LoginForm /> : <RegForm />}
                    </div>

                    <div className={styles.orDivider}><span>OR</span></div>

                    {/* continue with google section */}
                    <div>
                        <div style={{ textAlign: 'center', marginTop: '10px' }}>
                            <button className={styles.googleButton}>
                                <div className={styles.googleIcon}>
                                    <i className="fi fi-brands-google"></i>
                                    <i style={{ margin: '8px' }} className="fi fi-bs-tally-1"></i>

                                </div>
                                <span style={{ marginLeft: '8px' }}>
                                    Continue with Google
                                </span>
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default function AuthPage() {
    return (
        <Suspense fallback={<div className={styles.pageBackground}>
            <div className={styles.authContainer}>
                Loading...
            </div>
        </div>}>
            <AuthPageContent />
        </Suspense>
    );
}
