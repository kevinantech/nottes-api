import { Schema, model } from 'mongoose';
import { IMember } from '../../domain/member/member.entity';
import { MemberRole } from '../../domain/member/member-role.enum';

const MemberSchema = new Schema<IMember>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    projectId: {
      type: String,
      required: true,
      ref: 'projects',
    },
    userId: {
      type: String,
      required: true,
      ref: 'users',
    },
    role: {
      type: String,
      enum: MemberRole,
      required: true,
    },
    joinedAt: {
      type: Date,
      required: true,
    },
    invitedBy: {
      type: String,
      ref: 'users',
    },
  },
  {
    versionKey: false,
  },
);

// Evita que un mismo usuario sea agregado dos veces al mismo proyecto
// TODO: Crear test para probarlo
MemberSchema.index({ projectId: 1, userId: 1 }, { unique: true });

// Índice de búsqueda simple para optimizar consultas
MemberSchema.index({ userId: 1 });

const MemberModel = model('project_members', MemberSchema);
export { MemberModel };

