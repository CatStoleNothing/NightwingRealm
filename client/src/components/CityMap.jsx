import React from 'react';
import { MapGenerator } from '../core/MapGenerator';
import { slavicStyles } from '../styles/CombatStyles';

export function CityMap({ map, position, onMove }) {
  return (
    <div style={{ 
      display: 'inline-block', 
      border: `3px solid ${slavicStyles.colors.primary}`, 
      background: slavicStyles.colors.background,
      borderRadius: '8px',
      padding: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.6)'
    }}>
      {map.map((row, y) => (
        <div key={y} style={{ display: 'flex' }}>
          {row.map((cell, x) => {
            let color, borderColor;
            if (position.x === x && position.y === y) {
              color = slavicStyles.colors.danger;
              borderColor = slavicStyles.colors.accent;
            } else if (cell === MapGenerator.CELL_TYPES.WALL) {
              color = slavicStyles.colors.secondary;
              borderColor = slavicStyles.colors.primary;
            } else if (cell === MapGenerator.CELL_TYPES.EVENT) {
              color = slavicStyles.colors.info;
              borderColor = slavicStyles.colors.accent;
            } else {
              color = slavicStyles.colors.surface;
              borderColor = slavicStyles.colors.textSecondary;
            }
            
            return (
              <div
                key={x}
                style={{ 
                  width: 32, 
                  height: 32, 
                  background: color, 
                  border: `2px solid ${borderColor}`, 
                  boxSizing: 'border-box',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  ':hover': {
                    transform: 'scale(1.1)',
                    boxShadow: '0 0 8px rgba(218,165,32,0.6)',
                  }
                }}
                onClick={() => onMove(x - position.x, y - position.y)}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'scale(1.1)';
                  e.target.style.boxShadow = '0 0 8px rgba(218,165,32,0.6)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'scale(1)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
} 