import React, { useState } from 'react';

const ZONES = [
  { key: 'head', label: 'Голова' },
  { key: 'body', label: 'Тело' },
  { key: 'legs', label: 'Ноги' },
];

export function CombatScreen({ player, enemy, onTurn }) {
  const [attackZone, setAttackZone] = useState('head');
  const [blockZone, setBlockZone] = useState('body');

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'stretch', minHeight: 320 }}>
      {/* Статус игрока */}
      <div style={{ width: 200, background: '#222', color: '#fff', padding: 16, borderRadius: 8, marginRight: 16 }}>
        <h3>Вы (Тень)</h3>
        <div>Здоровье: {player.hp}</div>
        <div>Выносливость: {player.stamina}</div>
        <div>Мана: {player.mana}</div>
        <div>Сила: {player.stats.str}</div>
        <div>Ловкость: {player.stats.agi}</div>
        <div>Интеллект: {player.stats.int}</div>
      </div>

      {/* Центр — выбор зон */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ marginBottom: 16 }}>
          <b>Выберите зону атаки:</b>
          <div>
            {ZONES.map(z => (
              <button
                key={z.key}
                style={{ margin: 4, background: attackZone === z.key ? '#c33' : '#333', color: '#fff', borderRadius: 4, border: 'none', padding: '8px 16px' }}
                onClick={() => setAttackZone(z.key)}
              >
                {z.label}
              </button>
            ))}
          </div>
        </div>
        <div style={{ marginBottom: 16 }}>
          <b>Выберите зону защиты:</b>
          <div>
            {ZONES.map(z => (
              <button
                key={z.key}
                style={{ margin: 4, background: blockZone === z.key ? '#36c' : '#333', color: '#fff', borderRadius: 4, border: 'none', padding: '8px 16px' }}
                onClick={() => setBlockZone(z.key)}
              >
                {z.label}
              </button>
            ))}
          </div>
        </div>
        <button
          style={{ marginTop: 16, background: '#2a2', color: '#fff', borderRadius: 4, border: 'none', padding: '12px 32px', fontSize: 18 }}
          onClick={() => onTurn(attackZone, blockZone)}
        >
          Ход
        </button>
      </div>

      {/* Статус врага */}
      <div style={{ width: 200, background: '#222', color: '#fff', padding: 16, borderRadius: 8, marginLeft: 16 }}>
        <h3>{enemy.name}</h3>
        <div>Здоровье: {enemy.hp}</div>
        <div>Сила: {enemy.stats.str}</div>
        <div>Ловкость: {enemy.stats.agi}</div>
        <div>Интеллект: {enemy.stats.int}</div>
        <div>Тип: {enemy.type}</div>
      </div>
    </div>
  );
} 