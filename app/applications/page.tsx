import { auth } from "@/auth";
import Application from "@/components/Application";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function ApplicationsPage() {
    const session = await auth()
    if (!session) {
        redirect('/login')
    }
    const applications = await prisma.application.findMany({
        where: {
            applicantEmail: session.user?.email || '',
        },  
        include: {
            opportunity: true,
        },
    })
    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">My Applications</h1>
                <p className="text-gray-600 mt-2">Check out the applications you have made below.</p>
            </div>

            <div className="space-y-6">
                {applications.length === 0 ? (
                    <p className="text-gray-600">You have not submitted any applications yet.</p>
                ) : (
                    applications.map((application) => (
                        <Application key={application.id} application={application} />
                    ))
                )}
            </div>
        </div>
    )
}