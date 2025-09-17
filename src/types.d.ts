export interface Task {
  id: string;
  user_id?: string;
  title: string;
  deadline: string; 
  completed: boolean;
}
