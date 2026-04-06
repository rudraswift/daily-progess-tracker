import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogOut } from 'lucide-react';
import TaskCard from '../components/TaskCard';
import useGreeting from '../hooks/useGreeting';
import { APP_CONFIG } from '../config/constants';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Fetch dynamic typed greeting and accurate time-based motivation internally
  const { greeting, motivation } = useGreeting();

  useEffect(() => {
    fetch('http://localhost:5000/api/tasks?all=true', {
       headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => res.json())
      .then(data => {
        setTasks(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const toggleTaskStatus = async (id) => {
    const task = tasks.find(t => t._id === id);
    if (!task) return;
    
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    
    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      const updatedTask = await response.json();
      setTasks(tasks.map(t => t._id === id ? updatedTask : t));
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTask = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        setTasks(tasks.filter(t => t._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Safe Timezone filtering
  const isToday = (dateString) => {
    const taskDate = new Date(dateString);
    const today = new Date();
    return taskDate.getDate() === today.getDate() &&
           taskDate.getMonth() === today.getMonth() &&
           taskDate.getFullYear() === today.getFullYear();
  };

  const timingOrder = { "morning": 1, "afternoon": 2, "evening": 3, "anytime": 4 };
  const getTimingRank = (task) => timingOrder[task.timeSection] || 4;

  const todaysTasks = tasks
    .filter(t => t.date && isToday(t.date))
    .sort((a, b) => getTimingRank(a) - getTimingRank(b));

  const upcomingTasks = tasks
    .filter(t => t.date && !isToday(t.date))
    .sort((a, b) => {
      // Sort primarily by Date (day level)
      const dateA = new Date(a.date).setHours(0,0,0,0);
      const dateB = new Date(b.date).setHours(0,0,0,0);
      if (dateA !== dateB) return dateA - dateB;
      
      // Secondary sort by Time Section
      return getTimingRank(a) - getTimingRank(b);
    });

  // Progress should conceptually track Today's momentum
  const completedCount = todaysTasks.filter(t => t.status === 'completed').length;
  const progress = todaysTasks.length > 0 ? Math.round((completedCount / todaysTasks.length) * 100) : 0;

  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to sign out from your session?")) {
      logout();
      alert("Logged out successfully");
      navigate('/login');
    }
  };

  return (
    <div className="flex flex-col gap-8" style={{ maxWidth: '900px', margin: '0 auto' }}>
      
      {/* Top Actions Navbar area */}
      <div className="flex justify-end items-center">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 bg-white hover:bg-red-50 text-slate-600 hover:text-red-600 border border-slate-200 hover:border-red-200 px-4 py-2.5 rounded-xl text-sm font-bold transition-all shadow-[0_2px_10px_rgb(0,0,0,0.02)]"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>

      {/* Hero Section: Momentum Tracker */}
      <section className="section-bucket flex justify-between items-center relative overflow-hidden">
        <div className="animate-fade-in-up relative z-10 z-[1] min-h-[5rem]">
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', textWrap: 'preserve' }} className="font-display">
            {greeting}
            <span className="hidden opacity-0">|</span>
          </h1>
          <p className="text-on-surface-variant font-medium text-lg leading-relaxed">{motivation}</p>
          <p className="text-slate-400 font-medium text-sm mt-1">You have {todaysTasks.length - completedCount} tasks left for today.</p>
        </div>
        
        {/* Radial Progress */}
        <div style={{ position: 'relative', width: '120px', height: '120px' }}>
          <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%' }}>
            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="var(--color-surface-container-highest)" strokeWidth="3" />
            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="var(--color-primary)" strokeWidth="3" strokeDasharray={`${progress}, 100`} style={{ transition: 'stroke-dasharray 0.5s ease' }} />
          </svg>
          <div className="display-num" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-primary)' }}>
            {progress}%
          </div>
        </div>
      </section>

      {/* Today's Tasks List */}
      <section>
        <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem' }}>Today's Tasks</h2>
        </div>

        {loading ? (
          <p>Loading tasks...</p>
        ) : todaysTasks.length > 0 ? (
          <div className="flex flex-col gap-4">
            {todaysTasks.map(task => (
              <TaskCard key={task._id} task={task} onToggleStatus={toggleTaskStatus} onDelete={deleteTask} />
            ))}
          </div>
        ) : (
          <div className="section-bucket" style={{ textAlign: 'center', opacity: 0.7 }}>
            <p>No tasks for today. Stay {APP_CONFIG.appName.toLowerCase()}.</p>
          </div>
        )}
      </section>

      {/* Upcoming Tasks List */}
      {upcomingTasks.length > 0 && (
        <section className="mt-4 border-t border-slate-200 pt-8 border-dashed">
          <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.5rem' }} className="text-slate-500">Upcoming Tasks</h2>
          </div>
          <div className="flex flex-col gap-4 opacity-80 hover:opacity-100 transition-opacity">
            {upcomingTasks.map(task => (
              <TaskCard key={task._id} task={task} onToggleStatus={toggleTaskStatus} onDelete={deleteTask} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Dashboard;
