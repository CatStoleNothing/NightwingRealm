import React from 'react';
import { slavicStyles } from '../styles/CombatStyles';
import { CraftingSystem } from '../core/CraftingSystem';

export function MaterialsPanel({ materials }) {
  const renderMaterial = (key, count) => {
    const material = CraftingSystem.MATERIALS[key];
    if (!material) return null;

    const getRarityColor = (rarity) => {
      switch (rarity) {
        case 'COMMON': return slavicStyles.colors.textSecondary;
        case 'UNCOMMON': return slavicStyles.colors.success;
        case 'RARE': return slavicStyles.colors.info;
        case 'EPIC': return slavicStyles.colors.warning;
        case 'LEGENDARY': return slavicStyles.colors.accent;
        default: return slavicStyles.colors.textSecondary;
      }
    };

    return (
      <div key={key} style={{
        background: slavicStyles.colors.surface,
        border: `2px solid ${getRarityColor(material.rarity)}`,
        borderRadius: '6px',
        padding: '8px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        transition: 'all 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.target.style.transform = 'scale(1.02)';
        e.target.style.boxShadow = '0 0 8px rgba(218,165,32,0.4)';
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = 'scale(1)';
        e.target.style.boxShadow = 'none';
      }}>
        <span style={{ fontSize: '18px' }}>{material.icon}</span>
        <div style={{ flex: 1 }}>
          <div style={{ 
            color: getRarityColor(material.rarity), 
            fontWeight: 'bold',
            fontSize: '14px'
          }}>
            {material.name}
          </div>
          <div style={{ 
            color: slavicStyles.colors.textSecondary, 
            fontSize: '11px',
            marginTop: '2px'
          }}>
            {material.description}
          </div>
        </div>
        <div style={{ 
          color: slavicStyles.colors.accent, 
          fontWeight: 'bold',
          fontSize: '16px'
        }}>
          {count}
        </div>
      </div>
    );
  };

  const sortedMaterials = Object.entries(materials)
    .sort(([,a], [,b]) => b - a) // Сортировка по количеству (убывание)
    .sort(([a], [b]) => {
      // Сортировка по редкости
      const rarityOrder = { 'COMMON': 1, 'UNCOMMON': 2, 'RARE': 3, 'EPIC': 4, 'LEGENDARY': 5 };
      const aRarity = CraftingSystem.MATERIALS[a]?.rarity || 'COMMON';
      const bRarity = CraftingSystem.MATERIALS[b]?.rarity || 'COMMON';
      return rarityOrder[bRarity] - rarityOrder[aRarity];
    });

  return (
    <div style={slavicStyles.panel}>
      <h3 style={slavicStyles.subtitle}>Материалы</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '300px', overflowY: 'auto' }}>
        {sortedMaterials.length === 0 ? (
          <div style={{ 
            color: slavicStyles.colors.textSecondary, 
            textAlign: 'center', 
            padding: '20px',
            fontStyle: 'italic'
          }}>
            Материалы не найдены
          </div>
        ) : (
          sortedMaterials.map(([key, count]) => renderMaterial(key, count))
        )}
      </div>
    </div>
  );
} 