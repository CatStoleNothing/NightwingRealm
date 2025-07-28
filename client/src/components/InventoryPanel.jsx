import React from 'react';
import { slavicStyles } from '../styles/CombatStyles';

export function InventoryPanel({ inventory, onUseItem }) {
  const renderItem = (item, index) => {
    return (
      <div key={index} style={{
        background: slavicStyles.colors.surface,
        border: `2px solid ${item.rarityData?.color || slavicStyles.colors.secondary}`,
        borderRadius: '6px',
        padding: '12px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        maxWidth: '250px',
        minWidth: '200px',
      }}
      onClick={() => onUseItem(index)}
      onMouseEnter={(e) => {
        e.target.style.transform = 'scale(1.02)';
        e.target.style.boxShadow = '0 0 8px rgba(218,165,32,0.6)';
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = 'scale(1)';
        e.target.style.boxShadow = 'none';
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span style={{ fontSize: '20px' }}>{item.icon}</span>
          <div style={{ flex: 1 }}>
            <div style={{ 
              color: item.rarityData?.color || slavicStyles.colors.text, 
              fontWeight: 'bold',
              fontSize: '14px'
            }}>
              {item.name}
            </div>
            <div style={{ 
              color: slavicStyles.colors.textSecondary, 
              fontSize: '11px'
            }}>
              {item.rarityData?.name || 'Обычный'}
            </div>
          </div>
        </div>
        
        <div style={{ 
          color: slavicStyles.colors.textSecondary, 
          fontSize: '12px',
          marginBottom: '8px',
          lineHeight: '1.3'
        }}>
          {item.description}
        </div>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
          {item.damage && (
            <div style={{ 
              fontSize: '11px', 
              color: slavicStyles.colors.danger,
              background: 'rgba(220, 20, 60, 0.2)',
              padding: '2px 6px',
              borderRadius: '3px'
            }}>
              Урон: {item.damage}
            </div>
          )}
          {item.armor && (
            <div style={{ 
              fontSize: '11px', 
              color: slavicStyles.colors.info,
              background: 'rgba(135, 206, 235, 0.2)',
              padding: '2px 6px',
              borderRadius: '3px'
            }}>
              Броня: {item.armor}
            </div>
          )}
          {item.heal && (
            <div style={{ 
              fontSize: '11px', 
              color: slavicStyles.colors.success,
              background: 'rgba(34, 139, 34, 0.2)',
              padding: '2px 6px',
              borderRadius: '3px'
            }}>
              Лечение: {item.heal}
            </div>
          )}
          {item.staminaRestore && (
            <div style={{ 
              fontSize: '11px', 
              color: slavicStyles.colors.warning,
              background: 'rgba(255, 215, 0, 0.2)',
              padding: '2px 6px',
              borderRadius: '3px'
            }}>
              Выносливость: {item.staminaRestore}
            </div>
          )}
        </div>
      </div>
    );
  };

  const sortedInventory = [...inventory].sort((a, b) => {
    // Сортировка по типу предмета
    const typeOrder = { 'weapon': 1, 'armor': 2, 'potion': 3 };
    const aType = a.type || 'potion';
    const bType = b.type || 'potion';
    
    if (typeOrder[aType] !== typeOrder[bType]) {
      return typeOrder[aType] - typeOrder[bType];
    }
    
    // Затем по редкости
    const rarityOrder = { 'COMMON': 1, 'UNCOMMON': 2, 'RARE': 3, 'EPIC': 4, 'LEGENDARY': 5 };
    const aRarity = a.rarity || 'COMMON';
    const bRarity = b.rarity || 'COMMON';
    
    return rarityOrder[bRarity] - rarityOrder[aRarity];
  });

  return (
    <div style={slavicStyles.panel}>
      <h3 style={slavicStyles.subtitle}>Инвентарь ({inventory.length})</h3>
      <div style={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: '12px', 
        justifyContent: 'center',
        maxHeight: '400px',
        overflowY: 'auto'
      }}>
        {sortedInventory.length === 0 ? (
          <div style={{ 
            color: slavicStyles.colors.textSecondary, 
            textAlign: 'center', 
            padding: '40px',
            fontStyle: 'italic',
            width: '100%'
          }}>
            Инвентарь пуст
          </div>
        ) : (
          sortedInventory.map((item, index) => renderItem(item, index))
        )}
      </div>
    </div>
  );
} 