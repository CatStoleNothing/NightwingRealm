import React, { useState } from 'react';
import { Game, mapData } from './core/Game';
import { CityMap } from './components/CityMap';
import { CombatScreen } from './components/CombatScreen';

const game = new Game();

export default function App() {
  const [scene, setScene] = useState(game.scene);
  const [position, setPosition] = useState({ ...game.position });
  const [player, setPlayer] = useState({
    ...game.player,
    hp: 100,
    stamina: 50,
    mana: 20,
  });
  const [enemy, setEnemy] = useState({
    name: 'Кощей',
    type: 'бессмертный',
    hp: 80,
    stats: { str: 12, agi: 8, int: 15 },
  });

  const handleMove = (dx, dy) => {
    game.move(dx, dy);
    setPosition({ ...game.position });
    setScene(game.scene);
  };

  const handleCombatTurn = (attackZone, blockZone) => {
    // Простая заглушка: урон по врагу, смена хода
    setEnemy(e => ({ ...e, hp: Math.max(0, e.hp - 10) }));
    // Можно добавить логику ответа врага и расчёта урона по игроку
  };

  return (
    <div style={{ color: '#fff', background: '#181818', minHeight: '100vh', padding: 32 }}>
      <h1>NightwingRealm: Новгород</h1>
      {scene === 'city' && (
        <>
          <h2>Город</h2>
          <CityMap map={mapData} position={position} onMove={handleMove} />
          <p>Кликните по клетке для перемещения. Красная — вы.</p>
        </>
      )}
      {scene === 'combat' && (
        <CombatScreen player={player} enemy={enemy} onTurn={handleCombatTurn} />
      )}
    </div>
  );
} 