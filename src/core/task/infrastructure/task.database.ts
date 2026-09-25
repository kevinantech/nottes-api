import { ITask } from '../domain/task.entity';
import { ITaskRepository, UpdateTaskPayload } from '../domain/task.repository';
import { TaskModel } from './task.model';

export class TaskDatabaseRepository implements ITaskRepository {
  async findByProjectId(projectId: string): Promise<ITask[]> {
    const tasks = await TaskModel.find(
      { projectId },
      { _id: 0 /* created: 0, authorId: 0 */ },
    );
    return tasks;
  }

  async findById(id: string): Promise<ITask | null> {
    const taskFound = TaskModel.findOne({ id });
    return taskFound;
  }

  async save(task: ITask): Promise<ITask> {
    try {
      const taskModel = new TaskModel(task);
      const savedTask = await taskModel.save();
      return savedTask;
    } catch (e) {
      console.error({ at: `${__dirname} => registerTask`, error: e });
    }
  }

  async updateById(
    id: string,
    { title, status, projectId }: UpdateTaskPayload,
  ): Promise<ITask | null> {
    const updatedTask = TaskModel.findOneAndUpdate(
      { id },
      {
        title,
        status,
        projectId,
      },
      { new: true },
    );
    return updatedTask;
  }

  async deleteById(id: string): Promise<ITask | null> {
    const deletedTask = await TaskModel.findOneAndDelete({ id });
    return deletedTask;
  }

  async deleteByProjectId(projectId: string): Promise<void> {
    await TaskModel.deleteMany({ projectId });
  }
}

