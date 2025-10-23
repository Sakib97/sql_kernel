import React from 'react';
import styles from './Form.module.css';

export default function LoginForm() {
  return (
    <form className={styles.formBox}>
      <label className={styles.formLabel} htmlFor="email">Email</label>
      <input className={styles.formInput} type="email" id="email" placeholder="you@example.com" autoComplete="email" />

      <label className={styles.formLabel} htmlFor="password">Password</label>
      <input className={styles.formInput} type="password" id="password" placeholder="••••••••" autoComplete="current-password" />

      <button type="submit" className={styles.primaryButton}>Log In</button>

      <div className={styles.forgotPasswordBox}>
        <a href="#" className={styles.forgotPassword}>Forgot password?</a>
      </div>
    </form>
  );
}
