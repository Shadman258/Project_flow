"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.updateTask = exports.createTask = exports.getTasksByProject = void 0;
const zod_1 = require("zod");
const Project_1 = require("../models/Project");
const Task_1 = require("../models/Task");
const taskSchema = zod_1.z.object({
    title: zod_1.z.string().min(1),
    description: zod_1.z.string().optional(),
    status: zod_1.z.enum(['todo', 'in-progress', 'done']).optional(),
    dueDate: zod_1.z.string().datetime().optional().or(zod_1.z.string().optional())
});
const getTasksByProject = async (req, res) => {
    const status = String(req.query.status || '');
    const project = await Project_1.Project.findOne({ _id: req.params.projectId, user: req.userId });
    if (!project) {
        res.status(404).json({ message: 'Project not found' });
        return;
    }
    const filter = {
        project: project._id,
        ...(status ? { status } : {})
    };
    const tasks = await Task_1.Task.find(filter).sort({ dueDate: 1, createdAt: -1 });
    res.status(200).json(tasks);
};
exports.getTasksByProject = getTasksByProject;
const createTask = async (req, res) => {
    const parsed = taskSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ message: 'Validation failed', errors: parsed.error.flatten() });
        return;
    }
    const project = await Project_1.Project.findOne({ _id: req.params.projectId, user: req.userId });
    if (!project) {
        res.status(404).json({ message: 'Project not found' });
        return;
    }
    const task = await Task_1.Task.create({
        ...parsed.data,
        dueDate: parsed.data.dueDate ? new Date(parsed.data.dueDate) : undefined,
        project: project._id
    });
    res.status(201).json(task);
};
exports.createTask = createTask;
const updateTask = async (req, res) => {
    const parsed = taskSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ message: 'Validation failed', errors: parsed.error.flatten() });
        return;
    }
    const existingTask = await Task_1.Task.findById(req.params.taskId).populate('project');
    if (!existingTask) {
        res.status(404).json({ message: 'Task not found' });
        return;
    }
    const projectOwner = existingTask.project.user.toString();
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
exports.updateTask = updateTask;
const deleteTask = async (req, res) => {
    const existingTask = await Task_1.Task.findById(req.params.taskId).populate('project');
    if (!existingTask) {
        res.status(404).json({ message: 'Task not found' });
        return;
    }
    const projectOwner = existingTask.project.user.toString();
    if (projectOwner !== req.userId) {
        res.status(403).json({ message: 'Forbidden' });
        return;
    }
    await existingTask.deleteOne();
    res.status(200).json({ message: 'Task deleted successfully' });
};
exports.deleteTask = deleteTask;
