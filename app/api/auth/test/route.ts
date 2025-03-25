import { NextResponse } from 'next/server';
import { auth } from '@/app/auth';

/**
 * Test authentication API route
 * This API allows you to check if a user is authenticated and return their info
 */
export async function GET() {
  try {
    // Get the session
    const session = await auth();
    
    // If no session exists, return unauthorized
    if (!session || !session.user) {
      return NextResponse.json(
        { 
          authenticated: false,
          message: 'User is not authenticated'
        },
        { status: 401 }
      );
    }

    // Return user info and authentication status
    return NextResponse.json({
      authenticated: true,
      message: 'User is authenticated',
      user: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
        // Include emailAddresses for compatibility with our app's structure
        emailAddresses: session.user.emailAddresses || []
      },
      sessionExpires: session.expires
    });
  } catch (error) {
    console.error("Authentication test error:", error);
    return NextResponse.json(
      { 
        authenticated: false,
        message: 'Error checking authentication status',
        error: (error as Error).message
      },
      { status: 500 }
    );
  }
} 