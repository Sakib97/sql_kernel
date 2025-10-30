'use client';
import React, { useState } from 'react';
import styles from './Form.module.css';
import { useFormik } from 'formik';
import { RegistrationSchema } from '../../../schemas/RegistrationSchema';
import { createClient } from '@/lib/supabaseBrowser';
import { useRouter } from 'next/navigation';


export default function RegForm() {
  const supabase = createClient();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)
  const router = useRouter();

  // Use window.location.origin when available (client-side), fallback to env var
  const getRedirectUrl = () => {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/signup/confirm`
    }
    return `${process.env.NEXT_PUBLIC_APP_URL}/signup/confirm`
  }

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: RegistrationSchema,
    onSubmit: async (values) => {

      // console.log(values);
      setLoading(true)
      setMessage(null)
      setError(null)
      
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          emailRedirectTo: getRedirectUrl()
        }
      })
      
      if (error) {
        // Handle rate limit error specifically
        if (error.code?.includes('over_email_send_rate_limit') || error.message?.includes('you can only request this after')) {
          setError('A confirmation email was already sent. Please check your inbox.')
        } else {
          setError(error.message)
        }
        setLoading(false)
      } else if (data?.user?.identities?.length === 0) {
        // User already exists - identities array is empty
          // User exists and is already confirmed (no confirmation_sent_at means no new email sent)
          setError('An account with this email already exists. Please log in instead.')
        setLoading(false)
      } else {
        setMessage('Registration successful! Please check your email to confirm your account.')
        setLoading(false)
        // router.push('/login')
      }
    },
  });

  return (
    <form className={styles.formBox} onSubmit={formik.handleSubmit}>
      <label className={styles.formLabel} htmlFor="email">Email*</label>
      <input
        className={`${styles.formInput} ${formik.touched.email && formik.errors.email ? styles.errorInput : ''}`}
        type="email"
        id="email"
        name="email"
        placeholder="you@example.com"
        autoComplete="email"
        value={formik.values.email}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      />
      {formik.touched.email && formik.errors.email && (
        <div className={styles.errorMessage}>{formik.errors.email}</div>
      )}

      <label className={styles.formLabel} htmlFor="password">Password*</label>
      <div className={styles.passwordWrapper}>
        <input className={`${styles.formInput} 
        ${formik.touched.password && formik.errors.password ? styles.errorInput : ''}`}
          type={showPassword ? "text" : "password"}
          id="password"
          name="password"
          placeholder="••••••••"
          autoComplete="new-password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        <button
          type="button"
          className={styles.togglePassword}
          onClick={() => setShowPassword(!showPassword)}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          <i className={showPassword ? "fi fi-rr-eye-crossed" : "fi fi-rr-eye"}></i>
        </button>
      </div>
      {formik.touched.password && formik.errors.password && (
        <div className={styles.errorMessage}>{formik.errors.password}</div>
      )}

      <label className={styles.formLabel} htmlFor="confirm">Confirm Password*</label>
      <div className={styles.passwordWrapper}>
        <input className={`${styles.formInput} 
        ${formik.touched.confirmPassword && formik.errors.confirmPassword ? styles.errorInput : ''}`}
          type={showConfirmPassword ? "text" : "password"}
          id="confirm"
          name="confirmPassword"
          placeholder="••••••••"
          autoComplete="new-password"
          value={formik.values.confirmPassword}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        <button
          type="button"
          className={styles.togglePassword}
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          aria-label={showConfirmPassword ? "Hide password" : "Show password"}
        >
          <i className={showConfirmPassword ? "fi fi-rr-eye-crossed" : "fi fi-rr-eye"}></i>
        </button>
      </div>
      {formik.touched.confirmPassword && formik.errors.confirmPassword && (
        <div className={styles.errorMessage}>{formik.errors.confirmPassword}</div>
      )}

      {/* disable button if form is not valid or dirty or empty */}
      <button
        disabled={!(formik.isValid && formik.dirty) || loading}
        type="submit"
        // dynamically add class for disabled button
        className={styles.primaryButton}>
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>

        {message && <div className={styles.successMessage}>{message}</div>}
        {error && <div className={styles.specialErrorMessage}>{error}</div>}

    </form>
  );
}
