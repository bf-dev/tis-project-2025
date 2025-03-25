import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/app/auth';
import { isTeacher } from '@/lib/acl';
import { sendMail } from '@/lib/mail';

export async function GET() {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        
        const user = session.user;
        
        if (!isTeacher(user)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Ensure user.email is a string
        const userEmail = user.email || '';
        
        if (!userEmail) {
            return NextResponse.json({ error: 'User email not found' }, { status: 400 });
        }

        const applications = await prisma.application.findMany({
            where: {
                opportunity: {
                    creatorEmail: userEmail
                }
            },
            include: {
                opportunity: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        
        return NextResponse.json(applications);
    } catch (error) {
        console.error('Error fetching applications:', error);
        return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        
        const user = session.user;
        
        if (!isTeacher(user)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Ensure user.email is a string
        const userEmail = user.email || '';
        
        if (!userEmail) {
            return NextResponse.json({ error: 'User email not found' }, { status: 400 });
        }

        const body = await request.json();
        const { applicationId, status } = body;

        if (!applicationId || !status) {
            return NextResponse.json({ error: 'Application ID and status are required' }, { status: 400 });
        }

        // Verify the teacher owns the opportunity
        const application = await prisma.application.findUnique({
            where: { id: applicationId },
            include: { opportunity: true }
        });

        if (!application) {
            return NextResponse.json({ error: 'Application not found' }, { status: 404 });
        }

        if (application.opportunity.creatorEmail !== userEmail) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Update application status
        const updatedApplication = await prisma.application.update({
            where: { id: applicationId },
            data: { status },
            include: { opportunity: true }
        });

        // Send email to student about status change
        await sendMail(
            updatedApplication.applicantEmail,
            `Application Status Updated: ${updatedApplication.opportunity.title}`,
            `Dear ${updatedApplication.applicantName},\n\nYour application for "${updatedApplication.opportunity.title}" has been updated to status: ${status}.\n\nBest regards,\nTIS Team`
        );

        return NextResponse.json(updatedApplication);
    } catch (error) {
        console.error('Error updating application:', error);
        return NextResponse.json({ error: 'Failed to update application' }, { status: 500 });
    }
} 