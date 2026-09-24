import { IProject } from '../domain/project.entity';
import { ProjectRepository } from '../domain/project.repository';
import Project from '../domain/project.value';
import { TaskRepository } from '../../task/domain/task.repository';

export class UCProject {
  constructor(
    private readonly projectRepository: ProjectRepository,
    private readonly taskRepository: TaskRepository,
  ) {}

  public async GetProjects(authorId: string): Promise<IProject[]> {
    const projects =
      await this.projectRepository.findProjectsByAuthorId(authorId);
    return projects;
  }

  public async Create(
    nameArg: string,
    authorArg: string,
  ): Promise<{ ID: string; name: string }> {
    const project = new Project(nameArg, authorArg);
    const savedProject = await this.projectRepository.registerProject(project);
    if (!savedProject) throw new Error('Could not save');
    const { id: ID, name } = savedProject;
    return { ID, name };
  }

  public async Update(
    idArg: string,
    nameArg: string,
    editorArg: string,
  ): Promise<{ id: string; name: string }> {
    // Verify that the project exists.
    const projectFound = await this.projectRepository.findProjectById(idArg);
    if (!projectFound) throw new Error('The project does not exist');

    // Verify that editor matches with the project autor.
    if (editorArg != projectFound.authorId)
      throw new Error('You dont have permissions');

    // Core
    const updatedProject = await this.projectRepository.updateProject(
      idArg,
      nameArg,
    );
    if (!updatedProject) throw new Error('Could not update');
    const { id, name } = updatedProject;
    return { id, name };
  }

  public async Delete(
    idArg: string,
    editorArg: string,
  ): Promise<{ id: string }> {
    // Verify that the project exists.
    const projectFound = await this.projectRepository.findProjectById(idArg);
    if (!projectFound) throw new Error('The project does not exist');

    // Verify that editor matches with the project autor.
    if (editorArg != projectFound.authorId)
      throw new Error('You dont have permissions');

    // Deletes project's tasks.
    await this.taskRepository.deleteTasksByProjectId(idArg);

    const deletedProject = await this.projectRepository.deleteProject(idArg);
    if (!deletedProject) throw new Error('Could not delete');
    const { id } = deletedProject;
    return { id };
  }
}

