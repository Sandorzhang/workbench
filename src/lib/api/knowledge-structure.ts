export interface KnowledgePoint {
  id: string
  unitId: number
  title: string
  description?: string
  type: 'concept' | 'fact' | 'procedure' | 'principle'
  level: 1 | 2 | 3 // 知识点层级
  parentId?: string // 父知识点ID
  order: number
  status: 'active' | 'archived'
}

export interface KnowledgeRelation {
  id: string
  unitId: number
  sourceId: string // 起始知识点ID
  targetId: string // 目标知识点ID
  type: 'prerequisite' | 'related' | 'leads_to' // 前置/关联/引导
  description?: string
}

// 获取单元的知识结构
export async function fetchUnitKnowledgeStructure(unitId: string | number) {
  try {
    console.log('Fetching knowledge structure for unit:', unitId)
    
    const numericUnitId = typeof unitId === 'string' ? parseInt(unitId, 10) : unitId
    
    if (isNaN(numericUnitId)) {
      throw new Error('Invalid unit ID')
    }

    // 先检查单元是否存在
    const unitResponse = await fetch(`http://localhost:3100/teachingUnits/${numericUnitId}`)
    if (!unitResponse.ok) {
      throw new Error(`Teaching unit not found: ${numericUnitId}`)
    }

    // 获取知识点和关系数据
    const [pointsRes, relationsRes] = await Promise.all([
      fetch(`http://localhost:3100/knowledgePoints?unitId=${numericUnitId}`),
      fetch(`http://localhost:3100/knowledgeRelations?unitId=${numericUnitId}`)
    ])

    // 即使没有数据也应该返回空数组而不是错误
    const points = await pointsRes.json()
    const relations = await relationsRes.json()

    console.log('Knowledge structure data:', { points, relations })
    return { 
      points: Array.isArray(points) ? points : [],
      relations: Array.isArray(relations) ? relations : []
    }
  } catch (error) {
    console.error('Error fetching knowledge structure:', error)
    throw error
  }
}

// 创建知识点
export async function createKnowledgePoint(data: Omit<KnowledgePoint, 'id'>) {
  const response = await fetch('http://localhost:3100/knowledgePoints', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  if (!response.ok) throw new Error('Failed to create knowledge point')
  return response.json()
}

// 更新知识点
export async function updateKnowledgePoint(id: string, data: Partial<KnowledgePoint>) {
  const response = await fetch(`http://localhost:3100/knowledgePoints/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  if (!response.ok) throw new Error('Failed to update knowledge point')
  return response.json()
}

// 删除知识点
export async function deleteKnowledgePoint(id: string) {
  const response = await fetch(`http://localhost:3100/knowledgePoints/${id}`, {
    method: 'DELETE'
  })
  if (!response.ok) throw new Error('Failed to delete knowledge point')
}

// 创建知识点关系
export async function createKnowledgeRelation(data: Omit<KnowledgeRelation, 'id'>) {
  const response = await fetch('http://localhost:3100/knowledgeRelations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  if (!response.ok) throw new Error('Failed to create knowledge relation')
  return response.json()
}

// 更新知识点关系
export async function updateKnowledgeRelation(id: string, data: Partial<KnowledgeRelation>) {
  const response = await fetch(`http://localhost:3100/knowledgeRelations/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  if (!response.ok) throw new Error('Failed to update knowledge relation')
  return response.json()
}

// 删除知识点关系
export async function deleteKnowledgeRelation(id: string) {
  const response = await fetch(`http://localhost:3100/knowledgeRelations/${id}`, {
    method: 'DELETE'
  })
  if (!response.ok) throw new Error('Failed to delete knowledge relation')
} 