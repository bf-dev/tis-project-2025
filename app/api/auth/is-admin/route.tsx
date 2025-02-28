import { NextRequest, NextResponse } from 'next/server';
import { clerkClient, getAuth } from '@clerk/nextjs/server';
import { isAdmin } from '@/lib/acl';

export async function GET(request: NextRequest) {
    const { userId } = await getAuth(request);
    if (!userId) {
        return NextResponse.json({ isAdmin: false });
    }
    
    const user = await (await clerkClient()).users.getUser(userId);
    if (!user) {
        return NextResponse.json({ isAdmin: false });
    }

    return NextResponse.json({ isAdmin: isAdmin(user) });
} 