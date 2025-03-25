export interface UserEmail {
  emailAddress: string;
  verified: boolean;
}

export interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  emailAddresses: UserEmail[];
  image?: string | null;
} 