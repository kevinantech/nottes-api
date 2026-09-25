import { ITask } from './task.entity';
import { v4 as uuid } from 'uuid';

export class Task implements ITask {
  id: string;
  title: string;
  status: boolean;
  created: Date;
  projectId: string;
  authorId: string;
  constructor(title: string, projectId: string, authorId: string) {
    this.id = uuid();
    this.title = title;
    this.status = false;
    this.created = new Date();
    this.projectId = projectId;
    this.authorId = authorId;
  }
}

