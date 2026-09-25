import { AppException, ValidationException } from '../../../config/exception';
import { IProjectRepository } from '../../project/domain/project.repository';
import { ITask, ITaskResponse } from '../domain/task.entity';
import { ITaskRepository } from '../domain/task.repository';
import { Task } from '../domain/task.value';
import {
  CreateTaskInput,
  CreateTaskInputSchema,
  UpdateTaskInput,
  UpdateTaskInputSchema,
} from '../domain/task.schema';
import { z } from 'zod';

export class TaskService {
  constructor(
    private readonly taskRepository: ITaskRepository,
    private readonly projectRepository: IProjectRepository,
  ) {}

  // TODO: Add pagination.
  public async findByProject(
    projectId: string,
    authorId: string,
  ): Promise<ITaskResponse[]> {
    const project = await this.projectRepository.findById(projectId);
    if (!project || authorId !== project.authorId) {
      throw new AppException('Tareas no encontradas', 404 /* Not Found */);
    }

    const tasks = await this.taskRepository.findByProjectId(projectId);
    return tasks.map((t) => this.toResponse(t));
  }

  public async create(
    raw: CreateTaskInput,
    authorId: string,
  ): Promise<ITaskResponse> {
    const { data: input, error } = z.safeParse(CreateTaskInputSchema, raw);
    if (error) throw ValidationException.fromZod(error);

    const project = await this.projectRepository.findById(input.projectId);
    if (!project || authorId !== project.authorId) {
      throw new AppException('Proyecto no encontrado', 404 /* Not Found */);
    }

    const task = await this.taskRepository.save(
      new Task(input.title, input.projectId, authorId),
    );

    return this.toResponse(task);
  }

  public async update(
    raw: UpdateTaskInput,
    taskId: string,
    editorId: string,
  ): Promise<ITaskResponse> {
    const { data: payload, error } = z.safeParse(UpdateTaskInputSchema, raw);
    if (error) throw ValidationException.fromZod(error);

    const task = await this.taskRepository.findById(taskId);
    if (!task || editorId != task.authorId) {
      throw new AppException('Tarea no encontrada', 404 /* Not Found */);
    }

    const updatedTask = await this.taskRepository.updateById(taskId, payload);
    // Intentional Error over AppException, is an unexpected error.
    if (!updatedTask) throw new Error('No se pudo actualizar la tarea');

    return this.toResponse(updatedTask);
  }

  public async delete(id: string, editorId: string): Promise<ITaskResponse> {
    const task = await this.taskRepository.findById(id);
    if (!task || editorId != task.authorId) {
      throw new AppException('Tarea no encontrada', 404 /* Not Found */);
    }

    const deletedTask = await this.taskRepository.deleteById(id);
    // Intentional Error over AppException, is an unexpected error.
    if (!deletedTask) throw new Error('No se pudo eliminar la tarea');

    return this.toResponse(deletedTask);
  }

  private toResponse(entity: ITask): ITaskResponse {
    return {
      id: entity.id,
      title: entity.title,
      status: entity.status,
      created: entity.created,
      projectId: entity.projectId,
    };
  }
}

