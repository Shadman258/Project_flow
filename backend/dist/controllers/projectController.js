"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProject = exports.updateProject = exports.createProject = exports.getProjectById = exports.getProjects = void 0;
const zod_1 = require("zod");
const Project_1 = require("../models/Project");
const Task_1 = require("../models/Task");
const projectSchema = zod_1.z.object({
    title: zod_1.z.string().min(1),
    description: zod_1.z.string().optional(),
    status: zod_1.z.enum(['active', 'completed']).optional()
});
const getProjects = async (req, res) => {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);
    const search = String(req.query.search || '');
    const filter = {
        user: req.userId,
        ...(search ? { title: { $regex: search, $options: 'i' } } : {})
    };
    const [projects, total] = await Promise.all([
        Project_1.Project.find(filter)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit),
        Project_1.Project.countDocuments(filter)
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
exports.getProjects = getProjects;
const getProjectById = async (req, res) => {
    const project = await Project_1.Project.findOne({ _id: req.params.id, user: req.userId });
    if (!project) {
        res.status(404).json({ message: 'Project not found' });
        return;
    }
    const tasks = await Task_1.Task.find({ project: project._id }).sort({ dueDate: 1, createdAt: -1 });
    res.status(200).json({ project, tasks });
};
exports.getProjectById = getProjectById;
const createProject = async (req, res) => {
    const parsed = projectSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ message: 'Validation failed', errors: parsed.error.flatten() });
        return;
    }
    const project = await Project_1.Project.create({ ...parsed.data, user: req.userId });
    res.status(201).json(project);
};
exports.createProject = createProject;
const updateProject = async (req, res) => {
    const parsed = projectSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ message: 'Validation failed', errors: parsed.error.flatten() });
        return;
    }
    const project = await Project_1.Project.findOneAndUpdate({ _id: req.params.id, user: req.userId }, parsed.data, { new: true });
    if (!project) {
        res.status(404).json({ message: 'Project not found' });
        return;
    }
    res.status(200).json(project);
};
exports.updateProject = updateProject;
const deleteProject = async (req, res) => {
    const project = await Project_1.Project.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!project) {
        res.status(404).json({ message: 'Project not found' });
        return;
    }
    await Task_1.Task.deleteMany({ project: project._id });
    res.status(200).json({ message: 'Project deleted successfully' });
};
exports.deleteProject = deleteProject;
