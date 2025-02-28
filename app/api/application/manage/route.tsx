import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { clerkClient, getAuth } from '@clerk/nextjs/server';
import { isTeacher } from '@/lib/acl';
import { sendMail } from '@/lib/mail';

export async function GET(request: NextRequest) {
    const { userId } = await getAuth(request);
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const user = await (await clerkClient()).users.getUser(userId);
    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    if (!isTeacher(user)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const applications = await prisma.application.findMany({
            where: {
                opportunity: {
                    creatorEmail: user.emailAddresses[0].emailAddress
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
    const { userId } = await getAuth(request);
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const user = await (await clerkClient()).users.getUser(userId);
    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    if (!isTeacher(user)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
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

        if (application.opportunity.creatorEmail !== user.emailAddresses[0].emailAddress) {
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