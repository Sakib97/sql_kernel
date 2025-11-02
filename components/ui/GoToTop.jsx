"use client"
import React, { useEffect, useState, useCallback } from 'react'
import styles from './GoToTop.module.css'
import { FaArrowUp } from 'react-icons/fa'

export default function GoToTop({ threshold = 200 }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      // Guard for environments without window (SSR)
      if (typeof window === 'undefined') return
      setVisible(window.scrollY > threshold)
    }

    // Initialize state on mount and subscribe to scroll
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [threshold])

  const scrollToTop = useCallback(() => {
    if (typeof window === 'undefined') return
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  return (
    <button
      type="button"
      aria-label="Scroll to top"
      className={`${styles.button} ${visible ? styles.visible : ''}`}
      onClick={scrollToTop}
    >
      <FaArrowUp className={styles.icon} aria-hidden="true" />
    </button>
  )
}
