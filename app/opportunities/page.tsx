import { isTeacher } from "@/lib/acl";
import CreateButton from "./CreateButton";
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import type { Opportunity } from ".prisma/client";

export default async function Opportunities() {
  const {userId} = await auth();
  const opportunities = await prisma.opportunity.findMany({
    orderBy: {
      createdAt: 'desc'
    }
  });
  
  if (!userId) {
    return <div>Please sign in to continue</div>;
  }
  const user = await currentUser();
  if (!user) {
    return <div>Please sign in to continue</div>;
  }
  return (
    <div>
      <h3>Opportunities</h3>
      {isTeacher(user) && <CreateButton />}
      
      {opportunities.map((opportunity: Opportunity) => (
        <div key={opportunity.id} style={{ padding: "10px", margin: "10px 0", border: "1px solid #eee", borderRadius: "4px" }}>
          <h5>
            <mark
              style={{ position: "relative", bottom: "2px", marginRight: "2px" }}
            >
              {opportunity.type}
            </mark>{" "}
            {opportunity.title}
          </h5>
          <cite>Created by {opportunity.creatorName}</cite>
          {opportunity.deadline && (
            <div style={{ fontSize: "0.9em", color: "#666" }}>
              Deadline: {opportunity.deadline}
            </div>
          )}
          <p>{opportunity.description}</p>
          <div className="space-x-2">
            <a href={`/application/${opportunity.id}/create`}>Apply</a>
            {isTeacher(user) && opportunity.creatorEmail === user.emailAddresses[0].emailAddress && (
              <>
                <a href={`/opportunities/${opportunity.id}/edit`}>Edit</a>
                <a href={`/opportunities/${opportunity.id}/delete`}>Delete</a>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
