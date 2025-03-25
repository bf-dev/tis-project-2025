import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "./providers";
import StyledComponentsRegistry from "@/lib/registry";

export const metadata: Metadata = {
  title: "TIS Opportunities",
  description: "Apply for internships and service projects at TIS",
  icons: {
    icon: '/favicon.png',
  }
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <StyledComponentsRegistry>
          <Providers>{children}</Providers>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
