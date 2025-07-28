const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class Database {
  constructor() {
    this.db = new sqlite3.Database(path.join(__dirname, 'game.db'));
    this.init();
  }

  // Инициализация базы данных
  init() {
    this.db.serialize(() => {
      // Таблица пользователей
      this.db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          last_login DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Таблица персонажей
      this.db.run(`
        CREATE TABLE IF NOT EXISTS characters (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          name TEXT NOT NULL,
          class TEXT NOT NULL,
          level INTEGER DEFAULT 1,
          experience INTEGER DEFAULT 0,
          skill_points INTEGER DEFAULT 0,
          talent_points INTEGER DEFAULT 0,
          stats TEXT NOT NULL,
          hp INTEGER DEFAULT 100,
          max_hp INTEGER DEFAULT 100,
          stamina INTEGER DEFAULT 50,
          max_stamina INTEGER DEFAULT 50,
          mana INTEGER DEFAULT 20,
          max_mana INTEGER DEFAULT 20,
          armor INTEGER DEFAULT 2,
          dodge REAL DEFAULT 0.1,
          resistances TEXT,
          effects TEXT,
          temp_effects TEXT,
          inventory TEXT,
          materials TEXT,
          gold INTEGER DEFAULT 100,
          position TEXT,
          scene TEXT DEFAULT 'city',
          story_flags TEXT,
          combat_log TEXT,
          settings TEXT,
          skills TEXT,
          talents TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          last_played DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id)
        )
      `);

      // Таблица сессий
      this.db.run(`
        CREATE TABLE IF NOT EXISTS sessions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          token TEXT UNIQUE NOT NULL,
          expires_at DATETIME NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id)
        )
      `);

      // Таблица подземелий
      this.db.run(`
        CREATE TABLE IF NOT EXISTS dungeons (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          character_id INTEGER NOT NULL,
          map_data TEXT NOT NULL,
          difficulty INTEGER DEFAULT 1,
          completed BOOLEAN DEFAULT FALSE,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          completed_at DATETIME,
          FOREIGN KEY (character_id) REFERENCES characters (id)
        )
      `);

      // Таблица достижений
      this.db.run(`
        CREATE TABLE IF NOT EXISTS achievements (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          character_id INTEGER NOT NULL,
          achievement_type TEXT NOT NULL,
          achievement_data TEXT,
          earned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (character_id) REFERENCES characters (id)
        )
      `);

      console.log('База данных инициализирована');
    });
  }

  // Методы для работы с пользователями
  async createUser(username, email, passwordHash) {
    return new Promise((resolve, reject) => {
      this.db.run(
        'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
        [username, email, passwordHash],
        function(err) {
          if (err) reject(err);
          else resolve({ id: this.lastID, username, email });
        }
      );
    });
  }

  async getUserByUsername(username) {
    return new Promise((resolve, reject) => {
      this.db.get(
        'SELECT * FROM users WHERE username = ?',
        [username],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });
  }

  async updateUserLastLogin(userId) {
    return new Promise((resolve, reject) => {
      this.db.run(
        'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?',
        [userId],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  }

  // Методы для работы с персонажами
  async createCharacter(userId, characterData) {
    return new Promise((resolve, reject) => {
      const {
        name, class: characterClass, stats, skills, talents,
        inventory, materials, position, storyFlags
      } = characterData;

      this.db.run(
        `INSERT INTO characters (
          user_id, name, class, stats, skills, talents,
          inventory, materials, position, story_flags
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          userId, name, characterClass,
          JSON.stringify(stats),
          JSON.stringify(skills || []),
          JSON.stringify(talents || []),
          JSON.stringify(inventory || []),
          JSON.stringify(materials || {}),
          JSON.stringify(position || { x: 1, y: 1 }),
          JSON.stringify(storyFlags || {})
        ],
        function(err) {
          if (err) reject(err);
          else resolve({ id: this.lastID, ...characterData });
        }
      );
    });
  }

  async getCharactersByUserId(userId) {
    return new Promise((resolve, reject) => {
      this.db.all(
        'SELECT * FROM characters WHERE user_id = ? ORDER BY last_played DESC',
        [userId],
        (err, rows) => {
          if (err) reject(err);
          else {
            const characters = rows.map(row => ({
              ...row,
              stats: JSON.parse(row.stats),
              skills: JSON.parse(row.skills || '[]'),
              talents: JSON.parse(row.talents || '[]'),
              inventory: JSON.parse(row.inventory || '[]'),
              materials: JSON.parse(row.materials || '{}'),
              position: JSON.parse(row.position || '{"x": 1, "y": 1}'),
              storyFlags: JSON.parse(row.story_flags || '{}'),
              resistances: JSON.parse(row.resistances || '{}'),
              effects: JSON.parse(row.effects || '[]'),
              tempEffects: JSON.parse(row.temp_effects || '[]'),
              combatLog: JSON.parse(row.combat_log || '[]'),
              settings: JSON.parse(row.settings || '{}')
            }));
            resolve(characters);
          }
        }
      );
    });
  }

  async getCharacterById(characterId) {
    return new Promise((resolve, reject) => {
      this.db.get(
        'SELECT * FROM characters WHERE id = ?',
        [characterId],
        (err, row) => {
          if (err) reject(err);
          else if (row) {
            const character = {
              ...row,
              stats: JSON.parse(row.stats),
              skills: JSON.parse(row.skills || '[]'),
              talents: JSON.parse(row.talents || '[]'),
              inventory: JSON.parse(row.inventory || '[]'),
              materials: JSON.parse(row.materials || '{}'),
              position: JSON.parse(row.position || '{"x": 1, "y": 1}'),
              storyFlags: JSON.parse(row.story_flags || '{}'),
              resistances: JSON.parse(row.resistances || '{}'),
              effects: JSON.parse(row.effects || '[]'),
              tempEffects: JSON.parse(row.temp_effects || '[]'),
              combatLog: JSON.parse(row.combat_log || '[]'),
              settings: JSON.parse(row.settings || '{}')
            };
            resolve(character);
          } else {
            resolve(null);
          }
        }
      );
    });
  }

  async updateCharacter(characterId, characterData) {
    return new Promise((resolve, reject) => {
      const {
        level, experience, skillPoints, talentPoints, stats,
        hp, maxHp, stamina, maxStamina, mana, maxMana,
        armor, dodge, resistances, effects, tempEffects,
        inventory, materials, gold, position, scene,
        storyFlags, combatLog, settings, skills, talents
      } = characterData;

      this.db.run(
        `UPDATE characters SET 
          level = ?, experience = ?, skill_points = ?, talent_points = ?,
          stats = ?, hp = ?, max_hp = ?, stamina = ?, max_stamina = ?,
          mana = ?, max_mana = ?, armor = ?, dodge = ?, resistances = ?,
          effects = ?, temp_effects = ?, inventory = ?, materials = ?,
          gold = ?, position = ?, scene = ?, story_flags = ?,
          combat_log = ?, settings = ?, skills = ?, talents = ?,
          last_played = CURRENT_TIMESTAMP
          WHERE id = ?`,
        [
          level, experience, skillPoints, talentPoints,
          JSON.stringify(stats), hp, maxHp, stamina, maxStamina,
          mana, maxMana, armor, dodge, JSON.stringify(resistances),
          JSON.stringify(effects), JSON.stringify(tempEffects),
          JSON.stringify(inventory), JSON.stringify(materials),
          gold, JSON.stringify(position), scene, JSON.stringify(storyFlags),
          JSON.stringify(combatLog), JSON.stringify(settings),
          JSON.stringify(skills), JSON.stringify(talents), characterId
        ],
        function(err) {
          if (err) reject(err);
          else resolve({ changes: this.changes });
        }
      );
    });
  }

  async deleteCharacter(characterId) {
    return new Promise((resolve, reject) => {
      this.db.run(
        'DELETE FROM characters WHERE id = ?',
        [characterId],
        function(err) {
          if (err) reject(err);
          else resolve({ changes: this.changes });
        }
      );
    });
  }

  // Методы для работы с сессиями
  async createSession(userId, token, expiresAt) {
    return new Promise((resolve, reject) => {
      this.db.run(
        'INSERT INTO sessions (user_id, token, expires_at) VALUES (?, ?, ?)',
        [userId, token, expiresAt],
        function(err) {
          if (err) reject(err);
          else resolve({ id: this.lastID });
        }
      );
    });
  }

  async getSessionByToken(token) {
    return new Promise((resolve, reject) => {
      this.db.get(
        'SELECT * FROM sessions WHERE token = ? AND expires_at > CURRENT_TIMESTAMP',
        [token],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });
  }

  async deleteSession(token) {
    return new Promise((resolve, reject) => {
      this.db.run(
        'DELETE FROM sessions WHERE token = ?',
        [token],
        function(err) {
          if (err) reject(err);
          else resolve({ changes: this.changes });
        }
      );
    });
  }

  // Методы для работы с подземельями
  async saveDungeon(characterId, mapData, difficulty) {
    return new Promise((resolve, reject) => {
      this.db.run(
        'INSERT INTO dungeons (character_id, map_data, difficulty) VALUES (?, ?, ?)',
        [characterId, JSON.stringify(mapData), difficulty],
        function(err) {
          if (err) reject(err);
          else resolve({ id: this.lastID });
        }
      );
    });
  }

  async completeDungeon(dungeonId) {
    return new Promise((resolve, reject) => {
      this.db.run(
        'UPDATE dungeons SET completed = TRUE, completed_at = CURRENT_TIMESTAMP WHERE id = ?',
        [dungeonId],
        function(err) {
          if (err) reject(err);
          else resolve({ changes: this.changes });
        }
      );
    });
  }

  // Методы для работы с достижениями
  async addAchievement(characterId, achievementType, achievementData) {
    return new Promise((resolve, reject) => {
      this.db.run(
        'INSERT INTO achievements (character_id, achievement_type, achievement_data) VALUES (?, ?, ?)',
        [characterId, achievementType, JSON.stringify(achievementData)],
        function(err) {
          if (err) reject(err);
          else resolve({ id: this.lastID });
        }
      );
    });
  }

  async getAchievementsByCharacterId(characterId) {
    return new Promise((resolve, reject) => {
      this.db.all(
        'SELECT * FROM achievements WHERE character_id = ? ORDER BY earned_at DESC',
        [characterId],
        (err, rows) => {
          if (err) reject(err);
          else {
            const achievements = rows.map(row => ({
              ...row,
              achievementData: JSON.parse(row.achievement_data || '{}')
            }));
            resolve(achievements);
          }
        }
      );
    });
  }

  // Очистка устаревших сессий
  async cleanupExpiredSessions() {
    return new Promise((resolve, reject) => {
      this.db.run(
        'DELETE FROM sessions WHERE expires_at < CURRENT_TIMESTAMP',
        function(err) {
          if (err) reject(err);
          else resolve({ changes: this.changes });
        }
      );
    });
  }

  // Закрытие соединения
  close() {
    this.db.close();
  }
}

module.exports = Database; 