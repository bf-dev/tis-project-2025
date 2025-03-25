import NextAuth from "next-auth";
import { config } from "./authOptions";

// Create the handler
const { handlers } = NextAuth(config);

// Export Next.js App Router route handlers
export const GET = handlers.GET;
export const POST = handlers.POST; 