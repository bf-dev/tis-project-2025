"use client";

import { isTeacher, isAdmin } from "@/lib/acl";
import CreateButton from "./CreateButton";
import { useSession } from "next-auth/react";
import type { Opportunity } from "@prisma/client";
import { useEffect, useState } from "react";
import { 
  H1, 
  Paragraph, 
  LoadingBox, 
  ErrorSummary, 
  Tag,
  GridRow,
  GridCol,
  Button,
  Heading
} from "govuk-react";

export default function Opportunities() {
  const { data: session, status } = useSession();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch opportunities data
    const fetchData = async () => {
      try {
        // Fetch opportunities
        const res = await fetch('/api/opportunity');
        if (!res.ok) {
          throw new Error('Failed to fetch opportunities');
        }
        
        const data = await res.json();
        setOpportunities(data);
      } catch (err) {
        console.error(err);
        setError("Error loading opportunities");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  if (loading && status === "loading") {
    return <LoadingBox>Loading opportunities...</LoadingBox>;
  }
  
  if (error) {
    return <ErrorSummary heading="There is a problem" description={error} />;
  }
  
  if (status !== "authenticated" || !session?.user) {
    return (
      <div>
        <Heading size="MEDIUM">Please sign in</Heading>
        <Paragraph>You need to sign in to view opportunities.</Paragraph>
      </div>
    );
  }
  
  return (
    <>
      <H1>Opportunities</H1>
      {isTeacher(session.user) && (
        <div style={{ marginBottom: '20px' }}>
          <CreateButton />
        </div>
      )}
      
      {opportunities.length === 0 ? (
        <div>
          <Heading size="MEDIUM">No Opportunities</Heading>
          <Paragraph>No opportunities available at this time.</Paragraph>
        </div>
      ) : (
        opportunities.map((opportunity) => (
          <div key={opportunity.id} style={{ marginBottom: '30px', borderBottom: '1px solid #b1b4b6', paddingBottom: '20px' }}>
            <Heading size="MEDIUM">{opportunity.title}</Heading>
            <GridRow>
              <GridCol setWidth="two-thirds">
                <div style={{ fontSize: '0.875rem', color: '#505a5f', marginBottom: '10px' }}>
                  Created by {opportunity.creatorName}
                </div>
                
                {opportunity.type === "Service Project" ? (
                  <Tag style={{ backgroundColor: '#1d70b8' }}>Service Project</Tag>
                ) : (
                  <Tag>{opportunity.type}</Tag>
                )}
                
                {opportunity.deadline && (
                  <div style={{ margin: '15px 0' }}>
                    <strong>Deadline:</strong> {opportunity.deadline}
                  </div>
                )}
                
                <Paragraph style={{ marginTop: '15px' }}>
                  {opportunity.description}
                </Paragraph>
              </GridCol>
              
              <GridCol setWidth="one-third">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <Button as="a" href={`/application/${opportunity.id}/create`}>
                    Apply
                  </Button>
                  
                  {(isAdmin(session.user) || (isTeacher(session.user) && opportunity.creatorEmail === session.user.email)) && (
                    <>
                      <Button 
                        as="a" 
                        href={`/opportunities/${opportunity.id}/edit`} 
                        buttonColour="#f3f2f1" 
                        buttonTextColour="#0b0c0c"
                      >
                        Edit
                      </Button>
                      <Button 
                        as="a" 
                        href={`/opportunities/${opportunity.id}/delete`} 
                        buttonColour="#f3f2f1" 
                        buttonTextColour="#0b0c0c"
                      >
                        Delete
                      </Button>
                    </>
                  )}
                </div>
              </GridCol>
            </GridRow>
          </div>
        ))
      )}
    </>
  );
}
