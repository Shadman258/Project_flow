import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { connectDb } from '../config/db';
import { Project } from '../models/Project';
import { Task } from '../models/Task';
import { User } from '../models/User';

const seed = async (): Promise<void> => {
  try {
    await connectDb();

    await Task.deleteMany({});
    await Project.deleteMany({});
    await User.deleteMany({ email: 'test@example.com' });

    const user = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: await bcrypt.hash('Test@123', 10)
    });

    const projects = await Project.insertMany([
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

    await Task.insertMany(tasks);

    console.log('Seed data inserted successfully');
    console.log('Login with test@example.com / Test@123');
  } catch (error) {
    console.error('Seed failed', error);
  } finally {
    await mongoose.connection.close();
  }
};

seed();
