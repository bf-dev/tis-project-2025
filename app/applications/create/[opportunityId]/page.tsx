import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { auth } from '@/auth'
import { isStudent } from '@/lib/acl'
import { prisma } from '@/lib/prisma'
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { applicationQuestions } from '@/lib/questions'
import { sendMail } from '@/lib/mail'

async function createApplication(opportunityId: string, formData: FormData) {
  'use server'
  
  const session = await auth()
  if (!session?.user) {
    throw new Error('Unauthorized')
  }

  if (!isStudent(session.user)) {
    throw new Error('Unauthorized - Students only')
  }

  // Format the cover letter with questions and responses
  let coverLetter = ''
  for (const { id, question } of applicationQuestions) {
    const response = formData.get(id) as string
    coverLetter += `Question: ${question}\nResponse: ${response}\n\n`
  }

  // Get the opportunity details to include in the email
  const opportunity = await prisma.opportunity.findUnique({
    where: { id: opportunityId }
  })

  if (!opportunity) {
    throw new Error('Opportunity not found')
  }

  // Create the application
  const application = await prisma.application.create({
    data: {
      opportunityId,
      applicantEmail: session.user.email!,
      applicantName: session.user.name || 'Unknown',
      coverLetter: coverLetter.trim(),
      status: 'pending',
    },
  })

  // Send email to the teacher
  const emailSubject = `New Application Received: ${opportunity.title}`
  const emailBody = `
Dear ${opportunity.creatorName},

A new application has been received for "${opportunity.title}".

Applicant Details:
- Name: ${session.user.name}
- Email: ${session.user.email}

Application Content:
${coverLetter}

You can review this application at: ${process.env.NEXT_PUBLIC_APP_URL}/applications/${application.id}

Best regards,
TIS Team
  `.trim()
  console.log(opportunity.creatorEmail, emailSubject, emailBody)
  await sendMail(opportunity.creatorEmail, emailSubject, emailBody)

  redirect('/applications')
}

export default async function CreateApplicationPage({
  params,
}: {
  params: Promise<{ opportunityId: string }>
}) {
  const session = await auth()
  
  if (!session?.user) {
    throw new Error('Unauthorized')
  }

  if (!isStudent(session.user)) {
    throw new Error('Unauthorized - Students only')
  }

  const opportunity = await prisma.opportunity.findUnique({
    where: { id: (await params).opportunityId }
  })

  if (!opportunity) {
    notFound()
  }

  // Check if user has already applied
  const existingApplication = await prisma.application.findFirst({
    where: {
      opportunityId: (await params).opportunityId,
      applicantEmail: session.user.email!,
    },
  })

  if (existingApplication) {
    redirect('/applications')
  }

  const createApplicationWithId = createApplication.bind(null, (await params).opportunityId)

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 bg-tis-bg min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Apply for {opportunity.title}
        </h1>
        <p className="text-gray-600 mt-2">
          Please answer all questions thoughtfully to submit your application.
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Application Questions</h2>
            <p className="text-sm text-gray-600">
              Your responses will help us understand why you&apos;re a great fit for this opportunity.
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <form action={createApplicationWithId} className="space-y-8">
            {applicationQuestions.map(({ id, question }) => (
              <div key={id} className="space-y-2">
                <Label htmlFor={id}>{question}</Label>
                <Textarea
                  id={id}
                  name={id}
                  required
                  placeholder="Enter your response here..."
                  className="min-h-[100px]"
                />
              </div>
            ))}

            <div className="flex justify-end gap-4">
              <Button variant="outline" asChild>
                <Link href={`/opportunities/${(await params).opportunityId}`}>
                  Cancel
                </Link>
              </Button>
              <Button type="submit">
                Submit Application
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
