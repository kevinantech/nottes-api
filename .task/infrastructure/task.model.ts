import { Schema, model } from 'mongoose';
import { ITask } from '../domain/task.entity';

const TaskSchema = new Schema<ITask>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      required: true,
      default: false,
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
    projectId: {
      type: String,
      required: true,
      ref: 'projects',
    },
  },
  {
    versionKey: false,
  },
);

const TaskModel = model('tasks', TaskSchema);
export { TaskModel };

