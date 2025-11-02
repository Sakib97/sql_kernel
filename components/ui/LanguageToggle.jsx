"use client";
import React from 'react';
import { useLanguage } from '@/contexts/LanguageProvider';
import styles from './LanguageToggle.module.css';


const LanguageToggle = () => {
    const { language, setLanguage } = useLanguage();

    const toggleLanguage = () => {
        setLanguage((prev) => (prev === "en" ? "bn" : "en"));
    };
    return (
        <div className={styles.toggleContainer} onClick={toggleLanguage}>
            <div className={`${styles.slider} ${language === 'en' ? styles.english : styles.bengali}`}>
                <span className={styles.sliderText}>{language === 'en' ? 'EN' : 'BN'}</span>
            </div>
            <span className={`${styles.languageLabel} ${language === 'en' ? styles.showBN : styles.hide}`}>
                BN
            </span>
            <span className={`${styles.languageLabel} ${language === 'en' ? styles.hide : styles.showEN}`}>
                EN
            </span>
        </div>
    );
}

export default LanguageToggle;