'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import ProtectedRoute from '../../components/ProtectedRoute';
import DashboardLayout from '../../components/DashboardLayout';
import { useToast } from '../../context/ToastContext';
import { getErrorMessage } from '../../lib/errorHandler';
import api from '../../lib/api';
import { Project } from '../../types';
import { useRouter } from 'next/navigation';
import { Trash2, Edit2, Loader2, FolderKanban, Plus, X } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{name?: string}>({});

  // Delete modal state
  const [deleteProjectId, setDeleteProjectId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, [user]);

  const fetchProjects = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const url = user.role === 'ADMIN' ? '/projects/admin/all' : '/projects';
      const res = await api.get<Project[]>(url);
      setProjects(res.data);
    } catch (err) {
      showToast(getErrorMessage(err), 'error');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (project?: Project) => {
    if (project) {
      setEditingId(project.id);
      setName(project.name);
      setDescription(project.description || '');
    } else {
      setEditingId(null);
      setName('');
      setDescription('');
    }
    setValidationErrors({});
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setName('');
    setDescription('');
    setEditingId(null);
    setValidationErrors({});
  };

  const validate = () => {
    const errors: {name?: string} = {};
    if (!name.trim() || name.trim().length < 2) {
      errors.name = 'PROJECT NAME MUST BE AT LEAST 2 CHARACTERS.';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsSubmitting(true);
    try {
      if (editingId) {
        await api.put(`/projects/${editingId}`, { name, description });
        showToast('Project updated successfully.', 'success');
      } else {
        await api.post('/projects', { name, description });
        showToast('Project created successfully.', 'success');
      }
      await fetchProjects();
      closeModal();
    } catch (err) {
      showToast(getErrorMessage(err), 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDeleteProjectId(id);
  };

  const confirmDelete = async () => {
    if (!deleteProjectId) return;
    setIsDeleting(true);
    try {
      await api.delete(`/projects/${deleteProjectId}`);
      setProjects(projects.filter(p => p.id !== deleteProjectId));
      showToast('Project deleted successfully.', 'success');
      setDeleteProjectId(null);
    } catch (err) {
      showToast(getErrorMessage(err), 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 space-y-4 sm:space-y-0">
          <div className="bg-white border-2 border-black p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] inline-block">
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-wide">PROJECTS DIRECTORY</h1>
          </div>
          <button
            onClick={() => openModal()}
            className="group flex items-center justify-center space-x-2 bg-[#00E5FF] text-black border-2 border-black px-6 py-3 font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all focus:outline-none"
          >
            <Plus className="h-6 w-6 stroke-[3]" />
            <span>NEW PROJECT</span>
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 flex items-center space-x-4">
              <Loader2 className="h-10 w-10 text-black animate-spin stroke-[3]" />
              <span className="text-xl font-black uppercase tracking-widest">LOADING...</span>
            </div>
          </div>
        ) : projects.length === 0 ? (
          <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-12 text-center relative overflow-hidden">
            {/* Decorative tape */}
            <div className="absolute -top-4 -left-4 w-16 h-8 bg-[#FFC900]/50 rotate-[-45deg]"></div>
            <div className="absolute top-4 right-4 w-16 h-8 bg-[#00E5FF]/50 rotate-[30deg]"></div>
            
            <div className="flex justify-center mb-6">
              <div className="bg-[#FF90E8] border-2 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <FolderKanban className="h-16 w-16 text-black stroke-[2]" />
              </div>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black uppercase mb-4">EMPTY DIRECTORY</h3>
            <p className="text-lg font-bold mb-8 max-w-md mx-auto">CREATE A PROJECT TO START TRACKING TASKS.</p>
            <button
              onClick={() => openModal()}
              className="inline-flex items-center space-x-2 bg-[#FFC900] border-2 border-black text-black px-8 py-3 font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all text-lg focus:outline-none"
            >
              <Plus className="h-6 w-6 stroke-[3]" />
              <span>INITIALIZE</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <div 
                key={project.id} 
                onClick={() => router.push(`/dashboard/projects/${project.id}`)}
                className="bg-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all duration-200 p-0 flex flex-col cursor-pointer group"
              >
                {/* Title bar of the card */}
                <div className="bg-[#FFC900] border-b-4 border-black px-4 py-3 flex justify-between items-center group-hover:bg-[#FF90E8] transition-colors">
                  <div className="flex items-center space-x-3 w-full pr-2">
                    <FolderKanban className="h-6 w-6 text-black stroke-[2.5] flex-shrink-0" />
                    <h3 className="text-lg font-black uppercase truncate w-full" title={project.name}>
                      {project.name}
                    </h3>
                  </div>
                </div>
                
                <div className="p-4 flex flex-col flex-grow relative">
                  <div className="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white border-2 border-black p-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        openModal(project);
                      }}
                      className="hover:bg-[#00E5FF] p-1.5 transition-colors border-2 border-transparent hover:border-black focus:outline-none"
                      title="Edit"
                    >
                      <Edit2 className="h-4 w-4 text-black stroke-[3]" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleDelete(e, project.id)}
                      className="hover:bg-[#FF6B6B] p-1.5 transition-colors border-2 border-transparent hover:border-black focus:outline-none"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4 text-black stroke-[3]" />
                    </button>
                  </div>

                  <p className="text-sm font-bold mt-2 mb-6 line-clamp-3 leading-relaxed">
                    {project.description || <span className="italic opacity-50 bg-gray-200 px-1 font-black uppercase">NO DESCRIPTION</span>}
                  </p>
                  
                  <div className="mt-auto flex justify-between items-end pt-2">
                    <div className="bg-[#00E5FF] text-black font-black text-sm px-3 py-1.5 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      TASKS: {project._count?.tasks || 0}
                    </div>
                    <div className="text-xs font-black uppercase text-black bg-white border-2 border-black px-2 py-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      BY: {project.owner?.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white border-4 border-black w-full max-w-md shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
              {/* Modal Title bar - Reality popup style */}
              <div className="bg-[#FF6B6B] border-b-4 border-black px-4 py-3 flex justify-between items-center">
                <h2 className="text-xl font-black uppercase tracking-widest text-black">
                  {editingId ? 'EDIT_PROJECT' : 'CREATE_PROJECT'}
                </h2>
                <button onClick={closeModal} className="bg-white border-2 border-black p-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all focus:outline-none">
                  <X className="h-5 w-5 stroke-[3] text-black" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 bg-[#FFFDF9]">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-black text-black mb-2 uppercase">
                      <span className="bg-[#00E5FF] px-1 border border-black">PROJECT NAME</span>
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => { setName(e.target.value); setValidationErrors({}); }}
                      className={`w-full px-4 py-3 bg-white text-black text-lg font-bold border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all ${validationErrors.name ? 'bg-red-100' : ''}`}
                      placeholder="ENTER NAME..."
                    />
                    {validationErrors.name && <p className="text-[#FF6B6B] font-black text-sm mt-2 uppercase">{validationErrors.name}</p>}
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
                      placeholder="ENTER DETAILS..."
                    />
                  </div>
                </div>
                <div className="mt-8 flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-6 py-2 bg-white border-2 border-black text-base font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all focus:outline-none"
                  >
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !!validationErrors.name}
                    className="px-6 py-2 bg-[#00E5FF] border-2 border-black text-base font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 focus:outline-none"
                  >
                    {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin stroke-[3]" /> : null}
                    <span>{isSubmitting ? 'SAVING...' : 'CONFIRM'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {/* Delete Confirmation Modal */}
        {deleteProjectId && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white border-4 border-black w-full max-w-sm shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
              <div className="bg-[#FF6B6B] border-b-4 border-black px-4 py-3 flex justify-between items-center">
                <h2 className="text-xl font-black uppercase tracking-widest text-black">CONFIRM DELETE</h2>
                <button onClick={() => setDeleteProjectId(null)} className="bg-white border-2 border-black p-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all focus:outline-none">
                  <X className="h-5 w-5 stroke-[3] text-black" />
                </button>
              </div>
              <div className="p-6 bg-[#FFFDF9]">
                <p className="text-lg font-black uppercase text-black mb-8 text-center bg-[#FFC900] border-2 border-black p-3">
                  WARNING: THIS WILL DELETE THE PROJECT AND ALL ITS TASKS. CONTINUE?
                </p>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => setDeleteProjectId(null)}
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
