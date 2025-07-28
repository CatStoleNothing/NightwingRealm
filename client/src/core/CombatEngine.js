// Движок боя с расширенной системой
export class CombatEngine {
  constructor() {
    this.turn = 0;
    this.combatLog = [];
  }

  // Эффекты
  static EFFECTS = {
    STUN: 'stun',           // Ошеломление
    BLIND: 'blind',         // Ослепление
    PROVOKE: 'provoke',     // Провокация
    POISON: 'poison',       // Яд
    BURN: 'burn',           // Ожог
    SHOCK: 'shock',         // Шок
    BLEED: 'bleed',         // Кровотечение
    CURSE: 'curse',         // Проклятие
    REGEN: 'regen',         // Регенерация
    SHIELD: 'shield',       // Щит
  };

  // Стихии
  static ELEMENTS = {
    FIRE: 'fire',
    WATER: 'water',
    ELECTRIC: 'electric',
    PHYSICAL: 'physical',
  };

  // Расчёт урона с учётом всех модификаторов
  calculateDamage(attacker, defender, attackZone, blockZone, damageType = 'physical') {
    let baseDamage = attacker.stats.str * 2;
    
    // Модификаторы зон
    const zoneModifiers = {
      head: { damage: 1.5, accuracy: 0.7, critChance: 0.3 }, // Голова — больше урона, крит, но сложнее попасть
      body: { damage: 1.0, accuracy: 1.0, critChance: 0.1 }, // Тело — стандартно
      legs: { damage: 0.8, accuracy: 1.2, critChance: 0.05 }, // Ноги — меньше урона, но легче попасть
    };

    const attackMod = zoneModifiers[attackZone];

    // Проверка ошеломления
    if (attacker.effects?.find(e => e.type === CombatEngine.EFFECTS.STUN)) {
      return { damage: 0, message: 'Ошеломлён! Пропуск хода.' };
    }

    // Проверка уклонения
    const dodgeChance = (defender.stats.agi / 20) + (defender.dodge || 0);
    if (Math.random() < dodgeChance) {
      return { damage: 0, message: 'Уклонение!' };
    }

    // Проверка попадания (ослепление снижает точность)
    const blindPenalty = attacker.effects?.find(e => e.type === CombatEngine.EFFECTS.BLIND) ? 0.5 : 1;
    const accuracy = attackMod.accuracy * (attacker.stats.agi / 10) * blindPenalty;
    if (Math.random() > accuracy) {
      return { damage: 0, message: 'Промах!' };
    }

    // Расчёт урона
    let damage = baseDamage * attackMod.damage;
    
    // Критический удар
    const critChance = attackMod.critChance + (attacker.critChance || 0);
    const isCrit = Math.random() < critChance;
    if (isCrit) {
      damage *= 2; // Критический урон x2
    }

    // Блок
    if (attackZone === blockZone) {
      damage *= 0.3; // Блокированный урон
    }

    // Броня
    const armor = defender.armor || 0;
    damage = Math.max(1, damage - armor);

    // Стихийный урон и сопротивления
    if (damageType !== 'physical') {
      const resistance = defender.resistances?.[damageType] || 0;
      damage *= (1 - resistance);
    }

    // Случайность
    damage *= 0.8 + Math.random() * 0.4; // ±20%
    
    const finalDamage = Math.floor(damage);
    let message = `Урон: ${finalDamage}`;
    if (isCrit) message += ' (КРИТ!)';
    if (damageType !== 'physical') message += ` (${damageType})`;
    
    return { 
      damage: finalDamage, 
      message,
      isCrit,
      damageType
    };
  }

  // Применение эффектов
  applyEffects(target, effects) {
    if (!target.effects) target.effects = [];
    
    effects.forEach(effect => {
      const existingEffect = target.effects.find(e => e.type === effect.type);
      if (existingEffect) {
        existingEffect.duration = Math.max(existingEffect.duration, effect.duration);
      } else {
        target.effects.push({ ...effect, duration: effect.duration });
      }
    });
  }

  // Обработка эффектов в начале хода
  processEffects(target) {
    if (!target.effects) return;
    
    const messages = [];
    target.effects = target.effects.filter(effect => {
      effect.duration--;
      
      // Действие эффекта
      switch (effect.type) {
        case CombatEngine.EFFECTS.POISON:
          const poisonDamage = Math.floor(target.stats.str * 0.5);
          target.hp = Math.max(0, target.hp - poisonDamage);
          messages.push(`Яд наносит ${poisonDamage} урона`);
          break;
        case CombatEngine.EFFECTS.BURN:
          const burnDamage = Math.floor(target.stats.str * 0.3);
          target.hp = Math.max(0, target.hp - burnDamage);
          messages.push(`Ожог наносит ${burnDamage} урона`);
          break;
        case CombatEngine.EFFECTS.BLEED:
          const bleedDamage = Math.floor(target.stats.str * 0.4);
          target.hp = Math.max(0, target.hp - bleedDamage);
          messages.push(`Кровотечение наносит ${bleedDamage} урона`);
          break;
        case CombatEngine.EFFECTS.SHOCK:
          target.stamina = Math.max(0, target.stamina - 10);
          messages.push('Шок снижает выносливость');
          break;
        case CombatEngine.EFFECTS.REGEN:
          const regenAmount = Math.floor(target.stats.str * 0.3);
          target.hp = Math.min(target.hp + regenAmount, 100);
          messages.push(`Регенерация восстанавливает ${regenAmount} здоровья`);
          break;
        case CombatEngine.EFFECTS.CURSE:
          target.stats.str = Math.max(1, target.stats.str - 2);
          messages.push('Проклятие снижает силу');
          break;
      }
      
      return effect.duration > 0;
    });
    
    return messages;
  }

  // Ход игрока
  playerTurn(player, enemy, attackZone, blockZone, damageType = 'physical') {
    // Обработка эффектов
    const playerEffectMessages = this.processEffects(player);
    const enemyEffectMessages = this.processEffects(enemy);
    
    const result = this.calculateDamage(player, enemy, attackZone, blockZone, damageType);
    
    if (result.damage > 0) {
      enemy.hp = Math.max(0, enemy.hp - result.damage);
      
      // Шанс наложения эффектов при критическом ударе
      if (result.isCrit) {
        const effects = [];
        if (damageType === 'fire' && Math.random() < 0.3) {
          effects.push({ type: CombatEngine.EFFECTS.BURN, duration: 3 });
        }
        if (damageType === 'electric' && Math.random() < 0.2) {
          effects.push({ type: CombatEngine.EFFECTS.SHOCK, duration: 2 });
        }
        if (Math.random() < 0.1) {
          effects.push({ type: CombatEngine.EFFECTS.BLEED, duration: 2 });
        }
        if (effects.length > 0) {
          this.applyEffects(enemy, effects);
        }
      }
    }

    // Расход выносливости
    player.stamina = Math.max(0, player.stamina - 5);

    // Логирование
    let logMessage = `Вы атакуете ${attackZone}, защищаете ${blockZone}. ${result.message}`;
    if (playerEffectMessages?.length) logMessage += ` | Эффекты: ${playerEffectMessages.join(', ')}`;
    if (enemyEffectMessages?.length) logMessage += ` | Враг: ${enemyEffectMessages.join(', ')}`;
    
    this.combatLog.push(logMessage);
    
    return { enemy, player, message: result.message };
  }

  // ИИ врага с расширенной логикой
  enemyTurn(enemy, player) {
    // Обработка эффектов
    const enemyEffectMessages = this.processEffects(enemy);
    const playerEffectMessages = this.processEffects(player);

    const zones = ['head', 'body', 'legs'];
    let attackZone = zones[Math.floor(Math.random() * zones.length)];
    let blockZone = zones[Math.floor(Math.random() * zones.length)];

    // Умная логика в зависимости от типа врага
    if (enemy.type === 'ведьма') {
      // Баба-Яга предпочитает атаковать голову и защищать тело
      attackZone = Math.random() < 0.6 ? 'head' : zones[Math.floor(Math.random() * zones.length)];
      blockZone = Math.random() < 0.7 ? 'body' : zones[Math.floor(Math.random() * zones.length)];
    } else if (enemy.type === 'дух леса') {
      // Леший предпочитает ноги
      attackZone = Math.random() < 0.5 ? 'legs' : zones[Math.floor(Math.random() * zones.length)];
    } else if (enemy.type === 'дух природы') {
      // Лесной дух - быстрый и ловкий
      attackZone = Math.random() < 0.4 ? 'head' : Math.random() < 0.4 ? 'body' : 'legs';
      blockZone = Math.random() < 0.6 ? 'body' : zones[Math.floor(Math.random() * zones.length)];
    } else if (enemy.type === 'водный дух') {
      // Водяной - сильный, но медленный
      attackZone = Math.random() < 0.7 ? 'body' : zones[Math.floor(Math.random() * zones.length)];
      blockZone = Math.random() < 0.8 ? 'body' : zones[Math.floor(Math.random() * zones.length)];
    } else if (enemy.type === 'водная нежить') {
      // Русалка - очень ловкая
      attackZone = Math.random() < 0.3 ? 'head' : Math.random() < 0.3 ? 'body' : 'legs';
      blockZone = Math.random() < 0.4 ? 'head' : Math.random() < 0.4 ? 'body' : 'legs';
    } else if (enemy.type === 'домовой дух') {
      // Кикимора - хитрый и магический
      attackZone = Math.random() < 0.5 ? 'head' : zones[Math.floor(Math.random() * zones.length)];
      blockZone = Math.random() < 0.6 ? 'head' : zones[Math.floor(Math.random() * zones.length)];
    } else if (enemy.type === 'хранитель дома') {
      // Домовой - защитник
      attackZone = zones[Math.floor(Math.random() * zones.length)];
      blockZone = Math.random() < 0.8 ? 'body' : zones[Math.floor(Math.random() * zones.length)];
    } else if (enemy.type === 'дракон') {
      // Змей Горыныч - мощный
      attackZone = Math.random() < 0.6 ? 'head' : Math.random() < 0.6 ? 'body' : 'legs';
      blockZone = Math.random() < 0.7 ? 'body' : zones[Math.floor(Math.random() * zones.length)];
    } else if (enemy.type === 'древний злодей') {
      // Кощей Бессмертный - опытный
      attackZone = Math.random() < 0.5 ? 'head' : Math.random() < 0.5 ? 'body' : 'legs';
      blockZone = Math.random() < 0.6 ? 'body' : zones[Math.floor(Math.random() * zones.length)];
    }

    // Выбор типа урона (может быть стихийным)
    const damageTypes = ['physical', 'fire', 'water', 'electric'];
    let damageType = damageTypes[Math.floor(Math.random() * damageTypes.length)];

    // Специальные способности врагов
    if (enemy.type === 'ведьма' && Math.random() < 0.4) {
      damageType = 'fire'; // Баба-Яга любит огонь
    } else if (enemy.type === 'водный дух' && Math.random() < 0.5) {
      damageType = 'water'; // Водяной использует воду
    } else if (enemy.type === 'водная нежить' && Math.random() < 0.6) {
      damageType = 'water'; // Русалка тоже водная
    } else if (enemy.type === 'домовой дух' && Math.random() < 0.3) {
      damageType = 'electric'; // Кикимора использует электричество
    } else if (enemy.type === 'дракон' && Math.random() < 0.7) {
      damageType = 'fire'; // Змей Горыныч дышит огнём
    }

    const result = this.calculateDamage(enemy, player, attackZone, blockZone, damageType);

    if (result.damage > 0) {
      player.hp = Math.max(0, player.hp - result.damage);

      // Эффекты от врагов
      const effects = [];
      
      // Уникальные эффекты для каждого типа врага
      if (enemy.type === 'ведьма' && Math.random() < 0.3) {
        effects.push({ type: CombatEngine.EFFECTS.CURSE, duration: 2 });
      }
      if (enemy.type === 'дух леса' && Math.random() < 0.2) {
        effects.push({ type: CombatEngine.EFFECTS.POISON, duration: 3 });
      }
      if (enemy.type === 'дух природы' && Math.random() < 0.25) {
        effects.push({ type: CombatEngine.EFFECTS.BLIND, duration: 2 });
      }
      if (enemy.type === 'водный дух' && Math.random() < 0.3) {
        effects.push({ type: CombatEngine.EFFECTS.SHOCK, duration: 2 });
      }
      if (enemy.type === 'водная нежить' && Math.random() < 0.4) {
        effects.push({ type: CombatEngine.EFFECTS.PROVOKE, duration: 1 });
      }
      if (enemy.type === 'домовой дух' && Math.random() < 0.35) {
        effects.push({ type: CombatEngine.EFFECTS.STUN, duration: 1 });
      }
      if (enemy.type === 'хранитель дома' && Math.random() < 0.2) {
        effects.push({ type: CombatEngine.EFFECTS.SHIELD, duration: 2 });
      }
      if (enemy.type === 'дракон' && Math.random() < 0.5) {
        effects.push({ type: CombatEngine.EFFECTS.BURN, duration: 3 });
      }
      if (enemy.type === 'древний злодей' && Math.random() < 0.4) {
        effects.push({ type: CombatEngine.EFFECTS.CURSE, duration: 3 });
      }

      // Эффекты от стихийного урона
      if (damageType === 'fire' && Math.random() < 0.4) {
        effects.push({ type: CombatEngine.EFFECTS.BURN, duration: 2 });
      }
      if (damageType === 'electric' && Math.random() < 0.3) {
        effects.push({ type: CombatEngine.EFFECTS.SHOCK, duration: 2 });
      }
      if (damageType === 'water' && Math.random() < 0.2) {
        effects.push({ type: CombatEngine.EFFECTS.SHOCK, duration: 1 });
      }

      if (effects.length > 0) {
        this.applyEffects(player, effects);
      }
    }

    // Логирование
    let logMessage = `${enemy.name} атакует ${attackZone}, защищает ${blockZone}. ${result.message}`;
    if (enemyEffectMessages?.length) logMessage += ` | Эффекты: ${enemyEffectMessages.join(', ')}`;
    if (playerEffectMessages?.length) logMessage += ` | Вы: ${playerEffectMessages.join(', ')}`;

    this.combatLog.push(logMessage);

    return { player, enemy, message: result.message };
  }

  // Проверка окончания боя
  isCombatOver(player, enemy) {
    return player.hp <= 0 || enemy.hp <= 0;
  }

  // Получить результат боя
  getCombatResult(player, enemy) {
    if (player.hp <= 0) return 'defeat';
    if (enemy.hp <= 0) return 'victory';
    return 'ongoing';
  }

  // Создание врага с эффектами
  createEnemy(type) {
    const enemies = {
      koshchei: {
        name: 'Кощей',
        type: 'бессмертный',
        hp: 80,
        stats: { str: 12, agi: 8, int: 15 },
        armor: 5,
        resistances: { fire: 0.5, poison: 0.8 },
        effects: [],
        drop: {
          gold: { min: 50, max: 100 },
          experience: { min: 30, max: 50 },
          items: [
            { chance: 0.3, type: 'potion', rarity: 'COMMON' },
            { chance: 0.1, type: 'weapon', rarity: 'UNCOMMON' },
            { chance: 0.05, type: 'armor', rarity: 'RARE' }
          ]
        }
      },
      babaYaga: {
        name: 'Баба-Яга',
        type: 'ведьма',
        hp: 60,
        stats: { str: 8, agi: 12, int: 18 },
        dodge: 0.2,
        resistances: { fire: 0.3, electric: 0.5 },
        effects: [],
        drop: {
          gold: { min: 40, max: 80 },
          experience: { min: 25, max: 40 },
          items: [
            { chance: 0.4, type: 'potion', rarity: 'COMMON' },
            { chance: 0.15, type: 'weapon', rarity: 'UNCOMMON' },
            { chance: 0.08, type: 'armor', rarity: 'RARE' }
          ]
        }
      },
      leshy: {
        name: 'Леший',
        type: 'дух леса',
        hp: 70,
        stats: { str: 14, agi: 10, int: 8 },
        armor: 3,
        resistances: { water: 0.7, poison: 0.9 },
        effects: [],
        drop: {
          gold: { min: 30, max: 60 },
          experience: { min: 20, max: 35 },
          items: [
            { chance: 0.5, type: 'potion', rarity: 'COMMON' },
            { chance: 0.1, type: 'weapon', rarity: 'UNCOMMON' },
            { chance: 0.03, type: 'armor', rarity: 'RARE' }
          ]
        }
      },
      // Новые враги из славянских сказок
      forestSpirit: {
        name: 'Лесной дух',
        type: 'дух природы',
        hp: 65,
        stats: { str: 11, agi: 15, int: 12 },
        dodge: 0.25,
        resistances: { water: 0.6, poison: 0.8, fire: 0.3 },
        effects: [],
        drop: {
          gold: { min: 35, max: 70 },
          experience: { min: 22, max: 38 },
          items: [
            { chance: 0.45, type: 'potion', rarity: 'COMMON' },
            { chance: 0.12, type: 'weapon', rarity: 'UNCOMMON' },
            { chance: 0.04, type: 'armor', rarity: 'RARE' }
          ]
        }
      },
      vodyanoy: {
        name: 'Водяной',
        type: 'водный дух',
        hp: 75,
        stats: { str: 13, agi: 9, int: 14 },
        armor: 4,
        resistances: { water: 0.9, fire: 0.2, electric: 0.4 },
        effects: [],
        drop: {
          gold: { min: 45, max: 85 },
          experience: { min: 28, max: 45 },
          items: [
            { chance: 0.35, type: 'potion', rarity: 'COMMON' },
            { chance: 0.13, type: 'weapon', rarity: 'UNCOMMON' },
            { chance: 0.06, type: 'armor', rarity: 'RARE' }
          ]
        }
      },
      rusalka: {
        name: 'Русалка',
        type: 'водная нежить',
        hp: 55,
        stats: { str: 7, agi: 18, int: 16 },
        dodge: 0.3,
        resistances: { water: 0.8, fire: 0.1, electric: 0.3 },
        effects: [],
        drop: {
          gold: { min: 60, max: 120 },
          experience: { min: 35, max: 55 },
          items: [
            { chance: 0.4, type: 'potion', rarity: 'COMMON' },
            { chance: 0.18, type: 'weapon', rarity: 'UNCOMMON' },
            { chance: 0.08, type: 'armor', rarity: 'RARE' }
          ]
        }
      },
      kikimora: {
        name: 'Кикимора',
        type: 'домовой дух',
        hp: 50,
        stats: { str: 6, agi: 16, int: 20 },
        dodge: 0.35,
        resistances: { fire: 0.4, electric: 0.6, poison: 0.7 },
        effects: [],
        drop: {
          gold: { min: 70, max: 140 },
          experience: { min: 40, max: 65 },
          items: [
            { chance: 0.5, type: 'potion', rarity: 'COMMON' },
            { chance: 0.2, type: 'weapon', rarity: 'UNCOMMON' },
            { chance: 0.1, type: 'armor', rarity: 'RARE' }
          ]
        }
      },
      domovoy: {
        name: 'Домовой',
        type: 'хранитель дома',
        hp: 85,
        stats: { str: 16, agi: 8, int: 10 },
        armor: 6,
        resistances: { fire: 0.7, water: 0.5, electric: 0.6 },
        effects: [],
        drop: {
          gold: { min: 80, max: 160 },
          experience: { min: 45, max: 70 },
          items: [
            { chance: 0.3, type: 'potion', rarity: 'COMMON' },
            { chance: 0.25, type: 'weapon', rarity: 'UNCOMMON' },
            { chance: 0.12, type: 'armor', rarity: 'RARE' }
          ]
        }
      },
      zmey: {
        name: 'Змей Горыныч',
        type: 'дракон',
        hp: 120,
        stats: { str: 20, agi: 12, int: 14 },
        armor: 8,
        resistances: { fire: 0.9, water: 0.3, electric: 0.5 },
        effects: [],
        drop: {
          gold: { min: 200, max: 400 },
          experience: { min: 100, max: 150 },
          items: [
            { chance: 0.6, type: 'potion', rarity: 'COMMON' },
            { chance: 0.4, type: 'weapon', rarity: 'UNCOMMON' },
            { chance: 0.25, type: 'armor', rarity: 'RARE' },
            { chance: 0.1, type: 'weapon', rarity: 'EPIC' },
            { chance: 0.05, type: 'armor', rarity: 'EPIC' }
          ]
        }
      },
      koscheyImmortal: {
        name: 'Кощей Бессмертный',
        type: 'древний злодей',
        hp: 100,
        stats: { str: 15, agi: 10, int: 18 },
        armor: 7,
        resistances: { fire: 0.6, water: 0.4, electric: 0.5, poison: 0.9 },
        effects: [],
        drop: {
          gold: { min: 300, max: 600 },
          experience: { min: 150, max: 250 },
          items: [
            { chance: 0.7, type: 'potion', rarity: 'COMMON' },
            { chance: 0.5, type: 'weapon', rarity: 'UNCOMMON' },
            { chance: 0.3, type: 'armor', rarity: 'RARE' },
            { chance: 0.15, type: 'weapon', rarity: 'EPIC' },
            { chance: 0.1, type: 'armor', rarity: 'EPIC' },
            { chance: 0.05, type: 'weapon', rarity: 'LEGENDARY' },
            { chance: 0.03, type: 'armor', rarity: 'LEGENDARY' }
          ]
        }
      }
    };

    return enemies[type] || enemies.koshchei;
  }

  // Система дропа с врагов
  generateLoot(enemy) {
    const { ItemSystem } = require('./Items');
    const loot = {
      gold: 0,
      experience: 0,
      items: []
    };

    // Золото
    if (enemy.drop?.gold) {
      loot.gold = Math.floor(
        Math.random() * (enemy.drop.gold.max - enemy.drop.gold.min + 1) + 
        enemy.drop.gold.min
      );
    }

    // Опыт (всегда выпадает)
    if (enemy.drop?.experience) {
      loot.experience = Math.floor(
        Math.random() * (enemy.drop.experience.max - enemy.drop.experience.min + 1) + 
        enemy.drop.experience.min
      );
    }

    // Предметы
    if (enemy.drop?.items) {
      enemy.drop.items.forEach(itemDrop => {
        if (Math.random() < itemDrop.chance) {
          let item;
          
          if (itemDrop.type === 'potion') {
            const potions = Object.keys(ItemSystem.POTIONS);
            const randomPotion = potions[Math.floor(Math.random() * potions.length)];
            item = ItemSystem.createItem(ItemSystem.POTIONS[randomPotion]);
          } else if (itemDrop.type === 'weapon') {
            const weapons = Object.keys(ItemSystem.WEAPONS);
            const randomWeapon = weapons[Math.floor(Math.random() * weapons.length)];
            item = ItemSystem.createItem(ItemSystem.WEAPONS[randomWeapon]);
          } else if (itemDrop.type === 'armor') {
            const armors = Object.keys(ItemSystem.ARMORS);
            const randomArmor = armors[Math.floor(Math.random() * armors.length)];
            item = ItemSystem.createItem(ItemSystem.ARMORS[randomArmor]);
          }

          if (item) {
            loot.items.push(item);
          }
        }
      });
    }

    return loot;
  }
} 