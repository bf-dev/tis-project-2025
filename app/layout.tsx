import "@/app/globals.css"

import AuthProvider from "@/components/Provider"
import TopNavbar from "@/components/TopNavbar"

export const metadata = {
  title: 'TIS Opportunities',
  description: 'Apply for service projects and internships in TIS',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-background text-foreground">
        <AuthProvider>
          <TopNavbar />
          <div className="container mx-auto px-4 py-8 flex-grow">
            {children}
          </div>
          <footer className="py-6 border-t border-border">
            <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
              Created with ❤️ by Insung Cho and Mr. Bassett
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  )
}
