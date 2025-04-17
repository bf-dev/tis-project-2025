import { auth } from "@/auth"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { signIn } from "next-auth/react"

export default async function Home() {
  const session = await auth()
  
  return (
    <div className="max-w-4xl mx-auto py-8 space-y-4">
      {!session && (
        <>
          <h1 className="text-2xl font-bold">Welcome to the TIS Opportunities Portal</h1>
          <p className="text-lg">Log in to apply for service projects and internships in TIS</p>
          <Button onClick={()=>{
            signIn("microsoft-entra-id")
          }}>
            <Link href="/api/auth/signin">Login</Link>
          </Button>
        </>
      )}
      {session && (
        <>
          <h1 className="text-2xl font-bold">Welcome, {session.user?.name}</h1>
          <p className="text-lg">Click button to apply for service projects and internships in TIS</p>
          <Button asChild>
            <Link href="/opportunities">View Opportunities</Link>
          </Button>
        </>
      )}
    </div>
  )
}