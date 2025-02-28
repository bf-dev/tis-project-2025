"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

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

    useEffect(() => {
        const fetchOpportunity = async () => {
            try {
                const response = await fetch(`/api/opportunity`);
                //filter out the opportunity with the id
                const data = await response.json();
                const opportunity = data.filter((opportunity: Opportunity) => opportunity.id === id)[0]
                console.log(opportunity);
                if (response.ok) {
                    setOpportunity(opportunity);
                }
            } catch (error) {
                console.error('Error fetching opportunity:', error);
            }
        };

        fetchOpportunity();
    }, [id]);

    const handleDelete = async () => {
        try {
            const response = await fetch(`/api/opportunity?id=${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                router.push('/opportunities');
            } else {
                alert('Failed to delete opportunity');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error deleting opportunity');
        }
    };

    if (!opportunity) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Delete Opportunity</h1>
            <div>
                <h2>{opportunity.title}</h2>
                <p>{opportunity.description}</p>
                <p>Type: {opportunity.type}</p>
                <p>Creator: {opportunity.creatorName}</p>
                {opportunity.deadline && <p>Deadline: {opportunity.deadline}</p>}
            </div>
            <div>
                <p>Are you sure you want to delete this opportunity?</p>
                <button onClick={handleDelete}>Yes, Delete</button>
                <button onClick={() => router.push('/opportunities')}>Cancel</button>
            </div>
        </div>
    );
}
