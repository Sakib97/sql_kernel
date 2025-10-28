"use client";
import React, { useState } from 'react';
import styles from './Form.module.css';
import { useFormik } from 'formik';
import { LoginSchema } from '../../../schemas/LoginSchema';
import { createClient } from '@/lib/supabaseBrowser';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const supabase = createClient();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: LoginSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) {
        setError(error.message);
        setLoading(false);
      } else {
        // Login successful - refresh the page to update session and redirect
        router.refresh();
        router.push('/dashboard/profile');
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
        name='email'
        placeholder="you@example.com"
        autoComplete="email"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.email} />
      {formik.touched.email && formik.errors.email &&
        <div className={styles.errorMessage}>
          {formik.errors.email}
        </div>}

      <label className={styles.formLabel} htmlFor="password">Password*</label>
      <div className={styles.passwordWrapper}>
        <input
          className={`${styles.formInput} ${formik.touched.password && formik.errors.password ? styles.errorInput : ''}`}
          type={showPassword ? 'text' : 'password'}
          id="password"
          name='password'
          placeholder="••••••••"
          autoComplete="current-password"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.password}
        />
        <button
          type="button"
          className={styles.togglePassword}
          onClick={() => setShowPassword(!showPassword)}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          <i className={showPassword ? 'fi fi-rr-eye-crossed' : 'fi fi-rr-eye'}></i>
        </button>
      </div>
      {formik.touched.password && formik.errors.password &&
        <div className={styles.errorMessage}>
          {formik.errors.password}
        </div>}

      <button type="submit"
      // dirty is false when the form values match the initial values exactly
      // dirty checks if the user has made any changes to the form
      // isValid checks if there are no validation errors
        disabled={loading || formik.isSubmitting || !(formik.isValid && formik.dirty)}
        className={styles.primaryButton}>
        {loading ? 'Logging in...' : 'Log In'}
      </button>

      {error && <div className={styles.specialErrorMessage}>{error}</div>}

      <div className={styles.forgotPasswordBox}>
        <a href="#" className={styles.forgotPassword}>Forgot password?</a>
      </div>
    </form>
  );
}
