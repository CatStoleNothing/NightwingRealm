const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Database = require('./database');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Секретный ключ для JWT (в продакшене должен быть в переменных окружения)
const JWT_SECRET = 'nightwingrealm_secret_key_2024';

// Инициализация базы данных
const db = new Database();

// Middleware для проверки JWT токена
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Токен не предоставлен' });
  }

  try {
    const session = await db.getSessionByToken(token);
    if (!session) {
      return res.status(403).json({ error: 'Недействительный токен' });
    }

    const user = await db.getUserByUsername(session.user_id);
    if (!user) {
      return res.status(403).json({ error: 'Пользователь не найден' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Ошибка аутентификации:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
};

// Регистрация пользователя
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
      return res.status(400).json({ error: 'Все поля обязательны' });
    }

    // Проверяем, существует ли пользователь
    const existingUser = await db.getUserByUsername(username);
    if (existingUser) {
      return res.status(409).json({ error: 'Пользователь уже существует' });
    }

    // Хеширование пароля
    const hashedPassword = await bcrypt.hash(password, 10);

    // Создание пользователя
    const user = await db.createUser(username, email, hashedPassword);

    // Создание JWT токена
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '24h' });
    
    // Сохранение сессии
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 часа
    await db.createSession(user.id, token, expiresAt);

    res.status(201).json({
      message: 'Пользователь успешно зарегистрирован',
      token,
      user: {
        username: user.username,
        email: user.email,
        characters: []
      }
    });
  } catch (error) {
    console.error('Ошибка регистрации:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

// Авторизация пользователя
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Имя пользователя и пароль обязательны' });
    }

    const user = await db.getUserByUsername(username);
    if (!user) {
      return res.status(401).json({ error: 'Неверное имя пользователя или пароль' });
    }

    // Проверка пароля
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Неверное имя пользователя или пароль' });
    }

    // Обновление времени последнего входа
    await db.updateUserLastLogin(user.id);

    // Создание JWT токена
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '24h' });
    
    // Сохранение сессии
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 часа
    await db.createSession(user.id, token, expiresAt);

    // Получение персонажей пользователя
    const characters = await db.getCharactersByUserId(user.id);

    res.json({
      message: 'Успешная авторизация',
      token,
      user: {
        username: user.username,
        email: user.email,
        characters: characters.map(char => ({
          id: char.id,
          name: char.name,
          class: char.class,
          level: char.level,
          lastPlayed: char.last_played
        }))
      }
    });
  } catch (error) {
    console.error('Ошибка авторизации:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

// Получение профиля пользователя
app.get('/api/auth/profile', authenticateToken, async (req, res) => {
  try {
    const characters = await db.getCharactersByUserId(req.user.id);

    res.json({
      user: {
        username: req.user.username,
        email: req.user.email,
        characters: characters.map(char => ({
          id: char.id,
          name: char.name,
          class: char.class,
          level: char.level,
          lastPlayed: char.last_played
        })),
        createdAt: req.user.created_at,
        lastLogin: req.user.last_login
      }
    });
  } catch (error) {
    console.error('Ошибка получения профиля:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

// Создание персонажа
app.post('/api/characters', authenticateToken, async (req, res) => {
  try {
    const { name, class: characterClass } = req.body;

    if (!name || !characterClass) {
      return res.status(400).json({ error: 'Имя и класс персонажа обязательны' });
    }

    // Получаем существующих персонажей пользователя
    const existingCharacters = await db.getCharactersByUserId(req.user.id);
    if (existingCharacters.length >= 3) {
      return res.status(400).json({ error: 'Достигнут лимит персонажей (3)' });
    }

    // Проверка уникальности имени персонажа
    const existingCharacter = existingCharacters.find(char => char.name === name);
    if (existingCharacter) {
      return res.status(409).json({ error: 'Персонаж с таким именем уже существует' });
    }

    // Создание нового персонажа
    const characterData = {
      name,
      class: characterClass,
      stats: {
        str: 10,
        agi: 10,
        int: 10
      },
      skills: [],
      talents: [],
      inventory: [],
      materials: {
        iron: 5,
        steel: 2,
        herbs: 8,
        crystal: 3,
        fireEssence: 1,
      },
      position: { x: 1, y: 1 },
      storyFlags: {}
    };

    const newCharacter = await db.createCharacter(req.user.id, characterData);

    res.status(201).json({
      message: 'Персонаж успешно создан',
      character: {
        id: newCharacter.id,
        name: newCharacter.name,
        class: newCharacter.class,
        level: 1,
        lastPlayed: new Date()
      }
    });
  } catch (error) {
    console.error('Ошибка создания персонажа:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

// Получение списка персонажей пользователя
app.get('/api/characters', authenticateToken, async (req, res) => {
  try {
    const characters = await db.getCharactersByUserId(req.user.id);

    res.json({
      characters: characters.map(char => ({
        id: char.id,
        name: char.name,
        class: char.class,
        level: char.level,
        lastPlayed: char.last_played
      }))
    });
  } catch (error) {
    console.error('Ошибка получения персонажей:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

// Загрузка персонажа
app.get('/api/characters/:id', authenticateToken, async (req, res) => {
  try {
    const character = await db.getCharacterById(req.params.id);

    if (!character) {
      return res.status(404).json({ error: 'Персонаж не найден' });
    }

    // Проверяем, принадлежит ли персонаж пользователю
    const userCharacters = await db.getCharactersByUserId(req.user.id);
    const userCharacter = userCharacters.find(char => char.id === parseInt(req.params.id));
    
    if (!userCharacter) {
      return res.status(403).json({ error: 'Доступ запрещен' });
    }

    // Обновление времени последней игры
    await db.updateCharacter(character.id, {
      ...character,
      lastPlayed: new Date()
    });

    res.json({ character });
  } catch (error) {
    console.error('Ошибка загрузки персонажа:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

// Сохранение персонажа
app.put('/api/characters/:id', authenticateToken, async (req, res) => {
  try {
    const character = await db.getCharacterById(req.params.id);

    if (!character) {
      return res.status(404).json({ error: 'Персонаж не найден' });
    }

    // Проверяем, принадлежит ли персонаж пользователю
    const userCharacters = await db.getCharactersByUserId(req.user.id);
    const userCharacter = userCharacters.find(char => char.id === parseInt(req.params.id));
    
    if (!userCharacter) {
      return res.status(403).json({ error: 'Доступ запрещен' });
    }

    // Обновление данных персонажа
    const updatedCharacter = await db.updateCharacter(character.id, {
      ...character,
      ...req.body,
      lastPlayed: new Date()
    });

    res.json({
      message: 'Персонаж успешно сохранен',
      character: {
        id: character.id,
        name: character.name,
        level: character.level,
        lastPlayed: new Date()
      }
    });
  } catch (error) {
    console.error('Ошибка сохранения персонажа:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

// Удаление персонажа
app.delete('/api/characters/:id', authenticateToken, async (req, res) => {
  try {
    const character = await db.getCharacterById(req.params.id);

    if (!character) {
      return res.status(404).json({ error: 'Персонаж не найден' });
    }

    // Проверяем, принадлежит ли персонаж пользователю
    const userCharacters = await db.getCharactersByUserId(req.user.id);
    const userCharacter = userCharacters.find(char => char.id === parseInt(req.params.id));
    
    if (!userCharacter) {
      return res.status(403).json({ error: 'Доступ запрещен' });
    }

    await db.deleteCharacter(character.id);

    res.json({
      message: 'Персонаж успешно удален',
      deletedCharacter: {
        id: character.id,
        name: character.name
      }
    });
  } catch (error) {
    console.error('Ошибка удаления персонажа:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

// Выход из системы
app.post('/api/auth/logout', authenticateToken, async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (token) {
      await db.deleteSession(token);
    }

    res.json({ message: 'Успешный выход из системы' });
  } catch (error) {
    console.error('Ошибка выхода:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

// Проверка состояния сервера
app.get('/api/health', async (req, res) => {
  try {
    // Получаем количество пользователей
    const userCount = await db.db.get('SELECT COUNT(*) as count FROM users', (err, row) => {
      if (err) throw err;
      return row.count;
    });

    res.json({ 
      status: 'OK', 
      timestamp: new Date().toISOString(),
      database: 'Connected',
      usersCount: userCount
    });
  } catch (error) {
    console.error('Ошибка проверки состояния:', error);
    res.status(500).json({ 
      status: 'ERROR', 
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
});

// Очистка устаревших сессий каждые 24 часа
setInterval(async () => {
  try {
    await db.cleanupExpiredSessions();
    console.log('Очистка устаревших сессий выполнена');
  } catch (error) {
    console.error('Ошибка очистки сессий:', error);
  }
}, 24 * 60 * 60 * 1000);

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
  console.log(`API доступен по адресу: http://localhost:${PORT}/api`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Завершение работы сервера...');
  db.close();
  process.exit(0);
}); 