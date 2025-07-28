import React from 'react';

export default function TestApp() {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      color: '#ffffff',
      fontFamily: 'Inter, sans-serif'
    }}>
      <div style={{
        textAlign: 'center',
        padding: '2rem'
      }}>
        <h1 style={{
          fontSize: '3rem',
          fontWeight: 700,
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '1rem'
        }}>
          NightwingRealm
        </h1>
        <p style={{
          fontSize: '1.25rem',
          color: '#94a3b8',
          marginBottom: '2rem'
        }}>
          Славянская RPG в мире Новгорода
        </p>
        <div style={{
          padding: '1rem',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <p>React приложение работает!</p>
          <p>Время загрузки: {new Date().toLocaleTimeString()}</p>
        </div>
      </div>
    </div>
  );
} 