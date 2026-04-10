import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { Project } from '../types';
import { ProjectForm, ProjectFormValues } from '../components/ProjectForm';

interface ProjectsResponse {
  projects: Project[];
  pagination: {
    page: number;
    totalPages: number;
    total: number;
    limit: number;
  };
}

export const DashboardPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError('');
      const { data } = await api.get<ProjectsResponse>('/projects', {
        params: { search, page, limit: 6 }
      });
      setProjects(data.projects);
      setTotalPages(data.pagination.totalPages || 1);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [page, search]);

  const handleProjectSubmit = async (values: ProjectFormValues) => {
    try {
      if (editingProject) {
        await api.put(`/projects/${editingProject._id}`, values);
      } else {
        await api.post('/projects', values);
      }
      setShowForm(false);
      setEditingProject(null);
      setError('');
      await fetchProjects();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to save project');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this project?')) {
      return;
    }
    try {
      setDeletingId(id);
      await api.delete(`/projects/${id}`);
      await fetchProjects();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to delete project');
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setShowForm(true);
    setError('');
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingProject(null);
    setError('');
  };

  const handleOpenForm = () => {
    setShowForm(true);
    setEditingProject(null);
    setError('');
  };

  const handleToggleForm = () => {
    if (showForm) {
      handleCloseForm();
    } else {
      handleOpenForm();
    }
  };

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

      <div className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-lg sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Your Projects</h1>
          <p className="mt-1 text-sm text-slate-500">Create, track, and manage your projects efficiently.</p>
        </div>
        <button
          onClick={handleToggleForm}
          className="rounded-lg bg-gradient-to-r from-green-500 to-green-600 px-5 py-2.5 text-white font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-md active:scale-95"
        >
          {showForm ? '✕ Close Form' : '+ Create Project'}
        </button>
      </div>

      <div className="rounded-xl bg-white p-4 shadow-sm">
        <input
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
          placeholder="🔍 Search projects by title..."
          className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
        />
      </div>

      {showForm && (
        <ProjectForm 
          initialValues={editingProject || undefined} 
          onSubmit={handleProjectSubmit}
          onCancel={handleCloseForm}
        />
      )}

      {loading ? (
        <div className="rounded-xl bg-white p-12 shadow text-center">
          <div className="inline-block">Loading your projects...</div>
        </div>
      ) : projects.length === 0 ? (
        <div className="rounded-xl bg-white p-12 shadow text-center">
          <div className="text-5xl mb-3">📁</div>
          <h3 className="text-lg font-semibold text-slate-700">No projects yet</h3>
          <p className="text-sm text-slate-500 mt-1">Create your first project to get started</p>
        </div>
      ) : (
        <>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {projects.map((project) => (
              <div key={project._id} className="rounded-xl bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold text-slate-800">{project.title}</h2>
                    <span className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-medium ${
                      project.status === 'completed' 
                        ? 'bg-emerald-100 text-emerald-700' 
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {project.status === 'completed' ? '✓ Completed' : '○ Active'}
                    </span>
                  </div>
                </div>
                {project.description && (
                  <p className="mb-4 text-sm text-slate-600 line-clamp-2">{project.description}</p>
                )}
                <div className="flex flex-wrap gap-2">
                  <Link 
                    to={`/projects/${project._id}`} 
                    className="flex-1 rounded-lg bg-gradient-to-r from-green-500 to-green-600 px-3 py-2 text-center text-sm text-white hover:from-green-600 hover:to-green-700 transition-all font-medium shadow-md hover:shadow-lg"
                  >
                    View
                  </Link>
                  <button
                    onClick={() => handleEdit(project)}
                    className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors font-medium"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(project._id)}
                    disabled={deletingId === project._id}
                    className="rounded-lg border border-red-300 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 font-medium"
                  >
                    {deletingId === project._id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4">
              <button
                disabled={page === 1}
                onClick={() => setPage((prev) => prev - 1)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                ← Previous
              </button>
              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      p === page
                        ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md'
                        : 'border border-slate-300 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <button
                disabled={page === totalPages}
                onClick={() => setPage((prev) => prev + 1)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
