'use client';
import { useState } from 'react';
import styles from './page.module.css';
import LoginForm from './LoginForm';
import RegForm from './RegForm';

export default function AuthPage() {
    const [authState, setAuthState] = useState('login'); // 'login' or 'signup'
    return (
        <div className={styles.pageBackground}>
            <div className={styles.authContainer}>
                <div>
                    <div className={styles.authLinks}>
                        <div
                            className={authState === 'login' ? styles.activeTab : ''}
                            onClick={() => setAuthState('login')}
                        >
                            Log In
                        </div>
                        <div
                            className={authState === 'signup' ? styles.activeTab : ''}
                            onClick={() => setAuthState('signup')}
                        >
                            Sign Up
                        </div>
                    </div>
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
