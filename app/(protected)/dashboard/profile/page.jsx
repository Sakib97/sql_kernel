import React from 'react'
import styles from './page.module.css'
import LogoutButton from '@/components/ui/LogoutButton'
import { createClient } from '@/lib/supabaseServer'
import { redirect } from 'next/navigation'
import HashErrorHandler from './HashErrorHandler'

export default async function Page() {
  const supabase = await createClient()
  
  // Get the current user
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    redirect('/signup')
  }
  
  // Fetch profile data from the profiles table
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('name, email, avatar_url')
    .eq('uid', user.id)
    .single()
  
  // Fallback values
  const userName = profile?.name || ''
  const userEmail = profile?.email || user.email || ''
  const avatarUrl = profile?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(userEmail || 'User')}&background=random&size=200`
  
  return (
    <div className={styles.container}>
      <HashErrorHandler />
      <div className={styles.profileCard}>
        <div className={styles.avatar}>
          {avatarUrl && (
            <img 
              src={avatarUrl} 
              alt="Profile Avatar" 
              className={styles.avatarImage}
            />
          )}
        </div>
        
        <h1 className={styles.name}>{userName}</h1>
        <p className={styles.email}>{userEmail}</p>
        
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
        <div className={styles.actions}>
          {/* <button className={styles.editProfileButton}>Edit Profile</button> */}
          <LogoutButton />
        </div>
      </div>
    </div>
  )
}
