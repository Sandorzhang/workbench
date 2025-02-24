// API 请求函数
export async function fetchAcademicJourneys() {
  const response = await fetch("/api/academic-journeys")
  if (!response.ok) {
    throw new Error("Failed to fetch academic journeys")
  }
  return response.json()
} 