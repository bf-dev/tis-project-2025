import { NextResponse } from 'next/server';
import { auth } from '@/app/auth';
import { isTeacher } from '@/lib/acl';

export async function GET() {
    const session = await auth();
    if (!session || !session.user) {
        return NextResponse.json({ isTeacher: false });
    }
    
    return NextResponse.json({ isTeacher: isTeacher(session.user) });
}