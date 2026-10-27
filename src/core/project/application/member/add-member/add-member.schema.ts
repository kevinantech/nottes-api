import { z } from 'zod';
import { MemberRole } from '../../../domain/member/member-role.enum';

const AssignableProjectRoleSchema = z.enum([
  MemberRole.ADMIN,
  MemberRole.MEMBER,
  MemberRole.VIEWER,
]);

export const AddProjectMemberSchema = z.object({
  userId: z.string().trim().min(1, 'El usuario es requerido'),
  role: AssignableProjectRoleSchema.default(MemberRole.MEMBER),
});

export type AddProjectMemberInput = z.infer<typeof AddProjectMemberSchema>;
