import { describe, expect, it, vi } from 'vitest';
import {
  AppException,
  ValidationException,
} from '../../../../shared/domain/exception';
import { IUnitOfWork } from '../../../../shared/domain/unit-of-work.interface';
import { MAX_MEMBERSHIP_PROJECTS } from '../../../../user/domain/user.constants';
import { IUserRepository } from '../../../../user/domain/user.repository.interface';
import { MemberRole } from '../../../domain/member/member-role.enum';
import { IMember } from '../../../domain/member/member.entity';
import { IMemberRepository } from '../../../domain/member/member.repository.interface';
import { MAX_PROJECTS_MEMBERS } from '../../../domain/project/project.constants';
import { IProject } from '../../../domain/project/project.entity';
import { IProjectRepository } from '../../../domain/project/project.repository.interface';
import { ProjectAccessPolicy } from '../../project/project-access.policy';
import { ProjectAccessService } from '../../project/project-access.service';
import { MemberMapper } from '../member.mapper';
import { AddMemberInput, AddMemberSchema } from './add-member.schema';
import { AddMemberUseCase } from './add-member.uc';

const VALID_PROJECT_ID = '11111111-1111-4111-8111-111111111111';
const VALID_ACTOR_ID = '22222222-2222-4222-8222-222222222222';
const VALID_TARGET_USER_ID = '33333333-3333-4333-8333-333333333333';

const validInput: AddMemberInput = {
  userId: VALID_TARGET_USER_ID,
  role: MemberRole.MEMBER,
};

const makeProject = (overrides: Partial<IProject> = {}): IProject =>
  ({
    id: VALID_PROJECT_ID,
    ...overrides,
  }) as IProject;

const makeMember = (overrides: Partial<IMember> = {}): IMember =>
  ({
    id: '44444444-4444-4444-8444-444444444444',
    projectId: VALID_PROJECT_ID,
    userId: VALID_ACTOR_ID,
    role: MemberRole.OWNER,
    ...overrides,
  }) as IMember;

/**
 * Inicializa `AddMemberUseCase` con todas sus dependencias mockeadas en estado válido (happy path).
 *
 * @param options Respuestas simuladas para forzar cada rama de fallo
 * @param options.actor Membresía del usuario que ejecuta la acción (por defecto `OWNER`)
 * @param options.targetUser Usuario destino devuelto por `userRepository.findById` (`null` simula 404)
 * @param options.existingMember Membresía previa del usuario destino (`null` simula que aún no pertenece)
 * @param options.projectSlotReserved Resultado de reservar cupo en el proyecto (`false` simula límite alcanzado)
 * @param options.userSlotReserved Resultado de reservar cupo en el usuario (`false` simula límite alcanzado)
 */
const setup = ({
  project = makeProject(),
  actor = makeMember({ role: MemberRole.OWNER }),
  targetUser = { id: VALID_TARGET_USER_ID },
  existingMember = null,
  projectSlotReserved = true,
  userSlotReserved = true,
}: {
  project?: IProject;
  actor?: IMember;
  targetUser?: { id: string } | null;
  existingMember?: IMember | null;
  projectSlotReserved?: boolean;
  userSlotReserved?: boolean;
} = {}) => {
  const tx = { id: 'mock-tx' };

  const accessService = {
    ensureCan: vi.fn().mockResolvedValue({ project, actor }),
  } as unknown as ProjectAccessService;

  const userRepository = {
    findById: vi.fn().mockResolvedValue(targetUser),
    reserveMembershipSlot: vi.fn().mockResolvedValue(userSlotReserved),
  } as unknown as IUserRepository;

  const memberRepository = {
    findByProjectAndUser: vi.fn().mockResolvedValue(existingMember),
    save: vi.fn().mockImplementation(async (member: IMember) => member),
  } as unknown as IMemberRepository;

  const projectRepository = {
    reserveMemberSlot: vi.fn().mockResolvedValue(projectSlotReserved),
  } as unknown as IProjectRepository;

  const unitOfWork = {
    run: vi.fn(async (work: (transaction: unknown) => Promise<unknown>) =>
      work(tx),
    ),
  } as unknown as IUnitOfWork;

  return {
    useCase: new AddMemberUseCase(
      accessService,
      userRepository,
      memberRepository,
      projectRepository,
      unitOfWork,
    ),
    accessService,
    userRepository,
    memberRepository,
    projectRepository,
    unitOfWork,
    tx,
  };
};

/**
 * Prueba únicamente la orquestación, el orden Fail-Fast y la transacción de `AddMemberUseCase`.
 *
 * @remarks
 * No duplicar casos de validación de campos ni matrices de roles/permisos;
 * ambos ya tienen sus propias suites exhaustivas.
 *
 * @see {@link AddMemberSchema}
 * @see {@link ProjectAccessPolicy}
 * @see {@link ProjectAccessService}
 */
describe('AddMemberUseCase.execute', () => {
  it('Lanza ValidationException si el input es inválido', async () => {
    const { useCase, accessService } = setup();

    await expect(
      useCase.execute(VALID_PROJECT_ID, { userId: 'fake-id' }, VALID_ACTOR_ID),
    ).rejects.toBeInstanceOf(ValidationException);

    expect(accessService.ensureCan).not.toHaveBeenCalled();
  });

  it('Lanza 403 antes de consultar BD si el actor no puede asignar el rol', async () => {
    const { useCase, userRepository, memberRepository } = setup({
      actor: makeMember({ role: MemberRole.ADMIN }),
    });

    await expect(
      useCase.execute(
        VALID_PROJECT_ID,
        { userId: VALID_TARGET_USER_ID, role: MemberRole.ADMIN },
        VALID_ACTOR_ID,
      ),
    ).rejects.toMatchObject({
      statusCode: 403,
      message: 'No tienes permisos para asignar ese rol',
    } as Pick<AppException, 'statusCode' | 'message'>);

    expect(userRepository.findById).not.toHaveBeenCalled();
    expect(memberRepository.findByProjectAndUser).not.toHaveBeenCalled();
  });

  it('Lanza 404 si el usuario a agregar no existe', async () => {
    const { useCase, unitOfWork } = setup({ targetUser: null });

    await expect(
      useCase.execute(VALID_PROJECT_ID, validInput, VALID_ACTOR_ID),
    ).rejects.toMatchObject({
      statusCode: 404,
      message: 'Usuario no encontrado',
    } as Pick<AppException, 'statusCode' | 'message'>);

    expect(unitOfWork.run).not.toHaveBeenCalled();
  });

  it('Lanza AppException si el usuario ya es miembro del proyecto', async () => {
    const { useCase, unitOfWork } = setup({
      existingMember: makeMember({ userId: VALID_TARGET_USER_ID }),
    });

    await expect(
      useCase.execute(VALID_PROJECT_ID, validInput, VALID_ACTOR_ID),
    ).rejects.toMatchObject({
      message: 'El usuario ya es miembro del proyecto',
    } as Pick<AppException, 'message'>);

    expect(unitOfWork.run).not.toHaveBeenCalled();
  });

  it('Lanza AppException si el proyecto alcanzó el límite de miembros', async () => {
    const { useCase, userRepository, memberRepository } = setup({
      projectSlotReserved: false,
    });

    await expect(
      useCase.execute(VALID_PROJECT_ID, validInput, VALID_ACTOR_ID),
    ).rejects.toMatchObject({
      message: 'El proyecto alcanzó el límite de miembros',
    } as Pick<AppException, 'message'>);

    expect(userRepository.reserveMembershipSlot).not.toHaveBeenCalled();
    expect(memberRepository.save).not.toHaveBeenCalled();
  });

  it('Lanza AppException si el usuario alcanzó su límite de proyectos', async () => {
    const { useCase, memberRepository } = setup({
      userSlotReserved: false,
    });

    await expect(
      useCase.execute(VALID_PROJECT_ID, validInput, VALID_ACTOR_ID),
    ).rejects.toMatchObject({
      message: 'El usuario alcanzó el límite máximo de proyectos permitidos',
    } as Pick<AppException, 'message'>);

    expect(memberRepository.save).not.toHaveBeenCalled();
  });

  it('Reserva cupos, guarda el miembro en transacción y retorna el DTO', async () => {
    const { useCase, projectRepository, userRepository, memberRepository, tx } =
      setup();

    const result = await useCase.execute(
      VALID_PROJECT_ID,
      validInput,
      VALID_ACTOR_ID,
    );

    expect(projectRepository.reserveMemberSlot).toHaveBeenCalledWith(
      VALID_PROJECT_ID,
      MAX_PROJECTS_MEMBERS,
      tx,
    );
    expect(userRepository.reserveMembershipSlot).toHaveBeenCalledWith(
      VALID_TARGET_USER_ID,
      MAX_MEMBERSHIP_PROJECTS,
      tx,
    );
    expect(memberRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        projectId: VALID_PROJECT_ID,
        userId: VALID_TARGET_USER_ID,
        role: MemberRole.MEMBER,
      }),
      tx,
    );

    const savedMember = vi.mocked(memberRepository.save).mock.calls[0][0];
    expect(result).toEqual(MemberMapper.toResponse(savedMember));
  });
});
