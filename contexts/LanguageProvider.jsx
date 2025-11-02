"use client";
import { createContext, useContext, useState, useEffect } from "react";

const LanguageContext = createContext(undefined);

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState("en");

    // Load from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem("language");
        if (stored) {
            setLanguage(stored);
        }
    }, []);

    // Save to localStorage whenever language changes
    useEffect(() => {
        localStorage.setItem("language", language);
    }, [language]);


    return (
        <LanguageContext.Provider value={{ language, setLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const ctx = useContext(LanguageContext);
    if (!ctx) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return ctx;
};
