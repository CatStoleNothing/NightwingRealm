import React from 'react';
import { CellType } from '../core/Game';

export function CityMap({ map, position, onMove }) {
  return (
    <div style={{ display: 'inline-block', border: '2px solid #333', background: '#222' }}>
      {map.map((row, y) => (
        <div key={y} style={{ display: 'flex' }}>
          {row.map((cell, x) => {
            let color = cell === CellType.WALL ? '#444' : cell === CellType.EVENT ? '#aaf' : '#eee';
            if (position.x === x && position.y === y) color = '#f00';
            return (
              <div
                key={x}
                style={{ width: 32, height: 32, background: color, border: '1px solid #555', boxSizing: 'border-box' }}
                onClick={() => onMove(x - position.x, y - position.y)}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
} 