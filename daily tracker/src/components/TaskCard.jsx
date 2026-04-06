import React from 'react';
import { Circle, CheckCircle2, Trash2 } from 'lucide-react';

const TaskCard = ({ task, onToggleStatus, onDelete }) => {
  const isCompleted = task.status === 'completed';

  const getTimingStyles = (timing) => {
    switch (timing?.toLowerCase()) {
      case 'morning':
        return { bg: '#FEF9C3', text: '#CA8A04' }; // Light yellow
      case 'afternoon':
        return { bg: '#FFEDD5', text: '#C2410C' }; // Orange
      case 'evening':
        return { bg: '#F3E8FF', text: '#7E22CE' }; // Purple
      case 'anytime':
      default:
        return { bg: '#F1F5F9', text: '#475569' }; // Grey
    }
  };

  const timingStyle = getTimingStyles(task.timeSection);

  return (
    <div className={`task-card shadow-ambient flex items-center justify-between ${isCompleted ? 'opacity-50' : ''}`}
         style={{ opacity: isCompleted ? 0.7 : 1 }}>
      
      <div className="flex items-center gap-4">
        <button 
          onClick={() => onToggleStatus(task._id)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: isCompleted ? 'var(--color-tertiary)' : 'var(--color-outline-variant)' }}
        >
          {isCompleted ? <CheckCircle2 size={24} /> : <Circle size={24} style={{ color: 'var(--color-outline-variant)', opacity: 1, border: 'none' }} />}
        </button>

        <div className="flex flex-col gap-1">
          <h3 style={{ 
            fontSize: '1.125rem', 
            fontWeight: 600, 
            textDecoration: isCompleted ? 'line-through' : 'none',
            color: isCompleted ? 'var(--color-on-surface-variant)' : 'var(--color-on-surface)'
          }}>
            {task.title}
          </h3>
          {task.description && (
             <p className="text-on-surface-variant" style={{ fontSize: '0.875rem', margin: 0 }}>
               {task.description}
             </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {task.date && (
           <span className="text-slate-500 font-medium text-xs hidden sm:block whitespace-nowrap">
             {new Date(task.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
           </span>
        )}
        
        <span style={{
          backgroundColor: timingStyle.bg,
          color: timingStyle.text,
          padding: '0.25rem 0.75rem',
          borderRadius: '0.5rem',
          fontSize: '0.75rem',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          {task.timeSection || 'anytime'}
        </span>

        <span style={{
          backgroundColor: 'var(--color-surface-container-high)',
          color: 'var(--color-on-surface-variant)',
          padding: '0.25rem 0.75rem',
          borderRadius: '0.5rem',
          fontSize: '0.75rem',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          {task.categoryId}
        </span>
        <button 
          onClick={() => onDelete(task._id)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#a8364b', padding: '0.25rem', display: 'flex', alignItems: 'center' }}
        >
          <Trash2 size={16} />
        </button>
      </div>

    </div>
  );
};

export default TaskCard;
