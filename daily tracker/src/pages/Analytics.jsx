import React, { useEffect, useState } from 'react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { Flame, Trophy } from 'lucide-react';

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('weekly'); // 'weekly' or 'monthly'

  useEffect(() => {
    // 1. Fetching the aggregated data from our updated Express backend
    fetch('http://localhost:5000/api/analytics', {
       headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => res.json())
      .then(result => {
        setData(result);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading || !data) return <p style={{ padding: '3rem' }}>Loading analytics...</p>;

  // 2. Select data based on User toggle ('weekly' or 'monthly')
  const chartData = period === 'weekly' ? data.weeklyData : data.monthlyData;
  const categories = data.categoryData;

  // Formatting for Recharts components:
  // - ResponsiveContainer allows charts to safely size relative to their parent container
  // - LineChart tracks completionRate vs Date
  // - BarChart tracks completed tasks vs Category

  return (
    <div className="flex flex-col gap-8" style={{ maxWidth: '1000px', margin: '0 auto' }}>
      
      {/* Metric Hero Section - Following Zen Workspace rules by avoiding sharp borders and using ambient shadow components */}
      <section className="flex gap-4">
        {/* Streak Component */}
        <div className="section-bucket flex-1 flex flex-col items-center justify-center gap-2" style={{ marginBottom: 0 }}>
          <div className="flex items-center gap-2 text-primary text-xl">
             <Flame size={32} /> <h2 style={{ fontSize: '1.25rem' }}>Current Streak</h2>
          </div>
          <p className="display-num" style={{ fontSize: '3rem', color: 'var(--color-on-surface)' }}>
            {data.streak} <span style={{ fontSize: '1.25rem', color: 'var(--color-on-surface-variant)' }}>Days</span>
          </p>
          <p className="text-on-surface-variant text-sm">Consecutive days with &gt;80% completion</p>
        </div>
      </section>

      {/* Progress Line Chart (Weekly / Monthly) */}
      <section className="section-bucket">
        <div className="flex justify-between items-center" style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem' }}>Progress Trend</h2>
          <div className="flex gap-2">
            <button 
              className="ghost-input" 
              style={{ width: 'auto', padding: '0.5rem 1rem', cursor: 'pointer', backgroundColor: period === 'weekly' ? 'var(--color-surface-container-high)' : 'var(--color-surface-container-lowest)' }}
              onClick={() => setPeriod('weekly')}
            >
              Weekly
            </button>
            <button 
              className="ghost-input" 
              style={{ width: 'auto', padding: '0.5rem 1rem', cursor: 'pointer', backgroundColor: period === 'monthly' ? 'var(--color-surface-container-high)' : 'var(--color-surface-container-lowest)' }}
              onClick={() => setPeriod('monthly')}
            >
              Monthly
            </button>
          </div>
        </div>

        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="date" 
                     axisLine={false} 
                     tickLine={false} 
                     tick={{ fill: 'var(--color-on-surface-variant)', fontSize: 12, fontFamily: 'var(--font-body)' }} 
                     dy={10} />
              <YAxis axisLine={false} 
                     tickLine={false} 
                     tick={{ fill: 'var(--color-on-surface-variant)', fontSize: 12, fontFamily: 'var(--font-body)' }} />
              <Tooltip 
                contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 12px 40px rgba(44,52,55,0.08)' }}
                itemStyle={{ color: 'var(--color-primary)', fontWeight: 600 }}
              />
              {/* Type "monotone" creates beautifully smooth curved lines instead of sharp rigid lines */}
              <Line type="monotone" dataKey="completionRate" stroke="var(--color-primary)" strokeWidth={4} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Category Analysis Bar Chart */}
      <section className="section-bucket">
        <div className="flex justify-between items-center" style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem' }}>Category Analysis</h2>
        </div>

        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={categories} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barSize={40}>
              <XAxis dataKey="name" 
                     axisLine={false} 
                     tickLine={false} 
                     tick={{ fill: 'var(--color-on-surface-variant)', fontSize: 12, fontFamily: 'var(--font-body)' }} 
                     dy={10} />
              <YAxis axisLine={false} 
                     tickLine={false} 
                     tick={{ fill: 'var(--color-on-surface-variant)', fontSize: 12, fontFamily: 'var(--font-body)' }} />
              <Tooltip 
                cursor={{ fill: 'var(--color-surface-container-high)', radius: 10 }} // Custom highlight matching our aesthetic
                contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 12px 40px rgba(44,52,55,0.08)' }}
              />
              <Bar dataKey="completed" radius={[10, 10, 10, 10]}>
                {categories.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index % 2 === 0 ? 'var(--color-primary)' : 'var(--color-tertiary)'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

    </div>
  );
};

export default Analytics;
