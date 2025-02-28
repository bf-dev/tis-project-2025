import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { clerkClient, getAuth } from '@clerk/nextjs/server';

export async function GET(request: NextRequest) {
    const { userId } = await getAuth(request);
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const user = await (await clerkClient()).users.getUser(userId);
    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    try {
        const applications = await prisma.application.findMany({
            where: {
                applicantEmail: user.emailAddresses[0].emailAddress
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