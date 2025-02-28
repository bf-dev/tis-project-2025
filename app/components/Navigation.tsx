'use client';

import { useState, useEffect } from "react";
import { SignedIn } from "@clerk/nextjs";

export default function Navigation() {
  const [isTeacher, setIsTeacher] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        // Check teacher status
        const teacherResponse = await fetch('/api/auth/is-teacher');
        const teacherData = await teacherResponse.json();
        setIsTeacher(teacherData.isTeacher);

        // Check admin status
        const adminResponse = await fetch('/api/auth/is-admin');
        const adminData = await adminResponse.json();
        setIsAdmin(adminData.isAdmin);
      } catch (error) {
        console.error('Error checking user status:', error);
        setIsTeacher(false);
        setIsAdmin(false);
      }
    };

    checkUserStatus();
  }, []);

  return (
    <nav className="ml-10 space-x-4">
      <SignedIn>
        <a href="/opportunities" className="text-gray-600 hover:text-gray-900">Opportunities</a>
        <a href="/my-applications" className="text-gray-600 hover:text-gray-900">My Applications</a>
        {isTeacher && (
          <a href="/manage-applications" className="text-gray-600 hover:text-gray-900">Manage Applications</a>
        )}
        {isAdmin && (
          <a href="/admin/dashboard" className="text-gray-600 hover:text-gray-900">Dashboard</a>
        )}
      </SignedIn>
    </nav>
  );
}