export interface IProject {
  id: string;
  name: string;
  description: string;
  creator?: string;
  createdAt?: Date;
  url?: string;
}
