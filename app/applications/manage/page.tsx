import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { isTeacher } from '@/lib/acl'
import { prisma } from '@/lib/prisma'
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { sendMail } from '@/lib/mail'
import { after } from 'next/server'

const statusStyles = {
  pending: {
    variant: "secondary" as const,
    label: "Pending"
  },
  accepted: {
    variant: "default" as const,
    label: "Accepted"
  },
  rejected: {
    variant: "destructive" as const,
    label: "Rejected"
  }
}

async function updateApplicationStatus(formData: FormData) {
  'use server'
  
  const session = await auth()
  if (!session?.user) {
    throw new Error('Unauthorized')
  }

  if (!isTeacher(session.user)) {
    throw new Error('Unauthorized - Teachers only')
  }

  const applicationId = formData.get('applicationId') as string
  const status = formData.get('status') as string

  // Get the application with opportunity details
  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: { opportunity: true }
  })

  if (!application) {
    throw new Error('Application not found')
  }

  // Update the application status
  await prisma.application.update({
    where: { id: applicationId },
    data: { status },
  })

  // Send email to the student
  const emailSubject = `Application ${status.charAt(0).toUpperCase() + status.slice(1)}: ${application.opportunity.title}`
  let emailBody = ''

  if (status === 'accepted') {
    emailBody = `
Dear ${application.applicantName},

Congratulations! Your application for "${application.opportunity.title}" has been accepted.

Next steps and additional information will be communicated to you shortly.

Best regards,
${application.opportunity.creatorName}
    `.trim()
  } else if (status === 'rejected') {
    emailBody = `
Dear ${application.applicantName},

Thank you for your interest in "${application.opportunity.title}". After careful consideration, we regret to inform you that your application has not been accepted at this time.
Best regards,
${application.opportunity.creatorName}
    `.trim()
  }

  if (emailBody) {
    after(()=>{
      sendMail(application.applicantEmail, emailSubject, emailBody)
    })
  }

  redirect('/applications/manage')
}

export default async function ManageApplicationsPage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect('/')
  }

  if (!isTeacher(session.user)) {
    redirect('/')
  }

  const applications = await prisma.application.findMany({
    where: {
      opportunity: {
        creatorEmail: session.user.email!,
      },
    },
    include: {
      opportunity: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Manage Applications</h1>
      
      <div className="space-y-6">
        {applications.length === 0 ? (
          <p className="text-gray-600">No applications received yet.</p>
        ) : (
          applications.map((application) => {
            const status = statusStyles[application.status as keyof typeof statusStyles]
            
            return (
              <Card key={application.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h2 className="text-xl font-semibold text-gray-800">
                          {application.applicantName}
                        </h2>
                        <Badge variant="outline">
                          {application.opportunity.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        for {application.opportunity.title}
                      </p>
                    </div>
                    <form 
                      action={updateApplicationStatus}
                      className="flex items-center gap-2"
                    >
                      <input type="hidden" name="applicationId" value={application.id} />
                      <Badge variant={status.variant}>
                        Current: {status.label}
                      </Badge>
                      <Select 
                        name="status" 
                        defaultValue={application.status}
                      >
                        <SelectTrigger className="w-[130px]">
                          <SelectValue placeholder="Change status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="accepted">Accept</SelectItem>
                          <SelectItem value="rejected">Reject</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button type="submit" size="sm">
                        Update
                      </Button>
                    </form>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="text-sm text-gray-600 whitespace-pre-wrap rounded-lg bg-gray-50 p-4">
                      {application.coverLetter}
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="flex justify-between text-sm text-gray-500">
                  <p>Contact: {application.applicantEmail}</p>
                  <p>Applied: {new Date(application.createdAt).toLocaleDateString()}</p>
                </CardFooter>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
