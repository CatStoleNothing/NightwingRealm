import React, { useState, useEffect } from 'react';
import { ExpeditionEngine } from '../core/ExpeditionEngine';
import { slavicStyles } from '../styles/CombatStyles';

export function ExpeditionScreen({ expedition, player, onMove, onEvent, onComplete, onExit }) {
  const [currentEvent, setCurrentEvent] = useState(null);
  const [eventResult, setEventResult] = useState(null);
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [log, setLog] = useState([]);

  const addLogMessage = (message) => {
    setLog(prev => [...prev, { message, timestamp: Date.now() }]);
  };

  const handleCellClick = (x, y) => {
    const dx = x - expedition.playerPosition.x;
    const dy = y - expedition.playerPosition.y;

    // Проверяем, что клетка рядом
    if (Math.abs(dx) + Math.abs(dy) !== 1) {
      return;
    }

    const moveResult = ExpeditionEngine.move(expedition, dx, dy);
    
    if (moveResult.success) {
      onMove(dx, dy);
      addLogMessage(moveResult.message);

      if (moveResult.event) {
        setCurrentEvent(moveResult.event);
        setShowEventDialog(true);
      }

      if (moveResult.gameOver) {
        addLogMessage('Экспедиция провалена!');
        setTimeout(() => onExit(), 2000);
      }
    } else {
      addLogMessage(moveResult.message);
    }
  };

  const handleEvent = () => {
    if (!currentEvent) return;

    const result = ExpeditionEngine.handleEvent(expedition, currentEvent, player);
    setEventResult(result);
    addLogMessage(result.message);

    // Применяем результаты к игроку
    if (result.damage) {
      player.hp = Math.max(1, player.hp - result.damage);
    }
    if (result.heal) {
      player.hp = Math.min(100, player.hp + result.heal);
    }

    // Проверяем завершение экспедиции
    if (result.bossDefeated || ExpeditionEngine.checkExpeditionComplete(expedition)) {
      addLogMessage('Экспедиция завершена успешно!');
      setTimeout(() => onComplete(expedition.rewards), 2000);
    }
  };

  const renderCell = (cell, x, y) => {
    const isPlayer = expedition.playerPosition.x === x && expedition.playerPosition.y === y;
    const isDiscovered = expedition.discovered.has(`${x},${y}`);
    
    let cellStyle = {
      width: 40,
      height: 40,
      border: '1px solid #333',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      fontSize: '12px'
    };

    if (isPlayer) {
      cellStyle = {
        ...cellStyle,
        background: slavicStyles.colors.danger,
        color: 'white',
        fontWeight: 'bold'
      };
    } else if (cell === 1) {
      cellStyle = {
        ...cellStyle,
        background: slavicStyles.colors.secondary,
        cursor: 'not-allowed'
      };
    } else if (cell === 2 && isDiscovered) {
      cellStyle = {
        ...cellStyle,
        background: slavicStyles.colors.info,
        color: 'white'
      };
    } else if (cell === 3 && isDiscovered) {
      cellStyle = {
        ...cellStyle,
        background: slavicStyles.colors.warning,
        color: 'white',
        fontWeight: 'bold'
      };
    } else if (isDiscovered) {
      cellStyle = {
        ...cellStyle,
        background: slavicStyles.colors.surface
      };
    } else {
      cellStyle = {
        ...cellStyle,
        background: '#222',
        color: '#666'
      };
    }

    return (
      <div
        key={`${x}-${y}`}
        style={cellStyle}
        onClick={() => handleCellClick(x, y)}
        onMouseEnter={(e) => {
          if (!isPlayer && cell !== 1) {
            e.target.style.transform = 'scale(1.1)';
            e.target.style.boxShadow = '0 0 8px rgba(218,165,32,0.6)';
          }
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'scale(1)';
          e.target.style.boxShadow = 'none';
        }}
      >
        {isPlayer ? '👤' : 
         cell === 1 ? '🧱' :
         cell === 2 ? '⚔️' :
         cell === 3 ? '👹' :
         isDiscovered ? '·' : '?'}
      </div>
    );
  };

  const renderEventDialog = () => {
    if (!currentEvent || !showEventDialog) return null;

    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.8)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      }}>
        <div style={{
          background: slavicStyles.colors.background,
          border: `3px solid ${slavicStyles.colors.primary}`,
          borderRadius: '12px',
          padding: '24px',
          maxWidth: '400px',
          width: '90%',
          textAlign: 'center',
        }}>
          <h3 style={slavicStyles.subtitle}>
            {currentEvent.type === 'combat' ? '⚔️ Бой' :
             currentEvent.type === 'treasure' ? '💎 Сокровище' :
             currentEvent.type === 'trap' ? '⚠️ Ловушка' :
             currentEvent.type === 'rest' ? '🏕️ Отдых' :
             currentEvent.type === 'puzzle' ? '🧩 Загадка' :
             currentEvent.type === 'boss' ? '👹 Босс' : '❓ Событие'}
          </h3>
          
          <p style={{ color: slavicStyles.colors.text, marginBottom: '16px' }}>
            {currentEvent.description}
          </p>

          {currentEvent.type === 'combat' && (
            <div style={{ marginBottom: '16px' }}>
              <p style={{ color: slavicStyles.colors.warning }}>
                Враг: {currentEvent.enemy.type} (Уровень {currentEvent.enemy.level})
              </p>
              <p style={{ color: slavicStyles.colors.textSecondary }}>
                HP: {currentEvent.enemy.hp} | Сила: {currentEvent.enemy.stats.str}
              </p>
            </div>
          )}

          {eventResult && (
            <div style={{
              padding: '12px',
              borderRadius: '6px',
              marginBottom: '16px',
              background: eventResult.victory ? 'rgba(34, 139, 34, 0.2)' : 'rgba(220, 20, 60, 0.2)',
              border: `1px solid ${eventResult.victory ? slavicStyles.colors.success : slavicStyles.colors.danger}`
            }}>
              <p style={{ color: eventResult.victory ? slavicStyles.colors.success : slavicStyles.colors.danger }}>
                {eventResult.message}
              </p>
              {eventResult.rewards && (
                <div style={{ marginTop: '8px' }}>
                  <p style={{ color: slavicStyles.colors.accent }}>
                    Награды: {eventResult.rewards.gold} 🪙, {eventResult.rewards.experience} ⭐
                  </p>
                </div>
              )}
            </div>
          )}

          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
            {!eventResult ? (
              <button
                onClick={handleEvent}
                style={slavicStyles.button.primary}
              >
                Продолжить
              </button>
            ) : (
              <button
                onClick={() => {
                  setShowEventDialog(false);
                  setCurrentEvent(null);
                  setEventResult(null);
                }}
                style={slavicStyles.button.primary}
              >
                Закрыть
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={slavicStyles.container}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '16px',
        padding: '8px',
        background: slavicStyles.colors.surface,
        borderRadius: '8px',
        border: `1px solid ${slavicStyles.colors.secondary}`
      }}>
        <h2 style={slavicStyles.subtitle}>Экспедиция: {expedition.type}</h2>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ color: slavicStyles.colors.textSecondary }}>
            Шаги: {expedition.steps}/{expedition.maxSteps}
          </span>
          <button
            onClick={onExit}
            style={slavicStyles.button.secondary}
          >
            Выйти
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '20px' }}>
        {/* Карта экспедиции */}
        <div style={{ flex: 1 }}>
          <h3 style={slavicStyles.subtitle}>Карта экспедиции</h3>
          <div style={{ 
            display: 'inline-block', 
            border: `3px solid ${slavicStyles.colors.primary}`, 
            background: slavicStyles.colors.background,
            borderRadius: '8px',
            padding: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.6)'
          }}>
            {expedition.map.map((row, y) => (
              <div key={y} style={{ display: 'flex' }}>
                {row.map((cell, x) => renderCell(cell, x, y))}
              </div>
            ))}
          </div>
          
          <div style={{ marginTop: '12px', fontSize: '12px', color: slavicStyles.colors.textSecondary }}>
            <div>👤 - Вы | 🧱 - Препятствие | ⚔️ - Событие | 👹 - Босс</div>
            <div>Кликните по соседней клетке для перемещения</div>
          </div>
        </div>

        {/* Информация и лог */}
        <div style={{ flex: 1, maxWidth: '300px' }}>
          <h3 style={slavicStyles.subtitle}>Информация</h3>
          
          {/* Статус игрока */}
          <div style={slavicStyles.panel}>
            <h4 style={{ color: slavicStyles.colors.text, marginBottom: '8px' }}>Герой</h4>
            <div style={{ color: slavicStyles.colors.textSecondary, fontSize: '14px' }}>
              <div>HP: {player.hp}/100</div>
              <div>Уровень: {player.level}</div>
              <div>Опыт: {player.experience}</div>
            </div>
          </div>

          {/* Цель экспедиции */}
          <div style={slavicStyles.panel}>
            <h4 style={{ color: slavicStyles.colors.text, marginBottom: '8px' }}>Цель</h4>
            <div style={{ color: slavicStyles.colors.textSecondary, fontSize: '14px' }}>
              {expedition.goal === 'kill_boss' && 'Победить босса'}
              {expedition.goal === 'find_item' && 'Найти предмет'}
              {expedition.goal === 'reach_end' && 'Дойти до конца'}
              {expedition.goal === 'collect_materials' && 'Собрать материалы'}
              {expedition.goal === 'rescue_npc' && 'Спасти NPC'}
            </div>
          </div>

          {/* Лог событий */}
          <div style={slavicStyles.panel}>
            <h4 style={{ color: slavicStyles.colors.text, marginBottom: '8px' }}>Лог событий</h4>
            <div style={{ 
              maxHeight: '200px', 
              overflowY: 'auto',
              fontSize: '12px',
              color: slavicStyles.colors.textSecondary
            }}>
              {log.slice(-10).map((entry, index) => (
                <div key={index} style={{ marginBottom: '4px' }}>
                  {entry.message}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {renderEventDialog()}
    </div>
  );
} 