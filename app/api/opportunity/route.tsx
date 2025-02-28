import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuth, clerkClient, currentUser } from '@clerk/nextjs/server'
import { isTeacher, isAdmin } from '@/lib/acl';

export async function GET(req: NextRequest) {
    const {userId} = await getAuth(req);
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const user = await (await clerkClient()).users.getUser(userId);
    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    

    try {
        const opportunities = await prisma.opportunity.findMany({
            orderBy: {
                createdAt: 'desc',
            },
        });
        
        return NextResponse.json(opportunities);
    } catch (error) {
        console.error('Error fetching opportunities:', error);
        return NextResponse.json(
            { error: 'Failed to fetch opportunities' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { title, description, deadline, type } = body;
        const {userId} = await getAuth(request);
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
        const creatorEmail = user.emailAddresses[0].emailAddress;
        const creatorName = user.fullName || creatorEmail.split("@")[0].replaceAll(".", " ")
        // Validate required fields
        if (!title || !description || !type) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const opportunity = await prisma.opportunity.create({
            data: {
                title,
                description,
                deadline,
                type,
                creatorEmail,
                creatorName,
            },
        });

        return NextResponse.json(opportunity, { status: 201 });
    } catch (error) {
        console.error('Error creating opportunity:', error);
        return NextResponse.json(
            { error: 'Failed to create opportunity' },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { userId } = await getAuth(request);
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const user = await (await clerkClient()).users.getUser(userId);
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { error: 'Missing opportunity ID' },
                { status: 400 }
            );
        }

        // Check if the opportunity exists and get creator email
        const opportunity = await prisma.opportunity.findUnique({
            where: { id },
            select: { creatorEmail: true }
        });

        if (!opportunity) {
            return NextResponse.json({ error: 'Opportunity not found' }, { status: 404 });
        }

        // Check if user is admin or the creator of the opportunity
        if (!isAdmin(user) && opportunity.creatorEmail !== user.emailAddresses[0].emailAddress) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Delete all related applications first
        await prisma.application.deleteMany({
            where: { opportunityId: id }
        });

        // Then delete the opportunity
        await prisma.opportunity.delete({
            where: { id }
        });

        return NextResponse.json({ message: 'Opportunity and related applications deleted successfully' });
    } catch (error) {
        console.error('Error deleting opportunity:', error);
        return NextResponse.json(
            { error: 'Failed to delete opportunity' },
            { status: 500 }
        );
    }
}

export async function PUT(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        const body = await request.json();
        const { title, description, deadline, type, creatorEmail, creatorName } = body;

        if (!id) {
            return NextResponse.json(
                { error: 'Missing opportunity ID' },
                { status: 400 }
            );
        }

        if (!title || !description || !type || !creatorEmail || !creatorName) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const opportunity = await prisma.opportunity.update({
            where: { id },
            data: {
                title,
                description,
                deadline,
                type,
                creatorEmail,
                creatorName,
            },
        });

        return NextResponse.json(opportunity);
    } catch (error) {
        console.error('Error updating opportunity:', error);
        return NextResponse.json(
            { error: 'Failed to update opportunity' },
            { status: 500 }
        );
    }
}
