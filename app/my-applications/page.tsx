'use client';

import { useState, useEffect } from 'react';
import { 
  H1, 
  H2, 
  Paragraph, 
  Tag, 
  LoadingBox,
  ErrorSummary,
  Button,
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
    opportunity: {
        id: string;
        title: string;
        type: string;
        deadline: string | null;
        description: string;
        creatorName: string;
    };
}

export default function MyApplications() {
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const response = await fetch('/api/application/my-applications');
                if (!response.ok) {
                    throw new Error('Failed to fetch applications');
                }
                const data = await response.json();
                setApplications(data);
            } catch (error) {
                console.error('Error:', error);
                setError('Error fetching your applications');
            } finally {
                setLoading(false);
            }
        };

        fetchApplications();
    }, []);

    if (loading) {
        return <LoadingBox>Loading your applications...</LoadingBox>;
    }

    if (error) {
        return <ErrorSummary heading="There is a problem" description={error} />;
    }

    // Group applications by opportunity type
    const applicationsByType = applications.reduce((acc, application) => {
        const type = application.opportunity.type;
        if (!acc[type]) {
            acc[type] = [];
        }
        acc[type].push(application);
        return acc;
    }, {} as Record<string, Application[]>);

    const getStatusColor = (status: string) => {
        switch(status.toLowerCase()) {
            case 'accepted':
                return '#00703c'; // Green
            case 'rejected':
                return '#d4351c'; // Red
            default:
                return '#f47738'; // Amber for pending/other
        }
    };

    return (
        <>
            <H1>My Applications</H1>
            
            {applications.length === 0 ? (
                <div>
                    <Heading size="MEDIUM">No Applications</Heading>
                    <Paragraph>You haven&apos;t submitted any applications yet.</Paragraph>
                    <Button as={Link} href="/opportunities">Browse Opportunities</Button>
                </div>
            ) : (
                <>
                    {Object.entries(applicationsByType).map(([type, typeApplications]) => (
                        <div key={type} style={{ marginBottom: '30px' }}>
                            <H2>
                                {type === "Service Project" ? (
                                    <Tag style={{ backgroundColor: '#1d70b8' }}>Service Project</Tag>
                                ) : (
                                    <Tag>{type}</Tag>
                                )} Applications
                            </H2>
                            
                            {typeApplications.map((application) => (
                                <div key={application.id} style={{ marginBottom: '20px', borderBottom: '1px solid #b1b4b6', paddingBottom: '20px' }}>
                                    <Heading size="MEDIUM">{application.opportunity.title}</Heading>
                                    <div style={{ fontSize: '0.875rem', color: '#505a5f', marginBottom: '10px' }}>
                                        Posted by {application.opportunity.creatorName}
                                    </div>
                                    
                                    <GridRow>
                                        <GridCol setWidth="two-thirds">
                                            <div style={{ 
                                                display: 'inline-block', 
                                                backgroundColor: getStatusColor(application.status),
                                                color: 'white',
                                                padding: '2px 8px',
                                                borderRadius: '4px',
                                                fontSize: '14px',
                                                fontWeight: 'bold',
                                                marginBottom: '15px'
                                            }}>
                                                {application.status.charAt(0).toUpperCase() + application.status.slice(1).toLowerCase()}
                                            </div>
                                            
                                            <Paragraph>
                                                {application.opportunity.description}
                                            </Paragraph>
                                            
                                            <div style={{ marginTop: '15px', borderLeft: '4px solid #b1b4b6', paddingLeft: '15px' }}>
                                                <strong>Your Cover Letter:</strong><br />
                                                {application.coverLetter}
                                            </div>
                                        </GridCol>
                                        
                                        <GridCol setWidth="one-third">
                                            <div style={{ fontSize: '0.875rem', marginBottom: '10px' }}>
                                                <strong>Applied on:</strong> {new Date(application.createdAt).toLocaleDateString()}
                                            </div>
                                            
                                            {application.opportunity.deadline && (
                                                <div style={{ fontSize: '0.875rem' }}>
                                                    <strong>Deadline:</strong> {new Date(application.opportunity.deadline).toLocaleDateString()}
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