"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const mongoose_1 = __importDefault(require("mongoose"));
const db_1 = require("../config/db");
const Project_1 = require("../models/Project");
const Task_1 = require("../models/Task");
const User_1 = require("../models/User");
const seed = async () => {
    try {
        await (0, db_1.connectDb)();
        await Task_1.Task.deleteMany({});
        await Project_1.Project.deleteMany({});
        await User_1.User.deleteMany({ email: 'test@example.com' });
        const user = await User_1.User.create({
            name: 'Test User',
            email: 'test@example.com',
            password: await bcryptjs_1.default.hash('Test@123', 10)
        });
        const projects = await Project_1.Project.insertMany([
            {
                user: user._id,
                title: 'Website Redesign',
                description: 'Improve the landing page and dashboard UX.',
                status: 'active'
            },
            {
                user: user._id,
                title: 'Mobile App Launch',
                description: 'Prepare MVP tasks for Android and iOS.',
                status: 'completed'
            }
        ]);
        const tasks = [
            {
                project: projects[0]._id,
                title: 'Create wireframes',
                description: 'Design new wireframes for dashboard.',
                status: 'todo',
                dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
            },
            {
                project: projects[0]._id,
                title: 'Implement sidebar',
                description: 'Develop responsive sidebar component.',
                status: 'in-progress',
                dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
            },
            {
                project: projects[0]._id,
                title: 'Review QA feedback',
                description: 'Fix visual issues reported by QA.',
                status: 'done',
                dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            },
            {
                project: projects[1]._id,
                title: 'Set up CI/CD',
                description: 'Automate deployment pipeline.',
                status: 'done',
                dueDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
            },
            {
                project: projects[1]._id,
                title: 'Finalize app icons',
                description: 'Export all icon sizes.',
                status: 'done',
                dueDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000)
            },
            {
                project: projects[1]._id,
                title: 'Publish release notes',
                description: 'Write Play Store and App Store notes.',
                status: 'in-progress',
                dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
            }
        ];
        await Task_1.Task.insertMany(tasks);
        console.log('Seed data inserted successfully');
        console.log('Login with test@example.com / Test@123');
    }
    catch (error) {
        console.error('Seed failed', error);
    }
    finally {
        await mongoose_1.default.connection.close();
    }
};
seed();
