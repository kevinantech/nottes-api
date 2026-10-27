import z from 'zod';
import { Inject, Injectable } from '../../../../../di';
import {
  AppException,
  ValidationException,
} from '../../../../shared/domain/exception';
import { IUnitOfWork } from '../../../../shared/domain/unit-of-work.interface';
import { MAX_OWNED_PROJECTS } from '../../../../user/domain/user.constants';
import { IUserRepository } from '../../../../user/domain/user.repository.interface';
import { Member } from '../../../domain/member/member.factory';
import { IProjectMemberRepository } from '../../../domain/member/member.repository.interface';
import { IProjectResponse } from '../../../domain/project/project.entity';
import { ProjectMapper } from '../project.mapper';
import { IProjectRepository } from '../../../domain/project/project.repository';
import Project from '../../../domain/project/project.factory';
import {
  CreateProjectInput,
  CreateProjectSchema,
} from './create-project.schema';

@Injectable()
export class CreateProjectService {
  constructor(
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
    @Inject('IProjectRepository')
    private readonly projectRepository: IProjectRepository,
    @Inject('IProjectMemberRepository')
    private readonly memberRepository: IProjectMemberRepository,
    @Inject('IUnitOfWork') private readonly unitOfWork: IUnitOfWork,
  ) {}

  async execute(
    raw: CreateProjectInput,
    ownerId: string,
  ): Promise<IProjectResponse> {
    const { data: input, error } = z.safeParse(CreateProjectSchema, raw);
    if (error) throw ValidationException.fromZod(error);

    const newProject = await this.unitOfWork.run(async (tx) => {
      // Evita que peticiones concurrentes permitan superar el límite de proyectos de un usuario
      const slotReserved = await this.userRepository.reserveOwnedProjectSlot(
        ownerId,
        MAX_OWNED_PROJECTS,
        tx,
      );

      if (!slotReserved) {
        throw new AppException(
          'No puedes crear más proyectos. Límite alcanzado.',
        );
      }

      const project = Project.createNew(
        input.title,
        input.description,
        ownerId,
      );
      const owner = Member.createOwner(project.id, ownerId);

      const savedProject = await this.projectRepository.save(project, tx);
      await this.memberRepository.save(owner, tx);

      return savedProject;
    });

    return ProjectMapper.toResponse(newProject);
  }
}
