import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/app/auth';

export async function GET() {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        
        const user = session.user;
        
        // Ensure user.email is a string
        const userEmail = user.email || '';
        
        if (!userEmail) {
            return NextResponse.json({ error: 'User email not found' }, { status: 400 });
        }

        const applications = await prisma.application.findMany({
            where: {
                applicantEmail: userEmail
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