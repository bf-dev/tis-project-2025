import { redirect } from 'next/navigation'
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

async function createOpportunity(formData: FormData) {
  'use server'
  
  const session = await auth()
  if (!session?.user) {
    throw new Error('Unauthorized')
  }

  if (!isTeacher(session.user)) {
    throw new Error('Unauthorized - Teachers only')
  }

  const title = formData.get('title') as string
  const type = formData.get('type') as string
  const description = formData.get('description') as string
  const deadline = formData.get('deadline') as string

  await prisma.opportunity.create({
    data: {
      title,
      type,
      description,
      deadline: deadline || null,
      creatorEmail: session.user.email!,
      creatorName: session.user.name || 'Unknown',
    },
  })

  redirect('/opportunities')
}

export default async function CreateOpportunityPage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect('/')
  }

  if (!isTeacher(session.user)) {
    redirect('/')
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Opportunity</h1>
      
      <Card>
        <CardContent className="pt-6">
          <form action={createOpportunity} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                type="text"
                name="title"
                id="title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select name="type" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select a type" />
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
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="deadline">Deadline (Optional)</Label>
              <Input
                type="date"
                name="deadline"
                id="deadline"
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit">
                Create Opportunity
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 