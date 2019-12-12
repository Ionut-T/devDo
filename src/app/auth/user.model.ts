export interface IUser {
  id: string;
  firstName: string;
  email: string;
  password: string;
  confirmPassword?: string;
  isVerified: boolean;
}
