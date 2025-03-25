'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { isAdmin, isTeacher, isStudent } from '@/lib/acl';

export default function DebugPage() {
  const { data: session, status } = useSession();
  const [roles, setRoles] = useState({
    isAdmin: false,
    isTeacher: false,
    isStudent: false
  });

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      setRoles({
        isAdmin: Boolean(isAdmin(session.user)),
        isTeacher: Boolean(isTeacher(session.user)),
        isStudent: Boolean(isStudent(session.user))
      });
    }
  }, [session, status]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Authentication Debug Page</h1>
      
      <div className="bg-gray-100 p-4 rounded-md mb-4">
        <h2 className="text-lg font-semibold mb-2">Authentication Status</h2>
        <p className="mb-2">
          Current status: <span className="font-medium">{status}</span>
        </p>
      </div>

      {status === "authenticated" && session?.user && (
        <div className="bg-gray-100 p-4 rounded-md mb-4">
          <h2 className="text-lg font-semibold mb-2">User Information</h2>
          <p className="mb-1">
            <span className="font-medium">ID:</span> {session.user.id}
          </p>
          <p className="mb-1">
            <span className="font-medium">Name:</span> {session.user.name || 'Not provided'}
          </p>
          <p className="mb-1">
            <span className="font-medium">Email:</span> {session.user.email || 'Not provided'}
          </p>
          <p className="mb-1">
            <span className="font-medium">Email Addresses:</span>{' '}
            {session.user.emailAddresses?.length
              ? session.user.emailAddresses.map(email => email.emailAddress).join(', ')
              : 'None available'}
          </p>
          <p className="mb-1">
            <span className="font-medium">Image:</span>{' '}
            {session.user.image ? (
              <Image 
                src={session.user.image} 
                alt="User profile" 
                className="inline-block h-8 w-8 rounded-full ml-2"
                width={32}
                height={32}
              />
            ) : (
              'No image'
            )}
          </p>
          
          <h3 className="text-md font-semibold mt-4 mb-2">User Roles</h3>
          <ul className="list-disc pl-5">
            <li className={roles.isAdmin ? 'text-green-600' : 'text-red-600'}>
              Admin: {roles.isAdmin ? 'Yes' : 'No'}
            </li>
            <li className={roles.isTeacher ? 'text-green-600' : 'text-red-600'}>
              Teacher: {roles.isTeacher ? 'Yes' : 'No'}
            </li>
            <li className={roles.isStudent ? 'text-green-600' : 'text-red-600'}>
              Student: {roles.isStudent ? 'Yes' : 'No'}
            </li>
          </ul>
        </div>
      )}

      <div className="bg-gray-100 p-4 rounded-md">
        <h2 className="text-lg font-semibold mb-2">Session Details</h2>
        <pre className="bg-gray-800 text-white p-4 rounded-md overflow-auto max-h-96">
          {JSON.stringify(session, null, 2)}
        </pre>
      </div>
    </div>
  );
} 