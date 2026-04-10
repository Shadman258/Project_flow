export type ProjectStatus = 'active' | 'completed';
export type TaskStatus = 'todo' | 'in-progress' | 'done';

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  message: string;
}

export interface Project {
  _id: string;
  title: string;
  description: string;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  _id: string;
  project: string;
  title: string;
  description: string;
  status: TaskStatus;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}
