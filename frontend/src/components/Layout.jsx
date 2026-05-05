import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { LayoutDashboard, FolderKanban, LogOut, Menu, X, Layers } from 'lucide-react';
import { useState } from 'react';

const Layout = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navLinks = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Projects', path: '/projects', icon: <FolderKanban size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 flex flex-col md:flex-row font-sans">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-slate-800 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <Layers className="text-indigo-500" size={24} />
          <div className="text-xl font-bold text-indigo-400">TaskStack</div>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-300">
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-slate-800 border-r border-slate-700 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:flex md:flex-col
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="hidden md:flex p-6 border-b border-slate-700 items-center gap-3">
          <Layers className="text-indigo-500" size={32} />
          <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">TaskStack</div>
        </div>
        
        <div className="p-4 flex flex-col flex-1">
          <nav className="space-y-2 flex-1 mt-4 md:mt-0">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                  location.pathname === link.path 
                    ? 'bg-indigo-600 text-white' 
                    : 'text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                }`}
              >
                {link.icon}
                <span className="font-medium">{link.name}</span>
              </Link>
            ))}
          </nav>
          
          <div className="mt-auto border-t border-slate-700 pt-4">
            <div className="flex items-center px-4 py-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold mr-3">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium text-slate-200">{user?.name}</p>
                <p className="text-xs text-slate-400 capitalize">{user?.role}</p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-slate-400 hover:bg-slate-700 hover:text-red-400 transition-colors duration-200"
            >
              <LogOut size={20} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-900 p-6 md:p-8">
          <Outlet />
        </main>
      </div>
      
      {/* Overlay for mobile sidebar */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default Layout;
