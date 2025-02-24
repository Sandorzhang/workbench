import { Suspense } from "react"
import StudentJourneyContent from "./content"

export default function StudentJourneyPage({ params }: { params: { studentId: string } }) {
  return (
    <Suspense fallback={
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    }>
      <StudentJourneyContent studentId={params.studentId} />
    </Suspense>
  )
} 