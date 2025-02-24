export interface WritingUnit {
  id: string
  title: string
  term: number
  grade: string
  coverImage: string
  description?: string
  status: 'not_started' | 'in_progress' | 'completed'
}

export interface WritingRecord {
  id: string
  unitId: string
  studentId: string
  studentName: string
  content: string
  score?: number
  feedback?: string
  submittedAt: string
  gradedAt?: string
}

export async function fetchWritingUnits(grade: string, term: number): Promise<WritingUnit[]> {
  try {
    console.log('Fetching writing units with params:', { grade, term })
    
    // 直接访问 writingUnits 路径
    const response = await fetch('http://localhost:3100/writingUnits')
    
    if (!response.ok) {
      console.error('Response status:', response.status)
      const text = await response.text()
      console.error('Response text:', text)
      throw new Error('Failed to fetch writing units')
    }
    
    const data = await response.json()
    console.log('Raw writing units data:', data)
    
    // 在客户端过滤数据
    const filteredData = data.filter((unit: WritingUnit) => 
      unit.grade === grade && unit.term === term
    )
    
    console.log('Filtered writing units data:', filteredData)
    return filteredData
  } catch (error) {
    console.error('Error fetching writing units:', error)
    throw error
  }
}

export async function fetchWritingRecords(unitId: string): Promise<WritingRecord[]> {
  try {
    const response = await fetch(
      `http://localhost:3100/writingRecords${unitId ? `?unitId=${unitId}` : ''}`
    )
    if (!response.ok) {
      throw new Error('Failed to fetch writing records')
    }
    return response.json()
  } catch (error) {
    console.error('Error fetching writing records:', error)
    throw error
  }
}

export async function fetchWritingRecord(recordId: string): Promise<WritingRecord> {
  try {
    const response = await fetch(`http://localhost:3100/writingRecords/${recordId}`)
    if (!response.ok) {
      throw new Error('Failed to fetch writing record')
    }
    return response.json()
  } catch (error) {
    console.error('Error fetching writing record:', error)
    throw error
  }
}

export async function updateWritingRecord(recordId: string, data: Partial<WritingRecord>): Promise<WritingRecord> {
  try {
    const response = await fetch(
      `http://localhost:3100/writingRecords/${recordId}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }
    )
    if (!response.ok) {
      throw new Error('Failed to update writing record')
    }
    return response.json()
  } catch (error) {
    console.error('Error updating writing record:', error)
    throw error
  }
}

// 修改图片路径为本地图片
const WRITING_IMAGES = {
  diary: '/images/writing/diary.jpg',
  animal: '/images/writing/animal.jpg',
  discovery: '/images/writing/discovery.jpg',
  spring: '/images/writing/spring.jpg',
  lesson: '/images/writing/lesson.jpg',
  friend: '/images/writing/friend.jpg',
  wish: '/images/writing/wish.jpg',
  autumn: '/images/writing/autumn.jpg',
  place: '/images/writing/place.jpg',
  try: '/images/writing/try.jpg',
  right: '/images/writing/right.jpg',
  dream: '/images/writing/dream.jpg',
  memory: '/images/writing/memory.jpg',
  collection: '/images/writing/collection.jpg',
  growth: '/images/writing/growth.jpg',
  hometown: '/images/writing/hometown.jpg',
  myself: '/images/writing/myself.jpg',
  future: '/images/writing/future.jpg'
} 