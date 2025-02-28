'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

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
                alert(data.error || 'Failed to submit application');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error submitting application');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    if (!opportunityId) {
        return <div className="max-w-2xl mx-auto p-4">Error: No opportunity specified</div>;
    }

    if (loading) {
        return <div className="max-w-2xl mx-auto p-4">Loading...</div>;
    }

    if (error) {
        return <div className="max-w-2xl mx-auto p-4 text-red-600">{error}</div>;
    }

    return (
        <div className="max-w-2xl mx-auto p-4">
            {opportunity && (
                <div style={{ padding: "10px", margin: "10px 0", border: "1px solid #eee", borderRadius: "4px" }}>
                    <h5>
                        <mark
                            style={{ position: "relative", bottom: "2px", marginRight: "2px" }}
                        >
                            {opportunity.type}
                        </mark>{" "}
                        {opportunity.title}
                    </h5>
                    <cite>Created by {opportunity.creatorName}</cite>
                    {opportunity.deadline && (
                        <div style={{ fontSize: "0.9em", color: "#666" }}>
                            Deadline: {opportunity.deadline}
                        </div>
                    )}
                    <p>{opportunity.description}</p>
                </div>
            )}

            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <h2 className="text-xl font-bold mb-6">Submit Your Application</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium">
                            Message:
                            <textarea
                                name="coverLetter"
                                value={formData.coverLetter}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                rows={5}
                                placeholder="Tell us why you're interested in this opportunity..."
                            />
                        </label>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Submit Application
                    </button>
                </form>
            </div>
        </div>
    );
} 