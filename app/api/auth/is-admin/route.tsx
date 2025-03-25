import { NextResponse } from 'next/server';
import { auth } from '@/app/auth';
import { isAdmin } from '@/lib/acl';

export async function GET() {
    const session = await auth();
    if (!session || !session.user) {
        return NextResponse.json({ isAdmin: false });
    }
    
    return NextResponse.json({ isAdmin: isAdmin(session.user) });
} 