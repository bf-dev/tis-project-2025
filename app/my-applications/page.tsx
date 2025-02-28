'use client';

import { useState, useEffect } from 'react';

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
        return <div>Loading...</div>;
    }

    if (error) {
        return <div className="text-red-600">{error}</div>;
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

    const statusChipStyle = (status: string) => ({
        fontSize: '0.75rem',
        padding: '2px 8px',
        borderRadius: '4px',
        border: 'none',
        backgroundColor: status.toLowerCase() === 'accepted' ? '#10b981' : 
                       status.toLowerCase() === 'rejected' ? '#f43f5e' : '#fbbf24',
        color: 'white',
        fontWeight: '500'
    });

    return (
        <div>
            <h3>My Applications</h3>
            
            {applications.length === 0 ? (
                <div className="text-center py-8">
                    <p style={{ color: '#666', marginBottom: '1rem' }}>You haven&apos;t submitted any applications yet.</p>
                    <a 
                        href="/opportunities" 
                        style={{ color: '#4f46e5', textDecoration: 'none' }}
                    >
                        Browse Opportunities
                    </a>
                </div>
            ) : (
                <div>
                    {Object.entries(applicationsByType).map(([type, typeApplications]) => (
                        <div key={type} style={{ padding: "10px", margin: "10px 0", border: "1px solid #eee", borderRadius: "4px" }}>
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
                                    {type}
                                </mark>
                            </h5>
                            
                            <div style={{ marginTop: '1rem' }}>
                                {typeApplications.map((application) => (
                                    <div 
                                        key={application.id} 
                                        style={{ padding: "10px", border: "1px solid #eee", borderRadius: "4px", marginBottom: '1rem' }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <div>
                                                <div style={{ fontWeight: '500' }}>{application.opportunity.title}</div>
                                                <div style={{ fontSize: '0.875rem', color: '#666' }}>Posted by {application.opportunity.creatorName}</div>
                                            </div>
                                            <span style={statusChipStyle(application.status)}>
                                                {application.status.charAt(0).toUpperCase() + application.status.slice(1).toLowerCase()}
                                            </span>
                                        </div>
                                        
                                        <div style={{ marginTop: '0.5rem' }}>
                                            <div style={{ fontSize: '0.875rem', color: '#374151', marginBottom: '0.5rem' }}>
                                                {application.opportunity.description}
                                            </div>
                                            <div style={{ fontSize: '0.875rem', color: '#374151' }}>
                                                <strong>Your Cover Letter:</strong>
                                                <p style={{ whiteSpace: 'pre-wrap', marginTop: '0.25rem' }}>{application.coverLetter}</p>
                                            </div>
                                        </div>

                                        <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#666' }}>
                                            Applied on {new Date(application.createdAt).toLocaleDateString()}
                                            {application.opportunity.deadline && (
                                                <span style={{ marginLeft: '1rem' }}>
                                                    Deadline: {new Date(application.opportunity.deadline).toLocaleDateString()}
                                                </span>
                                            )}
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