# 📋 Project Management Tool

A modern, full-stack project management application with beautiful UI and robust backend. Organize your projects and tasks efficiently with an intuitive dashboard.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- MongoDB (running locally)
- Register with name, email, and password
- Login with email and password
- JWT-based protected routes
- Password hashing using bcrypt

### Projects
- Create, update, delete projects
- View only the logged-in user’s projects
- Project fields: title, description, status
- Search by title
- Pagination support

### Tasks
- Create, update, delete tasks
- Tasks linked to projects
- Fields: title, description, status, due date
- Filter tasks by status

### Seeder
Seeds the database with:
- One demo user
- Two demo projects
- Three tasks for each project

Demo credentials:
- **Email:** test@example.com
- **Password:** Test@123

---

## Folder Structure

```bash
project-management-tool/
  backend/
  frontend/
  README.md
```

---

## Backend Setup

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Backend runs on:
```bash
http://localhost:5000
```

### Backend Environment Variables
Create a `.env` file in the `backend` folder:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/project-management-tool
JWT_SECRET=supersecretjwtkey
CLIENT_URL=http://localhost:5173
```

---

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:
```bash
http://localhost:5173
```

If needed, create `.env` in frontend:

```env
VITE_API_URL=http://localhost:5000/api
```

---

## Run Seed Script

Make sure MongoDB is running, then:

```bash
cd backend
npm install
npm run seed
```

This will insert:
- 1 user
- 2 projects
- 6 tasks total

---

## API Summary

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`

### Projects
- `GET /api/projects?page=1&limit=6&search=design`
- `GET /api/projects/:id`
- `POST /api/projects`
- `PUT /api/projects/:id`
- `DELETE /api/projects/:id`

### Tasks
- `GET /api/tasks/project/:projectId?status=todo`
- `POST /api/tasks/project/:projectId`
- `PUT /api/tasks/:taskId`
- `DELETE /api/tasks/:taskId`

---

## Tech Decisions

- **Express + TypeScript** for fast development and clean structure
- **MongoDB + Mongoose** for simple relational modeling between users, projects, and tasks
- **Zustand** for lightweight auth state management
- **React Hook Form + Yup** for form validation
- **Tailwind CSS** for fast UI styling

---

## Known Limitations

- No role-based authorization beyond user ownership
- No file attachments or comments on tasks
- No refresh token flow
- Unit tests structure can be added further if required

---

## Suggested Git Commits

```bash
git init
git add .
git commit -m "Initial full-stack project management tool setup"
git commit -m "Add JWT auth, project CRUD, and task CRUD"
git commit -m "Add React frontend with dashboard and project details"
git commit -m "Add database seed script and README"
```

---

## Submission Checklist

- [x] JWT authentication
- [x] Password hashing
- [x] Project CRUD
- [x] Task CRUD
- [x] Task filter by status
- [x] React TypeScript frontend
- [x] Seed script
- [x] README with setup steps
- [x] Pagination and search on projects
- [x] Form validation

