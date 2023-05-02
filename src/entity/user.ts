export interface User {
    _id: string;
    name: string;
    email: string;
    password: string;
    competencies: string[];
    emailVerified?: boolean;
}

export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  username: string;
  emailVerified: boolean;
}

export function getUserGraphQuery(id: string): string {
  return `
    {
      user(userId: "${id}") {
          _id
          name
          email
          username
          emailVerified
      }
    }
  `;
}
