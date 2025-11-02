import React from 'react'

export default function LoadingIcon({ text = 'Loading...'}) {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            // minHeight: '100vh',
            fontSize: '15px',
            color: '#6b7280',
            fontFamily: 'var(--font-domine)',
            flexDirection: 'column',
            gap: '16px'
        }}>
            <div style={{
                width: '25px',
                height: '25px',
                border: '3px solid #e5e7eb',
                borderTop: '3px solid #667eea',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
            }} />
            <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
            <span>{text}</span>
        </div>
    )
}
