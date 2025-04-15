import { redirect } from 'next/navigation'
import Link from 'next/link'
import { auth } from '@/auth'
import { isTeacher } from '@/lib/acl'
import { prisma } from '@/lib/prisma'
import { Card, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import Opportunity from '@/components/Opportunity'
import Application from '@/components/Application'

export default async function AdminDashboardPage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect('/')
  }

  if (!isTeacher(session.user)) {
    redirect('/')
  }

  // Fetch all opportunities with their applications
  const opportunities = await prisma.opportunity.findMany({
    include: {
      applications: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  // Fetch all applications with their opportunities
  const applications = await prisma.application.findMany({
    include: {
      opportunity: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  // Calculate statistics
  const stats = {
    totalOpportunities: opportunities.length,
    totalApplications: applications.length,
    pendingApplications: applications.filter(app => app.status === 'pending').length,
    acceptedApplications: applications.filter(app => app.status === 'accepted').length,
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 bg-tis-bg min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Overview of all opportunities and applications</p>
        </div>
        <Button className="bg-tis-blue hover:bg-tis-blue/90" asChild>
          <Link href="/opportunities/create">
            Create Opportunity
          </Link>
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader>
            <h3 className="text-sm font-medium text-gray-500">Total Opportunities</h3>
            <p className="text-2xl font-bold">{stats.totalOpportunities}</p>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <h3 className="text-sm font-medium text-gray-500">Total Applications</h3>
            <p className="text-2xl font-bold">{stats.totalApplications}</p>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <h3 className="text-sm font-medium text-gray-500">Pending Applications</h3>
            <p className="text-2xl font-bold">{stats.pendingApplications}</p>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <h3 className="text-sm font-medium text-gray-500">Accepted Applications</h3>
            <p className="text-2xl font-bold">{stats.acceptedApplications}</p>
          </CardHeader>
        </Card>
      </div>

      <Tabs defaultValue="opportunities" className="space-y-4">
        <TabsList>
          <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
        </TabsList>

        <TabsContent value="opportunities" className="space-y-4">
          {opportunities.map((opportunity) => (
            <Opportunity key={opportunity.id} opportunity={opportunity} />
          ))}
        </TabsContent>

        <TabsContent value="applications" className="space-y-4">
          {applications.map((application) => (
            <Application key={application.id} application={application} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
} 