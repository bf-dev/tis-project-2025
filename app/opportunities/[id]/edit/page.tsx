'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    H1,
    InputField,
    Select,
    Button,
    ErrorSummary,
    LoadingBox,
    FormGroup
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

export default function EditOpportunity() {
    const router = useRouter();
    const { id } = useParams();
    const [formData, setFormData] = useState({
        id: id as string,
        title: '',
        description: '',
        deadline: '',
        type: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchOpportunity = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/opportunity`);
                //filter out the opportunity with the id
                const data = await response.json();
                const opportunity = data.filter((opportunity: Opportunity) => opportunity.id === id)[0];
                
                if (!opportunity) {
                    setError('Opportunity not found');
                    return;
                }
                
                setFormData({
                    id: id as string,
                    title: opportunity.title || '',
                    description: opportunity.description || '',
                    deadline: opportunity.deadline || '',
                    type: opportunity.type || ''
                });
            } catch (error) {
                console.error('Error fetching opportunity:', error);
                setError('Failed to load opportunity');
            } finally {
                setLoading(false);
            }
        };

        fetchOpportunity();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        
        try {
            const response = await fetch(`/api/opportunity`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                router.push('/opportunities');
            } else {
                const data = await response.json();
                setError(data.error || 'Failed to update opportunity');
            }
        } catch (error) {
            console.error('Error:', error);
            setError('Error updating opportunity');
        } finally {
            setSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    if (loading) {
        return <LoadingBox>Loading opportunity details...</LoadingBox>;
    }

    if (error && !formData.title) {
        return <ErrorSummary heading="There is a problem" description={error} />;
    }

    return (
        <>
            <H1>Edit Opportunity</H1>
            
            {error && (
                <ErrorSummary 
                    heading="There is a problem" 
                    description={error}
                />
            )}
            
            <form onSubmit={handleSubmit}>
                <FormGroup>
                    <InputField
                        input={{
                            name: "title",
                            value: formData.title,
                            onChange: handleChange,
                            required: true
                        }}
                    >
                        Title
                    </InputField>
                </FormGroup>
                
                <FormGroup>
                    <div>
                        <label htmlFor="description" style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            rows={5}
                            style={{ width: '100%', padding: '10px', border: '2px solid #0b0c0c', borderRadius: '0' }}
                        />
                    </div>
                </FormGroup>
                
                <FormGroup>
                    <InputField
                        input={{
                            name: "deadline",
                            type: "date",
                            value: formData.deadline,
                            onChange: handleChange
                        }}
                    >
                        Deadline
                    </InputField>
                </FormGroup>
                
                <FormGroup>
                    <Select
                        input={{
                            name: "type",
                            value: formData.type,
                            onChange: handleChange,
                            required: true
                        }}
                        label="Type"
                    >
                        <option value="">Select a type</option>
                        <option value="Service Project">Service Project</option>
                        <option value="Internship">Internship</option>
                    </Select>
                </FormGroup>
                
                <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
                    <Button 
                        type="submit" 
                        disabled={submitting}
                    >
                        {submitting ? 'Updating...' : 'Update Opportunity'}
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
    );
}
