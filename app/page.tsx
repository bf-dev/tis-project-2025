"use client";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";

export default function Home() {
  const { user } = useUser();
  return (
    <div>
      <h1>Welcome!</h1>
      <SignedOut>
        <h3>Please sign in to continue</h3>

        <SignInButton />
      </SignedOut>
      <SignedIn>
        <h3>Welcome back! {user?.fullName}</h3>
        <a href="/opportunities">Check out the opportunities</a>
      </SignedIn>
    </div>
  );
}
