import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useProjectStore from '../store/projectStore';
import useAuthStore from '../store/authStore';
import { Plus, Users, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';

const Projects = () => {
  const { user } = useAuthStore();
  const { projects, fetchProjects, isLoading, createProject } = useProjectStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '' });

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      await createProject(newProject);
      setIsModalOpen(false);
      setNewProject({ name: '', description: '' });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Projects</h1>
          <p className="text-slate-400">Manage your team's projects and workflows.</p>
        </div>
        {user?.role === 'admin' && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <Plus size={20} />
            <span>New Project</span>
          </button>
        )}
      </header>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-16 bg-slate-800 rounded-xl border border-slate-700">
          <div className="mx-auto w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mb-4">
            <Users className="text-slate-400" size={24} />
          </div>
          <h3 className="text-xl font-medium text-slate-200 mb-2">No projects yet</h3>
          <p className="text-slate-400 max-w-sm mx-auto mb-6">
            {user?.role === 'admin' 
              ? "Get started by creating a new project for your team."
              : "You haven't been assigned to any projects yet."}
          </p>
          {user?.role === 'admin' && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
            >
              <Plus size={20} />
              <span>Create Project</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project._id} className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden hover:border-indigo-500/50 transition-colors flex flex-col">
              <div className="p-6 flex-1">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-slate-100">{project.name}</h3>
                  <span className="text-xs font-medium bg-slate-700 text-slate-300 px-2.5 py-1 rounded-full">
                    {project.members.length} {project.members.length === 1 ? 'member' : 'members'}
                  </span>
                </div>
                <p className="text-slate-400 text-sm line-clamp-3 mb-4">{project.description}</p>
                
                <div className="text-xs text-slate-500 mt-auto">
                  Created {format(new Date(project.createdAt), 'MMM d, yyyy')}
                </div>
              </div>
              <div className="bg-slate-900/50 p-4 border-t border-slate-700">
                <Link 
                  to={`/projects/${project._id}`}
                  className="flex items-center justify-center gap-2 w-full bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
                >
                  View Details <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl w-full max-w-md overflow-hidden border border-slate-700 shadow-2xl">
            <div className="p-6 border-b border-slate-700 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Create New Project</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                &times;
              </button>
            </div>
            <div className="p-6">
              <form onSubmit={handleCreateProject} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1" htmlFor="name">
                    Project Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={newProject.name}
                    onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    placeholder="E.g., Website Redesign"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1" htmlFor="description">
                    Description
                  </label>
                  <textarea
                    id="description"
                    required
                    rows={3}
                    value={newProject.description}
                    onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
                    placeholder="Briefly describe the project..."
                  />
                </div>
                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-2.5 px-4 rounded-lg bg-slate-700 text-slate-300 font-medium hover:bg-slate-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 px-4 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-500 transition-colors"
                  >
                    Create
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
