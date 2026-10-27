import { MemberRole } from './member-role.enum';

export interface IMember {
  id: string;
  projectId: string;
  userId: string;
  role: MemberRole;
  joinedAt: Date;
  invitedBy?: string;
}

export interface IMemberResponse {
  id: string;
  projectId: string;
  userId: string;
  role: MemberRole;
  joinedAt: string;
  invitedBy?: string;
}

