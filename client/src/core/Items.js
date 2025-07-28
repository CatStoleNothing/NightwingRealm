// Система предметов
export class ItemSystem {
  // Типы предметов
  static ITEM_TYPES = {
    WEAPON: 'weapon',
    ARMOR: 'armor',
    POTION: 'potion',
    SCROLL: 'scroll',
    MATERIAL: 'material',
  };

  // Редкости
  static RARITIES = {
    COMMON: { name: 'Обычный', color: '#C0C0C0', multiplier: 1.0 },
    UNCOMMON: { name: 'Необычный', color: '#32CD32', multiplier: 1.2 },
    RARE: { name: 'Редкий', color: '#4169E1', multiplier: 1.5 },
    EPIC: { name: 'Эпический', color: '#8B008B', multiplier: 2.0 },
    LEGENDARY: { name: 'Легендарный', color: '#FFD700', multiplier: 3.0 },
  };

  // База оружия
  static WEAPONS = {
    sword: {
      name: 'Меч',
      type: 'weapon',
      rarity: 'COMMON',
      damage: 15,
      critChance: 0.1,
      effects: [],
      description: 'Обычный стальной меч',
      icon: '⚔️',
    },
    fireSword: {
      name: 'Огненный меч',
      type: 'weapon',
      rarity: 'RARE',
      damage: 20,
      critChance: 0.15,
      effects: [{ type: 'fire_damage', value: 5 }],
      description: 'Меч, зачарованный огнём',
      icon: '🔥⚔️',
    },
    lightningBlade: {
      name: 'Молния-клинок',
      type: 'weapon',
      rarity: 'EPIC',
      damage: 25,
      critChance: 0.2,
      effects: [{ type: 'electric_damage', value: 8 }],
      description: 'Клинок, излучающий электричество',
      icon: '⚡⚔️',
    },
    cursedBlade: {
      name: 'Проклятый клинок',
      type: 'weapon',
      rarity: 'LEGENDARY',
      damage: 30,
      critChance: 0.25,
      effects: [
        { type: 'curse_chance', value: 0.3 },
        { type: 'self_damage', value: 2 }
      ],
      description: 'Мощный, но опасный клинок',
      icon: '💀⚔️',
    },
    dragonBlade: {
      name: 'Драконий клинок',
      type: 'weapon',
      rarity: 'LEGENDARY',
      damage: 35,
      critChance: 0.3,
      effects: [
        { type: 'fire_damage', value: 10 },
        { type: 'dragon_fear', value: 0.2 }
      ],
      description: 'Клинок, выкованный из кости дракона',
      icon: '🐉⚔️',
    },
    shadowBlade: {
      name: 'Теневой кинжал',
      type: 'weapon',
      rarity: 'EPIC',
      damage: 22,
      critChance: 0.35,
      effects: [
        { type: 'shadow_step', value: 0.15 },
        { type: 'stealth_damage', value: 8 }
      ],
      description: 'Кинжал, скрытый в тенях',
      icon: '👻🗡️',
    },
  };

  // База брони
  static ARMORS = {
    leather: {
      name: 'Кожаная броня',
      type: 'armor',
      rarity: 'COMMON',
      armor: 3,
      dodge: 0.05,
      effects: [],
      description: 'Лёгкая кожаная броня',
      icon: '🛡️',
    },
    chainmail: {
      name: 'Кольчуга',
      type: 'armor',
      rarity: 'UNCOMMON',
      armor: 5,
      dodge: 0.02,
      effects: [],
      description: 'Надёжная металлическая кольчуга',
      icon: '🔗🛡️',
    },
    fireResistant: {
      name: 'Огнестойкая броня',
      type: 'armor',
      rarity: 'RARE',
      armor: 6,
      dodge: 0.03,
      effects: [{ type: 'fire_resistance', value: 0.5 }],
      description: 'Броня, защищающая от огня',
      icon: '🔥🛡️',
    },
    shadowArmor: {
      name: 'Теневые доспехи',
      type: 'armor',
      rarity: 'EPIC',
      armor: 8,
      dodge: 0.15,
      effects: [
        { type: 'shadow_step', value: 0.1 },
        { type: 'darkness_resistance', value: 0.8 }
      ],
      description: 'Доспехи из теней',
      icon: '👻🛡️',
    },
    dragonArmor: {
      name: 'Драконья броня',
      type: 'armor',
      rarity: 'LEGENDARY',
      armor: 12,
      dodge: 0.05,
      effects: [
        { type: 'fire_resistance', value: 0.8 },
        { type: 'dragon_fear', value: 0.3 },
        { type: 'armor_boost', value: 3 }
      ],
      description: 'Броня из чешуи дракона',
      icon: '🐉🛡️',
    },
    lightningArmor: {
      name: 'Громовая броня',
      type: 'armor',
      rarity: 'EPIC',
      armor: 9,
      dodge: 0.08,
      effects: [
        { type: 'electric_resistance', value: 0.7 },
        { type: 'lightning_reflect', value: 0.2 }
      ],
      description: 'Броня, поглощающая молнии',
      icon: '⚡🛡️',
    },
  };

  // База зелий
  static POTIONS = {
    healthPotion: {
      name: 'Зелье здоровья',
      type: 'potion',
      rarity: 'COMMON',
      heal: 30,
      effects: [{ type: 'heal', value: 30 }],
      description: 'Восстанавливает здоровье',
      consumable: true,
      icon: '❤️🧪',
    },
    staminaPotion: {
      name: 'Зелье выносливости',
      type: 'potion',
      rarity: 'COMMON',
      staminaRestore: 25,
      effects: [{ type: 'restore_stamina', value: 25 }],
      description: 'Восстанавливает выносливость',
      consumable: true,
      icon: '⚡🧪',
    },
    firePotion: {
      name: 'Огненное зелье',
      type: 'potion',
      rarity: 'RARE',
      effects: [
        { type: 'fire_damage_buff', value: 10, duration: 3 },
        { type: 'fire_resistance', value: 0.3, duration: 3 }
      ],
      description: 'Усиливает огненные атаки',
      consumable: true,
      icon: '🔥🧪',
    },
    poisonPotion: {
      name: 'Ядовитое зелье',
      type: 'potion',
      rarity: 'UNCOMMON',
      effects: [{ type: 'poison_weapon', value: 5, duration: 5 }],
      description: 'Отравляет оружие',
      consumable: true,
      icon: '☠️🧪',
    },
    lightningPotion: {
      name: 'Молниевое зелье',
      type: 'potion',
      rarity: 'RARE',
      effects: [
        { type: 'electric_damage_buff', value: 12, duration: 3 },
        { type: 'electric_resistance', value: 0.4, duration: 3 }
      ],
      description: 'Усиливает электрические атаки',
      consumable: true,
      icon: '⚡🧪',
    },
    shadowPotion: {
      name: 'Теневое зелье',
      type: 'potion',
      rarity: 'EPIC',
      effects: [
        { type: 'shadow_step', value: 0.2, duration: 5 },
        { type: 'stealth_damage', value: 15, duration: 3 }
      ],
      description: 'Позволяет скрываться в тенях',
      consumable: true,
      icon: '👻🧪',
    },
    dragonPotion: {
      name: 'Драконье зелье',
      type: 'potion',
      rarity: 'LEGENDARY',
      effects: [
        { type: 'dragon_fear', value: 0.5, duration: 5 },
        { type: 'fire_damage_buff', value: 20, duration: 3 },
        { type: 'armor_boost', value: 5, duration: 3 }
      ],
      description: 'Пробуждает силу дракона',
      consumable: true,
      icon: '🐉🧪',
    },
  };

  // Создание предмета с модификаторами
  static createItem(baseItem, rarity = 'COMMON', modifiers = []) {
    const rarityData = this.RARITIES[rarity];
    const item = { ...baseItem };
    
    item.rarity = rarity;
    item.rarityData = rarityData;
    item.key = Object.keys(this.WEAPONS).find(key => this.WEAPONS[key] === baseItem) ||
               Object.keys(this.ARMORS).find(key => this.ARMORS[key] === baseItem) ||
               Object.keys(this.POTIONS).find(key => this.POTIONS[key] === baseItem);
    
    // Применение множителя редкости
    if (item.damage) item.damage = Math.floor(item.damage * rarityData.multiplier);
    if (item.armor) item.armor = Math.floor(item.armor * rarityData.multiplier);
    if (item.critChance) item.critChance = Math.min(0.5, item.critChance * rarityData.multiplier);
    if (item.heal) item.heal = Math.floor(item.heal * rarityData.multiplier);
    if (item.staminaRestore) item.staminaRestore = Math.floor(item.staminaRestore * rarityData.multiplier);
    
    // Добавление модификаторов
    item.modifiers = modifiers;
    
    return item;
  }

  // Применение эффектов предмета к персонажу
  static applyItemEffects(player, item) {
    if (!item.effects) return player;

    const updatedPlayer = { ...player };
    
    item.effects.forEach(effect => {
      switch (effect.type) {
        case 'fire_damage':
          updatedPlayer.fireDamage = (updatedPlayer.fireDamage || 0) + effect.value;
          break;
        case 'electric_damage':
          updatedPlayer.electricDamage = (updatedPlayer.electricDamage || 0) + effect.value;
          break;
        case 'fire_resistance':
          updatedPlayer.resistances = updatedPlayer.resistances || {};
          updatedPlayer.resistances.fire = (updatedPlayer.resistances.fire || 0) + effect.value;
          break;
        case 'electric_resistance':
          updatedPlayer.resistances = updatedPlayer.resistances || {};
          updatedPlayer.resistances.electric = (updatedPlayer.resistances.electric || 0) + effect.value;
          break;
        case 'dodge':
          updatedPlayer.dodge = (updatedPlayer.dodge || 0) + effect.value;
          break;
        case 'armor':
          updatedPlayer.armor = (updatedPlayer.armor || 0) + effect.value;
          break;
        case 'crit_chance':
          updatedPlayer.critChance = (updatedPlayer.critChance || 0) + effect.value;
          break;
        case 'shadow_step':
          updatedPlayer.shadowStep = (updatedPlayer.shadowStep || 0) + effect.value;
          break;
        case 'dragon_fear':
          updatedPlayer.dragonFear = (updatedPlayer.dragonFear || 0) + effect.value;
          break;
        case 'armor_boost':
          updatedPlayer.armorBoost = (updatedPlayer.armorBoost || 0) + effect.value;
          break;
      }
    });

    return updatedPlayer;
  }

  // Использование зелья
  static usePotion(player, potion) {
    const updatedPlayer = { ...player };
    
    potion.effects.forEach(effect => {
      switch (effect.type) {
        case 'heal':
          updatedPlayer.hp = Math.min(100, updatedPlayer.hp + effect.value);
          break;
        case 'restore_stamina':
          updatedPlayer.stamina = Math.min(50, updatedPlayer.stamina + effect.value);
          break;
        case 'fire_damage_buff':
          updatedPlayer.tempEffects = updatedPlayer.tempEffects || [];
          updatedPlayer.tempEffects.push({
            type: 'fire_damage_buff',
            value: effect.value,
            duration: effect.duration
          });
          break;
        case 'electric_damage_buff':
          updatedPlayer.tempEffects = updatedPlayer.tempEffects || [];
          updatedPlayer.tempEffects.push({
            type: 'electric_damage_buff',
            value: effect.value,
            duration: effect.duration
          });
          break;
        case 'poison_weapon':
          updatedPlayer.tempEffects = updatedPlayer.tempEffects || [];
          updatedPlayer.tempEffects.push({
            type: 'poison_weapon',
            value: effect.value,
            duration: effect.duration
          });
          break;
        case 'shadow_step':
          updatedPlayer.tempEffects = updatedPlayer.tempEffects || [];
          updatedPlayer.tempEffects.push({
            type: 'shadow_step',
            value: effect.value,
            duration: effect.duration
          });
          break;
        case 'dragon_fear':
          updatedPlayer.tempEffects = updatedPlayer.tempEffects || [];
          updatedPlayer.tempEffects.push({
            type: 'dragon_fear',
            value: effect.value,
            duration: effect.duration
          });
          break;
        case 'armor_boost':
          updatedPlayer.tempEffects = updatedPlayer.tempEffects || [];
          updatedPlayer.tempEffects.push({
            type: 'armor_boost',
            value: effect.value,
            duration: effect.duration
          });
          break;
      }
    });

    return updatedPlayer;
  }

  // Генерация случайного предмета
  static generateRandomItem(level = 1) {
    const itemTypes = [this.WEAPONS, this.ARMORS, this.POTIONS];
    const typeIndex = Math.floor(Math.random() * itemTypes.length);
    const itemType = itemTypes[typeIndex];
    
    const itemKeys = Object.keys(itemType);
    const randomKey = itemKeys[Math.floor(Math.random() * itemKeys.length)];
    const baseItem = itemType[randomKey];
    
    // Определение редкости на основе уровня
    const rarityChances = {
      COMMON: 0.5,
      UNCOMMON: 0.3,
      RARE: 0.15,
      EPIC: 0.04,
      LEGENDARY: 0.01,
    };
    
    const rand = Math.random();
    let cumulative = 0;
    let selectedRarity = 'COMMON';
    
    for (const [rarity, chance] of Object.entries(rarityChances)) {
      cumulative += chance;
      if (rand <= cumulative) {
        selectedRarity = rarity;
        break;
      }
    }
    
    return this.createItem(baseItem, selectedRarity);
  }
} 