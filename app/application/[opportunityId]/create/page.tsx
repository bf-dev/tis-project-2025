'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  H1, 
  H2, 
  Paragraph, 
  ErrorSummary, 
  LoadingBox,
  Tag,
  Button,
  Label,
  HintText,
  InsetText,
  GridRow,
  GridCol
} from "govuk-react";

interface Opportunity {
    id: string;
    title: string;
    description: string;
    type: string;
    creatorName: string;
    creatorEmail: string;
    deadline?: string;
}

export default function CreateApplication() {
    const router = useRouter();
    const {opportunityId} = useParams();

    const [formData, setFormData] = useState({
        coverLetter: ''
    });

    const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchOpportunity = async () => {
            try {
                const response = await fetch(`/api/opportunity`);
                const data = await response.json();
                const opportunity = data.filter((opp: Opportunity) => opp.id === opportunityId)[0];
                
                if (opportunity) {
                    setOpportunity(opportunity);
                } else {
                    setError('Opportunity not found');
                }
            } catch (error) {
                console.error('Error:', error);
                setError('Error fetching opportunity details');
            } finally {
                setLoading(false);
            }
        };

        if (opportunityId) {
            fetchOpportunity();
        }
    }, [opportunityId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        
        try {
            const response = await fetch('/api/application', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    opportunityId,
                }),
            });

            if (response.ok) {
                router.push('/my-applications');
            } else {
                const data = await response.json();
                setError(data.error || 'Failed to submit application');
            }
        } catch (error) {
            console.error('Error:', error);
            setError('Error submitting application');
        } finally {
            setSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    if (!opportunityId) {
        return (
            <InsetText>
                <H2>Error</H2>
                <Paragraph>No opportunity specified</Paragraph>
            </InsetText>
        );
    }

    if (loading) {
        return <LoadingBox>Loading opportunity details...</LoadingBox>;
    }

    if (error) {
        return <ErrorSummary heading="There is a problem" description={error} />;
    }

    return (
        <GridRow>
            <GridCol setWidth="two-thirds">
                {opportunity && (
                    <>
                        <H1>Apply for Opportunity</H1>
                        
                        <div style={{ marginBottom: '30px' }}>
                            <H2>{opportunity.title}</H2>
                            
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

                        <H2>Your Application</H2>
                        <form onSubmit={handleSubmit}>
                            <Label htmlFor="coverLetter">Message</Label>
                            <HintText>
                                Tell us why you&apos;re interested in this opportunity and what you hope to contribute
                            </HintText>
                            <textarea
                                id="coverLetter"
                                name="coverLetter"
                                value={formData.coverLetter}
                                onChange={handleChange}
                                rows={5}
                                required
                                className="govuk-textarea"
                            />

                            <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                                <Button 
                                    type="submit" 
                                    disabled={submitting}
                                >
                                    {submitting ? "Submitting..." : "Submit Application"}
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
                        </form>
                    </>
                )}
            </GridCol>
        </GridRow>
    );
} 