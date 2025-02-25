module.exports = (req, res, next) => {
  // 移除 /api 前缀
  req.url = req.url.replace(/^\/api/, '')

  // 处理应用的角色权限
  if (req.path.match(/\/applications\/\d+\/role-permissions/)) {
    const appId = req.path.split('/')[2]
    if (req.method === 'GET') {
      // 获取指定应用的角色权限列表
      req.url = `/roles?appId=${appId}`
    } else if (req.method === 'PUT' || req.method === 'PATCH') {
      // 更新角色权限
      const roleId = req.path.split('/')[4]
      req.url = `/roles/${roleId}`
      req.method = 'PATCH'
    }
  }

  // 处理应用的用户权限
  if (req.path.match(/\/applications\/\d+\/user-permissions/)) {
    const appId = req.path.split('/')[2]
    if (req.method === 'GET') {
      // 获取指定应用的用户权限列表
      req.url = `/permissions?appId=${appId}&_expand=user`
    } else if (req.method === 'PUT' || req.method === 'PATCH') {
      // 更新用户权限
      const userId = req.path.split('/')[4]
      req.url = `/permissions/${userId}`
      req.method = 'PATCH'
    }
  }

  // 处理框架相关的任务
  if (req.path.match(/\/frameworks\/\d+\/tasks/)) {
    const frameworkId = req.path.split('/')[2]
    if (req.method === 'GET') {
      req.url = `/tasks?frameworkId=${frameworkId}&_expand=framework`
    }
  }

  // 处理学生的评估结果
  if (req.path.match(/\/tasks\/\d+\/results/)) {
    const taskId = req.path.split('/')[2]
    if (req.method === 'GET') {
      req.url = `/tasks/${taskId}?_embed=results&_expand=framework`
    } else if (req.method === 'POST') {
      req.url = `/results`
    }
  }

  // 处理学生的学术记录
  if (req.path.match(/\/students\/\d+\/academic-record/)) {
    const studentId = req.path.split('/')[2]
    req.url = `/students/${studentId}?_embed=assessments`
  }

  // 处理用户查询
  if (req.path === '/users' && req.query.role) {
    req.url = `/users?role=${req.query.role}&_embed=permissions`
  }

  // 处理学术旅程相关请求
  if (req.path.match(/\/academic\/students\/\d+\/journey/)) {
    const studentId = req.path.split('/')[3]
    req.url = `/journeys?studentId=${studentId}&_expand=student&_embed=milestones&_embed=goals`
  }

  if (req.path.match(/\/academic\/students\/\d+\/progress/)) {
    const studentId = req.path.split('/')[3]
    req.url = `/progress?studentId=${studentId}&_expand=student`
  }

  // 处理教学单元相关请求
  if (req.path.match(/\/teaching\/units\/\d+\/lessons/)) {
    const unitId = req.path.split('/')[3]
    if (req.method === 'GET') {
      req.url = `/lessons?unitId=${unitId}&_expand=unit`
    }
  }

  // 处理课程资源
  if (req.path.match(/\/teaching\/units\/\d+\/resources/)) {
    const unitId = req.path.split('/')[3]
    req.url = `/units/${unitId}?_embed=resources`
  }

  // 处理课程进度
  if (req.path.match(/\/teaching\/units\/\d+\/schedule/)) {
    const unitId = req.path.split('/')[3]
    req.url = `/units/${unitId}?_embed=lessons`
  }

  // 处理课堂瞬间相关请求
  if (req.path.match(/\/classroom\/moments/)) {
    if (req.query.type) {
      req.url = `/moments?type=${req.query.type}&_expand=teacher&_embed=media&_embed=comments`
    }
  }

  // 处理课程表相关请求
  if (req.path.match(/\/schedule\/classes\/\d+\/current/)) {
    const classId = req.path.split('/')[3]
    const today = new Date().toISOString().split('T')[0]
    req.url = `/timetables?classId=${classId}&status=active&effective.from_lte=${today}&effective.to_gte=${today}`
  }

  // 处理数据分类相关请求
  if (req.path.match(/\/category\/students\/\d+\/records/)) {
    const studentId = req.path.split('/')[3]
    req.url = `/records?studentId=${studentId}&_expand=category`
  }

  // 处理班级模型相关请求
  if (req.path.match(/\/class\/models\/\d+\/implementations/)) {
    const modelId = req.path.split('/')[3]
    if (req.method === 'GET') {
      req.url = `/implementations?modelId=${modelId}&_expand=model&_embed=progress`
    }
  }

  // 处理学习资源搜索
  if (req.path.match(/\/resources\/materials\/search/)) {
    const query = req.query.q
    req.url = `/materials?q=${query}&_expand=metadata`
  }

  // 处理教学计划查询
  if (req.path.match(/\/teaching\/plans\/teacher\/\d+/)) {
    const teacherId = req.path.split('/')[4]
    req.url = `/plans?teacherId=${teacherId}&_expand=teacher`
  }

  // 处理课堂时光机相关请求
  if (req.path.match(/\/classroom-timeline\/class\/\d+\/daily/)) {
    const classId = req.path.split('/')[3]
    const date = req.query.date || new Date().toISOString().split('T')[0]
    req.url = `/timelines?classId=${classId}&date=${date}&_embed=moments`
  }

  if (req.path.match(/\/classroom-timeline\/moments\/search/)) {
    const query = req.query.q
    req.url = `/moments?q=${query}&_expand=media&_expand=feedback`
  }

  // 处理写作记录查询
  if (req.path.match(/\/chinese-writing\/units\/\d+\/records/)) {
    const unitId = req.path.split('/')[3]
    req.url = `/records?unitId=${unitId}&_expand=unit`
  }

  // 记录请求日志
  console.log(`${req.method} ${req.url}`, req.body || '')

  next()
} 