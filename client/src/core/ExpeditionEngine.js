// Движок экспедиций и вылазок
export class ExpeditionEngine {
  // Типы локаций
  static LOCATION_TYPES = {
    FOREST: 'forest',
    SWAMP: 'swamp',
    MOUNTAIN: 'mountain',
    CAVE: 'cave',
    RUINS: 'ruins',
    VILLAGE: 'village'
  };

  // Типы событий
  static EVENT_TYPES = {
    COMBAT: 'combat',
    TREASURE: 'treasure',
    TRAP: 'trap',
    NPC: 'npc',
    REST: 'rest',
    PUZZLE: 'puzzle',
    BOSS: 'boss'
  };

  // Цели экспедиций
  static EXPEDITION_GOALS = {
    KILL_BOSS: 'kill_boss',
    FIND_ITEM: 'find_item',
    REACH_END: 'reach_end',
    COLLECT_MATERIALS: 'collect_materials',
    RESCUE_NPC: 'rescue_npc'
  };

  // Создание экспедиции
  static createExpedition(type, difficulty, goal) {
    const expedition = {
      id: Date.now().toString(),
      type,
      difficulty,
      goal,
      map: this.generateMap(type, difficulty),
      playerPosition: { x: 1, y: 1 },
      discovered: new Set(),
      events: [],
      bossDefeated: false,
      itemFound: false,
      materialsCollected: 0,
      npcRescued: false,
      steps: 0,
      maxSteps: 50,
      status: 'active', // active, completed, failed
      rewards: {
        gold: 0,
        experience: 0,
        items: [],
        materials: {}
      }
    };

    // Генерируем события на карте
    this.generateEvents(expedition);
    
    return expedition;
  }

  // Генерация карты экспедиции
  static generateMap(type, difficulty) {
    const size = 8 + difficulty * 2; // 8x8 для сложности 1, 10x10 для сложности 2, и т.д.
    const map = [];

    for (let y = 0; y < size; y++) {
      const row = [];
      for (let x = 0; x < size; x++) {
        if (x === 0 || x === size - 1 || y === 0 || y === size - 1) {
          row.push(1); // Стены по краям
        } else {
          // Случайные препятствия
          const obstacleChance = 0.1 + (difficulty * 0.05);
          row.push(Math.random() < obstacleChance ? 1 : 0);
        }
      }
      map.push(row);
    }

    // Обеспечиваем проходимость
    this.ensurePath(map);
    
    return map;
  }

  // Обеспечение проходимости карты
  static ensurePath(map) {
    const height = map.length;
    const width = map[0].length;
    
    // Создаем путь от начала до конца
    let x = 1, y = 1;
    const path = [];
    
    while (x < width - 2 || y < height - 2) {
      path.push({ x, y });
      
      if (x < width - 2 && Math.random() < 0.6) {
        x++;
      } else if (y < height - 2) {
        y++;
      }
    }
    
    // Очищаем путь
    path.forEach(pos => {
      map[pos.y][pos.x] = 0;
    });
  }

  // Генерация событий на карте
  static generateEvents(expedition) {
    const map = expedition.map;
    const height = map.length;
    const width = map[0].length;
    const eventCount = Math.floor((height * width) * 0.15); // 15% клеток с событиями

    for (let i = 0; i < eventCount; i++) {
      let x, y;
      do {
        x = Math.floor(Math.random() * (width - 2)) + 1;
        y = Math.floor(Math.random() * (height - 2)) + 1;
      } while (map[y][x] !== 0 || (x === 1 && y === 1));

      const event = this.createRandomEvent(expedition.type, expedition.difficulty);
      map[y][x] = 2; // Клетка с событием
      expedition.events.push({
        x, y, ...event
      });
    }

    // Добавляем босса в конце
    const bossX = width - 2;
    const bossY = height - 2;
    map[bossY][bossX] = 3; // Клетка с боссом
    expedition.events.push({
      x: bossX,
      y: bossY,
      type: 'boss',
      enemy: this.createBoss(expedition.type, expedition.difficulty),
      description: 'Вы встретили могущественного врага!'
    });
  }

  // Создание случайного события
  static createRandomEvent(locationType, difficulty) {
    const events = [
      {
        type: 'combat',
        enemy: this.createRandomEnemy(locationType, difficulty),
        description: 'Враги нападают!'
      },
      {
        type: 'treasure',
        gold: 10 + difficulty * 5,
        experience: 5 + difficulty * 3,
        description: 'Вы нашли сокровище!'
      },
      {
        type: 'trap',
        damage: 5 + difficulty * 2,
        description: 'Ловушка!'
      },
      {
        type: 'rest',
        heal: 20 + difficulty * 5,
        description: 'Безопасное место для отдыха'
      },
      {
        type: 'puzzle',
        reward: { gold: 15, experience: 10 },
        description: 'Загадка требует решения'
      }
    ];

    return events[Math.floor(Math.random() * events.length)];
  }

  // Создание случайного врага
  static createRandomEnemy(locationType, difficulty) {
    const enemies = {
      forest: ['leshy', 'forestSpirit', 'kikimora'],
      swamp: ['vodyanoy', 'rusalka', 'kikimora'],
      mountain: ['zmey', 'babaYaga', 'koshchei'],
      cave: ['domovoy', 'koshchei', 'babaYaga'],
      ruins: ['koshchei', 'babaYaga', 'zmey'],
      village: ['kikimora', 'domovoy', 'leshy']
    };

    const locationEnemies = enemies[locationType] || enemies.forest;
    const enemyType = locationEnemies[Math.floor(Math.random() * locationEnemies.length)];
    
    return {
      type: enemyType,
      level: difficulty,
      hp: 50 + difficulty * 20,
      stats: {
        str: 8 + difficulty * 2,
        agi: 6 + difficulty * 2,
        int: 5 + difficulty * 2
      }
    };
  }

  // Создание босса
  static createBoss(locationType, difficulty) {
    const bosses = {
      forest: 'leshy',
      swamp: 'vodyanoy',
      mountain: 'zmey',
      cave: 'koshchei',
      ruins: 'babaYaga',
      village: 'kikimora'
    };

    const bossType = bosses[locationType] || 'koshchei';
    
    return {
      type: bossType,
      level: difficulty + 2,
      hp: 100 + difficulty * 30,
      stats: {
        str: 12 + difficulty * 3,
        agi: 10 + difficulty * 3,
        int: 8 + difficulty * 3
      },
      isBoss: true
    };
  }

  // Перемещение по экспедиции
  static move(expedition, dx, dy) {
    const { x, y } = expedition.playerPosition;
    const newX = x + dx;
    const newY = y + dy;

    // Проверка границ
    if (newX < 0 || newX >= expedition.map[0].length || 
        newY < 0 || newY >= expedition.map.length) {
      return { success: false, message: 'Нельзя выйти за границы карты' };
    }

    // Проверка препятствий
    if (expedition.map[newY][newX] === 1) {
      return { success: false, message: 'Препятствие на пути' };
    }

    // Перемещение
    expedition.playerPosition = { x: newX, y: newY };
    expedition.steps++;
    expedition.discovered.add(`${newX},${newY}`);

    // Проверка лимита шагов
    if (expedition.steps >= expedition.maxSteps) {
      expedition.status = 'failed';
      return { success: true, message: 'Время экспедиции истекло!', gameOver: true };
    }

    // Проверка события на клетке
    const cellType = expedition.map[newY][newX];
    if (cellType === 2 || cellType === 3) {
      const event = expedition.events.find(e => e.x === newX && e.y === newY);
      if (event) {
        return { success: true, event, message: event.description };
      }
    }

    return { success: true, message: 'Перемещение успешно' };
  }

  // Обработка события
  static handleEvent(expedition, event, player) {
    switch (event.type) {
      case 'combat':
        return this.handleCombat(event, player);
      
      case 'treasure':
        return this.handleTreasure(event, expedition);
      
      case 'trap':
        return this.handleTrap(event, player);
      
      case 'rest':
        return this.handleRest(event, player);
      
      case 'puzzle':
        return this.handlePuzzle(event, expedition);
      
      case 'boss':
        return this.handleBoss(event, player, expedition);
      
      default:
        return { success: false, message: 'Неизвестное событие' };
    }
  }

  // Обработка боя
  static handleCombat(event, player) {
    const enemy = event.enemy;
    const combatResult = Math.random() < 0.7; // 70% шанс победы

    if (combatResult) {
      const rewards = {
        gold: 10 + enemy.level * 5,
        experience: 15 + enemy.level * 10,
        items: Math.random() < 0.3 ? [{ type: 'potion', rarity: 'COMMON' }] : []
      };

      return {
        success: true,
        victory: true,
        rewards,
        message: `Победа над ${enemy.type}!`
      };
    } else {
      const damage = Math.floor(enemy.stats.str * 0.5);
      return {
        success: true,
        victory: false,
        damage,
        message: 'Поражение в бою!'
      };
    }
  }

  // Обработка сокровища
  static handleTreasure(event, expedition) {
    expedition.rewards.gold += event.gold;
    expedition.rewards.experience += event.experience;

    return {
      success: true,
      rewards: {
        gold: event.gold,
        experience: event.experience
      },
      message: `Найдено сокровище: ${event.gold} золота, ${event.experience} опыта`
    };
  }

  // Обработка ловушки
  static handleTrap(event, player) {
    const damage = event.damage;
    player.hp = Math.max(1, player.hp - damage);

    return {
      success: true,
      damage,
      message: `Ловушка нанесла ${damage} урона!`
    };
  }

  // Обработка отдыха
  static handleRest(event, player) {
    const heal = event.heal;
    player.hp = Math.min(100, player.hp + heal);

    return {
      success: true,
      heal,
      message: `Отдых восстановил ${heal} здоровья`
    };
  }

  // Обработка загадки
  static handlePuzzle(event, expedition) {
    const solved = Math.random() < 0.6; // 60% шанс решения

    if (solved) {
      expedition.rewards.gold += event.reward.gold;
      expedition.rewards.experience += event.reward.experience;

      return {
        success: true,
        solved: true,
        rewards: event.reward,
        message: 'Загадка решена!'
      };
    } else {
      return {
        success: true,
        solved: false,
        message: 'Загадка оказалась слишком сложной'
      };
    }
  }

  // Обработка босса
  static handleBoss(event, player, expedition) {
    const boss = event.enemy;
    const victory = Math.random() < 0.4; // 40% шанс победы над боссом

    if (victory) {
      expedition.bossDefeated = true;
      expedition.rewards.gold += 100 + boss.level * 20;
      expedition.rewards.experience += 50 + boss.level * 30;
      expedition.rewards.items.push({ type: 'weapon', rarity: 'RARE' });

      return {
        success: true,
        victory: true,
        bossDefeated: true,
        rewards: expedition.rewards,
        message: `Победа над боссом ${boss.type}!`
      };
    } else {
      const damage = Math.floor(boss.stats.str * 1.5);
      return {
        success: true,
        victory: false,
        damage,
        message: 'Босс оказался слишком силен!'
      };
    }
  }

  // Проверка завершения экспедиции
  static checkExpeditionComplete(expedition) {
    const { goal } = expedition;

    switch (goal) {
      case 'kill_boss':
        return expedition.bossDefeated;
      
      case 'find_item':
        return expedition.itemFound;
      
      case 'reach_end':
        const { x, y } = expedition.playerPosition;
        return x === expedition.map[0].length - 2 && y === expedition.map.length - 2;
      
      case 'collect_materials':
        return expedition.materialsCollected >= 10;
      
      case 'rescue_npc':
        return expedition.npcRescued;
      
      default:
        return false;
    }
  }

  // Получение доступных экспедиций
  static getAvailableExpeditions(playerLevel) {
    const expeditions = [
      {
        id: 'forest_1',
        name: 'Лесная тропа',
        type: 'forest',
        difficulty: 1,
        goal: 'kill_boss',
        description: 'Исследуйте лесную тропу и победите Лешего',
        requiredLevel: 1,
        rewards: { gold: 50, experience: 30 }
      },
      {
        id: 'swamp_1',
        name: 'Болотные топи',
        type: 'swamp',
        difficulty: 2,
        goal: 'find_item',
        description: 'Найдите древний артефакт в болотах',
        requiredLevel: 3,
        rewards: { gold: 80, experience: 50 }
      },
      {
        id: 'mountain_1',
        name: 'Горные пещеры',
        type: 'mountain',
        difficulty: 3,
        goal: 'reach_end',
        description: 'Доберитесь до конца пещеры',
        requiredLevel: 5,
        rewards: { gold: 120, experience: 80 }
      },
      {
        id: 'ruins_1',
        name: 'Древние руины',
        type: 'ruins',
        difficulty: 4,
        goal: 'collect_materials',
        description: 'Соберите редкие материалы',
        requiredLevel: 7,
        rewards: { gold: 150, experience: 100 }
      }
    ];

    return expeditions.filter(exp => exp.requiredLevel <= playerLevel);
  }
} 