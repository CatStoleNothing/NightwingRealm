// Стили в духе славянских сказок
export const slavicStyles = {
  // Цветовая палитра
  colors: {
    primary: '#8B0000',      // Тёмно-красный
    secondary: '#2F4F4F',    // Тёмно-серый
    accent: '#DAA520',       // Золотой
    background: '#1a0f0f',   // Тёмно-коричневый
    surface: '#2d1b1b',      // Коричневый
    text: '#F5DEB3',         // Пшеничный
    textSecondary: '#DEB887', // Бургундский
    success: '#228B22',      // Зелёный
    danger: '#DC143C',       // Малиновый
    warning: '#FFD700',      // Золотой
    info: '#87CEEB',         // Небесно-голубой
  },

  // Общие стили
  container: {
    background: 'linear-gradient(135deg, #1a0f0f 0%, #2d1b1b 100%)',
    color: '#F5DEB3',
    fontFamily: '"Times New Roman", serif',
    minHeight: '100vh',
    padding: '20px',
  },

  // Заголовки
  title: {
    color: '#DAA520',
    fontSize: '2.5rem',
    fontWeight: 'bold',
    textAlign: 'center',
    textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
    marginBottom: '20px',
    fontFamily: '"Times New Roman", serif',
  },

  subtitle: {
    color: '#DEB887',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginBottom: '15px',
    textShadow: '1px 1px 2px rgba(0,0,0,0.6)',
  },

  // Панели
  panel: {
    background: 'linear-gradient(145deg, #2d1b1b 0%, #3d2b2b 100%)',
    border: '2px solid #8B0000',
    borderRadius: '8px',
    padding: '16px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.5)',
  },

  // Кнопки
  button: {
    primary: {
      background: 'linear-gradient(145deg, #8B0000 0%, #A0522D 100%)',
      color: '#F5DEB3',
      border: '2px solid #DAA520',
      borderRadius: '6px',
      padding: '10px 20px',
      fontSize: '16px',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
      ':hover': {
        background: 'linear-gradient(145deg, #A0522D 0%, #8B0000 100%)',
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 8px rgba(0,0,0,0.4)',
      },
    },
    secondary: {
      background: 'linear-gradient(145deg, #2F4F4F 0%, #4A5D5D 100%)',
      color: '#F5DEB3',
      border: '2px solid #696969',
      borderRadius: '6px',
      padding: '8px 16px',
      fontSize: '14px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    },
    success: {
      background: 'linear-gradient(145deg, #228B22 0%, #32CD32 100%)',
      color: '#F5DEB3',
      border: '2px solid #90EE90',
      borderRadius: '6px',
      padding: '12px 24px',
      fontSize: '18px',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    },
  },

  // Статус-бары
  statusBar: {
    container: {
      background: '#1a0f0f',
      border: '2px solid #8B0000',
      borderRadius: '4px',
      padding: '8px',
      marginBottom: '8px',
    },
    label: {
      color: '#DEB887',
      fontSize: '14px',
      fontWeight: 'bold',
      marginBottom: '4px',
    },
    bar: {
      background: '#2F4F4F',
      borderRadius: '2px',
      height: '20px',
      position: 'relative',
      overflow: 'hidden',
    },
    fill: {
      height: '100%',
      transition: 'width 0.3s ease',
    },
    health: {
      background: 'linear-gradient(90deg, #DC143C 0%, #FF6347 100%)',
    },
    stamina: {
      background: 'linear-gradient(90deg, #DAA520 0%, #FFD700 100%)',
    },
    mana: {
      background: 'linear-gradient(90deg, #4169E1 0%, #87CEEB 100%)',
    },
  },

  // Лог боя
  combatLog: {
    container: {
      background: '#1a0f0f',
      border: '2px solid #8B0000',
      borderRadius: '8px',
      padding: '16px',
      maxHeight: '200px',
      overflowY: 'auto',
      marginBottom: '16px',
    },
    entry: {
      color: '#DEB887',
      fontSize: '14px',
      marginBottom: '4px',
      padding: '2px 0',
    },
    highlight: {
      color: '#FFD700',
      fontSize: '16px',
      fontWeight: 'bold',
      textShadow: '0 0 4px rgba(255,215,0,0.5)',
    },
  },

  // Зоны атаки/защиты
  zoneButton: {
    base: {
      margin: '4px',
      borderRadius: '6px',
      border: '2px solid',
      padding: '8px 16px',
      fontSize: '14px',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      textShadow: '1px 1px 2px rgba(0,0,0,0.6)',
    },
    attack: {
      background: 'linear-gradient(145deg, #DC143C 0%, #FF6347 100%)',
      borderColor: '#8B0000',
      color: '#F5DEB3',
      ':hover': {
        background: 'linear-gradient(145deg, #FF6347 0%, #DC143C 100%)',
        transform: 'scale(1.05)',
      },
    },
    defense: {
      background: 'linear-gradient(145deg, #4169E1 0%, #87CEEB 100%)',
      borderColor: '#2F4F4F',
      color: '#F5DEB3',
      ':hover': {
        background: 'linear-gradient(145deg, #87CEEB 0%, #4169E1 100%)',
        transform: 'scale(1.05)',
      },
    },
    selected: {
      boxShadow: '0 0 10px rgba(218,165,32,0.8)',
      transform: 'scale(1.1)',
    },
  },

  // Эффекты
  effects: {
    container: {
      marginTop: '8px',
      fontSize: '12px',
    },
    label: {
      color: '#DAA520',
      fontWeight: 'bold',
      marginBottom: '4px',
    },
    effect: {
      color: '#FFD700',
      fontSize: '11px',
      marginBottom: '2px',
    },
  },

  // Сопротивления
  resistances: {
    container: {
      marginTop: '8px',
      fontSize: '12px',
    },
    label: {
      color: '#87CEEB',
      fontWeight: 'bold',
      marginBottom: '4px',
    },
    resistance: {
      color: '#90EE90',
      fontSize: '11px',
      marginBottom: '2px',
    },
  },
}; 