import z from 'zod';
import { Inject, Injectable } from '../../../../../di';
import {
  AppException,
  ValidationException,
} from '../../../../shared/domain/exception';
import { IUnitOfWork } from '../../../../shared/domain/unit-of-work.interface';
import { MAX_MEMBERSHIP_PROJECTS } from '../../../../user/domain/user.constants';
import { IUserRepository } from '../../../../user/domain/user.repository.interface';
import { Member } from '../../../domain/member/member.factory';
import { IMemberRepository } from '../../../domain/member/member.repository.interface';
import { MAX_PROJECTS_MEMBERS } from '../../../domain/project/project.constants';
import { IProjectRepository } from '../../../domain/project/project.repository.interface';
import {
  ProjectAccessPolicy,
  ProjectPermission,
} from '../../project/project-access.policy';
import { ProjectAccessService } from '../../project/project-access.service';
import { IMemberResponse } from '../member.dto';
import { MemberMapper } from '../member.mapper';
import { AddMemberInput, AddMemberSchema } from './add-member.schema';

@Injectable()
export class AddMemberUseCase {
  constructor(
    @Inject('ProjectAccessService')
    private readonly accessService: ProjectAccessService,
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
    @Inject('IMemberRepository')
    private readonly memberRepository: IMemberRepository,
    @Inject('IProjectRepository')
    private readonly projectRepository: IProjectRepository,
    @Inject('IUnitOfWork') private readonly unitOfWork: IUnitOfWork,
  ) {}

  /**
   * Añade un nuevo miembro al proyecto.
   * 1. Verificar que el usuario que ejecuta la acción pertenezca al proyecto y tenga permisos para agregar miembros.
   * 3. Verificar que el usuario que ejecuta la acción tenga la autoridad necesaria para asignar el rol especificado.
   * 2. Verificar que el usuario no forme parte del proyecto actual (evitar duplicados).
   * 4. Verificar que el proyecto tenga cupo para un nuevo miembro (no exceda el límite de miembros).
   * 5. Verificar que el usuario no haya llegado a su tope de proyectos.
   *
   * @param projectId ID del proyecto
   * @param raw Datos del nuevo miembro (ID del usuario y rol)
   * @param actorId ID del usuario que ejecuta la acción.
   * @returns
   */
  async execute(
    projectId: string,
    raw: AddMemberInput,
    actorId: string,
  ): Promise<IMemberResponse> {
    const { data: input, error } = z.safeParse(AddMemberSchema, raw);
    if (error) throw ValidationException.fromZod(error);

    const { project, actor } = await this.accessService.ensureCan(
      projectId,
      actorId,
      ProjectPermission.MEMBER_ADD,
    );

    if (!ProjectAccessPolicy.canAssignRole(actor.role, input.role)) {
      throw new AppException('No tienes permisos para asignar ese rol', 403);
    }

    const [targetUser, existing] = await Promise.all([
      this.userRepository.findById(input.userId),
      this.memberRepository.findByProjectAndUser(projectId, input.userId),
    ]);

    if (!targetUser) {
      throw new AppException('Usuario no encontrado', 404);
    }

    if (existing) {
      throw new AppException('El usuario ya es miembro del proyecto');
    }

    const member = await this.unitOfWork.run(async (tx) => {
      const isProjectSlotReserved =
        await this.projectRepository.reserveMemberSlot(
          project.id,
          MAX_PROJECTS_MEMBERS,
          tx,
        );
      if (!isProjectSlotReserved) {
        throw new AppException('El proyecto alcanzó el límite de miembros');
      }

      const isUserSlotReserved =
        await this.userRepository.reserveMembershipSlot(
          input.userId,
          MAX_MEMBERSHIP_PROJECTS,
          tx,
        );
      if (!isUserSlotReserved) {
        throw new AppException(
          'El usuario alcanzó el límite máximo de proyectos permitidos',
        );
      }

      const member = Member.create(
        project.id,
        input.userId,
        input.role,
        actorId,
      );

      return await this.memberRepository.save(member, tx);
    });

    return MemberMapper.toResponse(member);
  }
}

