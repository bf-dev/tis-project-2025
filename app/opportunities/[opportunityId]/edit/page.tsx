import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { auth } from '@/auth'
import { isTeacher } from '@/lib/acl'
import { prisma } from '@/lib/prisma'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"

async function updateOpportunity(opportunityId: string, formData: FormData) {
  'use server'
  
  const session = await auth()
  if (!session?.user) {
    throw new Error('Unauthorized')
  }

  if (!isTeacher(session.user)) {
    throw new Error('Unauthorized - Teachers only')
  }

  const opportunity = await prisma.opportunity.findUnique({
    where: { id: opportunityId }
  })

  if (!opportunity || opportunity.creatorEmail !== session.user.email) {
    throw new Error('Unauthorized - Not the creator')
  }

  const title = formData.get('title') as string
  const type = formData.get('type') as string
  const description = formData.get('description') as string
  const deadline = formData.get('deadline') as string

  await prisma.opportunity.update({
    where: { id: opportunityId },
    data: {
      title,
      type,
      description,
      deadline: deadline || null,
    },
  })

  redirect('/opportunities')
}

export default async function EditOpportunityPage({
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
    where: { id: (await params).opportunityId }
  })

  if (!opportunity) {
    notFound()
  }

  if (opportunity.creatorEmail !== session.user.email) {
    redirect('/opportunities')
  }

  const updateOpportunityWithId = updateOpportunity.bind(null, (await params).opportunityId)

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Opportunity</h1>
      
      <Card>
        <CardContent className="pt-6">
          <form action={updateOpportunityWithId} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                type="text"
                name="title"
                id="title"
                required
                defaultValue={opportunity.title}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select name="type" required defaultValue={opportunity.type}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Internship">Internship</SelectItem>
                  <SelectItem value="Service Project">Service Project</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                rows={4}
                required
                defaultValue={opportunity.description}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="deadline">Deadline (Optional)</Label>
              <Input
                type="date"
                name="deadline"
                id="deadline"
                defaultValue={opportunity.deadline?.split('T')[0] || ''}
              />
            </div>

            <div className="flex justify-end gap-4">
              <Button variant="outline" asChild>
                <Link href="/opportunities">
                  Cancel
                </Link>
              </Button>
              <Button type="submit">
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 