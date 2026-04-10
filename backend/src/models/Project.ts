import mongoose, { Document, Schema, Types } from 'mongoose';

export type ProjectStatus = 'active' | 'completed';

export interface IProject extends Document {
  user: Types.ObjectId;
  title: string;
  description?: string;
  status: ProjectStatus;
}

const projectSchema = new Schema<IProject>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    status: { type: String, enum: ['active', 'completed'], default: 'active' }
  },
  { timestamps: true }
);

export const Project = mongoose.model<IProject>('Project', projectSchema);
