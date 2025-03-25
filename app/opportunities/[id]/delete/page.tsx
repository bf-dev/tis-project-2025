"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import {
    H1,
    Paragraph,
    LoadingBox,
    ErrorSummary,
    Tag,
    Button,
    Heading
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

export default function DeleteOpportunity() {
    const {id} = useParams();
    const router = useRouter();
    const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        const fetchOpportunity = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/opportunity`);
                const data = await response.json();
                const opportunity = data.filter((opportunity: Opportunity) => opportunity.id === id)[0];
                
                if (!opportunity) {
                    setError('Opportunity not found');
                    return;
                }
                
                setOpportunity(opportunity);
            } catch (error) {
                console.error('Error fetching opportunity:', error);
                setError('Failed to load opportunity');
            } finally {
                setLoading(false);
            }
        };

        fetchOpportunity();
    }, [id]);

    const handleDelete = async () => {
        try {
            setDeleting(true);
            const response = await fetch(`/api/opportunity?id=${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                router.push('/opportunities');
            } else {
                const data = await response.json();
                setError(data.error || 'Failed to delete opportunity');
            }
        } catch (error) {
            console.error('Error:', error);
            setError('Error deleting opportunity');
        } finally {
            setDeleting(false);
        }
    };

    if (loading) {
        return <LoadingBox>Loading opportunity details...</LoadingBox>;
    }

    if (error) {
        return <ErrorSummary heading="There is a problem" description={error} />;
    }

    if (!opportunity) {
        return <ErrorSummary heading="Not Found" description="This opportunity could not be found." />;
    }

    return (
        <>
            <H1>Delete Opportunity</H1>
            
            <div style={{ marginBottom: '30px' }}>
                <Heading size="MEDIUM">{opportunity.title}</Heading>
                
                {opportunity.type === "Service Project" ? (
                  <Tag style={{ backgroundColor: '#1d70b8' }}>Service Project</Tag>
                ) : (
                  <Tag>{opportunity.type}</Tag>
                )}
                
                <div style={{ fontSize: '0.875rem', color: '#505a5f', margin: '10px 0' }}>
                    Created by {opportunity.creatorName}
                </div>
                
                {opportunity.deadline && (
                    <div style={{ margin: '15px 0' }}>
                        <strong>Deadline:</strong> {opportunity.deadline}
                    </div>
                )}
                
                <Paragraph>
                    {opportunity.description}
                </Paragraph>
            </div>
            
            <div style={{ borderLeft: '5px solid #d4351c', paddingLeft: '15px', marginTop: '20px', backgroundColor: '#f3f2f1', padding: '15px' }}>
                <Heading size="MEDIUM">Confirm Deletion</Heading>
                <Paragraph>
                    Are you sure you want to delete this opportunity? This action cannot be undone.
                </Paragraph>
                
                <div style={{ display: 'flex', gap: '15px', marginTop: '15px' }}>
                    <Button 
                        onClick={handleDelete}
                        disabled={deleting}
                        buttonColour="#d4351c"
                    >
                        {deleting ? 'Deleting...' : 'Yes, Delete'}
                    </Button>
                    
                    <Button 
                        as={Link} 
                        href="/opportunities" 
                        buttonColour="#f3f2f1"
                        buttonTextColour="#0b0c0c"
                    >
                        Cancel
                    </Button>
                </div>
            </div>
        </>
    );
}
