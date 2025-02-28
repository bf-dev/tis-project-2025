import { User } from "@clerk/nextjs/server";

const adminEmails = ["bfdev.main@gmail.com"];

export const isAdmin = (user: User) => {
  return adminEmails.includes(user.emailAddresses[0].emailAddress);
};

export const isTeacher = (user: User) => {
  return (user.emailAddresses[0].emailAddress.endsWith("@tiseagles.com")) || isAdmin(user);
};

export const isStudent = (user: User) => {
  return user.emailAddresses[0].emailAddress.endsWith("@students.tiseagles.com");
};
