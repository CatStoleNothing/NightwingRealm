// Система крафта
export class CraftingSystem {
  // Материалы
  static MATERIALS = {
    iron: {
      name: 'Железо',
      rarity: 'COMMON',
      description: 'Обычное железо',
      icon: '🔩',
    },
    steel: {
      name: 'Сталь',
      rarity: 'UNCOMMON',
      description: 'Прочная сталь',
      icon: '⚔️',
    },
    fireEssence: {
      name: 'Сущность огня',
      rarity: 'RARE',
      description: 'Концентрированная огненная энергия',
      icon: '🔥',
    },
    lightningEssence: {
      name: 'Сущность молнии',
      rarity: 'RARE',
      description: 'Электрическая энергия',
      icon: '⚡',
    },
    shadowEssence: {
      name: 'Теневая сущность',
      rarity: 'EPIC',
      description: 'Тёмная магия',
      icon: '👻',
    },
    dragonBone: {
      name: 'Кость дракона',
      rarity: 'LEGENDARY',
      description: 'Мощный материал',
      icon: '🦴',
    },
    herbs: {
      name: 'Травы',
      rarity: 'COMMON',
      description: 'Лечебные травы',
      icon: '🌿',
    },
    crystal: {
      name: 'Кристалл',
      rarity: 'UNCOMMON',
      description: 'Магический кристалл',
      icon: '💎',
    },
  };

  // Рецепты крафта
  static RECIPES = {
    // Оружие
    sword: {
      name: 'Меч',
      type: 'weapon',
      materials: { iron: 3, steel: 1 },
      result: 'sword',
      difficulty: 1,
      description: 'Обычный стальной меч',
    },
    fireSword: {
      name: 'Огненный меч',
      type: 'weapon',
      materials: { steel: 2, fireEssence: 1, crystal: 1 },
      result: 'fireSword',
      difficulty: 3,
      description: 'Меч, зачарованный огнём',
    },
    lightningBlade: {
      name: 'Молния-клинок',
      type: 'weapon',
      materials: { steel: 3, lightningEssence: 2, crystal: 2 },
      result: 'lightningBlade',
      difficulty: 4,
      description: 'Клинок, излучающий электричество',
    },
    cursedBlade: {
      name: 'Проклятый клинок',
      type: 'weapon',
      materials: { dragonBone: 1, shadowEssence: 3, crystal: 3 },
      result: 'cursedBlade',
      difficulty: 5,
      description: 'Мощный, но опасный клинок',
    },

    // Броня
    leatherArmor: {
      name: 'Кожаная броня',
      type: 'armor',
      materials: { herbs: 2, iron: 1 },
      result: 'leather',
      difficulty: 1,
      description: 'Лёгкая кожаная броня',
    },
    chainmail: {
      name: 'Кольчуга',
      type: 'armor',
      materials: { iron: 4, steel: 2 },
      result: 'chainmail',
      difficulty: 2,
      description: 'Надёжная металлическая кольчуга',
    },
    fireResistantArmor: {
      name: 'Огнестойкая броня',
      type: 'armor',
      materials: { steel: 3, fireEssence: 1, crystal: 1 },
      result: 'fireResistant',
      difficulty: 3,
      description: 'Броня, защищающая от огня',
    },
    shadowArmor: {
      name: 'Теневые доспехи',
      type: 'armor',
      materials: { shadowEssence: 2, crystal: 2, steel: 2 },
      result: 'shadowArmor',
      difficulty: 4,
      description: 'Доспехи из теней',
    },

    // Зелья
    healthPotion: {
      name: 'Зелье здоровья',
      type: 'potion',
      materials: { herbs: 2, crystal: 1 },
      result: 'healthPotion',
      difficulty: 1,
      description: 'Восстанавливает здоровье',
    },
    staminaPotion: {
      name: 'Зелье выносливости',
      type: 'potion',
      materials: { herbs: 3, crystal: 1 },
      result: 'staminaPotion',
      difficulty: 1,
      description: 'Восстанавливает выносливость',
    },
    firePotion: {
      name: 'Огненное зелье',
      type: 'potion',
      materials: { fireEssence: 1, herbs: 2, crystal: 2 },
      result: 'firePotion',
      difficulty: 3,
      description: 'Усиливает огненные атаки',
    },
    poisonPotion: {
      name: 'Ядовитое зелье',
      type: 'potion',
      materials: { herbs: 3, shadowEssence: 1 },
      result: 'poisonPotion',
      difficulty: 2,
      description: 'Отравляет оружие',
    },
  };

  // Проверка возможности крафта
  static canCraft(recipe, materials) {
    for (const [material, required] of Object.entries(recipe.materials)) {
      if (!materials[material] || materials[material] < required) {
        return false;
      }
    }
    return true;
  }

  // Выполнение крафта
  static craft(recipe, materials, playerLevel = 1) {
    if (!this.canCraft(recipe, materials)) {
      return { success: false, message: 'Недостаточно материалов' };
    }

    // Шанс успеха зависит от сложности и уровня игрока
    const successChance = Math.min(0.9, 0.5 + (playerLevel * 0.1) - (recipe.difficulty * 0.1));
    const isSuccess = Math.random() < successChance;

    if (isSuccess) {
      // Удаляем использованные материалы
      const newMaterials = { ...materials };
      for (const [material, required] of Object.entries(recipe.materials)) {
        newMaterials[material] -= required;
        if (newMaterials[material] <= 0) {
          delete newMaterials[material];
        }
      }

      // Создаём предмет
      const { ItemSystem } = require('./Items');
      let baseItem;
      
      if (recipe.type === 'weapon') {
        baseItem = ItemSystem.WEAPONS[recipe.result];
      } else if (recipe.type === 'armor') {
        baseItem = ItemSystem.ARMORS[recipe.result];
      } else if (recipe.type === 'potion') {
        baseItem = ItemSystem.POTIONS[recipe.result];
      }

      const craftedItem = ItemSystem.createItem(baseItem);

      return {
        success: true,
        item: craftedItem,
        materials: newMaterials,
        message: `Успешно создан ${craftedItem.name}!`,
      };
    } else {
      // При неудаче теряем часть материалов
      const newMaterials = { ...materials };
      for (const [material, required] of Object.entries(recipe.materials)) {
        const lost = Math.floor(required * 0.5);
        newMaterials[material] -= lost;
        if (newMaterials[material] <= 0) {
          delete newMaterials[material];
        }
      }

      return {
        success: false,
        materials: newMaterials,
        message: 'Крафт не удался! Потеряны материалы.',
      };
    }
  }

  // Получение доступных рецептов
  static getAvailableRecipes(materials, playerLevel = 1) {
    const available = [];
    
    for (const [key, recipe] of Object.entries(this.RECIPES)) {
      if (this.canCraft(recipe, materials) && recipe.difficulty <= playerLevel) {
        available.push({ key, ...recipe });
      }
    }

    return available.sort((a, b) => a.difficulty - b.difficulty);
  }

  // Получение информации о рецепте
  static getRecipeInfo(recipeKey) {
    const recipe = this.RECIPES[recipeKey];
    if (!recipe) return null;

    const materialInfo = [];
    for (const [material, count] of Object.entries(recipe.materials)) {
      const materialData = this.MATERIALS[material];
      materialInfo.push({
        name: materialData.name,
        icon: materialData.icon,
        count,
        rarity: materialData.rarity,
      });
    }

    return {
      ...recipe,
      materials: materialInfo,
    };
  }
} 