'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateOpportunity() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        deadline: '',
        type: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
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
                alert(data.error || 'Failed to create opportunity');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error creating opportunity');
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
            <h1>Create New Opportunity</h1>
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
                <button type="submit">Create Opportunity</button>
            </form>
        </div>
    );
}
