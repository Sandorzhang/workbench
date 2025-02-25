/**
 * Mock 服务中间件
 * 用于处理 API 请求的转发和响应
 */
module.exports = function middleware(req, res, next) {
  // 处理账号密码登录
  if (req.path === '/auth/login' && req.method === 'POST') {
    const { username, password } = req.body
    const db = req.app.db
    
    const users = db.get('users').value()
    const user = users.find(u => u.username === username && u.password === password)
    
    if (!user) {
      return res.status(401).json({
        message: '用户名或密码错误'
      })
    }

    const { password: _, ...safeUser } = user
    return res.json({
      ...safeUser,
      name: safeUser.name || safeUser.username,
      avatar: safeUser.avatar || '/avatars/default.png'
    })
  }

  // 处理手机验证码登录
  if (req.path === '/auth/login-phone' && req.method === 'POST') {
    const { phone, code } = req.body
    const db = req.app.db
    
    const users = db.get('users').value()
    const user = users.find(u => u.phone === phone)
    
    if (!user) {
      return res.status(401).json({
        message: '手机号未注册'
      })
    }

    if (code !== '123456') {
      return res.status(401).json({
        message: '验证码错误'
      })
    }

    const { password: _, ...safeUser } = user
    return res.json({
      ...safeUser,
      name: safeUser.name || safeUser.username || '用户',
      avatar: safeUser.avatar || '/avatars/default.png'
    })
  }

  // 处理发送验证码
  if (req.path === '/auth/send-code' && req.method === 'POST') {
    const { phone } = req.body
    const db = req.app.db
    
    const users = db.get('users').value()
    const user = users.find(u => u.phone === phone)
    
    if (!user) {
      return res.status(401).json({
        message: '手机号未注册'
      })
    }

    return res.json({
      message: '验证码发送成功',
      code: '123456'
    })
  }

  // 处理获取租户信息
  if (req.path.match(/^\/tenants\/\d+$/) && req.method === 'GET') {
    const tenantId = parseInt(req.path.split('/')[2])
    const db = req.app.db
    
    const tenants = db.get('tenants').value()
    const tenant = tenants.find(t => t.id === tenantId)
    
    if (!tenant) {
      return res.status(404).json({
        message: '租户不存在'
      })
    }
    
    return res.json(tenant)
  }

  // 处理获取租户应用列表
  if (req.path.match(/^\/tenants\/\d+\/applications$/) && req.method === 'GET') {
    const tenantId = parseInt(req.path.split('/')[2])
    const db = req.app.db
    
    const tenants = db.get('tenants').value()
    const tenant = tenants.find(t => t.id === tenantId)
    
    if (!tenant) {
      return res.status(404).json({
        message: '租户不存在'
      })
    }
    
    return res.json(tenant.applications || [])
  }

  next()
} 