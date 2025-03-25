import { auth, signIn, signOut } from "@/app/auth";
import { User } from "./types";

/**
 * Gets the current user session
 */
export async function getSession() {
  return await auth();
}

/**
 * Gets the current authenticated user
 */
export async function getCurrentUser(): Promise<User | null> {
  const session = await getSession();
  return session?.user || null;
}

/**
 * Checks if the current user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  return !!session?.user;
}

/**
 * Signs the user out
 */
export async function handleSignOut() {
  await signOut();
}

/**
 * Signs the user in
 */
export async function handleSignIn() {
  await signIn();
} 