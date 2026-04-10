import { Response } from 'express';
import { z } from 'zod';
import { Project } from '../models/Project';
import { Task } from '../models/Task';
import { AuthRequest } from '../types';

const taskSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  status: z.enum(['todo', 'in-progress', 'done']).optional(),
  dueDate: z.string().datetime().optional().or(z.string().optional())
});

export const getTasksByProject = async (req: AuthRequest, res: Response): Promise<void> => {
  const status = String(req.query.status || '');
  const project = await Project.findOne({ _id: req.params.projectId, user: req.userId });
  if (!project) {
    res.status(404).json({ message: 'Project not found' });
    return;
  }

  const filter = {
    project: project._id,
    ...(status ? { status } : {})
  };

  const tasks = await Task.find(filter).sort({ dueDate: 1, createdAt: -1 });
  res.status(200).json(tasks);
};

export const createTask = async (req: AuthRequest, res: Response): Promise<void> => {
  const parsed = taskSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Validation failed', errors: parsed.error.flatten() });
    return;
  }

  const project = await Project.findOne({ _id: req.params.projectId, user: req.userId });
  if (!project) {
    res.status(404).json({ message: 'Project not found' });
    return;
  }

  const task = await Task.create({
    ...parsed.data,
    dueDate: parsed.data.dueDate ? new Date(parsed.data.dueDate) : undefined,
    project: project._id
  });

  res.status(201).json(task);
};

export const updateTask = async (req: AuthRequest, res: Response): Promise<void> => {
  const parsed = taskSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Validation failed', errors: parsed.error.flatten() });
    return;
  }

  const existingTask = await Task.findById(req.params.taskId).populate('project');
  if (!existingTask) {
    res.status(404).json({ message: 'Task not found' });
    return;
  }

  const projectOwner = (existingTask.project as any).user.toString();
  if (projectOwner !== req.userId) {
    res.status(403).json({ message: 'Forbidden' });
    return;
  }

  existingTask.title = parsed.data.title;
  existingTask.description = parsed.data.description || '';
  existingTask.status = parsed.data.status || existingTask.status;
  existingTask.dueDate = parsed.data.dueDate ? new Date(parsed.data.dueDate) : undefined;
  await existingTask.save();

  res.status(200).json(existingTask);
};

export const deleteTask = async (req: AuthRequest, res: Response): Promise<void> => {
  const existingTask = await Task.findById(req.params.taskId).populate('project');
  if (!existingTask) {
    res.status(404).json({ message: 'Task not found' });
    return;
  }

  const projectOwner = (existingTask.project as any).user.toString();
  if (projectOwner !== req.userId) {
    res.status(403).json({ message: 'Forbidden' });
    return;
  }

  await existingTask.deleteOne();
  res.status(200).json({ message: 'Task deleted successfully' });
};
