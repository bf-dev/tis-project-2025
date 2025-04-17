import { Opportunity as OpportunityType } from '@prisma/client'
import Link from 'next/link'
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { auth } from '@/auth'
import { isAdmin, isStudent } from '@/lib/acl'

export default async function Opportunity({
  opportunity,
}: {
  opportunity: OpportunityType & {
    applications?: { id: string }[]
  }
}) {
  const session = await auth()
  const isCreator = (session?.user?.email === opportunity.creatorEmail) || isAdmin(session?.user)
  const canApply = session?.user && isStudent(session.user)

  return (
    <Card>
      <CardHeader>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold text-gray-800">{opportunity.title}</h2>
            <Badge variant="secondary">
              {opportunity.type}
            </Badge>
          </div>
          <p className="text-sm text-gray-600">Posted by {opportunity.creatorName}</p>
        </div>
      </CardHeader>

      <CardContent>
        <p className="text-gray-600 whitespace-pre-wrap">{opportunity.description}</p>
      </CardContent>

      <CardFooter className="flex justify-between items-center border-t pt-4">
        <div>
          {opportunity.deadline ? (
            <div className="text-sm">
              <span className="text-gray-600">Deadline: </span>
              <span className="font-medium text-gray-800">
                {new Date(opportunity.deadline).toLocaleDateString()}
              </span>
            </div>
          ) : (
            <div className="text-sm text-gray-600">No deadline specified</div>
          )}
        </div>

        <div className="flex gap-2">
          {isCreator && (
            <>
              <Button variant="outline" asChild>
                <Link href={`/opportunities/${opportunity.id}/edit`}>
                  Edit
                </Link>
              </Button>
              <Button variant="destructive" asChild>
                <Link href={`/opportunities/${opportunity.id}/delete`}>
                  Delete
                </Link>
              </Button>
            </>
          )}
          {canApply && (
            <Button asChild>
              <Link href={`/applications/create/${opportunity.id}`}>
                Apply
              </Link>
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  )
} 