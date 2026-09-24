import { ITask } from './task.entity';

export interface TaskRepository {
  findTaskById(id: string): Promise<ITask | null>;
  findTasksByProjectId(projectId: string): Promise<ITask[]>;
  registerTask(task: ITask): Promise<ITask | void>;
  updateTask(
    id: string,
    name?: string,
    status?: boolean,
  ): Promise<ITask | null>;
  deleteTask(id: string): Promise<ITask | null>;
  deleteTasksByProjectId(projectId: string): Promise<any>;
}
