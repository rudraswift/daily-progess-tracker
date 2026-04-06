import React, { useState } from 'react';
import { Calendar, X, Clock, Tag } from 'lucide-react';

const NewTaskModal = ({ isOpen, onClose }) => {
  const getFormattedDate = (daysToAdd = 0) => {
    const d = new Date();
    d.setDate(d.getDate() + daysToAdd);
    const offset = d.getTimezoneOffset();
    const localDate = new Date(d.getTime() - (offset * 60 * 1000));
    return localDate.toISOString().split('T')[0];
  };

  const today = getFormattedDate(0);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('work');
  const [timeSection, setTimeSection] = useState('anytime');
  const [date, setDate] = useState(today);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          title,
          description,
          categoryId,
          timeSection,
          date
        }),
      });

      if (response.ok) {
        setTitle('');
        setDescription('');
        setDate(today);
        onClose();
        window.location.reload();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div 
        className="relative w-full max-w-[480px] max-h-[90vh] flex flex-col bg-white dark:bg-[#1e293b] rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up border border-slate-200 dark:border-slate-700/50"
      >
        {/* Header */}
        <div className="shrink-0 flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-700/50">
          <h2 className="text-xl font-bold tracking-tight text-[#0f172a] dark:text-[#e2e8f0]">
            Schedule Task
          </h2>
          <button 
            type="button"
            onClick={onClose}
            className="p-2 -mr-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-6 overflow-y-auto custom-scrollbar pb-8">
          {/* Title Output */}
          <div>
            <label className="block text-sm font-bold text-[#475569] dark:text-[#94a3b8] mb-2">
              Task Title <span className="text-red-500">*</span>
            </label>
            <input 
              type="text" 
              className="w-full bg-[#f1f5f9] dark:bg-[#334155] text-[#0f172a] dark:text-[#e2e8f0] px-4 py-3 rounded-xl border border-transparent focus:border-indigo-500/50 focus:bg-white dark:focus:bg-[#1e293b] focus:ring-4 focus:ring-indigo-500/10 transition-all duration-300 outline-none placeholder-slate-400 dark:placeholder-slate-500 font-medium shadow-sm"
              placeholder="What needs to be done?" 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              required 
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-bold text-[#475569] dark:text-[#94a3b8] mb-2">
              Description <span className="font-normal text-xs text-slate-400">(Optional)</span>
            </label>
            <input 
              type="text" 
              className="w-full bg-[#f1f5f9] dark:bg-[#334155] text-[#0f172a] dark:text-[#e2e8f0] px-4 py-3 rounded-xl border border-transparent focus:border-indigo-500/50 focus:bg-white dark:focus:bg-[#1e293b] focus:ring-4 focus:ring-indigo-500/10 transition-all duration-300 outline-none placeholder-slate-400 dark:placeholder-slate-500 font-medium shadow-sm"
              placeholder="Add details, links, or notes..." 
              value={description} 
              onChange={e => setDescription(e.target.value)} 
            />
          </div>

          {/* Date Picker Group */}
          <div>
             <label className="flex items-center gap-2 text-sm font-bold text-[#475569] dark:text-[#94a3b8] mb-3">
               <Calendar size={16} className="text-indigo-500"/> 
               Schedule Date
             </label>
             
             {/* Quick Select Buttons */}
             <div className="flex gap-2 mb-4">
               <button 
                 type="button" 
                 onClick={() => setDate(getFormattedDate(0))}
                 className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all duration-300 ${
                   date === getFormattedDate(0) 
                     ? 'bg-[#0f172a] dark:bg-[#e2e8f0] text-white dark:text-[#0f172a] shadow-md scale-100' 
                     : 'bg-[#f1f5f9] dark:bg-[#334155]/50 text-[#475569] dark:text-[#94a3b8] hover:bg-slate-200 dark:hover:bg-[#334155] border border-transparent dark:border-slate-600'
                 }`}
               >
                 Today
               </button>
               <button 
                 type="button" 
                 onClick={() => setDate(getFormattedDate(1))}
                 className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all duration-300 ${
                   date === getFormattedDate(1) 
                     ? 'bg-[#0f172a] dark:bg-[#e2e8f0] text-white dark:text-[#0f172a] shadow-md scale-100' 
                     : 'bg-[#f1f5f9] dark:bg-[#334155]/50 text-[#475569] dark:text-[#94a3b8] hover:bg-slate-200 dark:hover:bg-[#334155] border border-transparent dark:border-slate-600'
                 }`}
               >
                 Tomorrow
               </button>
               <button 
                 type="button" 
                 onClick={() => setDate(getFormattedDate(2))}
                 className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all duration-300 ${
                   date === getFormattedDate(2) 
                     ? 'bg-[#0f172a] dark:bg-[#e2e8f0] text-white dark:text-[#0f172a] shadow-md scale-100' 
                     : 'bg-[#f1f5f9] dark:bg-[#334155]/50 text-[#475569] dark:text-[#94a3b8] hover:bg-slate-200 dark:hover:bg-[#334155] border border-transparent dark:border-slate-600'
                 }`}
               >
                 +2 Days
               </button>
             </div>

             {/* Native HTML5 Calendar */}
             <input 
               type="date"
               min={today}
               value={date}
               onChange={(e) => setDate(e.target.value)}
               className="w-full bg-[#f1f5f9] dark:bg-[#334155] text-[#0f172a] dark:text-[#e2e8f0] px-4 py-3 rounded-xl border border-transparent focus:border-indigo-500/50 focus:bg-white dark:focus:bg-[#1e293b] focus:ring-4 focus:ring-indigo-500/10 transition-all duration-300 outline-none font-medium shadow-sm cursor-pointer"
               required
             />
          </div>

          {/* Configuration Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-[#475569] dark:text-[#94a3b8] mb-2">
                <Tag size={14} className="text-indigo-500" />
                Category
              </label>
              <select 
                className="w-full bg-[#f1f5f9] dark:bg-[#334155] text-[#0f172a] dark:text-[#e2e8f0] px-4 py-3 rounded-xl border border-transparent focus:border-indigo-500/50 focus:bg-white dark:focus:bg-[#1e293b] focus:ring-4 focus:ring-indigo-500/10 transition-all duration-300 outline-none font-medium shadow-sm cursor-pointer appearance-none" 
                value={categoryId} 
                onChange={e => setCategoryId(e.target.value)}
              >
                <option value="Academics">Academics</option>
                <option value="Coding">Coding</option>
                <option value="Gym">Gym</option>
                <option value="Work">Work</option>
                <option value="Personal">Personal</option>
              </select>
            </div>
            
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-[#475569] dark:text-[#94a3b8] mb-2">
                <Clock size={14} className="text-indigo-500" />
                Timing
              </label>
              <select 
                className="w-full bg-[#f1f5f9] dark:bg-[#334155] text-[#0f172a] dark:text-[#e2e8f0] px-4 py-3 rounded-xl border border-transparent focus:border-indigo-500/50 focus:bg-white dark:focus:bg-[#1e293b] focus:ring-4 focus:ring-indigo-500/10 transition-all duration-300 outline-none font-medium shadow-sm cursor-pointer appearance-none" 
                value={timeSection} 
                onChange={e => setTimeSection(e.target.value)}
              >
                <option value="morning">Morning</option>
                <option value="afternoon">Afternoon</option>
                <option value="evening">Evening</option>
                <option value="anytime">Anytime</option>
              </select>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-3 items-center mt-4 pt-6 pb-2 border-t border-slate-100 dark:border-slate-700/50 shrink-0">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-6 py-3 rounded-xl text-sm font-bold text-[#475569] dark:text-[#94a3b8] hover:text-[#0f172a] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="flex items-center justify-center px-8 py-3 rounded-xl text-sm font-bold text-white shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 hover:shadow-indigo-500/25 hover:scale-[1.03] active:scale-[0.97] transition-all duration-300" 
              disabled={loading}
            >
              {loading ? 'Scheduling...' : 'Schedule Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewTaskModal;
