/**
 * 学科常量定义
 */

export const SUBJECTS = {
  CHINESE: "语文",
  MATH: "数学",
  ENGLISH: "英语",
  SCIENCE: "科学",
  PHYSICS: "物理",
  CHEMISTRY: "化学",
  BIOLOGY: "生物",
  HISTORY: "历史",
  GEOGRAPHY: "地理",
  POLITICS: "政治",
  MORAL: "道德与法治",
  PE: "体育与健康",
  MUSIC: "音乐",
  ART: "美术",
  LABOR: "劳动",
  PRACTICE: "综合实践活动",
  INFORMATION: "信息科技"
};

export type SubjectType = typeof SUBJECTS[keyof typeof SUBJECTS]

// 获取所有学科代码
export const getSubjectCodes = () => Object.keys(SUBJECTS) as (keyof typeof SUBJECTS)[]

// 获取所有学科名称
export const getSubjectNames = () => Object.values(SUBJECTS)

// 根据代码获取学科名称
export const getSubjectNameByCode = (code: keyof typeof SUBJECTS) => SUBJECTS[code]

// 根据名称获取学科代码
export const getSubjectCodeByName = (name: string) => {
  const entry = Object.entries(SUBJECTS).find(([_, subject]) => subject === name)
  return entry ? (entry[0] as keyof typeof SUBJECTS) : null
} 