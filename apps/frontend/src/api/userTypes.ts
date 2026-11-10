export interface User {
  id: string;
  name: string;
  email_verified: boolean;
  image: string | null;
  email: string;
  createdAt: Date;
  username: string;
}
