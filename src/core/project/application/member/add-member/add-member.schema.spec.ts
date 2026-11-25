import { describe, expect, it } from 'vitest';
import { MemberRole } from '../../../domain/member/member-role.enum';
import { AddMemberInput, AddMemberSchema } from './add-member.schema';

const validInput = {
  userId: 'b8da21dc-544f-43e5-854d-cac8a29b5f9e',
  role: MemberRole.MEMBER,
};

const invalidCases: Array<
  [description: string, input: any, inputFieldError: keyof AddMemberInput]
> = [
  ['Rechaza cuando falta el rol', { userId: validInput.userId }, 'role'],
  ['Rechaza un rol invalido', { userId: validInput.userId, role: '' }, 'role'],
  [
    'Rechaza el rol OWNER',
    { userId: validInput.userId, role: MemberRole.OWNER },
    'role',
  ],
  ['Rechaza cuando falta el userId', { role: validInput.role }, 'userId'],
  [
    'Rechaza un userId que no es UUID',
    { userId: '', role: validInput.role },
    'userId',
  ],
];

describe('AddMemberSchema', () => {
  it.each([MemberRole.ADMIN, MemberRole.MEMBER, MemberRole.VIEWER])(
    'Acepta el rol %s',
    (role) => {
      const result = AddMemberSchema.safeParse({ ...validInput, role });
      expect(result.success).toBe(true);
    },
  );

  it.each(invalidCases)('%s', (_description, input, inputFieldError) => {
    const result = AddMemberSchema.safeParse(input);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path[0]).toBe(inputFieldError);
    }
  });
});
