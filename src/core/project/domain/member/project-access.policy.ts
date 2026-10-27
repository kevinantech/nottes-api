import { MemberRole } from './member-role.enum';

export class ProjectAccessPolicy {
  static canView(role: MemberRole | null): boolean {
    return role !== null;
  }

  static canEditProject(role: MemberRole | null): boolean {
    return role === MemberRole.OWNER || role === MemberRole.ADMIN;
  }

  static canDeleteProject(role: MemberRole | null): boolean {
    return role === MemberRole.OWNER;
  }

  static canManageMembers(role: MemberRole | null): boolean {
    return role === MemberRole.OWNER || role === MemberRole.ADMIN;
  }

  /**
   * Nota de diseño: Aunque canAssignRole y canModifyMember parezcan tener código repetido,
   * están separados a propósito para evaluar dos momentos distintos.
   * - canAssignRole: ¿Tengo los permisos para darle este nuevo rol? (Evalúa su rol ACTUAL)
   * - canModifyMember: ¿Tengo autoridad para alterar a esta persona basándome en su rol actual? (Evalúa el NUEVO rol a dar)
   */
  static canAssignRole(
    actorRole: MemberRole | null,
    role: MemberRole,
  ): boolean {
    if (!this.canManageMembers(actorRole)) return false;

    // Ningún  miembro puede otorgar el rol owner
    if (role === MemberRole.OWNER) return false;

    // Un administrador no puede otorgarle administrador a otro miembro
    if (actorRole === MemberRole.ADMIN && role === MemberRole.ADMIN) {
      return false;
    }
    return true;
  }

  static canModifyMember(
    actorRole: MemberRole | null,
    targetRole: MemberRole,
  ): boolean {
    if (!this.canManageMembers(actorRole)) return false;

    // Ningún  miembro puede modificar a un owner
    if (targetRole === MemberRole.OWNER) return false;

    // Un administrador no puede modificar el rol de otro administrador
    if (actorRole === MemberRole.ADMIN && targetRole === MemberRole.ADMIN) {
      return false;
    }
    return true;
  }
}

