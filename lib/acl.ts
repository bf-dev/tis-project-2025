import type { Session } from "next-auth";

type User = Session["user"];

const adminEmails = process.env.ADMIN_EMAILS ? process.env.ADMIN_EMAILS.split(",").map(email => email.trim()) : [];

export const isAdmin = (user: User): boolean => {
  return Boolean(user?.email && adminEmails.includes(user.email));
};

export const isTeacher = (user: User): boolean => {
  return Boolean(user?.email && 
    (user.email.endsWith("@tiseagles.com") || isAdmin(user)));
};

export const isStudent = (user: User): boolean => {
  return Boolean(user?.email && 
    user.email.endsWith("@students.tiseagles.com"));
};
