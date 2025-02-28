"use client";

import { isTeacher } from "@/lib/acl";
import { ClerkProvider, useUser } from "@clerk/nextjs";

export default function CreateButton() {
  return <a href="/opportunities/create">Create New</a>;
}
