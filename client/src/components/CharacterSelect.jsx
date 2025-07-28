import React, { useState, useEffect } from 'react';
import { modernStyles } from './ModernUI';

export function CharacterSelect({ onCharacterSelect, onLogout }) {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: '',
    class: 'warrior'
  });

  const API_BASE_URL = 'http://localhost:3001/api';
  const token = localStorage.getItem('authToken');

  const characterClasses = [
    { id: 'warrior', name: 'Воин', description: 'Сильный боец с высокой защитой', icon: '⚔️' },
    { id: 'mage', name: 'Маг', description: 'Мощный заклинатель', icon: '🔮' },
    { id: 'rogue', name: 'Разбойник', description: 'Ловкий и быстрый', icon: '🗡️' },
    { id: 'hunter', name: 'Охотник', description: 'Мастер дальнего боя', icon: '🏹' }
  ];

  useEffect(() => {
    loadCharacters();
  }, []);

  const loadCharacters = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/characters`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Ошибка загрузки персонажей');
      }

      const data = await response.json();
      setCharacters(data.characters);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCharacter = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/characters`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(createForm),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка создания персонажа');
      }

      // Перезагружаем список персонажей
      await loadCharacters();
      setShowCreateForm(false);
      setCreateForm({ name: '', class: 'warrior' });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCharacter = async (characterId) => {
    if (!confirm('Вы уверены, что хотите удалить этого персонажа? Это действие нельзя отменить.')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/characters/${characterId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Ошибка удаления персонажа');
      }

      await loadCharacters();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleCharacterSelect = async (characterId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/characters/${characterId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Ошибка загрузки персонажа');
      }

      const data = await response.json();
      onCharacterSelect(data.character);
    } catch (error) {
      setError(error.message);
    }
  };

  const renderCharacter = (character) => {
    const characterClass = characterClasses.find(c => c.id === character.class);
    const lastPlayed = new Date(character.lastPlayed).toLocaleDateString('ru-RU');

    return (
      <div key={character.id} style={{
        background: modernStyles.colors.surface,
        border: `2px solid ${modernStyles.colors.secondary}`,
        borderRadius: '8px',
        padding: '16px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        position: 'relative'
      }}
      onClick={() => handleCharacterSelect(character.id)}
      onMouseEnter={(e) => {
        e.target.style.transform = 'scale(1.02)';
        e.target.style.boxShadow = '0 0 8px rgba(218,165,32,0.6)';
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = 'scale(1)';
        e.target.style.boxShadow = 'none';
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <span style={{ fontSize: '24px' }}>{characterClass?.icon}</span>
          <div style={{ flex: 1 }}>
            <div style={{ color: modernStyles.colors.text, fontWeight: 'bold', fontSize: '18px' }}>
              {character.name}
            </div>
            <div style={{ color: modernStyles.colors.textSecondary }}>
              {characterClass?.name} • Уровень {character.level}
            </div>
          </div>
        </div>
        
        <div style={{ color: modernStyles.colors.textSecondary, fontSize: '12px', marginBottom: '8px' }}>
          Последняя игра: {lastPlayed}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteCharacter(character.id);
          }}
          style={{
            backgroundColor: modernStyles.colors.white,
            color: modernStyles.colors.text,
            border: `1px solid ${modernStyles.colors.border}`,
            borderRadius: '4px',
            padding: '4px 8px',
            fontSize: '12px',
            position: 'absolute',
            top: '8px',
            right: '8px',
            cursor: 'pointer'
          }}
        >
          Удалить
        </button>
      </div>
    );
  };

  const renderCreateForm = () => (
    <div style={{
      background: modernStyles.colors.surface,
      border: `2px solid ${modernStyles.colors.accent}`,
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '16px'
    }}>
      <h3 style={modernStyles.subtitle}>Создать персонажа</h3>
      <form onSubmit={handleCreateCharacter} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div>
          <label style={{ color: modernStyles.colors.text, display: 'block', marginBottom: '4px' }}>
            Имя персонажа:
          </label>
          <input
            type="text"
            value={createForm.name}
            onChange={(e) => setCreateForm(prev => ({ ...prev, name: e.target.value }))}
            required
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: `1px solid ${modernStyles.colors.secondary}`,
              background: modernStyles.colors.background,
              color: modernStyles.colors.text
            }}
          />
        </div>

        <div>
          <label style={{ color: modernStyles.colors.text, display: 'block', marginBottom: '4px' }}>
            Класс:
          </label>
          <select
            value={createForm.class}
            onChange={(e) => setCreateForm(prev => ({ ...prev, class: e.target.value }))}
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: `1px solid ${modernStyles.colors.secondary}`,
              background: modernStyles.colors.background,
              color: modernStyles.colors.text
            }}
          >
            {characterClasses.map(cls => (
              <option key={cls.id} value={cls.id}>
                {cls.icon} {cls.name} - {cls.description}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: modernStyles.colors.primary,
              color: modernStyles.colors.white,
              border: `1px solid ${modernStyles.colors.primary}`,
              borderRadius: '4px',
              padding: '8px 16px',
              flex: 1,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Создание...' : 'Создать'}
          </button>
          <button
            type="button"
            onClick={() => setShowCreateForm(false)}
            style={{
              backgroundColor: modernStyles.colors.white,
              color: modernStyles.colors.text,
              border: `1px solid ${modernStyles.colors.border}`,
              borderRadius: '4px',
              padding: '8px 16px',
              cursor: 'pointer'
            }}
          >
            Отмена
          </button>
        </div>
      </form>
    </div>
  );

  if (loading && characters.length === 0) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.9)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      }}>
        <div style={{ color: modernStyles.colors.text, fontSize: '18px' }}>
          Загрузка персонажей...
        </div>
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.9)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        background: modernStyles.colors.background,
        border: `3px solid ${modernStyles.colors.primary}`,
        borderRadius: '12px',
        padding: '32px',
        maxWidth: '600px',
        width: '90%',
        maxHeight: '80vh',
        overflowY: 'auto',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h1 style={modernStyles.title}>Выбор персонажа</h1>
          <button
            onClick={onLogout}
            style={{
              backgroundColor: modernStyles.colors.white,
              color: modernStyles.colors.text,
              border: `1px solid ${modernStyles.colors.border}`,
              borderRadius: '8px',
              padding: '8px 16px',
              cursor: 'pointer'
            }}
          >
            Выйти
          </button>
        </div>

        {error && (
          <div style={{ 
            color: modernStyles.colors.danger, 
            padding: '8px', 
            borderRadius: '4px',
            background: 'rgba(220, 20, 60, 0.2)',
            border: `1px solid ${modernStyles.colors.danger}`,
            marginBottom: '16px'
          }}>
            {error}
          </div>
        )}

        {showCreateForm ? (
          renderCreateForm()
        ) : (
          <button
            onClick={() => setShowCreateForm(true)}
            disabled={characters.length >= 3}
            style={{
              backgroundColor: modernStyles.colors.primary,
              color: modernStyles.colors.white,
              border: `1px solid ${modernStyles.colors.primary}`,
              borderRadius: '8px',
              padding: '12px 24px',
              marginBottom: '24px',
              opacity: characters.length >= 3 ? 0.5 : 1,
              cursor: characters.length >= 3 ? 'not-allowed' : 'pointer'
            }}
          >
            {characters.length >= 3 ? 'Достигнут лимит персонажей (3)' : 'Создать персонажа'}
          </button>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {characters.length === 0 ? (
            <div style={{ 
              color: modernStyles.colors.textSecondary, 
              textAlign: 'center', 
              padding: '40px',
              fontStyle: 'italic'
            }}>
              У вас пока нет персонажей. Создайте первого!
            </div>
          ) : (
            characters.map(renderCharacter)
          )}
        </div>
      </div>
    </div>
  );
} 