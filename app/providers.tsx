"use client";

import { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import AppLayout from "./AppLayout";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <AppLayout>
        {children}
      </AppLayout>
    </SessionProvider>
  );
} 