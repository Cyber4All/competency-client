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
