import { Schema, model } from 'mongoose';
import { IProject } from '../domain/project.entity';

const ProjectSchema = new Schema<IProject>(
  {
    id: {
      type: String,
      require: true,
      unique: true,
    },
    name: {
      type: String,
      require: true,
      trim: true,
    },
    created: {
      type: Date,
      required: true,
    },
    authorId: {
      type: String,
      required: true,
      ref: 'User',
    },
  },
  {
    versionKey: false,
  },
);
const ProjectModel = model('Projects', ProjectSchema);
export { ProjectModel };

