import { notFound } from 'next/navigation'
import Application from '@/components/Application'
import Opportunity from '@/components/Opportunity'
import { prisma } from '@/lib/prisma'
import { Card, CardHeader, CardContent } from "@/components/ui/card"

interface PageProps {
  params: Promise<{
    applicationId: string
  }>
}

export default async function ApplicationPage({ params }: PageProps) {
  const application = await prisma.application.findUnique({
    where: {
      id: (await params).applicationId,
    },
    include: {
      opportunity: true,
    },
  })

  if (!application) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Application for {application.opportunity.title}
        </h1>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Application Details</h2>
          </CardHeader>
          <CardContent>
            <Application application={application} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Opportunity Details</h2>
          </CardHeader>
          <CardContent>
            <Opportunity opportunity={application.opportunity} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 