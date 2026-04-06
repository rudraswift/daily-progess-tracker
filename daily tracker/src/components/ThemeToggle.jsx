import React, { useContext } from 'react';
import { Sun, Moon } from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';

const ThemeToggle = ({ className = '' }) => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      className={`relative inline-flex items-center h-8 w-14 rounded-full transition-colors duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary shadow-inner overflow-hidden ${
        isDark 
          ? 'bg-slate-900 border border-slate-700/80 shadow-[inset_0_2px_8px_rgba(0,0,0,0.6)]' 
          : 'bg-sky-200 border border-white/60 shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]'
      } ${className}`}
      aria-label="Toggle Dark Mode"
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {/* Background Elements (Stars / Clouds) */}
      <div className={`absolute inset-0 transition-opacity duration-700 ${isDark ? 'opacity-100' : 'opacity-0'}`}>
        <div className="absolute top-1.5 left-4 w-0.5 h-0.5 rounded-full bg-white opacity-80 shadow-[4px_4px_0_white,-1px_6px_0_white,2px_8px_0_white]"></div>
      </div>
      <div className={`absolute inset-0 transition-opacity duration-700 ${isDark ? 'opacity-0' : 'opacity-100'}`}>
        <div className="absolute top-1 left-2 w-3 h-1.5 rounded-full bg-white/70 blur-[0.5px]"></div>
        <div className="absolute top-3 left-3 w-4 h-2 rounded-full bg-white/60 blur-[1px]"></div>
      </div>

      {/* Sliding Thumb */}
      <span
        className={`absolute z-10 flex h-6 w-6 items-center justify-center rounded-full transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
          isDark 
            ? 'translate-x-7 bg-slate-800 shadow-[0_0_12px_rgba(112,115,255,0.8)] border border-indigo-400/30' 
            : 'translate-x-1 bg-white shadow-md border border-amber-100'
        }`}
      >
        {/* Sun Icon */}
        <span
          className={`absolute flex items-center justify-center transition-all duration-500 ease-in-out ${
            isDark ? 'opacity-0 rotate-180 scale-50' : 'opacity-100 rotate-0 scale-100 text-amber-500'
          }`}
        >
          <Sun size={14} strokeWidth={2.5} />
        </span>
        
        {/* Moon Icon */}
        <span
          className={`absolute flex items-center justify-center transition-all duration-500 ease-in-out ${
            isDark ? 'opacity-100 rotate-0 scale-100 text-indigo-200' : 'opacity-0 -rotate-180 scale-50'
          }`}
        >
          <Moon size={14} strokeWidth={2.5} />
        </span>
      </span>
    </button>
  );
};

export default ThemeToggle;
