import { Schema, model } from 'mongoose';
import { IProject } from '../../domain/project/project.entity';

const ProjectSchema = new Schema<IProject>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    createdAt: {
      type: Date,
      required: true,
    },
    ownerId: {
      type: String,
      required: true,
      ref: 'users',
    },
    memberCount: {
      type: Number,
      required: true,
      default: 0,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    versionKey: false,
  },
);
const ProjectModel = model('projects', ProjectSchema);
export { ProjectModel };

