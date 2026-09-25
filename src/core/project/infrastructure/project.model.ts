import { Document, LeanDocument, Schema, model } from 'mongoose';
import { IProject } from '../domain/project.entity';

export type ProjectModelType = LeanDocument<IProject & Document>;

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
    created: {
      type: Date,
      required: true,
    },
    authorId: {
      type: String,
      required: true,
      ref: 'users',
    },
  },
  {
    versionKey: false,
  },
);
const ProjectModel = model('projects', ProjectSchema);
export { ProjectModel };

