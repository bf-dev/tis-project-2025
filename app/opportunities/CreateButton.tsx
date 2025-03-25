"use client";
import Link from "next/link";
import { Button } from "govuk-react";

export default function CreateButton() {
  return (
    <Button as={Link} href="/opportunities/create">
      Create new opportunity
    </Button>
  );
}
