import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import useProjectStore from '../store/projectStore';
import useTaskStore from '../store/taskStore';
import useAuthStore from '../store/authStore';
import api from '../api/axios';
import { ArrowLeft, Plus, CalendarIcon, Users, UserPlus } from 'lucide-react';
import { format } from 'date-fns';

const ProjectDetails = () => {
  const { id } = useParams();
  const { user } = useAuthStore();
  const { currentProject, fetchProjectById, updateProjectMembers, isLoading: isProjectLoading } = useProjectStore();
  const { projectTasks, fetchTasksByProject, createTask, updateTaskStatus, isLoading: isTasksLoading } = useTaskStore();
  
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: '',
    assignedTo: ''
  });

  const [selectedMember, setSelectedMember] = useState('');

  useEffect(() => {
    fetchProjectById(id);
    fetchTasksByProject(id);
  }, [id, fetchProjectById, fetchTasksByProject]);

  useEffect(() => {
    if (user.role === 'admin') {
      const fetchUsers = async () => {
        try {
          const res = await api.get('/auth/users');
          setAllUsers(res.data);
        } catch (err) {
          console.error(err);
        }
      };
      fetchUsers();
    }
  }, [user.role]);

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!selectedMember) return;
    
    if (currentProject.members.some(m => m._id === selectedMember)) {
      return;
    }
    
    try {
      const newMemberIds = [...currentProject.members.map(m => m._id), selectedMember];
      await updateProjectMembers(id, newMemberIds);
      setSelectedMember('');
      setIsMemberModalOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await createTask({ ...newTask, projectId: id });
      setIsTaskModalOpen(false);
      setNewTask({ title: '', description: '', dueDate: '', assignedTo: '' });
    } catch (error) {
      console.error(error);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await updateTaskStatus(taskId, newStatus);
    } catch (error) {
      console.error(error);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'todo': return 'bg-slate-700/50 text-slate-300 border-slate-600';
      case 'in-progress': return 'bg-indigo-900/30 text-indigo-300 border-indigo-700/50';
      case 'done': return 'bg-emerald-900/30 text-emerald-300 border-emerald-700/50';
      default: return 'bg-slate-700 text-slate-300';
    }
  };

  if (isProjectLoading || !currentProject) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <Link to="/projects" className="inline-flex items-center text-indigo-400 hover:text-indigo-300 font-medium text-sm mb-2 transition-colors">
        <ArrowLeft size={16} className="mr-1" /> Back to Projects
      </Link>
      
      <header className="bg-slate-800 rounded-xl p-6 md:p-8 border border-slate-700">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">{currentProject.name}</h1>
            <p className="text-slate-400 max-w-2xl">{currentProject.description}</p>
          </div>
          
          <div className="flex gap-3 mt-4 md:mt-0">
            {user?.role === 'admin' && (
              <>
                <button
                  onClick={() => setIsMemberModalOpen(true)}
                  className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  <UserPlus size={18} />
                  <span>Members</span>
                </button>
                <button
                  onClick={() => setIsTaskModalOpen(true)}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  <Plus size={18} />
                  <span>Add Task</span>
                </button>
              </>
            )}
          </div>
        </div>
        
        <div className="mt-8 flex items-center gap-2 text-sm text-slate-300">
          <Users size={18} className="text-slate-500" />
          <span className="font-medium text-slate-200">Team:</span>
          <div className="flex -space-x-2 overflow-hidden ml-2">
            {currentProject.members.map((member, i) => (
              <div 
                key={member._id} 
                className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-800 bg-indigo-500 flex items-center justify-center text-white text-xs font-bold"
                title={member.name}
              >
                {member.name.charAt(0).toUpperCase()}
              </div>
            ))}
          </div>
        </div>
      </header>

      <div className="mt-8">
        <h2 className="text-xl font-bold text-white mb-4">Project Tasks</h2>
        
        {isTasksLoading ? (
           <div className="flex justify-center py-8">
             <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-indigo-500"></div>
           </div>
        ) : projectTasks.length === 0 ? (
          <div className="text-center py-12 bg-slate-800 rounded-xl border border-slate-700">
            <p className="text-slate-400">No tasks created for this project yet.</p>
          </div>
        ) : (
          <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
            <ul className="divide-y divide-slate-700/50">
              {projectTasks.map(task => (
                <li key={task._id} className="p-4 sm:p-5 hover:bg-slate-750 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadgeClass(task.status)}`}>
                          {task.status.replace('-', ' ').toUpperCase()}
                        </span>
                      </div>
                      <h3 className={`text-lg font-medium ${task.status === 'done' ? 'text-slate-500 line-through' : 'text-slate-100'}`}>
                        {task.title}
                      </h3>
                      <p className="text-slate-400 text-sm mt-1">{task.description}</p>
                      
                      <div className="mt-3 flex items-center gap-4 text-xs">
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <CalendarIcon size={14} />
                          <span>Due: {format(new Date(task.dueDate), 'MMM d, yyyy')}</span>
                        </div>
                        {task.assignedTo && (
                          <div className="flex items-center gap-1.5 text-slate-400">
                            <Users size={14} />
                            <span>Assigned: <span className="text-slate-300 font-medium">{task.assignedTo.name}</span></span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex-shrink-0">
                      <select
                        value={task.status}
                        onChange={(e) => handleStatusChange(task._id, e.target.value)}
                        disabled={user.role !== 'admin' && task.assignedTo?._id !== user._id}
                        className="bg-slate-900 border border-slate-700 text-slate-300 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <option value="todo">To Do</option>
                        <option value="in-progress">In Progress</option>
                        <option value="done">Done</option>
                      </select>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Create Task Modal */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl w-full max-w-md overflow-hidden border border-slate-700 shadow-2xl">
            <div className="p-6 border-b border-slate-700 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Add New Task</h2>
              <button 
                onClick={() => setIsTaskModalOpen(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                &times;
              </button>
            </div>
            <div className="p-6">
              <form onSubmit={handleCreateTask} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1" htmlFor="title">
                    Task Title
                  </label>
                  <input
                    id="title"
                    type="text"
                    required
                    value={newTask.title}
                    onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
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
                    value={newTask.description}
                    onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1" htmlFor="dueDate">
                      Due Date
                    </label>
                    <input
                      id="dueDate"
                      type="date"
                      required
                      value={newTask.dueDate}
                      onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                      className="w-full px-4 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none [color-scheme:dark]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1" htmlFor="assignedTo">
                      Assign To
                    </label>
                    <select
                      id="assignedTo"
                      value={newTask.assignedTo}
                      onChange={(e) => setNewTask({...newTask, assignedTo: e.target.value})}
                      className="w-full px-4 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    >
                      <option value="">Unassigned</option>
                      {currentProject.members.map(member => (
                        <option key={member._id} value={member._id}>{member.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsTaskModalOpen(false)}
                    className="flex-1 py-2.5 px-4 rounded-lg bg-slate-700 text-slate-300 font-medium hover:bg-slate-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 px-4 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-500 transition-colors"
                  >
                    Create Task
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {/* Manage Members Modal */}
      {isMemberModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl w-full max-w-md overflow-hidden border border-slate-700 shadow-2xl">
            <div className="p-6 border-b border-slate-700 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Add Team Member</h2>
              <button 
                onClick={() => setIsMemberModalOpen(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                &times;
              </button>
            </div>
            <div className="p-6">
              <form onSubmit={handleAddMember} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1" htmlFor="member">
                    Select User
                  </label>
                  <select
                    id="member"
                    required
                    value={selectedMember}
                    onChange={(e) => setSelectedMember(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="">Choose a user...</option>
                    {allUsers
                      .filter(u => !currentProject.members.some(m => m._id === u._id))
                      .map(u => (
                        <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
                    ))}
                  </select>
                </div>
                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsMemberModalOpen(false)}
                    className="flex-1 py-2.5 px-4 rounded-lg bg-slate-700 text-slate-300 font-medium hover:bg-slate-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 px-4 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-500 transition-colors"
                  >
                    Add Member
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

export default ProjectDetails;
