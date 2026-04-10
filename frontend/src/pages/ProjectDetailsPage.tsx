import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../api/client';
import { Project, Task, TaskStatus } from '../types';
import { TaskForm, TaskFormValues } from '../components/TaskForm';

interface ProjectDetailsResponse {
  project: Project;
  tasks: Task[];
}

export const ProjectDetailsPage = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchProject = async () => {
    try {
      setLoading(true);
      setError('');
      const { data } = await api.get<ProjectDetailsResponse>(`/projects/${projectId}`);
      setProject(data.project);
      setTasks(data.tasks);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load project');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [projectId]);

  const taskStats = useMemo(() => {
    return {
      total: tasks.length,
      todo: tasks.filter(t => t.status === 'todo').length,
      inProgress: tasks.filter(t => t.status === 'in-progress').length,
      done: tasks.filter(t => t.status === 'done').length
    };
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    if (statusFilter === 'all') return tasks;
    return tasks.filter((task) => task.status === statusFilter);
  }, [tasks, statusFilter]);

  const handleTaskSubmit = async (values: TaskFormValues) => {
    try {
      const payload = { ...values, dueDate: new Date(values.dueDate).toISOString() };
      if (editingTask) {
        await api.put(`/tasks/${editingTask._id}`, payload);
      } else {
        await api.post(`/tasks/project/${projectId}`, payload);
      }
      setShowForm(false);
      setEditingTask(null);
      setError('');
      await fetchProject();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to save task');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }
    try {
      setDeletingId(taskId);
      await api.delete(`/tasks/${taskId}`);
      await fetchProject();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to delete task');
    } finally {
      setDeletingId(null);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingTask(null);
    setError('');
  };

  const handleOpenForm = () => {
    setShowForm(true);
    setEditingTask(null);
    setError('');
  };

  const handleToggleForm = () => {
    if (showForm) {
      handleCloseForm();
    } else {
      handleOpenForm();
    }
  };

  if (loading) {
    return <div className="rounded-xl bg-white p-12 shadow text-center">Loading project details...</div>;
  }

  if (!project) {
    return (
      <div className="rounded-xl bg-white p-12 shadow text-center">
        <div className="text-5xl mb-3">❌</div>
        <h3 className="text-lg font-semibold text-slate-700">Project not found</h3>
        <Link to="/" className="mt-4 inline-block text-blue-600 hover:text-blue-700 font-semibold">Back to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-lg bg-red-50 p-4 border border-red-200 text-red-700 text-sm">
          <div className="flex gap-3">
            <span className="text-lg">⚠️</span>
            <div>
              <p className="font-semibold">Error</p>
              <p>{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-2xl bg-white p-6 shadow-lg">
        <Link to="/" className="text-sm text-green-600 hover:text-green-700 font-medium">← Back to Projects</Link>
        <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-slate-900">{project.title}</h1>
            <span className={`mt-2 inline-block rounded-full px-4 py-1.5 text-sm font-medium ${
              project.status === 'completed'
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-blue-100 text-blue-700'
            }`}>
              {project.status === 'completed' ? '✓ Completed' : '○ Active'}
            </span>
          </div>
        </div>
        {project.description && (
          <p className="mt-4 text-slate-600">{project.description}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <p className="text-2xl font-bold text-slate-900">{taskStats.total}</p>
          <p className="text-sm text-slate-600">Total Tasks</p>
        </div>
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <p className="text-2xl font-bold text-slate-700">{taskStats.todo}</p>
          <p className="text-sm text-slate-600">Todo</p>
        </div>
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <p className="text-2xl font-bold text-amber-700">{taskStats.inProgress}</p>
          <p className="text-sm text-slate-600">In Progress</p>
        </div>
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <p className="text-2xl font-bold text-emerald-700">{taskStats.done}</p>
          <p className="text-sm text-slate-600">Done</p>
        </div>
      </div>

      <div className="flex flex-col gap-4 rounded-xl bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="all">All Tasks ({taskStats.total})</option>
            <option value="todo">Todo ({taskStats.todo})</option>
            <option value="in-progress">In Progress ({taskStats.inProgress})</option>
            <option value="done">Done ({taskStats.done})</option>
          </select>
        </div>
        <button
          onClick={handleToggleForm}
          className="rounded-lg bg-gradient-to-r from-green-500 to-green-600 px-5 py-2.5 text-white font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-md active:scale-95"
        >
          {showForm ? '✕ Close Form' : '+ Create Task'}
        </button>
      </div>

      {showForm && (
        <TaskForm 
          initialValues={editingTask || undefined} 
          onSubmit={handleTaskSubmit}
          onCancel={handleCloseForm}
        />
      )}

      {filteredTasks.length === 0 ? (
        <div className="rounded-xl bg-white p-12 shadow text-center">
          <div className="text-5xl mb-3">📋</div>
          <h3 className="text-lg font-semibold text-slate-700">No tasks yet</h3>
          <p className="text-sm text-slate-500 mt-1">Create your first task to get started</p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredTasks.map((task) => (
            <div key={task._id} className="rounded-xl bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-3 mb-3">
                <h2 className="text-lg font-semibold text-slate-800 flex-1">{task.title}</h2>
                <span className={`rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap ${
                  task.status === 'done'
                    ? 'bg-emerald-100 text-emerald-700'
                    : task.status === 'in-progress'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-slate-100 text-slate-700'
                }`}>
                  {task.status === 'done' ? '✓ Done' : task.status === 'in-progress' ? '⚡ In Progress' : '○ Todo'}
                </span>
              </div>
              {task.description && (
                <p className="text-sm text-slate-600 mb-3">{task.description}</p>
              )}
              <p className="text-xs text-slate-500 mb-4">
                📅 {task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'No due date'}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditingTask(task);
                    setShowForm(true);
                  }}
                  className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteTask(task._id)}
                  disabled={deletingId === task._id}
                  className="flex-1 rounded-lg border border-red-300 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 font-medium"
                >
                  {deletingId === task._id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
