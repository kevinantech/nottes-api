export interface ITask {
  id: string;
  title: string;
  status: boolean;
  created: Date;
  authorId: string;
  projectId: string;
}

export interface ITaskResponse {
  id: string;
  title: string;
  status: boolean;
  created: Date;
  projectId: string;
}
