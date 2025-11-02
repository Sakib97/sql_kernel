"use client";
import React, { useState, useEffect } from 'react'
import styles from './MainCard.module.css';
import Link from 'next/link';
import { createClient } from '@/lib/supabaseBrowser';

export default function MainCard() {
    const supabase = createClient();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is authenticated
        const checkUser = async () => {
            const { data: { user }, error } = await supabase.auth.getUser();
            setUser(error ? null : user);
            setLoading(false);
        };

        checkUser();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1 className={styles.heading}>Learn SQL the Interactive Way</h1>
                <p className={styles.description}>
                    Master SQL with our hands-on lessons and tutorials. Start your journey to becoming a data expert today.
                </p>
                {!loading && (
                    <Link 
                        href={user ? "/learn/modules" : "/signup"}
                        className={styles.button}>
                        Get Started
                    </Link>
                )}
                {loading && (
                    <div className={styles.button} style={{ opacity: 0.7, cursor: 'wait' }}>
                        Get Started
                    </div>
                )}
            </div>
        </div>
    )
}
