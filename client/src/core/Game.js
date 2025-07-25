// Типы клеток карты
export const CellType = { EMPTY:0, WALL:1, EVENT:2 };

// Пример карты
export const mapData = [
  [1,1,1,1,1],
  [1,0,0,2,1],
  [1,0,1,0,1],
  [1,0,0,0,1],
  [1,1,1,1,1]
];

export class Player {
  constructor() {
    this.stats = { str: 10, agi: 10, int: 10 };
    this.inventory = [];
    this.skills = [];
    this.talents = [];
  }
}

export class Game {
  constructor() {
    this.player = new Player();
    this.map = mapData;
    this.scene = 'city'; // city, dungeon, combat
    this.position = { x: 1, y: 1 };
    this.storyFlags = {};
  }

  move(dx, dy) {
    const { x, y } = this.position;
    const nx = x + dx, ny = y + dy;
    if (this.map[ny][nx] !== CellType.WALL) {
      this.position = { x: nx, y: ny };
      if (this.map[ny][nx] === CellType.EVENT) this.triggerEvent(nx, ny);
    }
  }

  triggerEvent(x, y) {
    this.scene = 'combat';
    // Здесь можно добавить генерацию врага и запуск боя
  }

  switchScene(newScene) {
    this.scene = newScene;
  }
} 