import { MemberRole } from '../../domain/member/member-role.enum';

export const ProjectPermission = {
  PROJECT_UPDATE: 'project:update',
  PROJECT_DELETE: 'project:delete',
  PROJECT_LEAVE: 'project:leave',
  MEMBER_ADD: 'member:add',
  MEMBER_REMOVE: 'member:remove',
  MEMBER_UPDATE_ROLE: 'member:update_role',
} as const;

export type ProjectPermission =
  (typeof ProjectPermission)[keyof typeof ProjectPermission];

const ROLE_PERMISSIONS: Record<MemberRole, ReadonlySet<ProjectPermission>> = {
  [MemberRole.OWNER]: new Set([
    ProjectPermission.PROJECT_UPDATE,
    ProjectPermission.PROJECT_DELETE,
    ProjectPermission.MEMBER_ADD,
    ProjectPermission.MEMBER_REMOVE,
    ProjectPermission.MEMBER_UPDATE_ROLE,
  ]),
  [MemberRole.ADMIN]: new Set([
    ProjectPermission.PROJECT_UPDATE,
    ProjectPermission.PROJECT_LEAVE,
    ProjectPermission.MEMBER_ADD,
    ProjectPermission.MEMBER_REMOVE,
    ProjectPermission.MEMBER_UPDATE_ROLE,
  ]),
  [MemberRole.MEMBER]: new Set([ProjectPermission.PROJECT_LEAVE]),
  [MemberRole.VIEWER]: new Set([ProjectPermission.PROJECT_LEAVE]),
};

// Roles que un actor puede gestionar (asignar o modificar) según su rol actual. Por ejemplo, un OWNER puede asignar o modificar los roles de ADMIN, MEMBER y VIEWER, pero no puede asignar o modificar el rol de OWNER.
const MANAGEABLE_ROLES: Record<MemberRole, ReadonlySet<MemberRole>> = {
  [MemberRole.OWNER]: new Set([
    MemberRole.ADMIN,
    MemberRole.MEMBER,
    MemberRole.VIEWER,
  ]),
  [MemberRole.ADMIN]: new Set([MemberRole.MEMBER, MemberRole.VIEWER]),
  [MemberRole.MEMBER]: new Set(),
  [MemberRole.VIEWER]: new Set(),
};

export class ProjectAccessPolicy {
  static can(role: MemberRole | null, permission: ProjectPermission): boolean {
    if (!role) return false;
    return ROLE_PERMISSIONS[role].has(permission);
  }

  /**
   * ¿Puede el actor asignar el rol especificado?
   * @param actorRole Rol del usuario que ejecuta la acción
   * @param roleToAssign Rol que se desea asignar a otro miembro
   * @returns
   */
  static canAssignRole(
    actorRole: MemberRole | null,
    roleToAssign: MemberRole,
  ): boolean {
    if (!actorRole) return false;
    return MANAGEABLE_ROLES[actorRole].has(roleToAssign);
  }

  /**
   * ¿Tiene el actor autoridad sobre el miembro actual?
   * @param actorRole Rol del usuario que ejecuta la acción
   * @param currentTargetRole Rol que tiene actualmente el miembro sobre el que se desea actuar
   * @returns
   */
  static canModifyMember(
    actorRole: MemberRole | null,
    currentTargetRole: MemberRole,
  ): boolean {
    if (!actorRole) return false;
    return MANAGEABLE_ROLES[actorRole].has(currentTargetRole);
  }
}

