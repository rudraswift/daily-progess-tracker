import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import History from './pages/History';
import DailyReport from './pages/DailyReport';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';
import AnimatedBackground from './components/AnimatedBackground';

// Placeholder Pages

function App() {
  return (
    <div className="app-layout flex h-screen overflow-hidden relative z-1" style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-on-surface)' }}>
      <AnimatedBackground />
      <Sidebar />
      <div className="flex-1 overflow-hidden relative">
        <main className="h-full overflow-y-auto p-4 md:p-8" id="scroller">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
            <Route path="/report" element={<ProtectedRoute><DailyReport /></ProtectedRoute>} />
            <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
