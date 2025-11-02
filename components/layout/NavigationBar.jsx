"use client";
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import styles from './NavigationBar.module.css';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { createClient } from '@/lib/supabaseBrowser';
import LanguageToggle from '../ui/LanguageToggle';


const NavigationBar = () => {
    const supabase = createClient();
    // Get current pathname
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);

    // Auth state
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Track clicked link for immediate visual feedback
    const [clickedPath, setClickedPath] = useState(null);

    useEffect(() => {
        setMounted(true);

        // Get initial user - use getUser() instead of getSession() for accurate auth state
        const checkUser = async () => {
            const { data: { user }, error } = await supabase.auth.getUser();
            setUser(error ? null : user);
            setLoading(false);
        };

        checkUser();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    // Reset clickedPath when pathname changes (navigation completed)
    useEffect(() => {
        if (clickedPath && pathname === clickedPath) {
            setClickedPath(null);
        }
    }, [pathname, clickedPath]);

    // Handle link clicks for immediate visual feedback
    const handleNavClick = (path) => {
        setClickedPath(path);
        handleClose();
    };

    // Offcanvas state
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    // Navbar scroll state
    const [showNavbar, setShowNavbar] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    // This useEffect hook adds a scroll event listener to control the navbar's visibility.
    useEffect(() => {
        // The controlNavbar function is called whenever the user scrolls.
        const controlNavbar = () => {
            // Check if the window object is available (ensuring it's running in the browser).
            if (typeof window !== 'undefined') {
                // If the user scrolls down (current scroll position is greater than the last one),
                // hide the navbar.
                if (window.scrollY > lastScrollY) { // if scroll down hide the navbar
                    setShowNavbar(false);
                } else { // if scroll up show the navbar
                    setShowNavbar(true);
                }
                // console.log("lastScrollY on Nav", lastScrollY);

                // Update the last scroll position to the current one.
                setLastScrollY(window.scrollY);
            }
        };

        // Check if window is defined before adding the event listener.
        if (typeof window !== 'undefined') {
            // Add the scroll event listener.
            window.addEventListener('scroll', controlNavbar);

            // The cleanup function is returned from useEffect.
            // It's called when the component unmounts or before the effect re-runs.
            return () => {
                // Remove the scroll event listener to prevent memory leaks.
                window.removeEventListener('scroll', controlNavbar);
            };
        }
    }, [lastScrollY]); // The effect depends on lastScrollY to compare scroll positions.

    return (
        <div>
            <Navbar bg="light" expand="lg"
                className={`shadow-sm fixed-top ${showNavbar ? styles.navbarShow : styles.navbarHide}`}>
                <Container>
                    <Navbar.Brand href="/">
                        <Image
                            src="/logo1.png"
                            width="40"
                            height="40"
                            className="d-inline-block align-top"
                            alt="SQL Kernel"
                        />
                        {/* lower the name along y axis */}
                        <div style={{ display: 'inline-block', transform: 'translateY(4px)', marginLeft: '8px', fontSize: '22px', fontWeight: '600' }}>
                            {' SQL Kernel'}
                        </div>
                    </Navbar.Brand>

                    <Navbar.Toggle onClick={handleShow} aria-controls="offcanvasNavbar-expand-lg" />
                    <Navbar.Offcanvas
                        id="offcanvasNavbar-expand-lg"
                        aria-labelledby="offcanvasNavbarLabel-expand-lg"
                        placement="end"
                        show={show}
                        onHide={handleClose}
                    >
                        <Offcanvas.Header closeButton>
                            <Offcanvas.Title id="offcanvasNavbarLabel-expand-lg">
                                Menu
                            </Offcanvas.Title>
                        </Offcanvas.Header>
                        <Offcanvas.Body>
                            <Nav style={{ fontSize: '1.1rem' }}
                                className="
                                    ms-auto        /* push to right on large screens */
                                    flex-lg-row    /* horizontal on large screens */
                                    flex-column    /* vertical on small screens */
                                    align-items-lg-end  /* right align on large */
                                    align-items-center  /* center align on small */
                                    gap-1
                                "
                            >
                                <Nav.Link as={Link} href="/"
                                    onClick={() => handleNavClick('/')}
                                    className={`${styles.navLink}${mounted && (pathname === '/' || clickedPath === '/') ? ' ' + styles.active : ''}`}>
                                    Home
                                </Nav.Link>
                                <Nav.Link as={Link} href="/learn/modules"
                                    onClick={() => handleNavClick('/learn/modules')}
                                    className={`${styles.navLink}${mounted && (pathname?.startsWith('/learn/modules') || clickedPath === '/learn/modules') ? ' ' + styles.active : ''}`}>
                                    Modules
                                </Nav.Link>

                                {/* Show Signup only when user is NOT logged in */}
                                {!loading && !user && (
                                    <Nav.Link as={Link}
                                        href="/signup"
                                        onClick={() => handleNavClick('/signup')}
                                        className={`${styles.navLink}${mounted && (pathname === '/signup' || clickedPath === '/signup') ? ' ' + styles.active : ''}`}>
                                        Signup
                                    </Nav.Link>
                                )}

                                {/* Show Profile with masked email (before @) when user IS logged in */}
                                {!loading && user && (
                                    <Nav.Link as={Link}
                                        href="/dashboard/profile"
                                        onClick={() => handleNavClick('/dashboard/profile')}
                                        className={`${styles.navLink}${mounted && (pathname === '/dashboard/profile' || clickedPath === '/dashboard/profile') ? ' ' + styles.active : ''}`}>
                                        <i className="fi fi-rr-user" style={{ marginRight: '6px' }}></i>
                                        {user?.email?.split('@')[0] ?? 'Profile'}
                                    </Nav.Link>
                                )}
                                <Navbar.Text onClick={handleClose}>
                                    <LanguageToggle />
                                </Navbar.Text>
                            </Nav>
                        </Offcanvas.Body>
                    </Navbar.Offcanvas>
                </Container>
            </Navbar>
        </div>
    );
}

export default NavigationBar;