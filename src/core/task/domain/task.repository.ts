import { ITask } from './task.entity';

export type UpdateTaskPayload = Partial<
  Pick<ITask, 'title' | 'status' | 'projectId'>
>;

export interface ITaskRepository {
  findById(id: string): Promise<ITask | null>;
  findByProjectId(projectId: string): Promise<ITask[]>;
  save(task: ITask): Promise<ITask>;
  updateById(id: string, payload: UpdateTaskPayload): Promise<ITask | null>;
  deleteById(id: string): Promise<ITask | null>;
  deleteByProjectId(projectId: string): Promise<void>;
}

