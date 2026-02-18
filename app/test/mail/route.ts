import { NextRequest, NextResponse } from 'next/server';
import { sendMail } from '@/lib/mail';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const to = searchParams.get('to') || 'test@example.com';
  const subject = searchParams.get('subject') || 'Test Email';
  const text = searchParams.get('text') || 'This is a test email from the mail API endpoint';
  
  try {
    const result = await sendMail(to, subject, text);
    
    return NextResponse.json({ 
      success: result.success,
      message: result.message,
      details: {
        to,
        subject,
        messageId: result.messageId
      }
    });
  } catch (error) {
    console.error('Error in mail test API:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to send test email',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 