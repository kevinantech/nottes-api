export interface ITask {
  id: string;
  name: string;
  status: boolean;
  created: Date;
  projectId: string;
  authorId: string;
}

