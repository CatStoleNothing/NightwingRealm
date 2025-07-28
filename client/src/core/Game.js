import { SaveSystem } from './SaveSystem';
import { CraftingSystem } from './CraftingSystem';
import { ItemSystem } from './Items';
import { MapGenerator } from './MapGenerator';
import { SkillSystem } from './SkillSystem';

// Типы клеток карты (устаревшие, используем MapGenerator)
export const CellType = { EMPTY:0, WALL:1, EVENT:2 };

// Генерируем карту города
export const mapData = MapGenerator.generateCity(20, 15).map;

export class Player {
  constructor() {
    this.stats = { str: 10, agi: 10, int: 10 };
    this.inventory = [];
    this.skills = [];
    this.talents = [];
    this.hp = 100;
    this.maxHp = 100;
    this.stamina = 50;
    this.maxStamina = 50;
    this.mana = 20;
    this.maxMana = 20;
    this.armor = 2;
    this.dodge = 0.1;
    this.resistances = { fire: 0.2, water: 0.1 };
    this.effects = [];
    this.tempEffects = [];
    this.level = 1;
    this.experience = 0;
    this.skillPoints = 0;
    this.talentPoints = 0;
  }
}

export class Game {
  constructor() {
    this.player = new Player();
    this.map = mapData;
    this.scene = 'city'; // city, dungeon, combat, crafting, expedition
    this.position = { x: 1, y: 1 };
    this.storyFlags = {};
    this.inventory = [];
    this.materials = {
      iron: 5,
      steel: 2,
      herbs: 8,
      crystal: 3,
      fireEssence: 1,
    };
    this.combatLog = [];
    this.settings = {};
    this.gold = 100; // Начальное золото
    this.currentDungeon = null;
    this.expeditionData = null;

    // Применяем эффекты талантов к игроку
    this.player = SkillSystem.applyTalentEffects(this.player, this.player.talents);

    // Загрузка сохранения при инициализации
    this.loadGame();

    // Настройка автосохранения
    SaveSystem.setupAutoSave(this, () => {
      console.log('Игра обновлена, автосохранение выполнено');
    });
  }

  loadGame() {
    const saveData = SaveSystem.loadSave();
    if (saveData) {
      // Восстанавливаем состояние игры
      if (saveData.player) {
        this.player = { ...this.player, ...saveData.player };
      }
      if (saveData.game) {
        this.scene = saveData.game.scene;
        this.position = saveData.game.position;
        this.storyFlags = saveData.game.storyFlags;
        this.map = saveData.game.map;
      }
      if (saveData.inventory) {
        this.inventory = saveData.inventory;
      }
      if (saveData.materials) {
        this.materials = saveData.materials;
      }
      if (saveData.combatLog) {
        this.combatLog = saveData.combatLog;
      }
      if (saveData.settings) {
        this.settings = saveData.settings;
      }
      if (saveData.gold) {
        this.gold = saveData.gold;
      }
      console.log('Игра загружена из сохранения');
    }
  }

  move(dx, dy) {
    const { x, y } = this.position;
    const nx = x + dx, ny = y + dy;
    
    // Проверяем границы карты
    if (nx < 0 || nx >= this.map[0].length || ny < 0 || ny >= this.map.length) {
      return false;
    }
    
    if (this.map[ny][nx] !== MapGenerator.CELL_TYPES.WALL) {
      this.position = { x: nx, y: ny };
      
      // Обрабатываем различные типы клеток
      const cellType = this.map[ny][nx];
      if (cellType === MapGenerator.CELL_TYPES.EVENT) {
        this.triggerEvent(nx, ny);
      } else if (cellType === MapGenerator.CELL_TYPES.TREASURE) {
        this.triggerTreasure(nx, ny);
      } else if (cellType === MapGenerator.CELL_TYPES.ENEMY) {
        this.triggerCombat(nx, ny);
      } else if (cellType === MapGenerator.CELL_TYPES.SHOP) {
        this.triggerShop(nx, ny);
      } else if (cellType === MapGenerator.CELL_TYPES.HEALING) {
        this.triggerHealing(nx, ny);
      } else if (cellType === MapGenerator.CELL_TYPES.BOSS) {
        this.triggerBoss(nx, ny);
      }
      
      return true;
    }
    return false;
  }

  triggerEvent(x, y) {
    // Случайное событие
    const events = ['combat', 'material', 'item', 'skill_point', 'talent_point'];
    const event = events[Math.floor(Math.random() * events.length)];

    switch (event) {
      case 'combat':
        this.scene = 'combat';
        break;
      case 'material':
        this.addRandomMaterial();
        break;
      case 'item':
        this.addRandomItem();
        break;
      case 'skill_point':
        this.player.skillPoints++;
        console.log('Получен очко способностей!');
        break;
      case 'talent_point':
        this.player.talentPoints++;
        console.log('Получен очко талантов!');
        break;
    }
  }

  triggerTreasure(x, y) {
    // Сокровище
    const treasureTypes = ['gold', 'item', 'material', 'skill_point'];
    const type = treasureTypes[Math.floor(Math.random() * treasureTypes.length)];
    
    switch (type) {
      case 'gold':
        const goldAmount = Math.floor(Math.random() * 50) + 10;
        this.gold += goldAmount;
        console.log(`Найдено золото: ${goldAmount}`);
        break;
      case 'item':
        this.addRandomItem();
        break;
      case 'material':
        this.addRandomMaterial();
        break;
      case 'skill_point':
        this.player.skillPoints++;
        console.log('Найдено очко способностей!');
        break;
    }
    
    // Убираем сокровище с карты
    this.map[y][x] = MapGenerator.CELL_TYPES.EMPTY;
  }

  triggerCombat(x, y) {
    // Бой с врагом
    this.scene = 'combat';
    console.log('Начинается бой!');
  }

  triggerShop(x, y) {
    // Магазин
    this.scene = 'shop';
    console.log('Вход в магазин');
  }

  triggerHealing(x, y) {
    // Лечение
    const healAmount = Math.floor(this.player.maxHp * 0.3);
    this.player.hp = Math.min(this.player.maxHp, this.player.hp + healAmount);
    console.log(`Восстановлено здоровья: ${healAmount}`);
  }

  triggerBoss(x, y) {
    // Босс
    this.scene = 'boss_combat';
    console.log('Бой с боссом!');
  }

  addRandomMaterial() {
    const materialKeys = Object.keys(CraftingSystem.MATERIALS);
    const randomMaterial = materialKeys[Math.floor(Math.random() * materialKeys.length)];
    const count = Math.floor(Math.random() * 3) + 1;

    this.materials[randomMaterial] = (this.materials[randomMaterial] || 0) + count;

    const material = CraftingSystem.MATERIALS[randomMaterial];
    console.log(`Найдено: ${material.icon} ${material.name} x${count}`);
  }

  addRandomItem() {
    const item = ItemSystem.generateRandomItem(this.player.level);
    this.inventory.push(item);
    console.log(`Найден предмет: ${item.name}`);
  }

  switchScene(newScene) {
    this.scene = newScene;
  }

  // Методы для крафта
  craftItem(recipeKey) {
    const recipe = CraftingSystem.RECIPES[recipeKey];
    if (!recipe) return { success: false, message: 'Рецепт не найден' };

    const result = CraftingSystem.craft(recipe, this.materials, this.player.level);

    if (result.success) {
      this.inventory.push(result.item);
      this.materials = result.materials;
    } else {
      this.materials = result.materials;
    }

    return result;
  }

  // Методы для инвентаря
  useItem(itemIndex) {
    if (itemIndex >= 0 && itemIndex < this.inventory.length) {
      const item = this.inventory[itemIndex];

      if (item.type === 'potion') {
        this.player = ItemSystem.usePotion(this.player, item);
        this.inventory.splice(itemIndex, 1);
        return { success: true, message: `Использовано: ${item.name}` };
      } else {
        this.player = ItemSystem.applyItemEffects(this.player, item);
        return { success: true, message: `Экипировано: ${item.name}` };
      }
    }
    return { success: false, message: 'Предмет не найден' };
  }

  // Методы для опыта и уровней
  addExperience(amount) {
    this.player.experience += amount;

    // Проверка повышения уровня
    const expNeeded = this.player.level * 100;
    if (this.player.experience >= expNeeded) {
      this.player.level++;
      this.player.experience -= expNeeded;
      
      // Улучшение характеристик
      this.player.stats.str += 2;
      this.player.stats.agi += 1;
      this.player.stats.int += 1;
      this.player.maxHp += 10;
      this.player.hp = Math.min(this.player.maxHp, this.player.hp + 10);
      this.player.maxStamina += 5;
      this.player.stamina = Math.min(this.player.maxStamina, this.player.stamina + 5);
      this.player.maxMana += 5;
      this.player.mana = Math.min(this.player.maxMana, this.player.mana + 5);

      // Даем очки способностей и талантов
      this.player.skillPoints += 1;
      this.player.talentPoints += 1;

      console.log(`Уровень повышен! Теперь уровень ${this.player.level}`);
      return { leveledUp: true, newLevel: this.player.level };
    }

    return { leveledUp: false };
  }

  // Обработка победы над врагом
  handleCombatVictory(enemy) {
    const { CombatEngine } = require('./CombatEngine');
    const loot = CombatEngine.generateLoot(enemy);
    
    // Добавляем золото
    this.gold += loot.gold;
    
    // Добавляем опыт
    const levelUp = this.addExperience(loot.experience);
    
    // Добавляем предметы в инвентарь
    loot.items.forEach(item => {
      this.inventory.push(item);
    });

    console.log(`Победа над ${enemy.name}!`);
    console.log(`Получено: ${loot.gold} золота, ${loot.experience} опыта`);
    if (loot.items.length > 0) {
      console.log(`Найдены предметы: ${loot.items.map(item => item.name).join(', ')}`);
    }

    return {
      gold: loot.gold,
      experience: loot.experience,
      items: loot.items,
      levelUp: levelUp.leveledUp,
      newLevel: levelUp.newLevel
    };
  }

  // Покупка предмета
  buyItem(item, price) {
    if (this.gold >= price) {
      this.gold -= price;
      this.inventory.push(item);
      console.log(`Куплен ${item.name} за ${price} золота`);
      return true;
    }
    console.log('Недостаточно золота!');
    return false;
  }

  // Продажа предмета
  sellItem(itemIndex, price) {
    if (itemIndex >= 0 && itemIndex < this.inventory.length) {
      const item = this.inventory[itemIndex];
      this.gold += price;
      this.inventory.splice(itemIndex, 1);
      console.log(`Продано ${item.name} за ${price} золота`);
      return true;
    }
    return false;
  }

  // Получение цены продажи (обычно 50% от цены покупки)
  getSellPrice(item) {
    const basePrice = item.price || 10;
    return Math.floor(basePrice * 0.5);
  }

  // Генерация подземелья
  generateDungeon(difficulty = 1) {
    this.currentDungeon = MapGenerator.generateDungeon(15, 15, difficulty);
    this.map = this.currentDungeon.map;
    this.position = { x: 1, y: 1 };
    this.scene = 'dungeon';
    console.log(`Сгенерировано подземелье сложности ${difficulty}`);
  }

  // Возврат в город
  returnToCity() {
    this.map = mapData;
    this.position = { x: 1, y: 1 };
    this.scene = 'city';
    this.currentDungeon = null;
    console.log('Возврат в город');
  }

  // Изучение способности
  learnSkill(skillId) {
    if (this.player.skillPoints > 0) {
      const success = SkillSystem.learnSkill(skillId, this.player.skills);
      if (success) {
        this.player.skillPoints--;
        console.log(`Изучена способность: ${SkillSystem.ACTIVE_SKILLS[skillId].name}`);
        return true;
      }
    }
    return false;
  }

  // Изучение таланта
  learnTalent(talentId) {
    if (this.player.talentPoints > 0) {
      const success = SkillSystem.learnTalent(talentId, this.player.talents);
      if (success) {
        this.player.talentPoints--;
        // Применяем эффекты талантов
        this.player = SkillSystem.applyTalentEffects(this.player, this.player.talents);
        console.log(`Изучен талант: ${SkillSystem.PASSIVE_TALENTS[talentId].name}`);
        return true;
      }
    }
    return false;
  }

  // Использование способности
  useSkill(skillId, target) {
    return SkillSystem.useSkill(skillId, this.player, target, this.player.skills);
  }

  // Обновление перезарядки способностей
  updateSkillCooldowns() {
    SkillSystem.updateCooldowns(this.player.skills);
  }

  // Очистка при закрытии
  cleanup() {
    SaveSystem.stopAutoSave(this);
  }
} 