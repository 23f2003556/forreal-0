"use client"

import React, { useEffect } from 'react';

export function LandingPage() {
    // Optional: listen for messages from the iframe if it needs to communicate with the parent Next.js app
    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            // For example, if the iframe sends a message to navigate to /login
            if (event.data === 'navigate_login') {
                window.location.href = '/login';
            }
        };
        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    return (
        <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
            <iframe 
                src="/landing.html" 
                style={{ width: '100%', height: '100%', border: 'none' }} 
                title="Forreal Landing"
            />
        </div>
    );
}

export default LandingPage;
