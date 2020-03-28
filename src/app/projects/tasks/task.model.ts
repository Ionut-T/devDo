/**
 * Task model.
 */
export interface ITask {
  id: string;
  title: string;
  description: string;
  status?: 'todo' | 'doing' | 'done';
  creator?: string;
}
