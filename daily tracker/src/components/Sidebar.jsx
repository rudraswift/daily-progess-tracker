import React, { useState, useContext } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, BarChart2, CalendarDays, Plus, FileText, Menu, LogOut, User as UserIcon } from 'lucide-react';
import NewTaskModal from './NewTaskModal';
import ThemeToggle from './ThemeToggle';
import { AuthContext } from '../context/AuthContext';
import { APP_CONFIG } from '../config/constants';
import logo from '../assets/mindful.png';

const Sidebar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  const { user, logout } = useContext(AuthContext);

  // Do not render Sidebar on Auth pages or if unauthenticated
  if (!user || location.pathname === '/login' || location.pathname === '/signup') return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { name: 'Analytics & Heatmap', icon: BarChart2, path: '/analytics' },
    { name: 'Daily Report', icon: FileText, path: '/report' },
    { name: 'History', icon: CalendarDays, path: '/history' },
  ];

  return (
    <>
      <aside className="w-64 shrink-0 h-screen flex flex-col gap-8 px-6 py-8 border-r border-slate-200 glass-panel z-10 transition-all duration-300 relative group/sidebar">
        
        {/* App Logo Section & Theme Toggle */}
        <div className="flex items-center justify-between px-1 w-full animate-fade-in-up">
          <div className="flex items-center gap-3 group cursor-pointer">
            <img 
              src={logo} 
              alt="Mindful Logo" 
              className="h-10 w-10 sm:h-12 sm:w-12 object-contain transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-0.5 drop-shadow-sm" 
            />
            <h2 className="text-[1.35rem] font-bold tracking-tight text-slate-800 dark:text-slate-100 transition-colors duration-300 group-hover:text-primary">
              {APP_CONFIG.appName}
            </h2>
          </div>
          <ThemeToggle />
        </div>

        <nav className="flex flex-col gap-2">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '0.875rem 1rem',
                textDecoration: 'none',
                borderRadius: '1rem',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? 'var(--color-primary)' : 'var(--color-on-surface-variant)',
                backgroundColor: isActive ? 'var(--color-surface-container-high)' : 'transparent',
                transition: 'all 0.2s'
              })}
            >
              <item.icon size={20} />
              {item.name}
            </NavLink>
          ))}
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full mt-6 bg-primary text-on-primary py-3 rounded-full font-bold shadow-ambient flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform"
          >
            <Plus size={20} />
            New Task
          </button>
        </nav>
        
        {/* User Profile & Logout Bottom Anchor */}
        <div className="mt-8 border-t border-outline-variant/30 pt-4 pb-2">
          <div className="flex items-center gap-3 px-4 py-2 text-on-surface-variant bg-surface-container-low rounded-xl mb-3 glass-panel">
            <div className="bg-primary/20 p-2 rounded-lg text-primary">
               <UserIcon size={18} />
            </div>
            <div className="flex flex-col text-sm truncate">
               <span className="font-bold text-on-surface truncate">{user.name}</span>
               <span className="text-xs truncate">{user.email}</span>
            </div>
          </div>
          
          <button 
             onClick={handleLogout}
             className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all text-error hover:bg-error/10 hover:text-error"
          >
             <LogOut size={20} />
             Logout
          </button>
        </div>

      </aside>
      
      <NewTaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default Sidebar;
