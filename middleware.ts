import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { auth } from './app/auth';

export async function middleware(request: NextRequest) {
  const { nextUrl } = request;
  
  
  if (nextUrl.pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }
  
  
  const session = await auth();
  
  
  if (!session && (
    nextUrl.pathname.startsWith('/api/') || 
    nextUrl.pathname.startsWith('/admin') ||
    nextUrl.pathname.startsWith('/dashboard')
  )) {
    return NextResponse.redirect(new URL('/api/auth/signin', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    
    '/(api|trpc)(.*)',
  ],
}