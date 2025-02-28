'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function EditOpportunity( ) {
    const router = useRouter();
    const id = useParams().id;
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        deadline: '',
        type: '',
        creatorEmail: '',
        creatorName: ''
    });

    useEffect(() => {
        const fetchOpportunity = async () => {
            try {
                const response = await fetch(`/api/opportunity`);
                //filter out the opportunity with the id
                const data = await response.json();
                const opportunity = data.filter((opportunity: any) => opportunity.id === id)[0]
                console.log(opportunity);
                if (response.ok) {
                    setFormData({
                        title: opportunity.title || '',
                        description: opportunity.description || '',
                        deadline: opportunity.deadline || '',
                        type: opportunity.type || '',
                        creatorEmail: opportunity.creatorEmail || '',
                        creatorName: opportunity.creatorName || ''
                    });
                }
            } catch (error) {
                console.error('Error fetching opportunity:', error);
            }
        };

        fetchOpportunity();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch(`/api/opportunity?id=${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                router.push('/opportunities');
            } else {
                const data = await response.json();
                alert(data.error || 'Failed to update opportunity');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error updating opportunity');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div>
            <h1>Edit Opportunity</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Title:</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Description:</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Deadline:</label>
                    <input
                        type="date"
                        name="deadline"
                        value={formData.deadline}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Type:</label>
                    <select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select a type</option>
                        <option value="Service Project">Service Project</option>
                        <option value="Internship">Internship</option>
                    </select>
                </div>
                <div>
                    <input
                        type="hidden"
                        name="creatorEmail"
                        value={formData.creatorEmail}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <input
                        type="hidden"
                        name="creatorName"
                        value={formData.creatorName}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit">Update Opportunity</button>
            </form>
        </div>
    );
}
