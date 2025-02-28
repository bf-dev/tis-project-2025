'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

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
    const router = useRouter();

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
            alert('Error updating application status');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div className="text-red-600">{error}</div>;
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

    const buttonBaseStyle = {
        fontSize: '0.75rem',
        padding: '2px 8px',
        borderRadius: '4px',
        border: 'none',
        cursor: 'pointer',
        fontWeight: '500',
    };

    const acceptButtonStyle = {
        ...buttonBaseStyle,
        backgroundColor: '#10b981', // emerald-500
        color: 'white',
    };

    const rejectButtonStyle = {
        ...buttonBaseStyle,
        backgroundColor: '#f43f5e', // rose-500
        color: 'white',
    };

    const statusChipStyle = (status: string) => ({
        ...buttonBaseStyle,
        backgroundColor: status === 'ACCEPTED' ? '#10b981' : '#f43f5e',
        color: 'white',
    });

    return (
        <div>
            <h3>Manage Applications</h3>
            
            {Object.keys(applicationsByOpportunity).length === 0 ? (
                <div className="text-center py-8">
                    <p style={{ color: '#666', marginBottom: '1rem' }}>No applications received yet.</p>
                    <a 
                        href="/opportunities" 
                        style={{ color: '#4f46e5', textDecoration: 'none' }}
                    >
                        View Your Opportunities
                    </a>
                </div>
            ) : (
                <div>
                    {Object.entries(applicationsByOpportunity).map(([opportunityId, { opportunity, applications }]) => (
                        <div key={opportunityId} style={{ padding: "10px", margin: "10px 0", border: "1px solid #eee", borderRadius: "4px" }}>
                            <h5>
                                <mark
                                    style={{ 
                                        position: "relative", 
                                        bottom: "2px", 
                                        marginRight: "2px",
                                        backgroundColor: "#e5e7eb",
                                        padding: "2px 8px",
                                        borderRadius: "4px"
                                    }}
                                >
                                    {opportunity.type}
                                </mark>{" "}
                                {opportunity.title}
                            </h5>
                            
                            <div style={{ marginTop: '1rem' }}>
                                {applications.map((application) => (
                                    <div 
                                        key={application.id} 
                                        style={{ padding: "10px", border: "1px solid #eee", borderRadius: "4px", marginBottom: '1rem' }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <div>
                                                <div style={{ fontWeight: '500' }}>{application.applicantName}</div>
                                                <div style={{ fontSize: '0.875rem', color: '#666' }}>{application.applicantEmail}</div>
                                            </div>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                {application.status === 'pending' ? (
                                                    <>
                                                        <button
                                                            onClick={() => handleUpdateStatus(application.id, 'ACCEPTED')}
                                                            style={acceptButtonStyle}
                                                        >
                                                            Accept
                                                        </button>
                                                        <button
                                                            onClick={() => handleUpdateStatus(application.id, 'REJECTED')}
                                                            style={rejectButtonStyle}
                                                        >
                                                            Reject
                                                        </button>
                                                    </>
                                                ) : (
                                                    <span style={statusChipStyle(application.status)}>
                                                        {application.status.charAt(0) + application.status.slice(1).toLowerCase()}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        
                                        <div style={{ marginTop: '0.5rem' }}>
                                            <p style={{ fontSize: '0.875rem', color: '#374151', whiteSpace: 'pre-wrap' }}>{application.coverLetter}</p>
                                        </div>

                                        <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#666' }}>
                                            Applied on {new Date(application.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
} 