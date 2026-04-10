import { Response } from 'express';
import { z } from 'zod';
import { Project } from '../models/Project';
import { Task } from '../models/Task';
import { AuthRequest } from '../types';

const projectSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  status: z.enum(['active', 'completed']).optional()
});

export const getProjects = async (req: AuthRequest, res: Response): Promise<void> => {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 10);
  const search = String(req.query.search || '');

  const filter = {
    user: req.userId,
    ...(search ? { title: { $regex: search, $options: 'i' } } : {})
  };

  const [projects, total] = await Promise.all([
    Project.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Project.countDocuments(filter)
  ]);

  res.status(200).json({
    projects,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  });
};

export const getProjectById = async (req: AuthRequest, res: Response): Promise<void> => {
  const project = await Project.findOne({ _id: req.params.id, user: req.userId });
  if (!project) {
    res.status(404).json({ message: 'Project not found' });
    return;
  }

  const tasks = await Task.find({ project: project._id }).sort({ dueDate: 1, createdAt: -1 });
  res.status(200).json({ project, tasks });
};

export const createProject = async (req: AuthRequest, res: Response): Promise<void> => {
  const parsed = projectSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Validation failed', errors: parsed.error.flatten() });
    return;
  }

  const project = await Project.create({ ...parsed.data, user: req.userId });
  res.status(201).json(project);
};

export const updateProject = async (req: AuthRequest, res: Response): Promise<void> => {
  const parsed = projectSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Validation failed', errors: parsed.error.flatten() });
    return;
  }

  const project = await Project.findOneAndUpdate(
    { _id: req.params.id, user: req.userId },
    parsed.data,
    { new: true }
  );

  if (!project) {
    res.status(404).json({ message: 'Project not found' });
    return;
  }

  res.status(200).json(project);
};

export const deleteProject = async (req: AuthRequest, res: Response): Promise<void> => {
  const project = await Project.findOneAndDelete({ _id: req.params.id, user: req.userId });
  if (!project) {
    res.status(404).json({ message: 'Project not found' });
    return;
  }

  await Task.deleteMany({ project: project._id });
  res.status(200).json({ message: 'Project deleted successfully' });
};
