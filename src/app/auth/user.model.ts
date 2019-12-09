export interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword?: string;
  isVerified: boolean;
}
