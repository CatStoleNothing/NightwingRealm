import React from 'react';

// Современные стили для UI
export const modernStyles = {
  // Цветовая схема
  colors: {
    primary: '#6366f1', // Индиго
    secondary: '#8b5cf6', // Фиолетовый
    accent: '#f59e0b', // Янтарный
    success: '#10b981', // Изумрудный
    danger: '#ef4444', // Красный
    warning: '#f97316', // Оранжевый
    info: '#06b6d4', // Циан
    light: '#f8fafc', // Светло-серый
    dark: '#1e293b', // Темно-серый
    white: '#ffffff',
    black: '#000000',
    text: '#334155',
    textSecondary: '#64748b',
    background: '#f1f5f9',
    surface: '#ffffff',
    border: '#e2e8f0'
  },

  // Типографика
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem'
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700
    },
    heading: {
      fontSize: '2rem',
      fontWeight: 700,
      lineHeight: 1.2,
      margin: 0
    },
    subheading: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.3,
      margin: 0
    },
    title: {
      fontSize: '2rem',
      fontWeight: 700,
      lineHeight: 1.2,
      margin: 0,
      color: '#6366f1'
    },
    subtitle: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.3,
      margin: 0,
      color: '#374151'
    }
  },

  // Тени
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)'
  },

  // Скругления
  borderRadius: {
    none: '0',
    sm: '0.125rem',
    base: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    full: '9999px'
  },

  // Кнопки
  button: {
    base: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0.5rem 1rem',
      fontSize: '0.875rem',
      fontWeight: 500,
      borderRadius: '0.375rem',
      border: '1px solid transparent',
      cursor: 'pointer',
      transition: 'all 0.2s ease-in-out',
      textDecoration: 'none',
      minHeight: '2.5rem',
      gap: '0.5rem'
    },
    primary: {
      backgroundColor: '#6366f1',
      color: '#ffffff',
      borderColor: '#6366f1'
    },
    secondary: {
      backgroundColor: '#ffffff',
      color: '#374151',
      borderColor: '#d1d5db'
    },
    success: {
      backgroundColor: '#10b981',
      color: '#ffffff',
      borderColor: '#10b981'
    },
    danger: {
      backgroundColor: '#ef4444',
      color: '#ffffff',
      borderColor: '#ef4444'
    },
    ghost: {
      backgroundColor: 'transparent',
      color: '#6366f1',
      borderColor: 'transparent'
    }
  },

  // Карточки
  card: {
    base: {
      backgroundColor: '#ffffff',
      borderRadius: '0.5rem',
      border: '1px solid #e2e8f0',
      boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
      padding: '1rem'
    },
    header: {
      borderBottom: '1px solid #e2e8f0',
      paddingBottom: '0.75rem',
      marginBottom: '1rem'
    },
    body: {
      padding: '0'
    },
    footer: {
      borderTop: '1px solid #e2e8f0',
      paddingTop: '0.75rem',
      marginTop: '1rem'
    }
  },

  // Модальные окна
  modal: {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    },
    content: {
      backgroundColor: '#ffffff',
      borderRadius: '0.5rem',
      boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
      maxWidth: '500px',
      width: '100%',
      maxHeight: '90vh',
      overflow: 'auto'
    }
  },

  // Навигация
  navigation: {
    base: {
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #e2e8f0',
      padding: '0.75rem 1rem'
    },
    item: {
      padding: '0.5rem 0.75rem',
      borderRadius: '0.375rem',
      color: '#374151',
      textDecoration: 'none',
      transition: 'all 0.2s ease-in-out'
    }
  },

  // Формы
  form: {
    input: {
      width: '100%',
      padding: '0.5rem 0.75rem',
      fontSize: '0.875rem',
      border: '1px solid #d1d5db',
      borderRadius: '0.375rem',
      backgroundColor: '#ffffff',
      transition: 'border-color 0.2s ease-in-out'
    },
    label: {
      display: 'block',
      fontSize: '0.875rem',
      fontWeight: 500,
      color: '#374151',
      marginBottom: '0.25rem'
    }
  },

  // Сетка
  grid: {
    container: {
      display: 'grid',
      gap: '1rem'
    },
    cols1: { gridTemplateColumns: 'repeat(1, minmax(0, 1fr))' },
    cols2: { gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' },
    cols3: { gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' },
    cols4: { gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' },
    cols6: { gridTemplateColumns: 'repeat(6, minmax(0, 1fr))' },
    cols12: { gridTemplateColumns: 'repeat(12, minmax(0, 1fr))' }
  },

  // Адаптивные брейкпоинты
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px'
  }
};

// Компонент кнопки
export function Button({ 
  children, 
  variant = 'primary', 
  size = 'base', 
  disabled = false, 
  onClick, 
  className = '',
  ...props 
}) {
  const sizeStyles = {
    sm: { padding: '0.25rem 0.5rem', fontSize: '0.75rem' },
    base: { padding: '0.5rem 1rem', fontSize: '0.875rem' },
    lg: { padding: '0.75rem 1.5rem', fontSize: '1rem' }
  };

  const getHoverStyle = (variant) => {
    const hoverStyles = {
      primary: { backgroundColor: '#5855eb', borderColor: '#5855eb' },
      secondary: { backgroundColor: '#f9fafb', borderColor: '#9ca3af' },
      success: { backgroundColor: '#059669', borderColor: '#059669' },
      danger: { backgroundColor: '#dc2626', borderColor: '#dc2626' },
      ghost: { backgroundColor: '#f8fafc', color: '#5855eb' }
    };
    return hoverStyles[variant] || {};
  };

  const buttonStyle = {
    ...modernStyles.button.base,
    ...modernStyles.button[variant],
    ...sizeStyles[size],
    opacity: disabled ? 0.5 : 1,
    cursor: disabled ? 'not-allowed' : 'pointer'
  };

  return (
    <button
      style={buttonStyle}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={className}
      onMouseEnter={(e) => {
        if (!disabled) {
          Object.assign(e.target.style, getHoverStyle(variant));
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          Object.assign(e.target.style, {
            backgroundColor: modernStyles.button[variant].backgroundColor,
            color: modernStyles.button[variant].color,
            borderColor: modernStyles.button[variant].borderColor
          });
        }
      }}
      {...props}
    >
      {children}
    </button>
  );
}

// Компонент карточки
export function Card({ children, className = '', ...props }) {
  return (
    <div style={modernStyles.card.base} className={className} {...props}>
      {children}
    </div>
  );
}

// Компонент модального окна
export function Modal({ isOpen, onClose, children, title }) {
  if (!isOpen) return null;

  return (
    <div style={modernStyles.modal.overlay} onClick={onClose}>
      <div style={modernStyles.modal.content} onClick={e => e.stopPropagation()}>
        {title && (
          <div style={modernStyles.card.header}>
            <h3 style={{ margin: 0, fontSize: modernStyles.typography.fontSize.xl }}>
              {title}
            </h3>
          </div>
        )}
        <div style={modernStyles.card.body}>
          {children}
        </div>
      </div>
    </div>
  );
}

// Компонент навигации
export function Navigation({ items, activeItem, onItemClick }) {
  return (
    <nav style={modernStyles.navigation.base}>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {items.map(item => {
          const isActive = activeItem === item.id;
          return (
            <a
              key={item.id}
              href="#"
              onClick={e => {
                e.preventDefault();
                onItemClick(item.id);
              }}
              style={{
                ...modernStyles.navigation.item,
                ...(isActive && {
                  backgroundColor: modernStyles.colors.primary,
                  color: modernStyles.colors.white
                })
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.target.style.backgroundColor = modernStyles.colors.light;
                  e.target.style.color = modernStyles.colors.dark;
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = modernStyles.colors.text;
                }
              }}
            >
              {item.icon && <span style={{ marginRight: '0.5rem' }}>{item.icon}</span>}
              {item.label}
            </a>
          );
        })}
      </div>
    </nav>
  );
}

// Компонент прогресс-бара
export function ProgressBar({ value, max = 100, color = 'primary', label }) {
  const percentage = Math.min((value / max) * 100, 100);
  const colorMap = {
    primary: modernStyles.colors.primary,
    success: modernStyles.colors.success,
    danger: modernStyles.colors.danger,
    warning: modernStyles.colors.warning
  };

  return (
    <div style={{ width: '100%' }}>
      {label && (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          marginBottom: '0.25rem',
          fontSize: modernStyles.typography.fontSize.sm,
          color: modernStyles.colors.textSecondary
        }}>
          <span>{label}</span>
          <span>{value}/{max}</span>
        </div>
      )}
      <div style={{
        width: '100%',
        height: '0.5rem',
        backgroundColor: modernStyles.colors.border,
        borderRadius: modernStyles.borderRadius.full,
        overflow: 'hidden'
      }}>
        <div style={{
          width: `${percentage}%`,
          height: '100%',
          backgroundColor: colorMap[color],
          transition: 'width 0.3s ease-in-out'
        }} />
      </div>
    </div>
  );
}

// Компонент иконки
export function Icon({ icon, size = 'base', color = 'currentColor' }) {
  const sizeMap = {
    sm: '0.875rem',
    base: '1rem',
    lg: '1.25rem',
    xl: '1.5rem'
  };

  return (
    <span style={{
      fontSize: sizeMap[size],
      color: color,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {icon}
    </span>
  );
}

// Хук для адаптивного дизайна
export function useResponsive() {
  const [isMobile, setIsMobile] = React.useState(false);
  const [isTablet, setIsTablet] = React.useState(false);
  const [isDesktop, setIsDesktop] = React.useState(false);

  React.useEffect(() => {
    const checkSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
      setIsDesktop(width >= 1024);
    };

    checkSize();
    window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize);
  }, []);

  return { isMobile, isTablet, isDesktop };
} 