import { auth, signOut, signIn } from "@/auth"
import { isAdmin, isStudent, isTeacher } from "@/lib/acl"
import { unauthorized } from "next/navigation"

export default async function MainPage() {
    const session = await auth()
    if(!session) {
        unauthorized()
    }
    return (
        <>
            <p>
                {session?.user?.email}  
                {session?.user?.name}
            </p>
            <p>
                isAdmin: {isAdmin(session?.user) ? "true" : "false"}
            </p>
            <p>
                isTeacher: {isTeacher(session?.user) ? "true" : "false"}
            </p>
            <p>
                isStudent: {isStudent(session?.user) ? "true" : "false"}
            </p>
            <form action={async () => {
                'use server'
                await signOut()
            }}>
                <button type="submit">Sign Out</button>
            </form>
            <form action={async () => {
                'use server'
                await signIn()
            }}>
                <button type="submit">Sign In</button>
            </form>
        </>
    )
}