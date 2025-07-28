// Система генерации карт для подземелий и локаций
export class MapGenerator {
  static CELL_TYPES = {
    EMPTY: 0,
    WALL: 1,
    EVENT: 2,
    TREASURE: 3,
    ENEMY: 4,
    EXIT: 5,
    SHOP: 6,
    HEALING: 7,
    BOSS: 8
  };

  // Генерация карты подземелья
  static generateDungeon(width = 15, height = 15, difficulty = 1) {
    const map = Array(height).fill().map(() => Array(width).fill(this.CELL_TYPES.WALL));
    
    // Создаем комнаты
    const rooms = this.generateRooms(width, height, difficulty);
    
    // Размещаем комнаты на карте
    rooms.forEach(room => {
      for (let y = room.y; y < room.y + room.height; y++) {
        for (let x = room.x; x < room.x + room.width; x++) {
          if (y >= 0 && y < height && x >= 0 && x < width) {
            map[y][x] = this.CELL_TYPES.EMPTY;
          }
        }
      }
    });

    // Соединяем комнаты коридорами
    this.connectRooms(map, rooms);
    
    // Размещаем объекты
    this.placeObjects(map, rooms, difficulty);
    
    return {
      map,
      rooms,
      difficulty,
      width,
      height
    };
  }

  // Генерация комнат
  static generateRooms(width, height, difficulty) {
    const rooms = [];
    const minRoomSize = 3;
    const maxRoomSize = 6 + difficulty;
    const roomCount = 5 + difficulty * 2;

    for (let i = 0; i < roomCount; i++) {
      let attempts = 0;
      let room;
      
      do {
        room = {
          x: Math.floor(Math.random() * (width - minRoomSize)),
          y: Math.floor(Math.random() * (height - minRoomSize)),
          width: Math.floor(Math.random() * (maxRoomSize - minRoomSize + 1)) + minRoomSize,
          height: Math.floor(Math.random() * (maxRoomSize - minRoomSize + 1)) + minRoomSize
        };
        attempts++;
      } while (this.roomsOverlap(room, rooms) && attempts < 100);

      if (attempts < 100) {
        rooms.push(room);
      }
    }

    return rooms;
  }

  // Проверка пересечения комнат
  static roomsOverlap(room, existingRooms) {
    return existingRooms.some(existing => 
      room.x < existing.x + existing.width + 1 &&
      room.x + room.width + 1 > existing.x &&
      room.y < existing.y + existing.height + 1 &&
      room.y + room.height + 1 > existing.y
    );
  }

  // Соединение комнат коридорами
  static connectRooms(map, rooms) {
    for (let i = 0; i < rooms.length - 1; i++) {
      const room1 = rooms[i];
      const room2 = rooms[i + 1];
      
      const startX = Math.floor(room1.x + room1.width / 2);
      const startY = Math.floor(room1.y + room1.height / 2);
      const endX = Math.floor(room2.x + room2.width / 2);
      const endY = Math.floor(room2.y + room2.height / 2);

      // Создаем L-образный коридор
      this.createCorridor(map, startX, startY, endX, endY);
    }
  }

  // Создание коридора
  static createCorridor(map, startX, startY, endX, endY) {
    // Горизонтальная часть
    const stepX = startX < endX ? 1 : -1;
    for (let x = startX; x !== endX; x += stepX) {
      if (x >= 0 && x < map[0].length && startY >= 0 && startY < map.length) {
        map[startY][x] = this.CELL_TYPES.EMPTY;
      }
    }

    // Вертикальная часть
    const stepY = startY < endY ? 1 : -1;
    for (let y = startY; y !== endY; y += stepY) {
      if (endX >= 0 && endX < map[0].length && y >= 0 && y < map.length) {
        map[y][endX] = this.CELL_TYPES.EMPTY;
      }
    }
  }

  // Размещение объектов на карте
  static placeObjects(map, rooms, difficulty) {
    rooms.forEach((room, index) => {
      const centerX = Math.floor(room.x + room.width / 2);
      const centerY = Math.floor(room.y + room.height / 2);

      if (index === 0) {
        // Первая комната - вход
        map[centerY][centerX] = this.CELL_TYPES.EMPTY;
      } else if (index === rooms.length - 1) {
        // Последняя комната - босс
        map[centerY][centerX] = this.CELL_TYPES.BOSS;
      } else {
        // Случайные объекты в других комнатах
        const objectType = this.getRandomObjectType(difficulty);
        map[centerY][centerX] = objectType;
      }
    });

    // Добавляем случайные события в коридорах
    this.addRandomEvents(map, difficulty);
  }

  // Получение случайного типа объекта
  static getRandomObjectType(difficulty) {
    const chances = {
      [this.CELL_TYPES.TREASURE]: 0.3,
      [this.CELL_TYPES.ENEMY]: 0.4,
      [this.CELL_TYPES.SHOP]: 0.1,
      [this.CELL_TYPES.HEALING]: 0.2
    };

    const rand = Math.random();
    let cumulative = 0;
    
    for (const [type, chance] of Object.entries(chances)) {
      cumulative += chance;
      if (rand <= cumulative) {
        return parseInt(type);
      }
    }

    return this.CELL_TYPES.EMPTY;
  }

  // Добавление случайных событий
  static addRandomEvents(map, difficulty) {
    const eventCount = 3 + difficulty;
    
    for (let i = 0; i < eventCount; i++) {
      let x, y;
      do {
        x = Math.floor(Math.random() * map[0].length);
        y = Math.floor(Math.random() * map.length);
      } while (map[y][x] !== this.CELL_TYPES.EMPTY);

      map[y][x] = this.CELL_TYPES.EVENT;
    }
  }

  // Генерация карты города
  static generateCity(width = 20, height = 15) {
    const map = Array(height).fill().map(() => Array(width).fill(this.CELL_TYPES.EMPTY));
    
    // Создаем основные здания
    const buildings = [
      { type: this.CELL_TYPES.SHOP, x: 3, y: 3, width: 3, height: 2 },
      { type: this.CELL_TYPES.HEALING, x: 8, y: 3, width: 2, height: 2 },
      { type: this.CELL_TYPES.EVENT, x: 15, y: 8, width: 2, height: 2 },
      { type: this.CELL_TYPES.EVENT, x: 5, y: 10, width: 2, height: 2 }
    ];

    buildings.forEach(building => {
      for (let y = building.y; y < building.y + building.height; y++) {
        for (let x = building.x; x < building.x + building.width; x++) {
          if (y >= 0 && y < height && x >= 0 && x < width) {
            map[y][x] = building.type;
          }
        }
      }
    });

    return {
      map,
      buildings,
      width,
      height
    };
  }

  // Получение описания клетки
  static getCellDescription(cellType) {
    const descriptions = {
      [this.CELL_TYPES.EMPTY]: 'Пустое пространство',
      [this.CELL_TYPES.WALL]: 'Стена',
      [this.CELL_TYPES.EVENT]: 'Событие',
      [this.CELL_TYPES.TREASURE]: 'Сокровище',
      [this.CELL_TYPES.ENEMY]: 'Враг',
      [this.CELL_TYPES.EXIT]: 'Выход',
      [this.CELL_TYPES.SHOP]: 'Магазин',
      [this.CELL_TYPES.HEALING]: 'Лечение',
      [this.CELL_TYPES.BOSS]: 'Босс'
    };

    return descriptions[cellType] || 'Неизвестно';
  }

  // Получение иконки клетки
  static getCellIcon(cellType) {
    const icons = {
      [this.CELL_TYPES.EMPTY]: '⬜',
      [this.CELL_TYPES.WALL]: '🧱',
      [this.CELL_TYPES.EVENT]: '❓',
      [this.CELL_TYPES.TREASURE]: '💎',
      [this.CELL_TYPES.ENEMY]: '👹',
      [this.CELL_TYPES.EXIT]: '🚪',
      [this.CELL_TYPES.SHOP]: '🏪',
      [this.CELL_TYPES.HEALING]: '🏥',
      [this.CELL_TYPES.BOSS]: '👑'
    };

    return icons[cellType] || '❓';
  }
} 