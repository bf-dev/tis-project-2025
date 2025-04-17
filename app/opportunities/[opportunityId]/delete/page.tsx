import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { auth } from '@/auth'
import { isTeacher, isAdmin } from '@/lib/acl'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

async function deleteOpportunity(opportunityId: string) {
  'use server'
  
  const session = await auth()
  if (!session?.user) {
    throw new Error('Unauthorized')
  }

  if (!isTeacher(session.user)) {
    throw new Error('Unauthorized - Teachers only')
  }

  const opportunity = await prisma.opportunity.findUnique({
    where: { id: opportunityId },
    include: {
      applications: true
    }
  })

  if (!opportunity || (!isAdmin(session.user) && opportunity.creatorEmail !== session.user.email)) {
    throw new Error('Unauthorized - Not the creator or admin')
  }

  // First delete all applications
  if (opportunity.applications.length > 0) {
    await prisma.application.deleteMany({
      where: {
        opportunityId: opportunityId
      }
    })
  }

  // Then delete the opportunity
  await prisma.opportunity.delete({
    where: { id: opportunityId },
  })

  redirect('/opportunities')
}

export default async function DeleteOpportunityPage({
  params,
}: {
  params: Promise<{ opportunityId: string }>
}) {
  const session = await auth()
  
  if (!session?.user) {
    redirect('/')
  }

  if (!isTeacher(session.user)) {
    redirect('/')
  }

  const opportunity = await prisma.opportunity.findUnique({
    where: { id: (await params).opportunityId },
    include: {
      applications: {
        select: {
          id: true
        }
      }
    }
  })

  if (!opportunity) {
    notFound()
  }

  if (!isAdmin(session.user) && opportunity.creatorEmail !== session.user.email) {
    redirect('/opportunities')
  }

  const deleteOpportunityWithId = deleteOpportunity.bind(null, (await params).opportunityId)

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Delete Opportunity</h1>
      
      <Card>
        <CardContent className="pt-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Are you sure?</AlertTitle>
            <AlertDescription>
              You are about to delete &quot;{opportunity.title}&quot;. This action cannot be undone.
              {opportunity.applications.length > 0 && (
                <p className="mt-2">
                  This will also delete {opportunity.applications.length} application{opportunity.applications.length !== 1 ? 's' : ''} 
                  that have been submitted for this opportunity.
                </p>
              )}
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter className="flex justify-end gap-4">
          <Button variant="outline" asChild>
            <Link href="/opportunities">
              Cancel
            </Link>
          </Button>
          <form action={deleteOpportunityWithId}>
            <Button variant="destructive" type="submit">
              Delete Opportunity
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  )
} 