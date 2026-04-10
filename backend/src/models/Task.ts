import mongoose, { Document, Schema, Types } from 'mongoose';

export type TaskStatus = 'todo' | 'in-progress' | 'done';

export interface ITask extends Document {
  project: Types.ObjectId;
  title: string;
  description?: string;
  status: TaskStatus;
  dueDate?: Date;
}

const taskSchema = new Schema<ITask>(
  {
    project: { type: Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    status: { type: String, enum: ['todo', 'in-progress', 'done'], default: 'todo' },
    dueDate: { type: Date }
  },
  { timestamps: true }
);

export const Task = mongoose.model<ITask>('Task', taskSchema);
