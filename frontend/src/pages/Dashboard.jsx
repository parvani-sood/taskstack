import { useEffect } from 'react';
import useTaskStore from '../store/taskStore';
import useAuthStore from '../store/authStore';
import { CheckCircle2, CircleDashed, Clock, CalendarIcon } from 'lucide-react';
import { format, isPast, isToday } from 'date-fns';

const Dashboard = () => {
  const { user } = useAuthStore();
  const { tasks, fetchTasks, isLoading, updateTaskStatus } = useTaskStore();

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const todoTasks = tasks.filter(t => t.status === 'todo');
  const inProgressTasks = tasks.filter(t => t.status === 'in-progress');
  const doneTasks = tasks.filter(t => t.status === 'done');
  
  const overdueTasks = tasks.filter(t => t.status !== 'done' && isPast(new Date(t.dueDate)) && !isToday(new Date(t.dueDate)));

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await updateTaskStatus(taskId, newStatus);
    } catch (error) {
      console.error(error);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'todo': return <CircleDashed className="text-slate-400" size={18} />;
      case 'in-progress': return <Clock className="text-indigo-400" size={18} />;
      case 'done': return <CheckCircle2 className="text-emerald-400" size={18} />;
      default: return null;
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

  const formatDueDate = (dateString) => {
    const date = new Date(dateString);
    if (isToday(date)) return 'Today';
    return format(date, 'MMM d, yyyy');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {user?.name.split(' ')[0]} 👋</h1>
        <p className="text-slate-400">Here's an overview of your tasks.</p>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-800 rounded-xl p-5 border border-slate-700 shadow-sm flex flex-col">
          <div className="text-slate-400 text-sm font-medium mb-2">Total Tasks</div>
          <div className="text-3xl font-bold text-white">{tasks.length}</div>
        </div>
        <div className="bg-slate-800 rounded-xl p-5 border border-slate-700 shadow-sm flex flex-col">
          <div className="text-slate-400 text-sm font-medium mb-2 flex items-center gap-2">
            <CircleDashed size={16} /> To Do
          </div>
          <div className="text-3xl font-bold text-slate-300">{todoTasks.length}</div>
        </div>
        <div className="bg-slate-800 rounded-xl p-5 border border-slate-700 shadow-sm flex flex-col">
          <div className="text-indigo-400 text-sm font-medium mb-2 flex items-center gap-2">
            <Clock size={16} /> In Progress
          </div>
          <div className="text-3xl font-bold text-indigo-300">{inProgressTasks.length}</div>
        </div>
        <div className="bg-slate-800 rounded-xl p-5 border border-slate-700 shadow-sm flex flex-col">
          <div className="text-emerald-400 text-sm font-medium mb-2 flex items-center gap-2">
            <CheckCircle2 size={16} /> Done
          </div>
          <div className="text-3xl font-bold text-emerald-300">{doneTasks.length}</div>
        </div>
      </div>

      {overdueTasks.length > 0 && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5 mb-8">
          <h3 className="text-red-400 font-semibold mb-3 flex items-center gap-2">
            <CalendarIcon size={18} /> You have {overdueTasks.length} overdue {overdueTasks.length === 1 ? 'task' : 'tasks'}
          </h3>
          <div className="space-y-2">
            {overdueTasks.map(task => (
              <div key={task._id} className="flex justify-between items-center bg-slate-900/50 p-3 rounded-lg border border-red-500/20">
                <div className="font-medium text-slate-200">{task.title}</div>
                <div className="text-sm text-red-400">{formatDueDate(task.dueDate)}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Task List */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">Your Tasks</h2>
        {tasks.length === 0 ? (
          <div className="text-center py-12 bg-slate-800 rounded-xl border border-slate-700">
            <CheckCircle2 className="mx-auto h-12 w-12 text-slate-500 mb-3" />
            <p className="text-slate-400">No tasks assigned to you right now.</p>
          </div>
        ) : (
          <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
            <ul className="divide-y divide-slate-700/50">
              {tasks.map(task => (
                <li key={task._id} className="p-4 sm:p-5 hover:bg-slate-750 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadgeClass(task.status)}`}>
                          {task.status.replace('-', ' ').toUpperCase()}
                        </span>
                        <span className="text-sm text-slate-400 flex items-center gap-1.5">
                          <CalendarIcon size={14} />
                          <span className={isPast(new Date(task.dueDate)) && !isToday(new Date(task.dueDate)) && task.status !== 'done' ? 'text-red-400 font-medium' : ''}>
                            {formatDueDate(task.dueDate)}
                          </span>
                        </span>
                      </div>
                      <h3 className={`text-lg font-medium truncate ${task.status === 'done' ? 'text-slate-500 line-through' : 'text-slate-100'}`}>
                        {task.title}
                      </h3>
                      <p className="text-slate-400 text-sm mt-1 line-clamp-2">{task.description}</p>
                      
                      {task.projectId && (
                        <div className="mt-3 text-xs font-medium text-indigo-400 bg-indigo-900/20 inline-block px-2 py-1 rounded">
                          Project: {task.projectId.name}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-shrink-0 ml-4">
                      <select
                        value={task.status}
                        onChange={(e) => handleStatusChange(task._id, e.target.value)}
                        className="bg-slate-900 border border-slate-700 text-slate-300 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2"
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
    </div>
  );
};

export default Dashboard;
