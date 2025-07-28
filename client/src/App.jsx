import React, { useState, useEffect } from 'react';
import { Game, mapData } from './core/Game';
import { CityMap } from './components/CityMap';
import { CombatScreen } from './components/CombatScreen';
import { CraftingScreen } from './components/CraftingScreen';
import { CombatEngine } from './core/CombatEngine';
import { slavicStyles } from './styles/CombatStyles';
import { TradeScreen } from './components/TradeScreen';
import { PlayerStats } from './components/PlayerStats';
import { MaterialsPanel } from './components/MaterialsPanel';
import { InventoryPanel } from './components/InventoryPanel';
import { AuthScreen } from './components/AuthScreen';
import { CharacterSelect } from './components/CharacterSelect';
import { SkillTree } from './components/SkillTree';
import { Button, Card, Modal, Navigation, useResponsive, modernStyles } from './components/ModernUI';

export default function App() {
  // Состояние авторизации
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentCharacter, setCurrentCharacter] = useState(null);
  const [showCharacterSelect, setShowCharacterSelect] = useState(false);

  // Состояние игры
  const [game, setGame] = useState(null);
  const [scene, setScene] = useState('city');
  const [position, setPosition] = useState({ x: 1, y: 1 });
  const [player, setPlayer] = useState(null);
  const [enemy, setEnemy] = useState(CombatEngine.prototype.createEnemy('koshchei'));
  const [inventory, setInventory] = useState([]);
  const [materials, setMaterials] = useState({});
  const [showCrafting, setShowCrafting] = useState(false);
  const [showTrade, setShowTrade] = useState(false);
  const [showSkillTree, setShowSkillTree] = useState(false);
  const [showExpedition, setShowExpedition] = useState(false);
  const [activeMenu, setActiveMenu] = useState('main');

  // Адаптивный дизайн
  const { isMobile, isTablet, isDesktop } = useResponsive();

  // Простой fallback для отладки
  const [debugMode, setDebugMode] = useState(false);

  // Проверка авторизации при загрузке
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    if (token && user) {
      setIsAuthenticated(true);
      setCurrentUser(JSON.parse(user));
      setShowCharacterSelect(true);
    } else {
      setIsAuthenticated(false);
      setCurrentUser(null);
      setShowCharacterSelect(false);
      setCurrentCharacter(null);
      setGame(null);
    }
  }, []);

  // Fallback для отладки
  if (debugMode) {
    return (
      <div style={{ 
        padding: '20px', 
        backgroundColor: '#f0f0f0', 
        color: '#333',
        fontFamily: 'Arial, sans-serif'
      }}>
        <h1>Debug Mode</h1>
        <p>isAuthenticated: {isAuthenticated.toString()}</p>
        <p>showCharacterSelect: {showCharacterSelect.toString()}</p>
        <p>currentUser: {currentUser ? currentUser.username : 'null'}</p>
        <p>currentCharacter: {currentCharacter ? currentCharacter.name : 'null'}</p>
        <button onClick={() => setDebugMode(false)}>Вернуться к игре</button>
      </div>
    );
  }



  // Инициализация игры при выборе персонажа
  useEffect(() => {
    if (currentCharacter) {
      const newGame = new Game();
      
      // Загружаем данные персонажа в игру
      newGame.player = {
        ...newGame.player,
        ...currentCharacter,
        name: currentCharacter.name,
        class: currentCharacter.class
      };
      
      newGame.position = currentCharacter.position || { x: 1, y: 1 };
      newGame.scene = currentCharacter.scene || 'city';
      newGame.inventory = currentCharacter.inventory || [];
      newGame.materials = currentCharacter.materials || {};
      newGame.gold = currentCharacter.gold || 100;
      newGame.storyFlags = currentCharacter.storyFlags || {};
      
      setGame(newGame);
      setPlayer(newGame.player);
      setPosition(newGame.position);
      setScene(newGame.scene);
      setInventory(newGame.inventory);
      setMaterials(newGame.materials);
      setShowCharacterSelect(false);
    }
  }, [currentCharacter]);

  const handleAuthSuccess = (user, token) => {
    setIsAuthenticated(true);
    setCurrentUser(user);
    setShowCharacterSelect(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setCurrentUser(null);
    setCurrentCharacter(null);
    setGame(null);
    setShowCharacterSelect(false);
  };

  const handleCharacterSelect = (character) => {
    setCurrentCharacter(character);
  };

  const saveCharacter = async () => {
    if (!game || !currentCharacter) return;

    try {
      const response = await fetch(`/api/characters/${currentCharacter.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          ...game.player,
          position: game.position,
          scene: game.scene,
          inventory: game.inventory,
          materials: game.materials,
          gold: game.gold,
          storyFlags: game.storyFlags,
          lastPlayed: new Date()
        }),
      });

      if (!response.ok) {
        console.error('Ошибка сохранения персонажа');
      }
    } catch (error) {
      console.error('Ошибка сохранения:', error);
    }
  };

  // Автосохранение каждые 30 секунд
  useEffect(() => {
    if (game) {
      const interval = setInterval(saveCharacter, 30000);
      return () => clearInterval(interval);
    }
  }, [game]);

  const handleMove = (dx, dy) => {
    if (!game) return;
    
    const moved = game.move(dx, dy);
    if (moved) {
      setPosition({ ...game.position });
      setScene(game.scene);
    }
  };

  const handleCombatTurn = (attackZone, blockZone, newPlayer, newEnemy) => {
    if (newPlayer) setPlayer(newPlayer);
    if (newEnemy) setEnemy(newEnemy);
  };

  const handleCombatEnd = (result) => {
    if (result === 'defeat') {
      alert('Поражение! Вы проиграли бой.');
      setScene('city');
    } else if (result === 'victory') {
      setScene('city');
    }
  };

  const changeEnemy = (enemyType) => {
    setEnemy(CombatEngine.prototype.createEnemy(enemyType));
  };

  const handleCraft = (item, newMaterials) => {
    if (!game) return;
    
    if (item) {
      setInventory(prev => [...prev, item]);
      game.inventory.push(item);
    }
    if (newMaterials) {
      setMaterials(newMaterials);
      game.materials = newMaterials;
    }
  };

  const handleUseItem = (itemIndex) => {
    if (!game) return;
    
    const result = game.useItem(itemIndex);
    if (result.success) {
      setInventory([...game.inventory]);
      setPlayer({ ...game.player });
      alert(result.message);
    }
  };

  // Главный рендер
  if (!isAuthenticated) {
    return <AuthScreen onAuthSuccess={handleAuthSuccess} />;
  }
  if (showCharacterSelect || !currentCharacter) {
    return <CharacterSelect onCharacterSelect={handleCharacterSelect} onLogout={handleLogout} />;
  }
  if (!game || !player) {
    return (
      <div style={{
        backgroundColor: modernStyles?.colors?.background || '#f1f5f9',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: modernStyles?.typography?.fontFamily || 'Arial, sans-serif'
      }}>
        <div style={{ 
          color: modernStyles?.colors?.text || '#334155', 
          textAlign: 'center',
          fontSize: modernStyles?.typography?.fontSize?.xl || '1.25rem'
        }}>
          Загрузка игры...
        </div>
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: modernStyles.colors.background,
      minHeight: '100vh',
      fontFamily: modernStyles.typography.fontFamily,
      color: modernStyles.colors.text
    }}>
      {/* Заголовок */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        padding: '1rem',
        backgroundColor: modernStyles.colors.surface,
        borderBottom: `1px solid ${modernStyles.colors.border}`,
        boxShadow: modernStyles.shadows.sm
      }}>
        <h1 style={{ 
          margin: 0, 
          fontSize: modernStyles.typography.fontSize['2xl'],
          fontWeight: modernStyles.typography.fontWeight.bold,
          color: modernStyles.colors.primary
        }}>
          NightwingRealm: Новгород
        </h1>
                           <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ 
              color: modernStyles.colors.textSecondary,
              fontSize: modernStyles.typography.fontSize.sm
            }}>
              {currentUser?.username} • {currentCharacter?.name}
            </span>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowCharacterSelect(true)}
            >
              Сменить персонажа
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setDebugMode(true)}
            >
              Debug
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleLogout}
            >
              Выйти
            </Button>
          </div>
      </div>
      
      {scene === 'city' && (
        <div style={{ padding: '1rem', maxWidth: '1200px', margin: '0 auto' }}>
          {/* Навигация */}
          <Navigation 
            items={[
              { id: 'main', label: 'Главная', icon: '🏠' },
              { id: 'expedition', label: 'Экспедиции', icon: '🗺️' },
              { id: 'skills', label: 'Способности', icon: '⚔️' },
              { id: 'inventory', label: 'Инвентарь', icon: '🎒' },
              { id: 'crafting', label: 'Кузница', icon: '⚒️' },
              { id: 'trade', label: 'Торговля', icon: '💰' }
            ]}
            activeItem={activeMenu}
            onItemClick={setActiveMenu}
          />

          {/* Основной контент */}
          <div style={{ marginTop: '1rem' }}>
            {activeMenu === 'main' && (
              <div style={{ display: 'grid', gap: '1rem' }}>
                {/* Карта */}
                <Card>
                  <h2 style={{ 
                    margin: '0 0 1rem 0',
                    fontSize: modernStyles.typography.fontSize.xl,
                    color: modernStyles.colors.text
                  }}>
                    Град Новгород
                  </h2>
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                    <CityMap map={mapData} position={position} onMove={handleMove} />
                  </div>
                  <p style={{ 
                    color: modernStyles.colors.textSecondary, 
                    textAlign: 'center',
                    fontSize: modernStyles.typography.fontSize.sm
                  }}>
                    Кликните по клетке для перемещения. Красная — вы.
                  </p>
                </Card>

                {/* Статус игрока */}
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))', 
                  gap: '1rem' 
                }}>
                  <PlayerStats player={player} game={game} />
                  <MaterialsPanel materials={materials} />
                </div>

                {/* Быстрые действия */}
                <Card>
                  <h3 style={{ 
                    margin: '0 0 1rem 0',
                    fontSize: modernStyles.typography.fontSize.lg,
                    color: modernStyles.colors.text
                  }}>
                    Быстрые действия
                  </h3>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fit, minmax(150px, 1fr))', 
                    gap: '0.5rem' 
                  }}>
                    <Button
                      variant="primary"
                      onClick={() => setActiveMenu('expedition')}
                    >
                      🗺️ Экспедиции
                    </Button>
                    <Button
                      variant="primary"
                      onClick={() => setActiveMenu('skills')}
                    >
                      ⚔️ Способности
                    </Button>
                    <Button
                      variant="primary"
                      onClick={() => setActiveMenu('crafting')}
                    >
                      ⚒️ Кузница
                    </Button>
                    <Button
                      variant="primary"
                      onClick={() => setActiveMenu('trade')}
                    >
                      💰 Торговля
                    </Button>
                  </div>
                </Card>
              </div>
            )}

            {activeMenu === 'expedition' && (
              <div style={{ display: 'grid', gap: '1rem' }}>
                <Card>
                  <h2 style={{ 
                    margin: '0 0 1rem 0',
                    fontSize: modernStyles.typography.fontSize.xl,
                    color: modernStyles.colors.text
                  }}>
                    Экспедиции
                  </h2>
                  <p style={{ 
                    color: modernStyles.colors.textSecondary,
                    marginBottom: '1rem'
                  }}>
                    Отправляйтесь в подземелья для поиска сокровищ и сражений с врагами.
                  </p>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(200px, 1fr))', 
                    gap: '0.5rem' 
                  }}>
                    <Button
                      variant="primary"
                      onClick={() => {
                        game.generateDungeon(1);
                        setScene('dungeon');
                      }}
                    >
                      🏰 Подземелье (Сложность 1)
                    </Button>
                    <Button
                      variant="primary"
                      onClick={() => {
                        game.generateDungeon(2);
                        setScene('dungeon');
                      }}
                    >
                      🏰 Подземелье (Сложность 2)
                    </Button>
                    <Button
                      variant="primary"
                      onClick={() => {
                        game.generateDungeon(3);
                        setScene('dungeon');
                      }}
                    >
                      🏰 Подземелье (Сложность 3)
                    </Button>
                  </div>
                </Card>
              </div>
            )}

            {activeMenu === 'skills' && (
              <SkillTree 
                player={player} 
                game={game}
                onSkillLearned={() => {
                  setPlayer({ ...game.player });
                }}
                onTalentLearned={() => {
                  setPlayer({ ...game.player });
                }}
              />
            )}

            {activeMenu === 'inventory' && (
              <div style={{ display: 'grid', gap: '1rem' }}>
                <Card>
                  <h2 style={{ 
                    margin: '0 0 1rem 0',
                    fontSize: modernStyles.typography.fontSize.xl,
                    color: modernStyles.colors.text
                  }}>
                    Инвентарь
                  </h2>
                  {inventory.length > 0 ? (
                    <InventoryPanel inventory={inventory} onUseItem={handleUseItem} />
                  ) : (
                    <p style={{ color: modernStyles.colors.textSecondary }}>
                      Инвентарь пуст
                    </p>
                  )}
                </Card>
              </div>
            )}

            {activeMenu === 'crafting' && (
              <div style={{ display: 'grid', gap: '1rem' }}>
                <Card>
                  <h2 style={{ 
                    margin: '0 0 1rem 0',
                    fontSize: modernStyles.typography.fontSize.xl,
                    color: modernStyles.colors.text
                  }}>
                    Кузница
                  </h2>
                  <Button
                    variant="primary"
                    onClick={() => setShowCrafting(true)}
                  >
                    Открыть кузницу
                  </Button>
                </Card>
              </div>
            )}

            {activeMenu === 'trade' && (
              <div style={{ display: 'grid', gap: '1rem' }}>
                <Card>
                  <h2 style={{ 
                    margin: '0 0 1rem 0',
                    fontSize: modernStyles.typography.fontSize.xl,
                    color: modernStyles.colors.text
                  }}>
                    Торговля
                  </h2>
                  <Button
                    variant="primary"
                    onClick={() => setShowTrade(true)}
                  >
                    Открыть торговлю
                  </Button>
                </Card>
              </div>
            )}
          </div>
        </div>
      )}
      
      {scene === 'combat' && (
        <CombatScreen
          player={game.player}
          enemy={enemy}
          onTurn={handleCombatTurn}
          onCombatEnd={handleCombatEnd}
          game={game}
        />
      )}

      {scene === 'dungeon' && (
        <div style={{ padding: '1rem', maxWidth: '1200px', margin: '0 auto' }}>
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ 
                margin: 0,
                fontSize: modernStyles.typography.fontSize.xl,
                color: modernStyles.colors.text
              }}>
                Подземелье
              </h2>
              <Button
                variant="secondary"
                onClick={() => {
                  game.returnToCity();
                  setScene('city');
                  setActiveMenu('main');
                }}
              >
                Вернуться в город
              </Button>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
              <CityMap map={game.map} position={position} onMove={handleMove} />
            </div>
            
            <p style={{ 
              color: modernStyles.colors.textSecondary, 
              textAlign: 'center',
              fontSize: modernStyles.typography.fontSize.sm
            }}>
              Исследуйте подземелье. Ищите сокровища и сражайтесь с врагами.
            </p>
          </Card>
        </div>
      )}

      {showTrade && (
        <TradeScreen
          game={game}
          onClose={() => setShowTrade(false)}
        />
      )}

      {showCrafting && (
        <CraftingScreen
          materials={materials}
          inventory={inventory}
          onCraft={handleCraft}
          onClose={() => setShowCrafting(false)}
          playerLevel={player.level}
        />
      )}
    </div>
  );
} 