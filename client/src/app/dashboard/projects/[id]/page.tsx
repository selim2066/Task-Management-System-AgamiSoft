'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import { useToast } from '../../../../context/ToastContext';
import { getErrorMessage } from '../../../../lib/errorHandler';
import ProtectedRoute from '../../../../components/ProtectedRoute';
import DashboardLayout from '../../../../components/DashboardLayout';
import api from '../../../../lib/api';
import { Project, Task } from '../../../../types';
import { useParams, useRouter } from 'next/navigation';
import { Plus, Trash2, ArrowLeft, Loader2, ListTodo, Search, X } from 'lucide-react';
import Link from 'next/link';

export default function ProjectPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { user } = useAuth();
  const { showToast } = useToast();
  
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filter state
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'TODO' | 'IN_PROGRESS' | 'DONE'>('TODO');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{title?: string}>({});

  useEffect(() => {
    if (id && user) {
      fetchProject();
    }
  }, [id, user]);

  // Debounced task fetch based on filters
  useEffect(() => {
    if (!id || !user) return;
    const timeoutId = setTimeout(() => {
      fetchTasks(search, filterStatus);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [search, filterStatus, id, user]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const projRes = await api.get<Project>(`/projects/${id}`);
      setProject(projRes.data);
    } catch (err: any) {
      showToast(getErrorMessage(err), 'error');
      if (err.response?.status === 403 || err.response?.status === 404) {
        router.push('/dashboard');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchTasks = async (currentSearch: string, currentStatus: string) => {
    try {
      let url = `/tasks?projectId=${id}`;
      if (currentSearch) url += `&search=${encodeURIComponent(currentSearch)}`;
      if (currentStatus) url += `&status=${currentStatus}`;
      const tasksRes = await api.get<Task[]>(url);
      setTasks(tasksRes.data);
    } catch (err) {
      showToast(getErrorMessage(err), 'error');
    }
  };

  const handleStatusChange = async (taskId: string, newStatus: 'TODO' | 'IN_PROGRESS' | 'DONE') => {
    try {
      await api.put(`/tasks/${taskId}`, { status: newStatus });
      setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
      showToast('Task status updated.', 'success');
    } catch (err) {
      showToast(getErrorMessage(err), 'error');
    }
  };

  const handleDelete = async (taskId: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await api.delete(`/tasks/${taskId}`);
        setTasks(tasks.filter(t => t.id !== taskId));
        showToast('Task deleted successfully.', 'success');
      } catch (err) {
        showToast(getErrorMessage(err), 'error');
      }
    }
  };

  const validate = () => {
    const errors: {title?: string} = {};
    if (!title.trim() || title.trim().length < 2) {
      errors.title = 'Task title must be at least 2 characters.';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsSubmitting(true);
    try {
      await api.post('/tasks', { title, description, status, projectId: id });
      await fetchTasks(search, filterStatus);
      showToast('Task created successfully.', 'success');
      setIsModalOpen(false);
      setTitle('');
      setDescription('');
      setStatus('TODO');
      setValidationErrors({});
    } catch (err) {
      showToast(getErrorMessage(err), 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearFilters = () => {
    setSearch('');
    setFilterStatus('');
  };

  const isFiltering = search !== '' || filterStatus !== '';

  const statusColors = {
    TODO: 'bg-gray-100 text-gray-800 border-gray-200',
    IN_PROGRESS: 'bg-blue-100 text-blue-800 border-blue-200',
    DONE: 'bg-green-100 text-green-800 border-green-200'
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
          </div>
        ) : !project ? (
          <div className="text-center py-12">Project not found.</div>
        ) : (
          <div>
            <div className="mb-6">
              <Link href="/dashboard" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-blue-600 mb-4 transition-colors">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Projects
              </Link>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{project.name}</h1>
              <p className="text-gray-600 max-w-3xl">{project.description || 'No description'}</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 sm:px-6 py-4 border-b border-gray-200 flex flex-col space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                  <h2 className="text-xl font-bold text-gray-800 flex items-center">
                    <ListTodo className="h-5 w-5 mr-2 text-blue-600" />
                    Tasks
                  </h2>
                  <button
                    onClick={() => {
                      setTitle('');
                      setDescription('');
                      setStatus('TODO');
                      setValidationErrors({});
                      setIsModalOpen(true);
                    }}
                    className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors shadow-sm w-full sm:w-auto justify-center"
                  >
                    <Plus className="h-4 w-4" />
                    <span>New Task</span>
                  </button>
                </div>

                {/* Filter Controls */}
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <div className="relative w-full sm:w-64">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search tasks by title..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  <div className="w-full sm:w-48">
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md bg-white"
                    >
                      <option value="">All Statuses</option>
                      <option value="TODO">To Do</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="DONE">Done</option>
                    </select>
                  </div>
                  {isFiltering && (
                    <button
                      onClick={clearFilters}
                      className="flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Clear filters
                    </button>
                  )}
                </div>
              </div>

              {tasks.length === 0 ? (
                <div className="p-12 text-center">
                  {isFiltering ? (
                    <div>
                      <p className="text-gray-500 mb-4">No tasks match your search/filter.</p>
                      <button
                        onClick={clearFilters}
                        className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Clear filters
                      </button>
                    </div>
                  ) : (
                    <div>
                      <p className="text-gray-500 mb-4">No tasks yet for this project.</p>
                      <button
                        onClick={() => {
                          setTitle('');
                          setDescription('');
                          setStatus('TODO');
                          setValidationErrors({});
                          setIsModalOpen(true);
                        }}
                        className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                      >
                        <Plus className="h-4 w-4 mr-1" /> Create the first task
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assignee</th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {tasks.map((task) => (
                        <tr key={task.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">{task.title}</div>
                            {task.description && (
                              <div className="text-sm text-gray-500 mt-1 line-clamp-1">{task.description}</div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <select
                              value={task.status}
                              onChange={(e) => handleStatusChange(task.id, e.target.value as any)}
                              className={`text-xs font-bold rounded-full px-3 py-1 border appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 ${statusColors[task.status]}`}
                            >
                              <option value="TODO">TODO</option>
                              <option value="IN_PROGRESS">IN PROGRESS</option>
                              <option value="DONE">DONE</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {task.assignedTo?.name || <span className="text-gray-400 italic">Unassigned</span>}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => handleDelete(task.id)}
                              className="text-gray-400 hover:text-red-600 transition-colors p-1 rounded-md hover:bg-red-50"
                              title="Delete Task"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">New Task</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
              </div>
              <form onSubmit={handleSubmit} className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => { setTitle(e.target.value); setValidationErrors({}); }}
                      className={`w-full px-3 py-2 border ${validationErrors.title ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} rounded-md shadow-sm focus:outline-none`}
                      placeholder="e.g. Design Login Page"
                    />
                    {validationErrors.title && <p className="text-red-500 text-xs mt-1">{validationErrors.title}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
                    <textarea
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Task details..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as any)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white"
                    >
                      <option value="TODO">To Do</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="DONE">Done</option>
                    </select>
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !!validationErrors.title}
                    className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 flex items-center space-x-2 transition-colors"
                  >
                    {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                    <span>{isSubmitting ? 'Saving...' : 'Create Task'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </DashboardLayout>
    </ProtectedRoute>
  );
}
