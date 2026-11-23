import { describe, expect, it } from 'vitest';
import { MemberRole } from '../../domain/member/member-role.enum';
import {
  ProjectAccessPolicy,
  ProjectPermission,
} from './project-access.policy';

// Matriz de casos de permisos por rol: [Rol del actor, permiso, resultado esperado]
const canCases: Array<[MemberRole | null, ProjectPermission, boolean]> = [
  // OWNER
  [MemberRole.OWNER, ProjectPermission.PROJECT_UPDATE, true],
  [MemberRole.OWNER, ProjectPermission.PROJECT_DELETE, true],
  [MemberRole.OWNER, ProjectPermission.PROJECT_LEAVE, false],
  [MemberRole.OWNER, ProjectPermission.MEMBER_ADD, true],
  [MemberRole.OWNER, ProjectPermission.MEMBER_REMOVE, true],
  [MemberRole.OWNER, ProjectPermission.MEMBER_UPDATE_ROLE, true],

  // ADMIN
  [MemberRole.ADMIN, ProjectPermission.PROJECT_UPDATE, true],
  [MemberRole.ADMIN, ProjectPermission.PROJECT_DELETE, false],
  [MemberRole.ADMIN, ProjectPermission.PROJECT_LEAVE, true],
  [MemberRole.ADMIN, ProjectPermission.MEMBER_ADD, true],
  [MemberRole.ADMIN, ProjectPermission.MEMBER_REMOVE, true],
  [MemberRole.ADMIN, ProjectPermission.MEMBER_UPDATE_ROLE, true],

  // MEMBER
  [MemberRole.MEMBER, ProjectPermission.PROJECT_UPDATE, false],
  [MemberRole.MEMBER, ProjectPermission.PROJECT_DELETE, false],
  [MemberRole.MEMBER, ProjectPermission.PROJECT_LEAVE, true],
  [MemberRole.MEMBER, ProjectPermission.MEMBER_ADD, false],
  [MemberRole.MEMBER, ProjectPermission.MEMBER_REMOVE, false],
  [MemberRole.MEMBER, ProjectPermission.MEMBER_UPDATE_ROLE, false],

  // VIEWER
  [MemberRole.VIEWER, ProjectPermission.PROJECT_UPDATE, false],
  [MemberRole.VIEWER, ProjectPermission.PROJECT_DELETE, false],
  [MemberRole.VIEWER, ProjectPermission.PROJECT_LEAVE, true],
  [MemberRole.VIEWER, ProjectPermission.MEMBER_ADD, false],
  [MemberRole.VIEWER, ProjectPermission.MEMBER_REMOVE, false],
  [MemberRole.VIEWER, ProjectPermission.MEMBER_UPDATE_ROLE, false],

  // null (sin membresía)
  [null, ProjectPermission.PROJECT_UPDATE, false],
  [null, ProjectPermission.PROJECT_DELETE, false],
  [null, ProjectPermission.PROJECT_LEAVE, false],
  [null, ProjectPermission.MEMBER_ADD, false],
  [null, ProjectPermission.MEMBER_REMOVE, false],
  [null, ProjectPermission.MEMBER_UPDATE_ROLE, false],
];

const canAssignRoleCases: Array<[MemberRole | null, MemberRole, boolean]> = [
  [MemberRole.OWNER, MemberRole.OWNER, false],
  [MemberRole.OWNER, MemberRole.ADMIN, true],
  [MemberRole.OWNER, MemberRole.MEMBER, true],
  [MemberRole.OWNER, MemberRole.VIEWER, true],
  [MemberRole.ADMIN, MemberRole.OWNER, false],
  [MemberRole.ADMIN, MemberRole.ADMIN, false],
  [MemberRole.ADMIN, MemberRole.MEMBER, true],
  [MemberRole.ADMIN, MemberRole.VIEWER, true],
  [MemberRole.MEMBER, MemberRole.OWNER, false],
  [MemberRole.MEMBER, MemberRole.ADMIN, false],
  [MemberRole.MEMBER, MemberRole.MEMBER, false],
  [MemberRole.MEMBER, MemberRole.VIEWER, false],
  [MemberRole.VIEWER, MemberRole.OWNER, false],
  [MemberRole.VIEWER, MemberRole.ADMIN, false],
  [MemberRole.VIEWER, MemberRole.MEMBER, false],
  [MemberRole.VIEWER, MemberRole.VIEWER, false],
  [null, MemberRole.OWNER, false],
  [null, MemberRole.ADMIN, false],
  [null, MemberRole.MEMBER, false],
  [null, MemberRole.VIEWER, false],
];

const canModifyMemberCases: Array<[MemberRole | null, MemberRole, boolean]> = [
  [MemberRole.OWNER, MemberRole.OWNER, false],
  [MemberRole.OWNER, MemberRole.ADMIN, true],
  [MemberRole.OWNER, MemberRole.MEMBER, true],
  [MemberRole.OWNER, MemberRole.VIEWER, true],
  [MemberRole.ADMIN, MemberRole.OWNER, false],
  [MemberRole.ADMIN, MemberRole.ADMIN, false],
  [MemberRole.ADMIN, MemberRole.MEMBER, true],
  [MemberRole.ADMIN, MemberRole.VIEWER, true],
  [MemberRole.MEMBER, MemberRole.OWNER, false],
  [MemberRole.MEMBER, MemberRole.ADMIN, false],
  [MemberRole.MEMBER, MemberRole.MEMBER, false],
  [MemberRole.MEMBER, MemberRole.VIEWER, false],
  [MemberRole.VIEWER, MemberRole.OWNER, false],
  [MemberRole.VIEWER, MemberRole.ADMIN, false],
  [MemberRole.VIEWER, MemberRole.MEMBER, false],
  [MemberRole.VIEWER, MemberRole.VIEWER, false],
  [null, MemberRole.OWNER, false],
  [null, MemberRole.ADMIN, false],
  [null, MemberRole.MEMBER, false],
  [null, MemberRole.VIEWER, false],
];

describe('ProjectAccessPolicy.can', () => {
  it.each(canCases)('can(%s, %s) => %s', (role, permission, expected) => {
    expect(ProjectAccessPolicy.can(role, permission)).toBe(expected);
  });
});

describe('ProjectAccessPolicy.canAssignRole', () => {
  it.each(canAssignRoleCases)(
    'canAssignRole(%s, %s) => %s',
    (actorRole, roleToAssign, expected) => {
      expect(ProjectAccessPolicy.canAssignRole(actorRole, roleToAssign)).toBe(
        expected,
      );
    },
  );
});

describe('ProjectAccessPolicy.canModifyMember', () => {
  it.each(canModifyMemberCases)(
    'canModifyMember(%s, %s) => %s',
    (actorRole, roleToAssign, expected) => {
      expect(ProjectAccessPolicy.canModifyMember(actorRole, roleToAssign)).toBe(
        expected,
      );
    },
  );
});
