"use client"
import React, { useState } from 'react'
import { Button, Modal, Alert } from "react-bootstrap";
import { createClient } from '@/lib/supabaseBrowser';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
    const supabase = createClient();
    const router = useRouter();
    const [show, setShow] = useState(false);

    const [logoutLoading, setLogoutLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleLogout = async () => {
        setLogoutLoading(true);
        setError(null);
        
        const { error } = await supabase.auth.signOut();
        
        if (error) {
            console.error("Logout failed", error);
            setError("Logout failed. Please try again.");
            setLogoutLoading(false);
        } else {
            // Clear any remaining local storage items
            if (typeof window !== 'undefined') {
                // Clear Supabase-related items from localStorage
                Object.keys(localStorage).forEach(key => {
                    if (key.startsWith('sb-')) {
                        localStorage.removeItem(key);
                    }
                });
            }
            
            setLogoutLoading(false);
            handleClose();
            
            // Refresh the router to update server state
            router.refresh();
            // Redirect to signup page after logout
            router.push('/signup');
        }
    }

    return (
        <div>
            <Button variant="danger" onClick={handleShow}>
                Logout
            </Button>

            <Modal show={show}
                onHide={handleClose}
                centered
                backdrop="static"
            >
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Logout</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ textAlign: 'center' }}>
                    Are you sure you want to logout?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button
                        variant="danger"
                        onClick={handleLogout}
                        disabled={logoutLoading}>
                        {logoutLoading ? "Logging out..." : "Logout"}
                    </Button>
                </Modal.Footer>
            </Modal>

            {error && <Alert variant="danger">{error}</Alert>}
        </div>
    )
}
