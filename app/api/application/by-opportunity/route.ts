import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/app/auth';
import { isAdmin, isTeacher } from '@/lib/acl';
import { sendMail } from '@/lib/mail';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        
        const user = session.user;
        
        if (!isTeacher(user)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        
        const opportunityId = searchParams.get('opportunityId');
        if (!opportunityId) {
            return NextResponse.json({ error: 'Opportunity ID is required' }, { status: 400 });
        }
        
        const applications = await prisma.application.findMany({
            where: {
                opportunityId: opportunityId,
            },
        });
        
        return NextResponse.json(applications);
    } catch (error) {
        console.error('Error fetching applications:', error);
        return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 });
    }
}

//accept/reject application
export async function POST(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        
        const user = session.user;
        
        if (!isTeacher(user)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        
        //creator email == user email or isAdmin
        const opportunity = await prisma.opportunity.findUnique({
            where: {
                id: searchParams.get('opportunityId') ?? undefined,
            },
            select: {
                creatorEmail: true,
            },
        });

        if (!opportunity) {
            return NextResponse.json({ error: 'Opportunity not found' }, { status: 404 });
        }

        if (user.email !== opportunity.creatorEmail && !isAdmin(user)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const applicationId = searchParams.get('applicationId');
        const status = searchParams.get('status');

        if (!applicationId || !status) {
            return NextResponse.json({ error: 'Application ID and status are required' }, { status: 400 });
        }

        // Validate status is one of the allowed values
        const validStatuses = ['accepted', 'rejected', 'pending'];
        if (!validStatuses.includes(status.toLowerCase())) {
            return NextResponse.json({ error: 'Invalid status value' }, { status: 400 });
        }

        const application = await prisma.application.update({
            where: {
                id: applicationId,
            },
            data: {
                status: status,
            },
            include: {
                opportunity: true
            }
        });

        // Send email to student about status change
        await sendMail(
            application.applicantEmail,
            `Application Status Updated: ${application.opportunity.title}`,
            `Dear ${application.applicantName},\n\nYour application for "${application.opportunity.title}" has been updated to status: ${status}.\n\nBest regards,\nTIS Team`
        );

        return NextResponse.json(application);
    } catch (error) {
        console.error('Error updating application:', error);
        return NextResponse.json({ error: 'Failed to update application' }, { status: 500 });
    }
} 