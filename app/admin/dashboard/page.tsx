'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './dashboard.module.css';

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
            // Fetch opportunities
            const opportunitiesResponse = await fetch('/api/opportunity');
            if (!opportunitiesResponse.ok) {
                throw new Error('Failed to fetch opportunities');
            }
            const opportunitiesData = await opportunitiesResponse.json();
            setOpportunities(opportunitiesData);

            // Fetch all applications
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

            fetchData(); // Refresh data
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

            fetchData(); // Refresh data
        } catch (error) {
            console.error('Error:', error);
            alert('Error deleting opportunity');
        }
    };

    if (loading) {
        return <div className="p-4">Loading...</div>;
    }

    if (error) {
        return <div className="p-4 text-red-600">{error}</div>;
    }

    return (
        <div style={{ padding: '1rem' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Admin Dashboard</h1>
            
            <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <nav style={{ display: 'flex', gap: '2rem', marginBottom: '-1px' }}>
                        <button
                            onClick={() => setActiveTab('opportunities')}
                            className={styles.tab}
                            style={{
                                whiteSpace: 'nowrap',
                                padding: '1rem 0.25rem',
                                borderBottom: `2px solid ${activeTab === 'opportunities' ? '#6366f1' : 'transparent'}`,
                                color: activeTab === 'opportunities' ? '#4f46e5' : '#6b7280',
                                fontWeight: '500',
                                fontSize: '0.875rem',
                                transition: 'all 0.2s'
                            }}
                        >
                            Opportunities ({opportunities.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('applications')}
                            className={styles.tab}
                            style={{
                                whiteSpace: 'nowrap',
                                padding: '1rem 0.25rem',
                                borderBottom: `2px solid ${activeTab === 'applications' ? '#6366f1' : 'transparent'}`,
                                color: activeTab === 'applications' ? '#4f46e5' : '#6b7280',
                                fontWeight: '500',
                                fontSize: '0.875rem',
                                transition: 'all 0.2s'
                            }}
                        >
                            Applications ({applications.length})
                        </button>
                    </nav>
                </div>
            </div>

            {activeTab === 'opportunities' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>All Opportunities</h2>
                        <a
                            href="/opportunities/create"
                            className={styles.createButton}
                            style={{
                                backgroundColor: '#4f46e5',
                                color: 'white',
                                padding: '0.5rem 1rem',
                                borderRadius: '0.375rem',
                                textDecoration: 'none',
                                transition: 'background-color 0.2s'
                            }}
                        >
                            Create New
                        </a>
                    </div>
                    <div style={{ backgroundColor: 'white', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', borderRadius: '0.5rem', overflow: 'hidden' }}>
                        <ul style={{ borderTop: '1px solid #e5e7eb' }}>
                            {opportunities.map((opportunity) => (
                                <li key={opportunity.id} style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <div style={{ flexGrow: 1, marginRight: '1rem' }}>
                                            <h3 style={{ fontSize: '1.125rem', fontWeight: '500', display: 'flex', alignItems: 'center' }}>
                                                <mark style={{ 
                                                    padding: '0.25rem 0.5rem', 
                                                    borderRadius: '0.25rem', 
                                                    backgroundColor: '#f3f4f6', 
                                                    color: '#1f2937',
                                                    marginRight: '0.75rem',
                                                    fontWeight: 'normal'
                                                }}>
                                                    {opportunity.type}
                                                </mark>
                                                {opportunity.title}
                                            </h3>
                                            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>
                                                Created by {opportunity.creatorName} ({opportunity.creatorEmail})
                                            </p>
                                            {opportunity.deadline && (
                                                <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                                                    Deadline: {opportunity.deadline}
                                                </p>
                                            )}
                                            <p style={{ marginTop: '0.5rem', color: '#374151' }}>{opportunity.description}</p>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <a
                                                href={`/opportunities/${opportunity.id}/edit`}
                                                className={styles.editLink}
                                                style={{ color: '#4f46e5', textDecoration: 'none', transition: 'color 0.2s' }}
                                            >
                                                Edit
                                            </a>
                                            <a
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleDeleteOpportunity(opportunity.id);
                                                }}
                                                className={styles.deleteLink}
                                                style={{ color: '#dc2626', textDecoration: 'none', transition: 'color 0.2s' }}
                                            >
                                                Delete
                                            </a>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            {activeTab === 'applications' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>All Applications</h2>
                    <div style={{ backgroundColor: 'white', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', borderRadius: '0.5rem', overflow: 'hidden' }}>
                        <ul style={{ borderTop: '1px solid #e5e7eb' }}>
                            {applications.map((application) => (
                                <li key={application.id} style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb' }}>
                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <div style={{ flexGrow: 1, marginRight: '1rem' }}>
                                                <h3 style={{ fontSize: '1.125rem', fontWeight: '500' }}>
                                                    Application for: {application.opportunity.title}
                                                </h3>
                                                <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>
                                                    From: {application.applicantName} ({application.applicantEmail})
                                                </p>
                                                <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                                                    Submitted: {new Date(application.createdAt).toLocaleDateString()}
                                                </p>
                                                <div style={{ marginTop: '0.5rem' }}>
                                                    <p style={{ fontSize: '0.875rem', color: '#374151' }}>{application.coverLetter}</p>
                                                </div>
                                            </div>
                                            <div>
                                                <select
                                                    value={application.status}
                                                    onChange={(e) => handleUpdateApplicationStatus(application.id, e.target.value)}
                                                    className={styles.select}
                                                    style={{
                                                        borderRadius: '0.375rem',
                                                        border: '1px solid #d1d5db',
                                                        padding: '0.375rem 0.75rem',
                                                        fontSize: '0.875rem',
                                                        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
                                                    }}
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="accepted">Accepted</option>
                                                    <option value="rejected">Rejected</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
} 