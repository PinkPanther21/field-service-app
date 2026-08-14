export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'worker';
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'done';
  assignedTo: User;
  createdBy: User;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}