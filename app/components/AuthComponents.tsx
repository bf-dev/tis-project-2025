"use client";

import { ReactNode, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "govuk-react";

interface SignedInProps {
  children: ReactNode;
}

/**
 * SignedIn component that conditionally renders its children only if the user is authenticated
 */
export function SignedIn({ children }: SignedInProps) {
  const { status } = useSession();
  
  if (status === "authenticated") {
    return <>{children}</>;
  }
  
  return null;
}

/**
 * SignedOut component that conditionally renders its children only if the user is not authenticated
 */
export function SignedOut({ children }: SignedInProps) {
  const { status } = useSession();
  
  if (status === "unauthenticated") {
    return <>{children}</>;
  }
  
  return null;
}

/**
 * AuthLoading component that renders during authentication loading state
 */
export function AuthLoading({ children }: SignedInProps) {
  const { status } = useSession();
  
  if (status === "loading") {
    return <>{children}</>;
  }
  
  return null;
}

// SignInButton - Button to trigger sign in
export function SignInButton({ children }: { children?: ReactNode }) {
  return (
    <Button 
      as={Link} 
      href="/auth/signin"
      buttonColour="#193182"
      buttonTextColour="#ffffff"
    >
      {children || "Sign In"}
    </Button>
  );
}

// SignOutButton - Button to trigger sign out
export function SignOutButton({ children }: { children?: ReactNode }) {
  return (
    <Button 
      onClick={() => signOut({ callbackUrl: '/' })}
      buttonColour="#d4351c"
    >
      {children || "Sign Out"}
    </Button>
  );
}

// UserButton - Shows user profile image/button
export function UserButton() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  
  if (!session?.user) {
    return null;
  }
  
  return (
    <div className="govuk-header__navigation">
      <Button 
        onClick={() => setIsOpen(!isOpen)}
        buttonColour="#f3f2f1"
        buttonTextColour="#0b0c0c"
      >
        {session.user.image ? (
          <Image 
            src={session.user.image} 
            alt="User avatar" 
            className="govuk-header__logotype-crown"
            width={32}
            height={32}
          />
        ) : (
          <div className="govuk-header__logotype-crown">
            {(session.user.name?.[0] || session.user.email?.[0] || '?').toUpperCase()}
          </div>
        )}
        <span>{session.user.name || session.user.email || 'User'}</span>
      </Button>
      
      {isOpen && (
        <div className="govuk-header__navigation">
          <ul className="govuk-list">
            <li>
              <Link href="/profile" className="govuk-link">
                Profile
              </Link>
            </li>
            <li>
              <Button
                onClick={() => signOut({ callbackUrl: '/' })}
                buttonColour="#f3f2f1"
                buttonTextColour="#0b0c0c"
              >
                Sign out
              </Button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

// Hook to get current user (mimics Clerk's useUser)
export function useUser() {
  const { data: session, status } = useSession();
  
  return {
    user: session?.user || null,
    isSignedIn: status === "authenticated",
    isLoaded: status !== "loading",
  };
} 