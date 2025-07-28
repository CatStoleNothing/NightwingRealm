const express = require('express');
const path = require('path');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Database = require('./server/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'client/public')));

// Секретный ключ для JWT
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

// API маршруты
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
      return res.status(400).json({ error: 'Все поля обязательны' });
    }

    const existingUser = await db.getUserByUsername(username);
    if (existingUser) {
      return res.status(409).json({ error: 'Пользователь уже существует' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = await db.createUser(username, email, hashedPassword);
    const user = await db.getUserById(userId);

    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '24h' });
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

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Неверное имя пользователя или пароль' });
    }

    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '24h' });
    await db.createSession(user.id, token, new Date(Date.now() + 24 * 60 * 60 * 1000));

    const characters = await db.getCharactersByUserId(user.id);

    res.json({
      message: 'Успешная авторизация',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        characters
      }
    });
  } catch (error) {
    console.error('Ошибка авторизации:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

app.get('/api/characters', authenticateToken, async (req, res) => {
  try {
    const characters = await db.getCharactersByUserId(req.user.id);
    res.json(characters);
  } catch (error) {
    console.error('Ошибка получения персонажей:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

app.post('/api/characters', authenticateToken, async (req, res) => {
  try {
    const { name, class: characterClass } = req.body;

    if (!name || !characterClass) {
      return res.status(400).json({ error: 'Имя и класс персонажа обязательны' });
    }

    const characterId = await db.createCharacter(req.user.id, name, characterClass);
    const character = await db.getCharacterById(characterId);

    res.status(201).json({
      message: 'Персонаж успешно создан',
      character
    });
  } catch (error) {
    console.error('Ошибка создания персонажа:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

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

    await db.updateCharacter(characterId, req.body);

    res.json({
      message: 'Персонаж успешно обновлен',
      character: await db.getCharacterById(characterId)
    });
  } catch (error) {
    console.error('Ошибка обновления персонажа:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

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

// Корневой маршрут для API
app.get('/api', (req, res) => {
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

// Все остальные запросы отправляем на React приложение
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/public/index.html'));
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Получен сигнал SIGINT, закрываем сервер...');
  await db.close();
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
  console.log(`API доступен по адресу: http://localhost:${PORT}/api`);
  console.log(`Приложение доступно по адресу: http://localhost:${PORT}`);
}); 