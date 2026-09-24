import { Schema, model } from 'mongoose';
import { ITask } from '../domain/task.entity';

const TaskSchema = new Schema<ITask>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
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
    projectId: {
      type: String,
      required: true,
    },
    authorId: {
      type: String,
      required: true,
    },
  },
  {
    versionKey: false,
  },
);

const TaskModel = model('tasks', TaskSchema);
export { TaskModel };

