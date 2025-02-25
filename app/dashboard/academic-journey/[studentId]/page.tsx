import { Suspense } from "react"
import { use } from "react"
import StudentJourneyClient from "./student-journey-client"

export default function StudentJourneyPage({ params }: { params: Promise<{ studentId: string }> }) {
  const resolvedParams = use(params)
  
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    }>
      <StudentJourneyClient studentId={resolvedParams.studentId} />
    </Suspense>
  )
} 