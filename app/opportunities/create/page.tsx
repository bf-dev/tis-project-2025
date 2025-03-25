'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    H1,
    InputField,
    Select,
    Button,
    ErrorSummary,
    FormGroup
} from 'govuk-react';

export default function CreateOpportunity() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        deadline: '',
        type: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        
        try {
            const response = await fetch('/api/opportunity', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                router.push('/opportunities');
            } else {
                const data = await response.json();
                setError(data.error || 'Failed to create opportunity');
            }
        } catch (error) {
            console.error('Error:', error);
            setError('Error creating opportunity');
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

    return (
        <>
            <H1>Create New Opportunity</H1>
            
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
                        {submitting ? 'Creating...' : 'Create Opportunity'}
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
