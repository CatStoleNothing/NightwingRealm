import React, { useState, useEffect } from 'react';
import { CombatEngine } from '../core/CombatEngine';
import { ItemSystem } from '../core/Items';
import { slavicStyles } from '../styles/CombatStyles';
import { 
  StrikeAnimation, 
  EffectAnimation, 
  DamageAnimation, 
  MissAnimation, 
  DodgeAnimation 
} from './CombatAnimations';

const ZONES = [
  { key: 'head', label: 'Голова' },
  { key: 'body', label: 'Тело' },
  { key: 'legs', label: 'Ноги' },
];

const DAMAGE_TYPES = [
  { key: 'physical', label: 'Физический' },
  { key: 'fire', label: 'Огонь' },
  { key: 'water', label: 'Вода' },
  { key: 'electric', label: 'Электричество' },
];

export function CombatScreen({ player, enemy, onTurn, onCombatEnd, game }) {
  const [attackZone, setAttackZone] = useState('head');
  const [blockZone, setBlockZone] = useState('body');
  const [damageType, setDamageType] = useState('physical');
  const [combatEngine] = useState(new CombatEngine());
  const [lastMessage, setLastMessage] = useState('');
  const [isEnemyTurn, setIsEnemyTurn] = useState(false);
  const [victoryData, setVictoryData] = useState(null);
  
  // Анимации
  const [animations, setAnimations] = useState({
    strike: { isVisible: false, position: { x: 0, y: 0 }, type: 'normal' },
    damage: { isVisible: false, position: { x: 0, y: 0 }, damage: 0, isCrit: false },
    effect: { isVisible: false, position: { x: 0, y: 0 }, effect: '' },
    miss: { isVisible: false, position: { x: 0, y: 0 } },
    dodge: { isVisible: false, position: { x: 0, y: 0 } },
  });

  // Инвентарь
  const [inventory, setInventory] = useState([
    ItemSystem.createItem(ItemSystem.WEAPONS.sword),
    ItemSystem.createItem(ItemSystem.ARMORS.leather),
    ItemSystem.createItem(ItemSystem.POTIONS.healthPotion),
  ]);
  const [showInventory, setShowInventory] = useState(false);

  // Проверка окончания боя
  useEffect(() => {
    if (combatEngine.isCombatOver(player, enemy)) {
      const result = combatEngine.getCombatResult(player, enemy);
      if (result === 'victory' && game) {
        // Обрабатываем победу
        const victoryData = game.handleCombatVictory(enemy);
        setVictoryData(victoryData);
      }
      onCombatEnd(result);
    }
  }, [player.hp, enemy.hp]);

  // Ход врага
  useEffect(() => {
    if (isEnemyTurn && !combatEngine.isCombatOver(player, enemy)) {
      const timeout = setTimeout(() => {
        const result = combatEngine.enemyTurn(enemy, player);
        setLastMessage(result.message);
        setIsEnemyTurn(false);
        onTurn(null, null, result.player, result.enemy);
        
        // Анимация удара врага
        if (result.damage > 0) {
          setAnimations(prev => ({
            ...prev,
            strike: { isVisible: true, position: { x: 100, y: 150 }, type: 'normal' },
            damage: { isVisible: true, position: { x: 100, y: 150 }, damage: result.damage, isCrit: false },
          }));
        }
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [isEnemyTurn]);

  const handlePlayerTurn = () => {
    if (isEnemyTurn) return;

    const result = combatEngine.playerTurn(player, enemy, attackZone, blockZone, damageType);
    setLastMessage(result.message);
    setIsEnemyTurn(true);
    onTurn(attackZone, blockZone, result.player, result.enemy);

    // Анимации
    if (result.damage > 0) {
      setAnimations(prev => ({
        ...prev,
        strike: { isVisible: true, position: { x: 300, y: 150 }, type: damageType },
        damage: { isVisible: true, position: { x: 300, y: 150 }, damage: result.damage, isCrit: result.isCrit },
      }));
    } else if (lastMessage.includes('Промах')) {
      setAnimations(prev => ({
        ...prev,
        miss: { isVisible: true, position: { x: 300, y: 150 } },
      }));
    } else if (lastMessage.includes('Уклонение')) {
      setAnimations(prev => ({
        ...prev,
        dodge: { isVisible: true, position: { x: 300, y: 150 } },
      }));
    }
  };

  const useItem = (item) => {
    if (item.type === 'potion') {
      const updatedPlayer = ItemSystem.usePotion(player, item);
      // Удаляем использованное зелье
      setInventory(prev => prev.filter(i => i !== item));
      onTurn(null, null, updatedPlayer, enemy);
    } else {
      // Экипировка оружия/брони
      const updatedPlayer = ItemSystem.applyItemEffects(player, item);
      onTurn(null, null, updatedPlayer, enemy);
    }
    setShowInventory(false);
  };

  const renderEffects = (target) => {
    if (!target.effects?.length) return null;
    return (
      <div style={slavicStyles.effects.container}>
        <div style={slavicStyles.effects.label}>Эффекты:</div>
        {target.effects.map((effect, i) => (
          <div key={i} style={slavicStyles.effects.effect}>
            {effect.type} ({effect.duration} ходов)
          </div>
        ))}
      </div>
    );
  };

  const renderResistances = (target) => {
    if (!target.resistances) return null;
    return (
      <div style={slavicStyles.resistances.container}>
        <div style={slavicStyles.resistances.label}>Сопротивления:</div>
        {Object.entries(target.resistances).map(([type, value]) => (
          <div key={type} style={slavicStyles.resistances.resistance}>
            {type}: {Math.floor(value * 100)}%
          </div>
        ))}
      </div>
    );
  };

  const renderInventory = () => {
    if (!showInventory) return null;

    return (
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        background: slavicStyles.colors.background,
        border: `3px solid ${slavicStyles.colors.primary}`,
        borderRadius: '8px',
        padding: '20px',
        zIndex: 1000,
        maxWidth: '400px',
        maxHeight: '300px',
        overflowY: 'auto',
      }}>
        <h3 style={slavicStyles.subtitle}>Инвентарь</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {inventory.map((item, index) => (
            <div key={index} style={{
              background: slavicStyles.colors.surface,
              border: `2px solid ${item.rarityData?.color || slavicStyles.colors.secondary}`,
              borderRadius: '4px',
              padding: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onClick={() => useItem(item)}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.05)';
              e.target.style.boxShadow = '0 0 8px rgba(218,165,32,0.6)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)';
              e.target.style.boxShadow = 'none';
            }}>
              <div style={{ color: item.rarityData?.color || slavicStyles.colors.text, fontWeight: 'bold' }}>
                {item.name} ({item.rarityData?.name || 'Обычный'})
              </div>
              <div style={{ color: slavicStyles.colors.textSecondary, fontSize: '12px' }}>
                {item.description}
              </div>
              {item.damage && <div>Урон: {item.damage}</div>}
              {item.armor && <div>Броня: {item.armor}</div>}
            </div>
          ))}
        </div>
        <button
          style={{ ...slavicStyles.button.secondary, marginTop: '16px' }}
          onClick={() => setShowInventory(false)}
        >
          Закрыть
        </button>
      </div>
    );
  };

  const renderVictoryLoot = () => {
    if (!victoryData) return null;

    return (
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        background: slavicStyles.colors.background,
        border: `3px solid ${slavicStyles.colors.success}`,
        borderRadius: '8px',
        padding: '20px',
        zIndex: 1000,
        maxWidth: '500px',
        textAlign: 'center',
      }}>
        <h3 style={{ ...slavicStyles.subtitle, color: slavicStyles.colors.success }}>
          Победа! 🎉
        </h3>
        
        <div style={{ marginBottom: '16px' }}>
          <div style={{ color: slavicStyles.colors.text, fontSize: '18px', marginBottom: '8px' }}>
            Получено золота: <span style={{ color: slavicStyles.colors.accent }}>{victoryData.gold}</span>
          </div>
          <div style={{ color: slavicStyles.colors.text, fontSize: '18px', marginBottom: '8px' }}>
            Получено опыта: <span style={{ color: slavicStyles.colors.accent }}>{victoryData.experience}</span>
          </div>
          {victoryData.levelUp && (
            <div style={{ color: slavicStyles.colors.success, fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>
              🎊 Уровень повышен! Теперь уровень {victoryData.newLevel} 🎊
            </div>
          )}
        </div>

        {victoryData.items.length > 0 && (
          <div style={{ marginBottom: '16px' }}>
            <div style={{ color: slavicStyles.colors.text, fontWeight: 'bold', marginBottom: '8px' }}>
              Найденные предметы:
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {victoryData.items.map((item, index) => (
                <div key={index} style={{
                  background: slavicStyles.colors.surface,
                  border: `2px solid ${item.rarityData?.color || slavicStyles.colors.secondary}`,
                  borderRadius: '4px',
                  padding: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}>
                  <span style={{ fontSize: '16px' }}>{item.icon}</span>
                  <div>
                    <div style={{ color: item.rarityData?.color || slavicStyles.colors.text, fontWeight: 'bold' }}>
                      {item.name}
                    </div>
                    <div style={{ color: slavicStyles.colors.textSecondary, fontSize: '12px' }}>
                      {item.rarityData?.name || 'Обычный'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          style={slavicStyles.button.primary}
          onClick={() => setVictoryData(null)}
        >
          Продолжить
        </button>
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, position: 'relative' }}>
      {/* Анимации */}
      <StrikeAnimation {...animations.strike} />
      <DamageAnimation {...animations.damage} />
      <EffectAnimation {...animations.effect} />
      <MissAnimation {...animations.miss} />
      <DodgeAnimation {...animations.dodge} />

      {/* Инвентарь */}
      {renderInventory()}

      {/* Лог боя */}
      <div style={slavicStyles.combatLog.container}>
        <h4 style={slavicStyles.subtitle}>Летопись битвы:</h4>
        {combatEngine.combatLog.map((log, i) => (
          <div key={i} style={slavicStyles.combatLog.entry}>
            {log}
          </div>
        ))}
        {lastMessage && (
          <div style={slavicStyles.combatLog.highlight}>
            {lastMessage}
          </div>
        )}
      </div>

      {/* Основной интерфейс боя */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'stretch', minHeight: 320 }}>
        {/* Статус игрока */}
        <div style={slavicStyles.panel}>
          <h3 style={slavicStyles.subtitle}>Вы (Тень)</h3>
          <div style={{ color: slavicStyles.colors.text }}>
            <div>Здоровье: {player.hp}</div>
            <div>Выносливость: {player.stamina}</div>
            <div>Мана: {player.mana}</div>
            <div>Сила: {player.stats.str}</div>
            <div>Ловкость: {player.stats.agi}</div>
            <div>Интеллект: {player.stats.int}</div>
            {player.armor && <div>Броня: {player.armor}</div>}
            {player.dodge && <div>Уклонение: {Math.floor(player.dodge * 100)}%</div>}
          </div>
          {renderEffects(player)}
          {renderResistances(player)}
          <button
            style={{ ...slavicStyles.button.secondary, marginTop: '8px' }}
            onClick={() => setShowInventory(true)}
          >
            Инвентарь ({inventory.length})
          </button>
        </div>

        {/* Центр — выбор зон и типа урона */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          {isEnemyTurn ? (
            <div style={{ fontSize: 18, color: slavicStyles.colors.danger }}>
              Ход врага...
            </div>
          ) : (
            <>
              <div style={{ marginBottom: 16 }}>
                <b style={{ color: slavicStyles.colors.text }}>Тип урона:</b>
                <div>
                  {DAMAGE_TYPES.map(dt => (
                    <button
                      key={dt.key}
                      style={{
                        ...slavicStyles.button.secondary,
                        background: damageType === dt.key 
                          ? 'linear-gradient(145deg, #DAA520 0%, #FFD700 100%)'
                          : slavicStyles.button.secondary.background,
                        margin: '4px',
                      }}
                      onClick={() => setDamageType(dt.key)}
                    >
                      {dt.label}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <b style={{ color: slavicStyles.colors.text }}>Выберите зону атаки:</b>
                <div>
                  {ZONES.map(z => (
                    <button
                      key={z.key}
                      style={{
                        ...slavicStyles.zoneButton.base,
                        ...slavicStyles.zoneButton.attack,
                        ...(attackZone === z.key ? slavicStyles.zoneButton.selected : {}),
                      }}
                      onClick={() => setAttackZone(z.key)}
                    >
                      {z.label}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <b style={{ color: slavicStyles.colors.text }}>Выберите зону защиты:</b>
                <div>
                  {ZONES.map(z => (
                    <button
                      key={z.key}
                      style={{
                        ...slavicStyles.zoneButton.base,
                        ...slavicStyles.zoneButton.defense,
                        ...(blockZone === z.key ? slavicStyles.zoneButton.selected : {}),
                      }}
                      onClick={() => setBlockZone(z.key)}
                    >
                      {z.label}
                    </button>
                  ))}
                </div>
              </div>
              <button
                style={slavicStyles.button.success}
                onClick={handlePlayerTurn}
              >
                Ход
              </button>
            </>
          )}
        </div>

        {/* Статус врага */}
        <div style={slavicStyles.panel}>
          <h3 style={slavicStyles.subtitle}>{enemy.name}</h3>
          <div style={{ color: slavicStyles.colors.text }}>
            <div>Здоровье: {enemy.hp}</div>
            <div>Сила: {enemy.stats.str}</div>
            <div>Ловкость: {enemy.stats.agi}</div>
            <div>Интеллект: {enemy.stats.int}</div>
            <div style={{ color: slavicStyles.colors.accent, fontWeight: 'bold' }}>
              Тип: {enemy.type}
            </div>
            {enemy.armor && <div>Броня: {enemy.armor}</div>}
            {enemy.dodge && <div>Уклонение: {Math.floor(enemy.dodge * 100)}%</div>}
          </div>
          {renderEffects(enemy)}
          {renderResistances(enemy)}
        </div>
      </div>
      {renderVictoryLoot()}
    </div>
  );
} 