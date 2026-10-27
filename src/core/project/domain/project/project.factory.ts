import { v4 as uuid } from 'uuid';
import { IProject } from './project.entity';

export default class Project implements IProject {
  id: string;
  title: string;
  ownerId: string;
  description: string;
  memberCount: number;
  createdAt: Date;

  private constructor(
    id: string,
    title: string,
    description: string,
    ownerId: string,
    memberCount: number,
    createdAt: Date,
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.ownerId = ownerId;
    this.memberCount = memberCount;
    this.createdAt = createdAt;
  }

  static createNew(
    title: string,
    description: string,
    ownerId: string,
  ): Project {
    return new Project(uuid(), title, description, ownerId, 1, new Date());
  }
}

