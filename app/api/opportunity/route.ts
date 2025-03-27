import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/app/auth';


export async function GET() {
  try {
    
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    
    const opportunities = await prisma.opportunity.findMany({
      orderBy: {
        createdAt: 'desc'
      }
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


export async function POST(request: Request) {
  try {
    
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    
    const body = await request.json();
    
    
    const opportunity = await prisma.opportunity.create({
      data: {
        title: body.title,
        description: body.description,
        type: body.type,
        deadline: body.deadline || null,
        creatorName: session.user.name || 'Unknown',
        creatorEmail: session.user.email || 'unknown@example.com',
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


export async function PATCH(request: Request) {
  try {
    
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    
    const body = await request.json();
    
    
    if (!body.id) {
      return NextResponse.json({ error: 'Opportunity ID is required' }, { status: 400 });
    }

    
    const opportunity = await prisma.opportunity.findUnique({
      where: { id: body.id }
    });

    
    if (!opportunity) {
      return NextResponse.json({ error: 'Opportunity not found' }, { status: 404 });
    }

    
    if (opportunity.creatorEmail !== session.user.email) {
      return NextResponse.json({ error: 'You are not authorized to update this opportunity' }, { status: 403 });
    }

    
    const updatedOpportunity = await prisma.opportunity.update({
      where: { id: body.id },
      data: {
        title: body.title || opportunity.title,
        description: body.description || opportunity.description,
        type: body.type || opportunity.type,
        deadline: body.deadline || opportunity.deadline,
      }
    });

    return NextResponse.json(updatedOpportunity);
  } catch (error) {
    console.error('Error updating opportunity:', error);
    return NextResponse.json(
      { error: 'Failed to update opportunity' },
      { status: 500 }
    );
  }
}


export async function DELETE(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Opportunity ID is required' }, { status: 400 });
    }

    const opportunity = await prisma.opportunity.findUnique({
      where: { id },
      include: {
        applications: true
      }
    });

    if (!opportunity) {
      return NextResponse.json({ error: 'Opportunity not found' }, { status: 404 });
    }

    if (opportunity.creatorEmail !== session.user.email) {
      return NextResponse.json({ error: 'You are not authorized to delete this opportunity' }, { status: 403 });
    }

    // Delete all applications first
    await prisma.application.deleteMany({
      where: { opportunityId: id }
    });

    // Then delete the opportunity
    await prisma.opportunity.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Opportunity deleted successfully' });
  } catch (error) {
    console.error('Error deleting opportunity:', error);
    return NextResponse.json(
      { error: 'Failed to delete opportunity' },
      { status: 500 }
    );
  }
} 