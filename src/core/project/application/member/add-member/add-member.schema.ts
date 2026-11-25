import { z } from 'zod';
import { MemberRole } from '../../../domain/member/member-role.enum';

const AssignableMemberRoleSchema = z.enum([
  MemberRole.ADMIN,
  MemberRole.MEMBER,
  MemberRole.VIEWER,
]);

export const AddMemberSchema = z.object({
  userId: z.uuid('El usuario debe ser valido'),
  role: AssignableMemberRoleSchema,
});

export type AddMemberInput = z.infer<typeof AddMemberSchema>;
