"use client";
import React from 'react'
import styles from './MainCard.module.css';
import Link from 'next/link';

export default function MainCard() {
    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1 className={styles.heading}>Learn SQL the Interactive Way</h1>
                <p className={styles.description}>
                    Master SQL with our hands-on lessons and tutorials. Start your journey to becoming a data expert today.
                </p>
                <Link href="/signup"
                    className={styles.button}>
                    Get Started
                </Link>
            </div>
        </div>
    )
}
