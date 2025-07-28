import React from 'react';
import { slavicStyles } from '../styles/CombatStyles';

export function PlayerStats({ player, game }) {
  const renderStatBar = (label, current, max, color) => (
    <div style={slavicStyles.statusBar.container}>
      <div style={slavicStyles.statusBar.label}>
        {label}: {current}/{max}
      </div>
      <div style={slavicStyles.statusBar.bar}>
        <div 
          style={{
            ...slavicStyles.statusBar.fill,
            ...slavicStyles.statusBar[color],
            width: `${(current / max) * 100}%`
          }}
        />
      </div>
    </div>
  );

  const renderStat = (label, value, color = 'text') => (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      marginBottom: '4px',
      color: slavicStyles.colors[color]
    }}>
      <span>{label}:</span>
      <span style={{ fontWeight: 'bold' }}>{value}</span>
    </div>
  );

  const renderEffects = () => {
    if (!player.effects || player.effects.length === 0) return null;
    
    return (
      <div style={{ marginTop: '12px' }}>
        <div style={{ color: slavicStyles.colors.accent, fontWeight: 'bold', marginBottom: '4px' }}>
          Эффекты:
        </div>
        {player.effects.map((effect, index) => (
          <div key={index} style={{ 
            color: slavicStyles.colors.warning, 
            fontSize: '12px',
            marginBottom: '2px'
          }}>
            {effect.type} ({effect.duration} ходов)
          </div>
        ))}
      </div>
    );
  };

  const renderTempEffects = () => {
    if (!player.tempEffects || player.tempEffects.length === 0) return null;
    
    return (
      <div style={{ marginTop: '8px' }}>
        <div style={{ color: slavicStyles.colors.info, fontWeight: 'bold', marginBottom: '4px' }}>
          Временные эффекты:
        </div>
        {player.tempEffects.map((effect, index) => (
          <div key={index} style={{ 
            color: slavicStyles.colors.success, 
            fontSize: '12px',
            marginBottom: '2px'
          }}>
            {effect.type} ({effect.duration} ходов)
          </div>
        ))}
      </div>
    );
  };

  const renderResistances = () => {
    if (!player.resistances) return null;
    
    const resistanceEntries = Object.entries(player.resistances);
    if (resistanceEntries.length === 0) return null;
    
    return (
      <div style={{ marginTop: '12px' }}>
        <div style={{ color: slavicStyles.colors.info, fontWeight: 'bold', marginBottom: '4px' }}>
          Сопротивления:
        </div>
        {resistanceEntries.map(([type, value]) => (
          <div key={type} style={{ 
            color: slavicStyles.colors.success, 
            fontSize: '12px',
            marginBottom: '2px'
          }}>
            {type}: {Math.floor(value * 100)}%
          </div>
        ))}
      </div>
    );
  };

  return (
    <div style={slavicStyles.panel}>
      <h3 style={slavicStyles.subtitle}>Герой</h3>
      
      {/* Основные характеристики */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '8px'
        }}>
          <span style={{ color: slavicStyles.colors.text, fontWeight: 'bold' }}>
            Уровень {player.level}
          </span>
          <span style={{ color: slavicStyles.colors.accent, fontWeight: 'bold' }}>
            {game.gold} 🪙
          </span>
        </div>
        
        {renderStatBar('Здоровье', player.hp, 100, 'health')}
        {renderStatBar('Выносливость', player.stamina, 50, 'stamina')}
        {renderStatBar('Мана', player.mana, 20, 'mana')}
        
        <div style={{ 
          color: slavicStyles.colors.textSecondary, 
          fontSize: '12px',
          marginTop: '4px'
        }}>
          Опыт: {player.experience}/{player.level * 100}
        </div>
      </div>

      {/* Характеристики */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ color: slavicStyles.colors.accent, fontWeight: 'bold', marginBottom: '8px' }}>
          Характеристики:
        </div>
        {renderStat('Сила', player.stats.str)}
        {renderStat('Ловкость', player.stats.agi)}
        {renderStat('Интеллект', player.stats.int)}
        {player.armor && renderStat('Броня', player.armor, 'info')}
        {player.dodge && renderStat('Уклонение', `${Math.floor(player.dodge * 100)}%`, 'info')}
        {player.critChance && renderStat('Крит. шанс', `${Math.floor(player.critChance * 100)}%`, 'warning')}
      </div>

      {/* Специальные способности */}
      {(player.shadowStep || player.dragonFear || player.armorBoost) && (
        <div style={{ marginBottom: '16px' }}>
          <div style={{ color: slavicStyles.colors.warning, fontWeight: 'bold', marginBottom: '8px' }}>
            Способности:
          </div>
          {player.shadowStep && renderStat('Теневой шаг', `${Math.floor(player.shadowStep * 100)}%`, 'warning')}
          {player.dragonFear && renderStat('Страх дракона', `${Math.floor(player.dragonFear * 100)}%`, 'warning')}
          {player.armorBoost && renderStat('Усиление брони', player.armorBoost, 'warning')}
        </div>
      )}

      {/* Эффекты */}
      {renderEffects()}
      {renderTempEffects()}
      {renderResistances()}
    </div>
  );
} 