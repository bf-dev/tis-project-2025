'use client';

import { useState, useEffect } from 'react';
import { 
  H1, 
  H2, 
  Paragraph, 
  Tag, 
  Button,
  LoadingBox,
  ErrorSummary,
  Heading,
  GridRow,
  GridCol
} from 'govuk-react';
import Link from 'next/link';

interface Application {
    id: string;
    status: string;
    coverLetter: string;
    createdAt: string;
    applicantName: string;
    applicantEmail: string;
    opportunity: {
        id: string;
        title: string;
        type: string;
        deadline: string | null;
        description: string;
    };
}

export default function ManageApplications() {
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            const response = await fetch('/api/application/manage');
            if (!response.ok) {
                throw new Error('Failed to fetch applications');
            }
            const data = await response.json();
            setApplications(data);
        } catch (error) {
            console.error('Error:', error);
            setError('Error fetching applications');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (applicationId: string, newStatus: string) => {
        try {
            const response = await fetch('/api/application/manage', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    applicationId,
                    status: newStatus,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update application');
            }

            // Refresh applications list
            fetchApplications();
        } catch (error) {
            console.error('Error:', error);
            setError('Error updating application status');
        }
    };

    if (loading) {
        return <LoadingBox>Loading applications...</LoadingBox>;
    }

    if (error) {
        return <ErrorSummary heading="There is a problem" description={error} />;
    }

    // Group applications by opportunity
    const applicationsByOpportunity = applications.reduce((acc, application) => {
        const opportunityId = application.opportunity.id;
        if (!acc[opportunityId]) {
            acc[opportunityId] = {
                opportunity: application.opportunity,
                applications: []
            };
        }
        acc[opportunityId].applications.push(application);
        return acc;
    }, {} as Record<string, { opportunity: Application['opportunity'], applications: Application[] }>);

    return (
        <>
            <H1>Manage Applications</H1>
            
            {Object.keys(applicationsByOpportunity).length === 0 ? (
                <div>
                    <Heading size="MEDIUM">No Applications</Heading>
                    <Paragraph>No applications received yet.</Paragraph>
                    <Button as={Link} href="/opportunities">View Your Opportunities</Button>
                </div>
            ) : (
                <>
                    {Object.entries(applicationsByOpportunity).map(([opportunityId, { opportunity, applications }]) => (
                        <div key={opportunityId} style={{ marginBottom: '30px' }}>
                            <H2>
                                {opportunity.type === "Service Project" ? (
                                    <Tag style={{ backgroundColor: '#1d70b8' }}>Service Project</Tag>
                                ) : (
                                    <Tag>{opportunity.type}</Tag>
                                )} {opportunity.title}
                            </H2>
                            
                            {applications.map((application) => (
                                <div key={application.id} style={{ marginBottom: '20px', borderBottom: '1px solid #b1b4b6', paddingBottom: '20px' }}>
                                    <Heading size="MEDIUM">Application from {application.applicantName}</Heading>
                                    
                                    <GridRow>
                                        <GridCol setWidth="two-thirds">
                                            <div style={{ fontSize: '0.875rem', color: '#505a5f', marginBottom: '15px' }}>
                                                <strong>Applicant:</strong> {application.applicantName} ({application.applicantEmail})
                                            </div>
                                            
                                            <div style={{ fontSize: '0.875rem', marginBottom: '10px' }}>
                                                <strong>Applied on:</strong> {new Date(application.createdAt).toLocaleDateString()}
                                            </div>
                                            
                                            <div style={{ marginTop: '15px', borderLeft: '4px solid #b1b4b6', paddingLeft: '15px' }}>
                                                <strong>Cover Letter:</strong><br />
                                                {application.coverLetter}
                                            </div>
                                        </GridCol>
                                        
                                        <GridCol setWidth="one-third">
                                            <div style={{ marginBottom: '15px' }}>
                                                <strong>Status:</strong>
                                            </div>
                                            
                                            {application.status === 'pending' ? (
                                                <div style={{ display: 'flex', gap: '10px' }}>
                                                    <Button 
                                                        onClick={() => handleUpdateStatus(application.id, 'ACCEPTED')}
                                                        buttonColour="#00703c"
                                                    >
                                                        Accept
                                                    </Button>
                                                    <Button 
                                                        onClick={() => handleUpdateStatus(application.id, 'REJECTED')}
                                                        buttonColour="#d4351c"
                                                    >
                                                        Reject
                                                    </Button>
                                                </div>
                                            ) : (
                                                <div style={{ 
                                                    display: 'inline-block', 
                                                    backgroundColor: application.status === 'ACCEPTED' ? '#00703c' : '#d4351c',
                                                    color: 'white',
                                                    padding: '5px 10px',
                                                    borderRadius: '4px',
                                                    fontWeight: 'bold'
                                                }}>
                                                    {application.status.charAt(0) + application.status.slice(1).toLowerCase()}
                                                </div>
                                            )}
                                        </GridCol>
                                    </GridRow>
                                </div>
                            ))}
                        </div>
                    ))}
                </>
            )}
        </>
    );
} 