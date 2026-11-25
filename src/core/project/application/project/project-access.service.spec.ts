import { it, describe, vi, expect } from 'vitest';
import { IProject } from '../../domain/project/project.entity';
import { IMember } from '../../domain/member/member.entity';
import { MemberRole } from '../../domain/member/member-role.enum';
import { IProjectRepository } from '../../domain/project/project.repository';
import { IMemberRepository } from '../../domain/member/member.repository.interface';
import { ProjectAccessService } from './project-access.service';
import { AppException } from '../../../shared/domain/exception';
import { ProjectPermission } from './project-access.policy';

const VALID_PROJECT_ID = 'dbf11c01-f337-47a8-afd1-b41b5f48d337';
const VALID_ACTOR_ID = '9c27d2d3-f3fd-46e1-b1af-788c57009dd5';

const makeProject = (override: Partial<IProject> = {}): IProject => ({
  id: VALID_PROJECT_ID,
  title: 'Proyecto 1',
  description: 'Descripción',
  ownerId: 'cd6d2c24-cf0e-4b7d-82fe-739c24d17067',
  memberCount: 1,
  createdAt: new Date(),
  ...override,
});

const makeMember = (override: Partial<IMember> = {}): IMember => ({
  id: 'a26697ab-afda-4ab4-ad52-f6ba4d27ebbb',
  projectId: VALID_PROJECT_ID,
  userId: VALID_ACTOR_ID,
  role: MemberRole.MEMBER,
  joinedAt: new Date(),
  ...override,
});

/**
 * Inicializa `ProjectAccessService` con sus repositorios mockeados para cada caso de prueba.
 * @param options Respuestas simuladas que devolverán los repositorios
 * @param options.project Proyecto que resolverá `projectRepository.findById` (por defecto un proyecto válido; `null` simula que no existe)
 * @param options.actor Membresía que resolverá `memberRepository.findByProjectAndUser` (por defecto un miembro válido; `null` simula que no pertenece al proyecto)
 * @returns Instancia de `ProjectAccessService` junto con los mocks de `projectRepository` y `memberRepository`
 */
const setup = ({
  project = makeProject(),
  actor = makeMember(),
}: {
  project?: IProject | null;
  actor?: IMember | null;
}) => {
  const projectRepository = {
    findById: vi.fn().mockResolvedValue(project),
  } as unknown as IProjectRepository;

  const memberRepository = {
    findByProjectAndUser: vi.fn().mockResolvedValue(actor),
  } as unknown as IMemberRepository;

  return {
    service: new ProjectAccessService(projectRepository, memberRepository),
    projectRepository,
    memberRepository,
  };
};

describe('ProjectAccessService.ensureMembership', () => {
  it('Lanza 404 si el proyecto no es encontrado', async () => {
    const { service, projectRepository, memberRepository } = setup({
      project: null,
    });

    await expect(
      service.ensureMembership(VALID_PROJECT_ID, VALID_ACTOR_ID),
    ).rejects.toMatchObject({ statusCode: 404 } as Pick<
      AppException,
      'statusCode'
    >);

    expect(projectRepository.findById).toHaveBeenCalled();
    expect(memberRepository.findByProjectAndUser).toHaveBeenCalled();
  });

  it('Lanza 403 si el actor no hace parte del proyecto', async () => {
    const { service, projectRepository, memberRepository } = setup({
      actor: null,
    });

    await expect(
      service.ensureMembership(VALID_PROJECT_ID, VALID_ACTOR_ID),
    ).rejects.toMatchObject({ statusCode: 403 } as Pick<
      AppException,
      'statusCode'
    >);

    expect(projectRepository.findById).toHaveBeenCalled();
    expect(memberRepository.findByProjectAndUser).toHaveBeenCalled();
  });

  it('Retorna el proyecto y el actor si pertenece al proyecto', async () => {
    const project = makeProject();
    const actor = makeMember();
    const { service } = setup({ project, actor });

    await expect(
      service.ensureMembership(VALID_PROJECT_ID, VALID_ACTOR_ID),
    ).resolves.toEqual({ project, actor });
  });
});

/**
 * @see
 * Prueba únicamente que el servicio reaccione bien (OK / 403).
 * Tanto `ProjectAccessService.ensureMembership` y `ProjectAccessPolicy`
 * ya tienen sus propias suites de pruebas (no duplicar casos aquí).
 */
describe('ProjectAccessService.ensureCan', () => {
  it('Retorna el proyecto y el actor si tiene el permiso requerido', async () => {
    const project = makeProject();
    const actor = makeMember({ role: MemberRole.ADMIN });
    const { service } = setup({ project, actor });

    await expect(
      service.ensureCan(
        VALID_PROJECT_ID,
        VALID_ACTOR_ID,
        ProjectPermission.MEMBER_ADD,
      ),
    ).resolves.toEqual({ project, actor });
  });

  it('Retorna 403 si el actor no tiene el permiso requerido', async () => {
    const { service } = setup({
      actor: makeMember({ role: MemberRole.MEMBER }),
    });

    await expect(
      service.ensureCan(
        VALID_PROJECT_ID,
        VALID_ACTOR_ID,
        ProjectPermission.MEMBER_ADD,
      ),
    ).rejects.toMatchObject({ statusCode: 403 } as Pick<
      AppException,
      'statusCode'
    >);
  });
});
