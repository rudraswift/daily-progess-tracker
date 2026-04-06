import React, { useEffect, useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Clock, Activity, Calendar, Search, Zap } from 'lucide-react';

const DailyReport = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Filtering States
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    // 1. Optimized Fetch: Single request pulls entirely mapped history + insights
    fetch('http://localhost:5000/api/reports', {
       headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => res.json())
      .then(resData => {
        // Reverse array for linechart so chronology builds left to right
        const chronReports = [...resData.reports].reverse(); 
        
        // Aggregate flattened category count from all historic days for bar chart
        const categoryTotals = {};
        resData.reports.forEach(r => {
           Object.keys(r.categories).forEach(cat => {
              categoryTotals[cat] = (categoryTotals[cat] || 0) + r.categories[cat];
           });
        });
        const categoryData = Object.keys(categoryTotals).map(k => ({ name: k, total: categoryTotals[k] }));

        setData({ ...resData, chronReports, categoryData });
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading || !data) return <p className="text-on-surface-variant p-8">Compiling Daily Reports...</p>;

  const { reports, insights, chronReports, categoryData } = data;

  // 2. Date Filtering & Search Logic (applied locally to save API calls)
  const filteredReports = reports.filter(r => {
    let isValid = true;
    if (searchTerm) {
       isValid = r.date.includes(searchTerm);
    }
    if (isValid && startDate) {
       isValid = new Date(r.date) >= new Date(startDate);
    }
    if (isValid && endDate) {
       isValid = new Date(r.date) <= new Date(endDate);
    }
    return isValid;
  });

  return (
    <div className="flex flex-col gap-8" style={{ maxWidth: '1000px', margin: '0 auto' }}>
      
      {/* Top Hero: Universal Metrics */}
      <section className="flex flex-col md:flex-row gap-4">
        <div className="section-bucket flex-1">
          <div className="flex items-center gap-2 mb-2"><TrendingUp size={20} className="text-primary" /> <span className="font-bold">Avg. Completion</span></div>
          <span className="display-num text-3xl">{insights.averageCompletion}%</span>
        </div>
        
        <div className="section-bucket flex-1">
          <div className="flex items-center gap-2 mb-2"><Activity size={20} className="text-on-surface-variant" /> <span className="font-bold">Most Skipped</span></div>
          <span className="display-num text-xl capitalize">{insights.mostSkippedCategory}</span>
        </div>

        <div className="section-bucket flex-1">
          <div className="flex items-center gap-2 mb-2"><Clock size={20} className="text-on-surface-variant" /> <span className="font-bold">Prime Time</span></div>
          <span className="display-num text-xl capitalize">{insights.mostActiveTimeSlot}</span>
        </div>

        <div className="section-bucket flex-1" style={{ backgroundColor: 'var(--color-primary-container)', color: 'var(--color-on-primary-container)' }}>
          <div className="flex items-center gap-2 mb-2"><Zap size={20} /> <span className="font-bold text-sm">Winning Streak</span></div>
          <span className="display-num text-3xl">{insights.currentStreak} <span className="text-lg">Days</span></span>
        </div>
      </section>

      {/* Analytics Recharts */}
      <section className="flex flex-col md:flex-row gap-4">
        {/* Progression Over Time (Left to Right) */}
        <div className="section-bucket flex-2" style={{ flex: 2 }}>
          <h2 className="text-xl mb-4 font-bold flex justify-between">
            Timeline Progression
            {insights.bestDay && <span className="text-sm font-normal text-on-surface-variant bg-surface-container-highest px-3 py-1 rounded-full">Record: {insights.bestDay.percentage}% on {insights.bestDay.date}</span>}
          </h2>
          <div style={{ width: '100%', height: 250 }}>
            <ResponsiveContainer>
              <LineChart data={chronReports} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--color-on-surface-variant)' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--color-on-surface-variant)' }} />
                <Tooltip contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 12px 40px rgba(44,52,55,0.08)' }} />
                <Line type="monotone" dataKey="totalTasks" stroke="var(--color-outline-variant)" strokeWidth={2} dot={false} name="Total Tasks" />
                <Line type="monotone" dataKey="completed" stroke="var(--color-primary)" strokeWidth={3} activeDot={{ r: 8 }} name="Completed" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Global Category Distribution */}
        <div className="section-bucket flex-1">
          <h2 className="text-xl mb-4 font-bold">Category Distribution</h2>
          <div style={{ width: '100%', height: 250 }}>
            <ResponsiveContainer>
              <BarChart data={categoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} dy={10} />
                <Tooltip cursor={{ fill: 'var(--color-surface-container-high)', radius: 10 }} contentStyle={{ borderRadius: '1rem', border: 'none' }} />
                <Bar dataKey="total" radius={[8, 8, 8, 8]}>
                  {categoryData.map((entry, index) => (
                    <Cell key={index} fill={index % 2 === 0 ? 'var(--color-primary)' : 'var(--color-tertiary)'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* Filtering Toolkit */}
      <section className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <h2 className="text-2xl font-bold">Historical Ledger</h2>
            
            <div className="flex gap-2 bg-surface-container-low p-2 rounded-2xl glass-panel">
               <div className="flex items-center gap-2 px-2">
                 <Search size={16} className="text-on-surface-variant" />
                 <input 
                   type="text" 
                   placeholder="Search YYYY-MM-DD" 
                   className="ghost-input py-1" 
                   value={searchTerm} 
                   onChange={(e) => setSearchTerm(e.target.value)} 
                 />
               </div>
               
               <div className="h-6 w-px bg-surface-container-highest my-auto mx-2"></div>
               
               <input type="date" className="ghost-input py-1 text-sm" value={startDate} onChange={e => setStartDate(e.target.value)} />
               <span className="my-auto text-on-surface-variant">to</span>
               <input type="date" className="ghost-input py-1 text-sm" value={endDate} onChange={e => setEndDate(e.target.value)} />
            </div>
        </div>

        {/* Responsive Generated LEDGER */}
        {filteredReports.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {filteredReports.map(day => (
              <div key={day.date} className="section-bucket flex flex-col md:flex-row items-center justify-between shadow-ambient transition-all hover:scale-[1.01]">
                
                {/* Date Side */}
                <div className="flex items-center gap-4 min-w-[200px]">
                  <div className="bg-surface-container-highest p-3 rounded-xl">
                     <Calendar size={20} className="text-on-surface-variant" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{day.date}</h3>
                    <p className="text-sm text-on-surface-variant">{day.totalTasks} Total Tasks</p>
                  </div>
                </div>

                {/* Score Ratio */}
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-bold display-num" style={{ color: day.percentage >= 80 ? 'var(--color-primary)' : day.percentage < 50 ? 'var(--color-error)' : 'var(--color-on-surface)' }}>
                    {day.percentage}%
                  </span>
                  <span className="text-xs text-on-surface-variant font-bold uppercase tracking-widest">{day.completed} / {day.totalTasks} DONE</span>
                </div>

                {/* Categories Badge Stream */}
                <div className="flex flex-wrap gap-2 justify-end min-w-[200px]">
                   {Object.keys(day.categories).length > 0 ? Object.keys(day.categories).map(cat => (
                     <span key={cat} className="text-xs px-2 py-1 bg-surface-container-high rounded-md text-on-surface-variant">
                       {cat}: {day.categories[cat]}
                     </span>
                   )) : (
                     <span className="text-xs text-outline-variant italic">No categories</span>
                   )}
                </div>

              </div>
            ))}
          </div>
        ) : (
          <p className="text-center p-8 text-on-surface-variant">No records match your exact filter sweep.</p>
        )}
      </section>

    </div>
  );
};

export default DailyReport;
