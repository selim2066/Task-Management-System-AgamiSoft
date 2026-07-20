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

  // Delete modal state
  const [deleteTaskId, setDeleteTaskId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleDelete = (taskId: string) => {
    setDeleteTaskId(taskId);
  };

  const confirmDelete = async () => {
    if (!deleteTaskId) return;
    setIsDeleting(true);
    try {
      await api.delete(`/tasks/${deleteTaskId}`);
      setTasks(tasks.filter(t => t.id !== deleteTaskId));
      showToast('Task deleted successfully.', 'success');
      setDeleteTaskId(null);
    } catch (err) {
      showToast(getErrorMessage(err), 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const validate = () => {
    const errors: {title?: string} = {};
    if (!title.trim() || title.trim().length < 2) {
      errors.title = 'TASK TITLE MUST BE AT LEAST 2 CHARACTERS.';
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
    TODO: 'bg-white text-black',
    IN_PROGRESS: 'bg-[#FFC900] text-black',
    DONE: 'bg-[#00E5FF] text-black'
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 flex items-center space-x-4">
              <Loader2 className="h-10 w-10 text-black animate-spin stroke-[3]" />
              <span className="text-xl font-black uppercase tracking-widest">LOADING...</span>
            </div>
          </div>
        ) : !project ? (
          <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-12 text-center">
            <h2 className="text-2xl font-black uppercase">PROJECT NOT FOUND</h2>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex flex-col space-y-4">
              <div>
                <Link href="/dashboard" className="inline-flex items-center text-sm font-black uppercase text-black bg-white border-2 border-black px-3 py-1.5 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all mb-6">
                  <ArrowLeft className="h-4 w-4 mr-2 stroke-[3]" />
                  BACK TO PROJECTS
                </Link>
              </div>
              <div className="bg-white border-4 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
                {/* Decorative tape */}
                <div className="absolute -top-4 -right-4 w-16 h-8 bg-[#FF90E8]/50 rotate-[45deg]"></div>
                
                <h1 className="text-4xl font-black text-black mb-3 uppercase tracking-wide">
                  <span className="bg-[#FFC900] px-2 border-2 border-black">{project.name}</span>
                </h1>
                <p className="text-lg font-bold text-black max-w-3xl border-l-4 border-[#00E5FF] pl-4 py-1">
                  {project.description || <span className="italic opacity-50 bg-gray-200 px-1 uppercase">NO DESCRIPTION PROVIDED.</span>}
                </p>
              </div>
            </div>

            <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              {/* Toolbar Header */}
              <div className="p-4 sm:px-6 py-4 border-b-4 border-black flex flex-col space-y-6 bg-[#00E5FF]">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                  <h2 className="text-2xl font-black text-black flex items-center uppercase tracking-widest bg-white border-2 border-black px-3 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <ListTodo className="h-6 w-6 mr-2 stroke-[3]" />
                    TASKS
                  </h2>
                  <button
                    onClick={() => {
                      setTitle('');
                      setDescription('');
                      setStatus('TODO');
                      setValidationErrors({});
                      setIsModalOpen(true);
                    }}
                    className="flex items-center space-x-2 bg-[#FF90E8] text-black px-5 py-2.5 font-black uppercase border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all focus:outline-none w-full sm:w-auto justify-center"
                  >
                    <Plus className="h-5 w-5 stroke-[3]" />
                    <span>NEW TASK</span>
                  </button>
                </div>

                {/* Filter Controls */}
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 items-center bg-white p-4 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <div className="relative w-full sm:w-64">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-black stroke-[3]" />
                    </div>
                    <input
                      type="text"
                      placeholder="SEARCH TASKS..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2.5 border-2 border-black font-black uppercase bg-white placeholder-gray-400 focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:shadow-none transition-all"
                    />
                  </div>
                  <div className="w-full sm:w-48 relative">
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="block w-full pl-3 pr-10 py-2.5 text-base border-2 border-black font-black uppercase focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:shadow-none transition-all bg-[#FFC900] appearance-none"
                    >
                      <option value="">ALL STATUSES</option>
                      <option value="TODO">TO DO</option>
                      <option value="IN_PROGRESS">IN PROGRESS</option>
                      <option value="DONE">DONE</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-black">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                    </div>
                  </div>
                  {isFiltering && (
                    <button
                      onClick={clearFilters}
                      className="flex items-center text-sm font-black uppercase text-black bg-[#FF6B6B] border-2 border-black px-3 py-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all focus:outline-none"
                    >
                      <X className="h-4 w-4 mr-1 stroke-[3]" />
                      CLEAR FILTERS
                    </button>
                  )}
                </div>
              </div>

              {tasks.length === 0 ? (
                <div className="p-16 text-center bg-[#FFFDF9]">
                  {isFiltering ? (
                    <div>
                      <p className="text-xl font-black uppercase mb-6">NO TASKS MATCH YOUR FILTER.</p>
                      <button
                        onClick={clearFilters}
                        className="inline-flex items-center text-black bg-[#FF6B6B] border-2 border-black px-4 py-2 font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all focus:outline-none"
                      >
                        <X className="h-4 w-4 mr-1 stroke-[3]" /> CLEAR FILTERS
                      </button>
                    </div>
                  ) : (
                    <div>
                      <p className="text-xl font-black uppercase mb-6 bg-[#FFC900] inline-block px-3 py-1 border-2 border-black">NO TASKS YET FOR THIS PROJECT.</p>
                      <div className="mt-4">
                        <button
                          onClick={() => {
                            setTitle('');
                            setDescription('');
                            setStatus('TODO');
                            setValidationErrors({});
                            setIsModalOpen(true);
                          }}
                          className="inline-flex items-center text-black bg-[#00E5FF] border-2 border-black px-6 py-3 font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all focus:outline-none"
                        >
                          <Plus className="h-5 w-5 mr-2 stroke-[3]" /> CREATE THE FIRST TASK
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="overflow-x-auto bg-[#FFFDF9]">
                  <table className="min-w-full divide-y-4 divide-black border-b-4 border-black">
                    <thead className="bg-[#FF90E8]">
                      <tr>
                        <th scope="col" className="px-6 py-4 text-left text-sm font-black text-black uppercase tracking-widest border-r-4 border-black">TASK</th>
                        <th scope="col" className="px-6 py-4 text-left text-sm font-black text-black uppercase tracking-widest border-r-4 border-black">STATUS</th>
                        <th scope="col" className="px-6 py-4 text-left text-sm font-black text-black uppercase tracking-widest border-r-4 border-black">ASSIGNEE</th>
                        <th scope="col" className="px-6 py-4 text-right text-sm font-black text-black uppercase tracking-widest">ACTION</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y-2 divide-black">
                      {tasks.map((task) => (
                         <tr key={task.id} className="hover:bg-gray-100 transition-colors group">
                          <td className="px-6 py-5 border-r-4 border-black">
                            <div className="text-lg font-black text-black uppercase leading-tight">{task.title}</div>
                            {task.description && (
                              <div className="text-sm font-bold text-gray-700 mt-2 line-clamp-2">{task.description}</div>
                            )}
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap border-r-4 border-black">
                            <div className="relative inline-block">
                              <select
                                value={task.status}
                                onChange={(e) => handleStatusChange(task.id, e.target.value as any)}
                                className={`text-sm font-black uppercase px-4 py-2 border-2 border-black appearance-none cursor-pointer focus:outline-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all pr-8 ${statusColors[task.status]}`}
                              >
                                <option value="TODO">TODO</option>
                                <option value="IN_PROGRESS">IN PROGRESS</option>
                                <option value="DONE">DONE</option>
                              </select>
                              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-black">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap border-r-4 border-black">
                            <div className="inline-block bg-white border-2 border-black px-3 py-1 text-sm font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                              {task.assignedTo?.name || <span className="opacity-50">UNASSIGNED</span>}
                            </div>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap text-right">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleDelete(task.id);
                              }}
                              className="inline-flex items-center justify-center bg-[#FF6B6B] border-2 border-black p-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all focus:outline-none"
                              title="Delete Task"
                            >
                              <Trash2 className="h-5 w-5 stroke-[3] text-black pointer-events-none" />
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white border-4 border-black w-full max-w-md shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
              <div className="bg-[#FF90E8] border-b-4 border-black px-4 py-3 flex justify-between items-center">
                <h2 className="text-xl font-black uppercase tracking-widest text-black">NEW TASK</h2>
                <button onClick={() => setIsModalOpen(false)} className="bg-white border-2 border-black p-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all focus:outline-none">
                  <X className="h-5 w-5 stroke-[3] text-black" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 bg-[#FFFDF9]">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-black text-black mb-2 uppercase">
                      <span className="bg-[#00E5FF] px-1 border border-black">TASK TITLE</span>
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => { setTitle(e.target.value); setValidationErrors({}); }}
                      className={`w-full px-4 py-3 bg-white text-black text-lg font-bold border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all ${validationErrors.title ? 'bg-red-100' : ''}`}
                      placeholder="ENTER TASK TITLE..."
                    />
                    {validationErrors.title && <p className="text-[#FF6B6B] font-black text-sm mt-2 uppercase">{validationErrors.title}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-black text-black mb-2 uppercase">
                      <span className="bg-[#FFC900] px-1 border border-black">DESCRIPTION (OPTIONAL)</span>
                    </label>
                    <textarea
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-4 py-3 bg-white text-black text-base font-bold border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all resize-none"
                      placeholder="TASK DETAILS..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-black text-black mb-2 uppercase">
                      <span className="bg-white px-1 border border-black">STATUS</span>
                    </label>
                    <div className="relative">
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value as any)}
                        className="w-full px-4 py-3 bg-white text-black text-lg font-bold border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all appearance-none"
                      >
                        <option value="TODO">TODO</option>
                        <option value="IN_PROGRESS">IN PROGRESS</option>
                        <option value="DONE">DONE</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-black">
                        <svg className="fill-current h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-8 flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-2 bg-white border-2 border-black text-base font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all focus:outline-none"
                  >
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !!validationErrors.title}
                    className="px-6 py-2 bg-[#00E5FF] border-2 border-black text-base font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 focus:outline-none"
                  >
                    {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin stroke-[3]" /> : null}
                    <span>{isSubmitting ? 'SAVING...' : 'CREATE TASK'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {/* Delete Confirmation Modal */}
        {deleteTaskId && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white border-4 border-black w-full max-w-sm shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
              <div className="bg-[#FF6B6B] border-b-4 border-black px-4 py-3 flex justify-between items-center">
                <h2 className="text-xl font-black uppercase tracking-widest text-black">CONFIRM DELETE</h2>
                <button onClick={() => setDeleteTaskId(null)} className="bg-white border-2 border-black p-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all focus:outline-none">
                  <X className="h-5 w-5 stroke-[3] text-black" />
                </button>
              </div>
              <div className="p-6 bg-[#FFFDF9]">
                <p className="text-lg font-black uppercase text-black mb-8 text-center bg-[#FFC900] border-2 border-black p-3">
                  WARNING: THIS WILL DELETE THE TASK PERMANENTLY. CONTINUE?
                </p>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => setDeleteTaskId(null)}
                    className="px-6 py-2 bg-white border-2 border-black text-base font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all focus:outline-none"
                  >
                    CANCEL
                  </button>
                  <button
                    onClick={confirmDelete}
                    disabled={isDeleting}
                    className="px-6 py-2 bg-[#FF6B6B] border-2 border-black text-base font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 focus:outline-none"
                  >
                    {isDeleting ? <Loader2 className="h-5 w-5 animate-spin stroke-[3]" /> : <Trash2 className="h-5 w-5 stroke-[3]" />}
                    <span>{isDeleting ? 'DELETING...' : 'DELETE'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </DashboardLayout>
    </ProtectedRoute>
  );
}
