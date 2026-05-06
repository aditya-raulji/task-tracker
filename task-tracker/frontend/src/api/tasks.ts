import { client } from './client';
import { Task } from '../types';

export const tasksApi = {
  getAll: () => client.get<Task[]>('/tasks'),
  create: (data: { title: string; description?: string }) => 
    client.post<Task>('/tasks', data),
  update: (id: string, data: Partial<Pick<Task, 'title' | 'description' | 'completed'>>) => 
    client.patch<Task>(`/tasks/${id}`, data),
  delete: (id: string) => 
    client.delete(`/tasks/${id}`),
};
