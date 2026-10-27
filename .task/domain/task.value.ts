import { ITask } from './task.entity';
import { v4 as uuid } from 'uuid';

export class Task implements ITask {
  id: string;
  title: string;
  status: boolean;
  created: Date;
  authorId: string;
  projectId: string;
  description: string;
  assigneeId?: string;
  constructor(
    title: string,
    description: string,
    projectId: string,
    authorId: string,
    assigneeId?: string,
  ) {
    this.id = uuid();
    this.title = title;
    this.description = description;
    this.assigneeId = assigneeId;
    this.status = false;
    this.created = new Date();
    this.projectId = projectId;
    this.authorId = authorId;
  }
}

