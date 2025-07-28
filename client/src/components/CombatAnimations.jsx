import React, { useState, useEffect } from 'react';

// Анимация удара
export function StrikeAnimation({ isVisible, position, type = 'normal' }) {
  const [animation, setAnimation] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setAnimation(true);
      setTimeout(() => setAnimation(false), 500);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  const styles = {
    position: 'absolute',
    left: position.x,
    top: position.y,
    width: '60px',
    height: '60px',
    pointerEvents: 'none',
    zIndex: 1000,
    animation: animation ? 'strike 0.5s ease-out' : 'none',
  };

  const colors = {
    normal: '#FFD700',
    crit: '#FF0000',
    fire: '#FF4500',
    electric: '#00FFFF',
    water: '#4169E1',
  };

  return (
    <div style={styles}>
      <svg width="60" height="60" viewBox="0 0 60 60">
        <defs>
          <radialGradient id={`strike-${type}`}>
            <stop offset="0%" stopColor={colors[type]} stopOpacity="1" />
            <stop offset="100%" stopColor={colors[type]} stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="30" cy="30" r="25" fill={`url(#strike-${type})`} />
        <path d="M15 15 L45 45 M45 15 L15 45" stroke={colors[type]} strokeWidth="3" />
      </svg>
      <style>
        {`
          @keyframes strike {
            0% { transform: scale(0); opacity: 1; }
            50% { transform: scale(1.5); opacity: 0.8; }
            100% { transform: scale(2); opacity: 0; }
          }
        `}
      </style>
    </div>
  );
}

// Анимация эффекта
export function EffectAnimation({ effect, isVisible, position }) {
  const [animation, setAnimation] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setAnimation(true);
      setTimeout(() => setAnimation(false), 2000);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  const effectStyles = {
    poison: { color: '#32CD32', symbol: '☠' },
    burn: { color: '#FF4500', symbol: '🔥' },
    shock: { color: '#00FFFF', symbol: '⚡' },
    bleed: { color: '#DC143C', symbol: '💧' },
    curse: { color: '#8B008B', symbol: '👻' },
    regen: { color: '#228B22', symbol: '✨' },
  };

  const style = effectStyles[effect] || { color: '#FFD700', symbol: '✨' };

  return (
    <div style={{
      position: 'absolute',
      left: position.x,
      top: position.y,
      fontSize: '24px',
      color: style.color,
      pointerEvents: 'none',
      zIndex: 999,
      animation: animation ? 'effect 2s ease-out' : 'none',
    }}>
      {style.symbol}
      <style>
        {`
          @keyframes effect {
            0% { transform: translateY(0) scale(1); opacity: 1; }
            50% { transform: translateY(-20px) scale(1.2); opacity: 0.8; }
            100% { transform: translateY(-40px) scale(0.8); opacity: 0; }
          }
        `}
      </style>
    </div>
  );
}

// Анимация урона
export function DamageAnimation({ damage, isVisible, position, isCrit = false }) {
  const [animation, setAnimation] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setAnimation(true);
      setTimeout(() => setAnimation(false), 1000);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div style={{
      position: 'absolute',
      left: position.x,
      top: position.y,
      fontSize: isCrit ? '20px' : '16px',
      fontWeight: 'bold',
      color: isCrit ? '#FF0000' : '#FFD700',
      pointerEvents: 'none',
      zIndex: 998,
      animation: animation ? 'damage 1s ease-out' : 'none',
      textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
    }}>
      {damage}
      <style>
        {`
          @keyframes damage {
            0% { transform: translateY(0) scale(1); opacity: 1; }
            50% { transform: translateY(-15px) scale(1.1); opacity: 0.8; }
            100% { transform: translateY(-30px) scale(0.9); opacity: 0; }
          }
        `}
      </style>
    </div>
  );
}

// Анимация промаха
export function MissAnimation({ isVisible, position }) {
  const [animation, setAnimation] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setAnimation(true);
      setTimeout(() => setAnimation(false), 800);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div style={{
      position: 'absolute',
      left: position.x,
      top: position.y,
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#87CEEB',
      pointerEvents: 'none',
      zIndex: 998,
      animation: animation ? 'miss 0.8s ease-out' : 'none',
      textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
    }}>
      Промах!
      <style>
        {`
          @keyframes miss {
            0% { transform: translateY(0) scale(1); opacity: 1; }
            50% { transform: translateY(-10px) scale(1.1); opacity: 0.8; }
            100% { transform: translateY(-20px) scale(0.9); opacity: 0; }
          }
        `}
      </style>
    </div>
  );
}

// Анимация уклонения
export function DodgeAnimation({ isVisible, position }) {
  const [animation, setAnimation] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setAnimation(true);
      setTimeout(() => setAnimation(false), 600);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div style={{
      position: 'absolute',
      left: position.x,
      top: position.y,
      fontSize: '16px',
      fontWeight: 'bold',
      color: '#90EE90',
      pointerEvents: 'none',
      zIndex: 998,
      animation: animation ? 'dodge 0.6s ease-out' : 'none',
      textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
    }}>
      Уклонение!
      <style>
        {`
          @keyframes dodge {
            0% { transform: translateX(-10px) scale(1); opacity: 1; }
            50% { transform: translateX(10px) scale(1.1); opacity: 0.8; }
            100% { transform: translateX(20px) scale(0.9); opacity: 0; }
          }
        `}
      </style>
    </div>
  );
} 