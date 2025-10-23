import React from 'react';
import styles from './Form.module.css';

export default function RegForm() {
  return (
    <form className={styles.formBox}>
      <label className={styles.formLabel} htmlFor="email">Email</label>
      <input className={styles.formInput} type="email" id="email" placeholder="you@example.com" autoComplete="email" />

      <label className={styles.formLabel} htmlFor="password">Password</label>
      <input className={styles.formInput} type="password" id="password" placeholder="••••••••" autoComplete="new-password" />

      <label className={styles.formLabel} htmlFor="confirm">Confirm Password</label>
      <input className={styles.formInput} type="password" id="confirm" placeholder="••••••••" autoComplete="new-password" />

      <button type="submit" className={styles.primaryButton}>Sign Up</button>
     
    </form>
  );
}
