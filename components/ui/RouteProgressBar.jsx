"use client";
import { useEffect, useRef, useState } from "react";

// usePathname is used to detect route changes
import { usePathname } from "next/navigation";
import styles from "./RouteProgressBar.module.css";
import { showToast } from "./CustomToast";

/**
 * RouteProgressBar
 * - Shows a thin progress bar just below the fixed navbar during client navigations
 * - Starts on link clicks to internal routes; completes when pathname changes
 * - Falls back with a max timeout so it never gets stuck
 */
export default function RouteProgressBar({
  height = 3,
  color = "#0d6efd", // Bootstrap primary
  shadow = true,
  maxDurationMs = 15000, // max duration before auto-complete , default 15s
}) {
  const pathname = usePathname();

  const [progress, setProgress] = useState(0); // progress percentage 0-100
  const [visible, setVisible] = useState(false); // visibility state
  const [topOffset, setTopOffset] = useState(0); // where to place bar

  // Helper: measure where the progress bar should start (below visible navbar, else 0)
  const measureTopOffset = () => {
    if (typeof document === "undefined") return 0;
    // Be flexible with selector: navbar stays fixed but may slide out of view
    const nav =
      document.querySelector("nav.navbar") ||
      document.querySelector("nav.navbar.fixed-top");
    if (!nav) return 0;

    const rect = nav.getBoundingClientRect();
    // If navbar is fixed at top and visible, rect.top will be <= 0 and rect.bottom > 0
    // When it is hidden via translateY(-100%), rect.bottom will be <= 0
    if (rect.top <= 0 && rect.bottom > 0) return rect.bottom; // place bar just below the visible navbar
    return 0; // otherwise pin to the very top of viewport
  };

  const timerRef = useRef(null); // controls progress animation
  const maxTimerRef = useRef(null); // max duration timer
  const lastPathRef = useRef(pathname); // last pathname for comparison

  // Measure navbar visibility/position and set offset accordingly
  useEffect(() => {
    const updateOffset = () => setTopOffset(measureTopOffset());

    updateOffset();
    window.addEventListener("resize", updateOffset);
    window.addEventListener("orientationchange", updateOffset);
    window.addEventListener("scroll", updateOffset, { passive: true });
    return () => {
      window.removeEventListener("resize", updateOffset);
      window.removeEventListener("orientationchange", updateOffset);
      window.removeEventListener("scroll", updateOffset);
    };
  }, []);

  // Begin progress on internal link clicks or custom events
  useEffect(() => {
    const onClick = (e) => {
      // Only respond to primary-button, non-modified clicks
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const anchor = e.target?.closest?.("a[href]");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;
      // Ignore external, same-page, and special links
      if (href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return;
      try {
        const url = new URL(href, window.location.href);
        if (url.origin !== window.location.origin) return; // external
        if (url.pathname === window.location.pathname && url.search === window.location.search) return; // same route
      } catch (_) {
        // If URL parsing fails, do nothing
        return;
      }
      startProgress();
    };

    const onCustomStart = () => startProgress();

    document.addEventListener("click", onClick, true);
    window.addEventListener("app:navigation-start", onCustomStart);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("app:navigation-start", onCustomStart);
    };
  }, []);

  // Complete when pathname changes (navigation committed)
  useEffect(() => {
    if (lastPathRef.current !== pathname) {
      finishProgress();
      lastPathRef.current = pathname;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const startProgress = () => {
    // Reset any prior timers
    clearInterval(timerRef.current);
    clearTimeout(maxTimerRef.current);

    // Re-measure in case the navbar state changed just before navigation
    setTopOffset(measureTopOffset());

    setVisible(true);
    setProgress(10); // initial kick

    // Fake incremental progress towards 90%
    timerRef.current = setInterval(() => {
      setProgress((p) => {
        if (p >= 90) return p;
        // Slow down as we approach 90
        const delta = Math.max(0.5, (90 - p) * 0.03);
        return Math.min(p + delta, 90);
      });
    }, 150);

    // Safety timer so the bar never gets stuck forever
    // If we hit maxDuration without route commit, show a warning toast
    maxTimerRef.current = setTimeout(() => {
      showToast('Loading took longer than expected, please try again !', 'exclamation');
      finishProgress();
    }, maxDurationMs);
  };

  const finishProgress = () => {
    clearInterval(timerRef.current);
    clearTimeout(maxTimerRef.current);

    setProgress(100);
    // Give CSS a moment to render 100% width, then hide
    setTimeout(() => {
      setVisible(false);
      setProgress(0);
    }, 250);
  };

  if (!visible && progress === 0) return null;

  return (
    <div
      className={styles.wrapper}
      style={{ top: topOffset, height }}
      aria-hidden
    >
      <div
        className={`${styles.bar} ${shadow ? styles.shadow : ""}`}
        style={{ width: `${progress}%`, backgroundColor: color, height }}
      />
    </div>
  );
}
