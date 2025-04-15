import { auth } from "@/auth"
import { isTeacher } from "@/lib/acl"
import { prisma } from "@/lib/prisma"
import Opportunity from "@/components/Opportunity"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function OpportunitiesPage() {
  const session = await auth()
  const isTeacherUser = session?.user && isTeacher(session.user)

  const opportunities = await prisma.opportunity.findMany({
    orderBy: {
      createdAt: 'desc'
    }
  })

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Opportunities</h1>
          <p className="text-gray-600 mt-2">
            Explore available internships and service projects
          </p>
        </div>
        {isTeacherUser && (
          <Button asChild>
            <Link href="/opportunities/create">
              Create Opportunity
            </Link>
          </Button>
        )}
      </div>

      <div className="space-y-6">
        {opportunities.length === 0 ? (
          <p className="text-gray-600">No opportunities available at the moment.</p>
        ) : (
          opportunities.map((opportunity) => (
            <Opportunity 
              key={opportunity.id} 
              opportunity={opportunity}
            />
          ))
        )}
      </div>
    </div>
  )
}
