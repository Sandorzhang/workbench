const jsonServer = require('json-server');
const path = require('path');
const fs = require('fs');
const server = jsonServer.create();
const middlewares = jsonServer.defaults();

// 设置中间件
server.use(middlewares);

// 添加请求体解析中间件
server.use(jsonServer.bodyParser);

// 添加请求日志中间件
server.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// 自定义响应处理 - 放在路由重写之前
server.use((req, res, next) => {
  // 处理登录请求 - 同时处理 /api/auth/login 和 /auth/login 路径
  if (req.method === 'POST' && (req.path === '/api/auth/login' || req.path === '/auth/login')) {
    console.log('Login request received:', req.body);
    
    const { username, password } = req.body;
    
    // 确保 db.users 存在
    if (!db.users || !Array.isArray(db.users)) {
      console.error('Users data not found or not an array');
      return res.status(500).json({ error: '服务器内部错误' });
    }
    
    console.log(`Attempting login with username: ${username}`);
    console.log(`Available users:`, db.users.map(u => u.username));
    
    const user = db.users.find(
      u => u.username === username && u.password === password
    );
    
    if (user) {
      console.log(`User found: ${user.name} (${user.role})`);
      return res.json({
        id: user.id,
        name: user.name,
        username: user.username,
        role: user.role,
        avatar: user.avatar
      });
    } else {
      console.log('User not found or password incorrect');
      return res.status(401).json({ error: '用户名或密码错误' });
    }
  }
  
  next();
});

// 加载路由配置
const routes = JSON.parse(fs.readFileSync(path.join(__dirname, 'routes.json')));
server.use(jsonServer.rewriter(routes));

// 加载多个数据文件
const dataDir = path.join(__dirname, 'data');
const db = {};

// 读取 db.json 作为基础数据
try {
  if (fs.existsSync(path.join(dataDir, 'db.json'))) {
    const dbJson = JSON.parse(fs.readFileSync(path.join(dataDir, 'db.json')));
    Object.assign(db, dbJson);
    console.log('Loaded data from db.json');
  } else {
    console.log('db.json not found, starting with empty database');
  }
} catch (error) {
  console.error('Error loading db.json:', error);
}

// 读取 classroom-moments 目录下的数据文件
try {
  const momentsDir = path.join(dataDir, 'classroom-moments');
  if (fs.existsSync(momentsDir) && fs.existsSync(path.join(momentsDir, 'moments.json'))) {
    const momentsJson = JSON.parse(fs.readFileSync(path.join(momentsDir, 'moments.json')));
    
    // 合并数据
    if (momentsJson.moments) {
      // 如果 db.json 中已有 moments 数据，则合并
      if (db.moments) {
        db.moments = [...db.moments, ...momentsJson.moments];
      } else {
        db.moments = momentsJson.moments;
      }
      console.log('Loaded moments data from classroom-moments/moments.json');
    }
  } else {
    console.log('moments.json not found');
  }
} catch (error) {
  console.error('Error loading moments data:', error);
}

// 确保 db 对象至少有一个属性
if (Object.keys(db).length === 0) {
  db.moments = [];
  console.log('Created empty moments array');
}

// 确保用户数据存在
if (!db.users || db.users.length === 0) {
  db.users = [
    {
      id: "1",
      name: "管理员",
      username: "admin",
      password: "admin123",
      role: "ADMIN",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin"
    },
    {
      id: "2",
      name: "张老师",
      username: "teacher",
      password: "teacher123",
      role: "TEACHER",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=teacher"
    },
    {
      id: "3",
      name: "王学生",
      username: "student",
      password: "student123",
      role: "STUDENT",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=student"
    }
  ];
  console.log('Created default users');
}

// 添加以下代码来检查用户数据
console.log('Users data:', db.users ? `${db.users.length} users found` : 'No users found');

// 创建路由器
const router = jsonServer.router(db);
server.use(router);

// 其他自定义响应处理
server.use((req, res, next) => {
  if (req.method === 'GET' && req.path.startsWith('/moments/')) {
    const id = req.path.split('/').pop();
    const moment = db.moments.find(m => m.id === id);
    
    if (moment) {
      return res.json(moment);
    }
  }
  next();
});

// 启动服务器
const PORT = 3100;
server.listen(PORT, () => {
  console.log(`JSON Server is running on port ${PORT}`);
  console.log(`Data loaded: ${Object.keys(db).join(', ')}`);
  console.log(`Available routes: ${Object.keys(routes).join(', ')}`);
}); 