import React from 'react'
import styles from './page.module.css'

export default function Page() {
  return (
    <div className={styles.container}>
      <div className={styles.profileCard}>
        <div className={styles.avatar}></div>
        
        <h1 className={styles.name}>John Doe</h1>
        <p className={styles.email}>john.doe@example.com</p>
        
        <div className={styles.progressSection}>
          <div className={styles.progressHeader}>
            <h2 className={styles.progressTitle}>Course Progress</h2>
            <span className={styles.progressPercent}>65%</span>
          </div>
          
          <div className={styles.progressBar}>
            <div className={styles.progressFill}></div>
          </div>
          
          <div className={styles.progressInfo}>
            <span className={styles.progressLabel}>13 of 20 lessons completed</span>
          </div>
        </div>
      </div>
    </div>
  )
}
