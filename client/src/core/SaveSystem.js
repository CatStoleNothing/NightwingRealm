// Система автоматического сохранения
export class SaveSystem {
  static SAVE_KEY = 'nightwingrealm_save';
  static AUTO_SAVE_INTERVAL = 5000; // 5 секунд

  // Структура сохранения
  static createSaveData(gameState) {
    return {
      timestamp: Date.now(),
      version: '1.0.0',
      player: {
        stats: gameState.player.stats,
        hp: gameState.player.hp,
        stamina: gameState.player.stamina,
        mana: gameState.player.mana,
        armor: gameState.player.armor,
        dodge: gameState.player.dodge,
        resistances: gameState.player.resistances,
        effects: gameState.player.effects,
        tempEffects: gameState.player.tempEffects,
        level: gameState.player.level || 1,
        experience: gameState.player.experience || 0,
      },
      game: {
        scene: gameState.scene,
        position: gameState.position,
        storyFlags: gameState.storyFlags,
        map: gameState.map,
      },
      inventory: gameState.inventory || [],
      materials: gameState.materials || {},
      combatLog: gameState.combatLog || [],
      settings: gameState.settings || {},
      gold: gameState.gold || 100,
    };
  }

  // Автоматическое сохранение
  static autoSave(gameState) {
    try {
      const saveData = this.createSaveData(gameState);
      localStorage.setItem(this.SAVE_KEY, JSON.stringify(saveData));
      console.log('Автосохранение выполнено:', new Date().toLocaleTimeString());
    } catch (error) {
      console.error('Ошибка автосохранения:', error);
    }
  }

  // Загрузка сохранения
  static loadSave() {
    try {
      const saveData = localStorage.getItem(this.SAVE_KEY);
      if (!saveData) {
        return null;
      }

      const parsed = JSON.parse(saveData);
      
      // Проверка версии
      if (parsed.version !== '1.0.0') {
        console.warn('Версия сохранения отличается, может потребоваться миграция');
      }

      return parsed;
    } catch (error) {
      console.error('Ошибка загрузки сохранения:', error);
      return null;
    }
  }

  // Применение сохранённых данных к игре
  static applySaveData(saveData, game) {
    if (!saveData) return false;

    try {
      // Восстанавливаем игрока
      if (saveData.player) {
        game.player = { ...game.player, ...saveData.player };
      }

      // Восстанавливаем состояние игры
      if (saveData.game) {
        game.scene = saveData.game.scene;
        game.position = saveData.game.position;
        game.storyFlags = saveData.game.storyFlags;
        game.map = saveData.game.map;
      }

      // Восстанавливаем золото
      if (saveData.gold) {
        game.gold = saveData.gold;
      }

      return true;
    } catch (error) {
      console.error('Ошибка применения сохранения:', error);
      return false;
    }
  }

  // Удаление сохранения
  static deleteSave() {
    try {
      localStorage.removeItem(this.SAVE_KEY);
      console.log('Сохранение удалено');
      return true;
    } catch (error) {
      console.error('Ошибка удаления сохранения:', error);
      return false;
    }
  }

  // Проверка наличия сохранения
  static hasSave() {
    try {
      return localStorage.getItem(this.SAVE_KEY) !== null;
    } catch (error) {
      return false;
    }
  }

  // Получение времени последнего сохранения
  static getLastSaveTime() {
    try {
      const saveData = this.loadSave();
      if (saveData && saveData.timestamp) {
        return new Date(saveData.timestamp);
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  // Экспорт сохранения
  static exportSave() {
    try {
      const saveData = localStorage.getItem(this.SAVE_KEY);
      if (!saveData) return null;

      const dataStr = JSON.stringify(JSON.parse(saveData), null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      
      const link = document.createElement('a');
      link.href = URL.createObjectURL(dataBlob);
      link.download = `nightwingrealm_save_${Date.now()}.json`;
      link.click();
      
      return true;
    } catch (error) {
      console.error('Ошибка экспорта сохранения:', error);
      return false;
    }
  }

  // Импорт сохранения
  static importSave(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const saveData = JSON.parse(e.target.result);
          
          // Проверка структуры
          if (!saveData.player || !saveData.game) {
            throw new Error('Неверный формат файла сохранения');
          }

          localStorage.setItem(this.SAVE_KEY, JSON.stringify(saveData));
          console.log('Сохранение импортировано');
          resolve(true);
        } catch (error) {
          console.error('Ошибка импорта сохранения:', error);
          reject(error);
        }
      };

      reader.onerror = () => reject(new Error('Ошибка чтения файла'));
      reader.readAsText(file);
    });
  }

  // Настройка автосохранения
  static setupAutoSave(gameInstance, updateCallback) {
    const autoSaveInterval = setInterval(() => {
      const gameState = {
        player: gameInstance.player,
        scene: gameInstance.scene,
        position: gameInstance.position,
        storyFlags: gameInstance.storyFlags,
        map: gameInstance.map,
        inventory: gameInstance.inventory,
        materials: gameInstance.materials,
        combatLog: gameInstance.combatLog,
        settings: gameInstance.settings,
      };

      this.autoSave(gameState);
      
      if (updateCallback) {
        updateCallback();
      }
    }, this.AUTO_SAVE_INTERVAL);

    // Сохраняем интервал для возможности остановки
    gameInstance.autoSaveInterval = autoSaveInterval;

    // Сохранение при закрытии страницы
    window.addEventListener('beforeunload', () => {
      const gameState = {
        player: gameInstance.player,
        scene: gameInstance.scene,
        position: gameInstance.position,
        storyFlags: gameInstance.storyFlags,
        map: gameInstance.map,
        inventory: gameInstance.inventory,
        materials: gameInstance.materials,
        combatLog: gameInstance.combatLog,
        settings: gameInstance.settings,
      };
      this.autoSave(gameState);
    });

    return autoSaveInterval;
  }

  // Остановка автосохранения
  static stopAutoSave(gameInstance) {
    if (gameInstance.autoSaveInterval) {
      clearInterval(gameInstance.autoSaveInterval);
      gameInstance.autoSaveInterval = null;
    }
  }
} 