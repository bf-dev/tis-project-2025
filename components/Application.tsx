import { Application as ApplicationType } from '@prisma/client'
import { Opportunity } from '@prisma/client'
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

type ApplicationWithOpportunity = ApplicationType & {
  opportunity: Opportunity
}

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

export default function Application({
  application,
}: {
  application: ApplicationWithOpportunity
}) {
  const status = statusStyles[application.status as keyof typeof statusStyles]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold text-card-foreground">
              {application.applicantName}
            </h2>
            <p className="text-sm text-muted-foreground">
              {application.applicantEmail}
            </p>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline">
              {application.opportunity.type}
            </Badge>
            <Badge variant={status.variant}>
              {status.label}
            </Badge>
          </div>

        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="text-sm text-card-foreground whitespace-pre-wrap rounded-lg bg-muted p-4">
            {application.coverLetter}
          </div>
        </div>
      </CardContent>
      
      <CardFooter>
        <p className="text-sm text-muted-foreground">
          Applied on: {new Date(application.createdAt).toLocaleDateString()}
        </p>
      </CardFooter>
    </Card>
  )
}