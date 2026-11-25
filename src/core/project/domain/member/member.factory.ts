import { v4 as uuid } from 'uuid';
import { IMember } from './member.entity';
import { MemberRole } from './member-role.enum';

export class Member implements IMember {
  readonly id: string;
  readonly projectId: string;
  readonly userId: string;
  readonly role: MemberRole;
  readonly joinedAt: Date;
  readonly invitedBy?: string;

  private constructor(
    projectId: string,
    userId: string,
    role: MemberRole = MemberRole.MEMBER,
    invitedBy?: string,
  ) {
    this.id = uuid();
    this.projectId = projectId;
    this.userId = userId;
    this.role = role;
    this.joinedAt = new Date();
    this.invitedBy = invitedBy;
  }

  static create(
    projectId: string,
    userId: string,
    role: MemberRole,
    invitedBy?: string,
  ): Member {
    return new Member(projectId, userId, role, invitedBy);
  }

  static createOwner(projectId: string, ownerId: string): Member {
    return new Member(projectId, ownerId, MemberRole.OWNER);
  }
}

