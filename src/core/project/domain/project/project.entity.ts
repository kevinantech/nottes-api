export interface IProject {
  id: string;
  title: string;
  description: string;
  ownerId: string;
  memberCount: number;
  createdAt: Date;
}

export interface IProjectResponse {
  id: string;
  title: string;
  description: string;
  createdAt: string;
}

