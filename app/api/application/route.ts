import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/app/auth";
import { isAdmin, isStudent } from "@/lib/acl";
import { sendMail } from "@/lib/mail";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const user = session.user;
    
    if (!isStudent(user) && !isAdmin(user)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const opportunityId = body.opportunityId;
    const coverLetter = body.coverLetter;
    const applicantEmail = user.email || "";
    const applicantName = user.name || applicantEmail.split("@")[0].replaceAll(".", " ");
    
    if (!opportunityId || !coverLetter || !applicantEmail || !applicantName) {
      console.log(opportunityId, coverLetter, applicantEmail, applicantName);
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    
    const application = await prisma.application.create({
      data: {
        opportunityId,
        coverLetter,
        applicantEmail,
        applicantName,
      },
    });

    // Get opportunity details to send emails
    const opportunity = await prisma.opportunity.findUnique({
      where: { id: opportunityId },
      select: { title: true, creatorEmail: true }
    });

    if (opportunity) {
      // Send email to student
      await sendMail(
        applicantEmail,
        `Application Submitted: ${opportunity.title}`,
        `Dear ${applicantName},\n\nYour application for "${opportunity.title}" has been successfully submitted. We will notify you when there are any updates to your application status.\n\nBest regards,\nTIS Team`
      );

      // Send email to teacher
      await sendMail(
        opportunity.creatorEmail,
        `New Application Received: ${opportunity.title}`,
        `Dear Teacher,\n\nA new application has been received for "${opportunity.title}" from ${applicantName} (${applicantEmail}).\n\nPlease review the application at your earliest convenience.\n\nBest regards,\nTIS Team`
      );
    }

    return NextResponse.json(application);
  } catch (error) {
    console.error("Error creating application:", error);
    return NextResponse.json(
      { error: "Failed to create application" },
      { status: 500 }
    );
  }
} 