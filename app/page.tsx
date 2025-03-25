"use client";
import { SignedIn, SignedOut, SignInButton, useUser } from "./components/AuthComponents";
import { H1, H3, Paragraph, Button } from "govuk-react";
import Link from "next/link";

export default function Home() {
  const { user } = useUser();
  return (
    <>
      <H1>Welcome to TIS Opportunities</H1>
      <SignedOut>
        <Paragraph>Please sign in to view and apply for opportunities at TIS.</Paragraph>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <H3>Welcome back, {user?.name}</H3>
        <Paragraph>
          Find and apply for internships and service projects at TIS.
        </Paragraph>
        <Button as={Link} href="/opportunities">
          View opportunities
        </Button>
      </SignedIn>
    </>
  );
}
