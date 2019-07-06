/**
 * Interface for defining the data-authentication model.
 */
export interface User {
  username?: string;
  email: string;
  password: string;
  confirmPassword?: string;
}
