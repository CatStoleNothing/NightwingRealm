const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Database = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

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
    const decoded = jwt.verify(token, JWT_SECRET);
    const session = await db.getSessionByToken(token);
    
    if (!session || session.expiresAt < new Date()) {
      return res.status(403).json({ error: 'Сессия истекла' });
    }
    
    const user = await db.getUserByUsername(decoded.username);
    if (!user) {
      return res.status(403).json({ error: 'Пользователь не найден' });
    }
    
    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Недействительный токен' });
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
    const userId = await db.createUser(username, email, hashedPassword);
    const user = await db.getUserById(userId);

    // Создание JWT токена
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '24h' });
    
    // Создание сессии
    await db.createSession(userId, token, new Date(Date.now() + 24 * 60 * 60 * 1000));

    res.status(201).json({
      message: 'Пользователь успешно зарегистрирован',
      token,
      user: {
        id: user.id,
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
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Неверное имя пользователя или пароль' });
    }

    // Обновление времени последнего входа
    await db.updateUserLastLogin(user.id);

    // Создание JWT токена
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '24h' });
    
    // Создание сессии
    await db.createSession(user.id, token, new Date(Date.now() + 24 * 60 * 60 * 1000));

    // Получаем персонажей пользователя
    const characters = await db.getCharactersByUserId(user.id);

    res.json({
      message: 'Успешная авторизация',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        characters: characters
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
        id: req.user.id,
        username: req.user.username,
        email: req.user.email,
        characters: characters,
        createdAt: req.user.createdAt,
        lastLogin: req.user.lastLogin
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

    const characters = await db.getCharactersByUserId(req.user.id);
    if (characters.length >= 3) {
      return res.status(400).json({ error: 'Достигнут лимит персонажей (3)' });
    }

    // Проверка уникальности имени персонажа
    const existingCharacter = characters.find(char => char.name === name);
    if (existingCharacter) {
      return res.status(409).json({ error: 'Персонаж с таким именем уже существует' });
    }

    // Создание нового персонажа
    const characterData = {
      userId: req.user.id,
      name,
      class: characterClass,
      level: 1,
      experience: 0,
      stats: JSON.stringify({
        str: 10,
        agi: 10,
        int: 10
      }),
      hp: 100,
      stamina: 50,
      mana: 20,
      armor: 2,
      dodge: 0.1,
      resistances: JSON.stringify({ fire: 0.2, water: 0.1 }),
      effects: JSON.stringify([]),
      tempEffects: JSON.stringify([]),
      inventory: JSON.stringify([]),
      materials: JSON.stringify({
        iron: 5,
        steel: 2,
        herbs: 8,
        crystal: 3,
        fireEssence: 1,
      }),
      gold: 100,
      position: JSON.stringify({ x: 1, y: 1 }),
      scene: 'city',
      storyFlags: JSON.stringify({}),
      combatLog: JSON.stringify([]),
      skills: JSON.stringify([]),
      talents: JSON.stringify([]),
      createdAt: new Date(),
      lastPlayed: new Date()
    };

    const characterId = await db.createCharacter(characterData);
    const newCharacter = await db.getCharacterById(characterId);

    res.status(201).json({
      message: 'Персонаж успешно создан',
      character: newCharacter
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
        lastPlayed: char.lastPlayed
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

    if (character.userId !== req.user.id) {
      return res.status(403).json({ error: 'Нет доступа к этому персонажу' });
    }

    // Обновление времени последней игры
    await db.updateCharacterLastPlayed(character.id);

    res.json({ character });
  } catch (error) {
    console.error('Ошибка загрузки персонажа:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

// Обновление персонажа
app.put('/api/characters/:id', authenticateToken, async (req, res) => {
  try {
    const characterId = req.params.id;
    const character = await db.getCharacterById(characterId);

    if (!character) {
      return res.status(404).json({ error: 'Персонаж не найден' });
    }

    if (character.userId !== req.user.id) {
      return res.status(403).json({ error: 'Нет доступа к этому персонажу' });
    }

    // Подготавливаем данные для обновления
    const updateData = {
      ...req.body,
      stats: typeof req.body.stats === 'object' ? JSON.stringify(req.body.stats) : req.body.stats,
      resistances: typeof req.body.resistances === 'object' ? JSON.stringify(req.body.resistances) : req.body.resistances,
      effects: typeof req.body.effects === 'object' ? JSON.stringify(req.body.effects) : req.body.effects,
      tempEffects: typeof req.body.tempEffects === 'object' ? JSON.stringify(req.body.tempEffects) : req.body.tempEffects,
      inventory: typeof req.body.inventory === 'object' ? JSON.stringify(req.body.inventory) : req.body.inventory,
      materials: typeof req.body.materials === 'object' ? JSON.stringify(req.body.materials) : req.body.materials,
      position: typeof req.body.position === 'object' ? JSON.stringify(req.body.position) : req.body.position,
      storyFlags: typeof req.body.storyFlags === 'object' ? JSON.stringify(req.body.storyFlags) : req.body.storyFlags,
      combatLog: typeof req.body.combatLog === 'object' ? JSON.stringify(req.body.combatLog) : req.body.combatLog,
      skills: typeof req.body.skills === 'object' ? JSON.stringify(req.body.skills) : req.body.skills,
      talents: typeof req.body.talents === 'object' ? JSON.stringify(req.body.talents) : req.body.talents,
      lastPlayed: new Date()
    };

    await db.updateCharacter(characterId, updateData);

    res.json({
      message: 'Персонаж успешно обновлен',
      character: await db.getCharacterById(characterId)
    });
  } catch (error) {
    console.error('Ошибка обновления персонажа:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

// Удаление персонажа
app.delete('/api/characters/:id', authenticateToken, async (req, res) => {
  try {
    const characterId = req.params.id;
    const character = await db.getCharacterById(characterId);

    if (!character) {
      return res.status(404).json({ error: 'Персонаж не найден' });
    }

    if (character.userId !== req.user.id) {
      return res.status(403).json({ error: 'Нет доступа к этому персонажу' });
    }

    await db.deleteCharacter(characterId);

    res.json({
      message: 'Персонаж успешно удален',
      deletedCharacter: {
        id: characterId,
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

// Корневой маршрут
app.get('/', (req, res) => {
  res.json({ 
    message: 'Добро пожаловать в Nightwing Realm API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: {
        register: '/api/auth/register',
        login: '/api/auth/login',
        logout: '/api/auth/logout',
        profile: '/api/auth/profile'
      },
      characters: {
        list: '/api/characters',
        create: '/api/characters',
        get: '/api/characters/:id',
        update: '/api/characters/:id',
        delete: '/api/characters/:id'
      }
    },
    timestamp: new Date().toISOString()
  });
});

// Проверка здоровья сервера
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    message: 'Сервер работает нормально'
  });
});

// Очистка истекших сессий каждые 5 минут
setInterval(async () => {
  try {
    await db.cleanupExpiredSessions();
  } catch (error) {
    console.error('Ошибка очистки сессий:', error);
  }
}, 5 * 60 * 1000);

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Получен сигнал SIGINT, закрываем сервер...');
  await db.close();
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
  console.log(`API доступен по адресу: http://localhost:${PORT}/api`);
}); 