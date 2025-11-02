"use client"
import { useEffect } from 'react'
import { useLanguage } from '@/contexts/LanguageProvider'

// Keeps the correct font applied by toggling a data attribute on <body>
export default function LanguageFontManager() {
  const { language } = useLanguage()

  useEffect(() => {
    if (typeof document === 'undefined') return
    document.body.setAttribute('data-lang', language)
  }, [language])

  return null
}
