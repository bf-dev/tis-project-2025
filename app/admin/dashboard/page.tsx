'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  GridCol,
  Tabs,
  Link,
} from 'govuk-react';

interface Opportunity {
    id: string;
    title: string;
    description: string;
    type: string;
    creatorName: string;
    creatorEmail: string;
    deadline?: string;
}

interface Application {
    id: string;
    opportunityId: string;
    applicantName: string;
    applicantEmail: string;
    coverLetter: string;
    status: string;
    createdAt: string;
    opportunity: Opportunity;
}

export default function AdminDashboard() {
    const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('opportunities');
    const router = useRouter();

    useEffect(() => {
        const checkAdminStatus = async () => {
            try {
                const response = await fetch('/api/auth/is-admin');
                const data = await response.json();
                if (!data.isAdmin) {
                    router.push('/');
                } else {
                    fetchData();
                }
            } catch (error) {
                console.error('Error checking admin status:', error);
                router.push('/');
            }
        };

        checkAdminStatus();
    }, [router]);

    const fetchData = async () => {
        try {
            const opportunitiesResponse = await fetch('/api/opportunity');
            if (!opportunitiesResponse.ok) {
                throw new Error('Failed to fetch opportunities');
            }
            const opportunitiesData = await opportunitiesResponse.json();
            setOpportunities(opportunitiesData);

            const applicationsResponse = await fetch('/api/application/manage');
            if (!applicationsResponse.ok) {
                throw new Error('Failed to fetch applications');
            }
            const applicationsData = await applicationsResponse.json();
            setApplications(applicationsData);
        } catch (error) {
            console.error('Error:', error);
            setError('Error fetching data');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateApplicationStatus = async (applicationId: string, newStatus: string) => {
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

            fetchData();
        } catch (error) {
            console.error('Error:', error);
            alert('Error updating application status');
        }
    };

    const handleDeleteOpportunity = async (id: string) => {
        if (!confirm('Are you sure you want to delete this opportunity?')) {
            return;
        }

        try {
            const response = await fetch(`/api/opportunity?id=${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete opportunity');
            }

            fetchData();
        } catch (error) {
            console.error('Error:', error);
            alert('Error deleting opportunity');
        }
    };

    if (loading) {
        return <LoadingBox>Loading...</LoadingBox>;
    }

    if (error) {
        return <ErrorSummary heading="There is a problem" description={error} />;
    }

    return (
        <>
            <H1>Admin Dashboard</H1>
            
            <Tabs>
                <Tabs.List>
                    <Tabs.Tab
                        selected={activeTab === 'opportunities'}
                        onClick={() => setActiveTab('opportunities')}
                    >
                        Opportunities ({opportunities.length})
                    </Tabs.Tab>
                    <Tabs.Tab
                        selected={activeTab === 'applications'}
                        onClick={() => setActiveTab('applications')}
                    >
                        Applications ({applications.length})
                    </Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel selected={activeTab === 'opportunities'}>
                    <div style={{ marginBottom: '20px' }}>
                        <Button as={Link} href="/opportunities/create">Create New Opportunity</Button>
                    </div>

                    {opportunities.length === 0 ? (
                        <div>
                            <Heading size="MEDIUM">No Opportunities</Heading>
                            <Paragraph>No opportunities available at this time.</Paragraph>
                        </div>
                    ) : (
                        opportunities.map((opportunity) => (
                            <div key={opportunity.id} style={{ marginBottom: '30px', borderBottom: '1px solid #b1b4b6', paddingBottom: '20px' }}>
                                <H2>
                                    {opportunity.type === "Service Project" ? (
                                        <Tag style={{ backgroundColor: '#1d70b8' }}>Service Project</Tag>
                                    ) : (
                                        <Tag>{opportunity.type}</Tag>
                                    )} {opportunity.title}
                                </H2>
                                
                                <GridRow>
                                    <GridCol setWidth="two-thirds">
                                        <div style={{ fontSize: '0.875rem', color: '#505a5f', marginBottom: '10px' }}>
                                            Created by {opportunity.creatorName} ({opportunity.creatorEmail})
                                        </div>
                                        
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
                                            <Button 
                                                as={Link} 
                                                href={`/opportunities/${opportunity.id}/edit`}
                                                buttonColour="#f3f2f1" 
                                                buttonTextColour="#0b0c0c"
                                            >
                                                Edit
                                            </Button>
                                            <Button 
                                                onClick={() => handleDeleteOpportunity(opportunity.id)}
                                                buttonColour="#f3f2f1" 
                                                buttonTextColour="#0b0c0c"
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    </GridCol>
                                </GridRow>
                            </div>
                        ))
                    )}
                </Tabs.Panel>

                <Tabs.Panel selected={activeTab === 'applications'}>
                    {applications.length === 0 ? (
                        <div>
                            <Heading size="MEDIUM">No Applications</Heading>
                            <Paragraph>No applications received yet.</Paragraph>
                        </div>
                    ) : (
                        applications.map((application) => (
                            <div key={application.id} style={{ marginBottom: '30px', borderBottom: '1px solid #b1b4b6', paddingBottom: '20px' }}>
                                <H2>Application for: {application.opportunity.title}</H2>
                                
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
                                                    onClick={() => handleUpdateApplicationStatus(application.id, 'accepted')}
                                                    buttonColour="#00703c"
                                                >
                                                    Accept
                                                </Button>
                                                <Button 
                                                    onClick={() => handleUpdateApplicationStatus(application.id, 'rejected')}
                                                    buttonColour="#d4351c"
                                                >
                                                    Reject
                                                </Button>
                                            </div>
                                        ) : (
                                            <div style={{ 
                                                display: 'inline-block', 
                                                backgroundColor: application.status === 'accepted' ? '#00703c' : '#d4351c',
                                                color: 'white',
                                                padding: '5px 10px',
                                                borderRadius: '4px',
                                                fontWeight: 'bold'
                                            }}>
                                                {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                                            </div>
                                        )}
                                    </GridCol>
                                </GridRow>
                            </div>
                        ))
                    )}
                </Tabs.Panel>
            </Tabs>
        </>
    );
} 