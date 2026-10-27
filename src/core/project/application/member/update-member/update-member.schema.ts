import { z } from 'zod';
import { MemberRole } from '../../../domain/member/member-role.enum';

const AssignableProjectRoleSchema = z.enum([
  MemberRole.ADMIN,
  MemberRole.MEMBER,
  MemberRole.VIEWER,
]);

export const UpdateProjectMemberRoleSchema = z.object({
  role: AssignableProjectRoleSchema,
});

export type UpdateProjectMemberRoleInput = z.infer<
  typeof UpdateProjectMemberRoleSchema
>;
