import React, { useEffect, useState } from 'react';
import TaskCard from '../components/TaskCard';
import { Calendar as CalendarIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { API_BASE_URL } from '../config/constants';

const History = () => {
  // Initialize to yesterday since Dashboard already handles Today
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const [selectedDate, setSelectedDate] = useState(yesterday.toISOString().split('T')[0]);
  
  const [historyTasks, setHistoryTasks] = useState([]);
  const [todayTasks, setTodayTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Parallel fetch History Data & Today's Data for fluid comparison
    const fetchData = async () => {
      setLoading(true);
      try {
        const [histRes, todayRes] = await Promise.all([
          // The selected date triggers the exact start/end bounds on the backend
          fetch(`${API_BASE_URL}/api/tasks?date=${selectedDate}`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
          }),
          // Defaults to Today
          fetch(`${API_BASE_URL}/api/tasks`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
          }) 
        ]);
        
        const histData = await histRes.json();
        const todayData = await todayRes.json();
        
        setHistoryTasks(histData);
        setTodayTasks(todayData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [selectedDate]);

  const toggleTaskStatus = async (id) => {
    // 2. Allow users to checkoff past missed tasks
    const task = historyTasks.find(t => t._id === id);
    if (!task) return;
    
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      const updatedTask = await response.json();
      setHistoryTasks(historyTasks.map(t => t._id === id ? updatedTask : t));
    } catch (err) {
      console.error(err);
    }
  };

  const calcCompletionRate = (tasksArr) => {
    if (tasksArr.length === 0) return 0;
    const completed = tasksArr.filter(t => t.status === 'completed').length;
    return Math.round((completed / tasksArr.length) * 100);
  };

  const histRate = calcCompletionRate(historyTasks);
  const todayRate = calcCompletionRate(todayTasks);
  
  // 3. Dynamic Delta: compares present completion momentum against the historical moment
  const diff = todayRate - histRate;

  return (
    <div className="flex flex-col gap-8" style={{ maxWidth: '900px', margin: '0 auto' }}>
      
      {/* Title & Date Picker */}
      <section className="flex justify-between items-center section-bucket">
        <div>
           <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Time Capsule</h1>
           <p className="text-on-surface-variant" style={{ fontSize: '1.25rem' }}>Reflect on your past momentum.</p>
        </div>
        
        <div className="flex flex-col gap-2 relative">
          <label className="text-on-surface-variant flex items-center gap-2 font-body" style={{ fontWeight: 600, fontSize: '0.875rem' }}>
            <CalendarIcon size={16} /> Select Date
          </label>
          <input 
            type="date" 
            className="ghost-input" 
            value={selectedDate} 
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{ width: 'auto', fontSize: '1.125rem', padding: '0.75rem 1rem', cursor: 'pointer' }}
          />
        </div>
      </section>

      {/* Progress Comparison Dashboards */}
      {!loading && (
        <section className="flex gap-4 flex-col md:flex-row">
          
          <div className="section-bucket flex-1 flex flex-col justify-center gap-2 relative overflow-hidden" style={{ minHeight: '140px' }}>
            <div style={{ position: 'absolute', top: '-10%', right: '-10%', opacity: 0.05, transform: 'scale(1.5)', pointerEvents: 'none' }}>
               {diff > 0 ? <TrendingUp size={120} /> : diff < 0 ? <TrendingDown size={120} /> : <Minus size={120} />}
            </div>
            
            <h2 className="text-on-surface-variant" style={{ fontSize: '1rem', fontWeight: 600 }}>Performance Delta</h2>
            
            <div className="flex items-center gap-4">
              <span className="display-num" style={{ fontSize: '3rem', color: diff > 0 ? 'var(--color-primary)' : diff < 0 ? 'var(--color-error, #a8364b)' : 'var(--color-on-surface-variant)' }}>
                {diff > 0 ? `+${diff}%` : diff < 0 ? `${diff}%` : `${diff}%`}
              </span>
            </div>
            
            <p className="text-on-surface-variant" style={{ fontSize: '0.875rem', zIndex: 1, position: 'relative' }}>
              {diff > 0 ? "You're more productive today than on this selected date! Keep it up!" : 
               diff < 0 ? "You completed more tasks on this past date. Time to lock in!" : 
               "Your momentum is perfectly matched between both days."}
            </p>
          </div>
          
          <div className="section-bucket flex-1 flex flex-col gap-4">
            <h2 className="text-on-surface-variant" style={{ fontSize: '1rem', fontWeight: 600 }}>Baseline Breakdown</h2>
            <div className="flex justify-between items-center" style={{ backgroundColor: 'var(--color-surface-container-lowest)', padding: '1rem', borderRadius: '1rem' }}>
               <span className="text-on-surface-variant">Selected Date Rate</span>
               <span className="display-num font-bold" style={{ fontSize: '1.5rem', color: 'var(--color-on-surface-variant)' }}>{histRate}%</span>
            </div>
             <div className="flex justify-between items-center highlight-border" style={{ backgroundColor: 'var(--color-surface-container-lowest)', padding: '1rem', borderRadius: '1rem', borderLeft: '4px solid var(--color-primary)' }}>
               <span className="text-on-surface font-bold">Today's Rate</span>
               <span className="display-num font-bold" style={{ fontSize: '1.5rem', color: 'var(--color-primary)' }}>{todayRate}%</span>
            </div>
          </div>

        </section>
      )}

      {/* Historic Data List */}
      <section>
        <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem' }}>Historical Tasks</h2>
        </div>

        {loading ? (
          <p className="text-on-surface-variant">Loading historical archives...</p>
        ) : historyTasks.length > 0 ? (
          <div className="flex flex-col gap-4">
            {historyTasks.map(task => (
              <TaskCard 
                key={task._id} 
                task={task} 
                onToggleStatus={toggleTaskStatus} 
                onDelete={() => {}} // Disabled explicit deletions in history
              />
            ))}
          </div>
        ) : (
          <div className="section-bucket flex items-center justify-center flex-col gap-2" style={{ padding: '4rem', textAlign: 'center', opacity: 0.7 }}>
            <CalendarIcon size={32} style={{ color: 'var(--color-on-surface-variant)' }} />
            <p>No tasks found for this date. A clean slate.</p>
          </div>
        )}
      </section>

    </div>
  );
};

export default History;
