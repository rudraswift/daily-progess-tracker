import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { API_BASE_URL } from '../config/constants';
import { Eye, EyeOff, AlertCircle, Lock, Shield, Loader2 } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import logo from '../assets/mindful.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, loginWithGoogle } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.msg || 'Invalid credentials. Please try again.');
      }

      login(data.user, data.token);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 md:p-10 flex flex-col justify-between bg-transparent text-slate-200">
      
      {/* Top Main Content Section Container */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10 w-full py-10">
        
        {/* App Logo */}
        <div className="mb-6 z-10 flex flex-col items-center">
          <img 
            src={logo} 
            alt="Mindful Logo" 
            className="h-16 w-auto sm:h-20 object-contain hover:scale-105 hover:-translate-y-1 transition-all duration-500 drop-shadow-sm hover:drop-shadow-lg animate-fade-in-up" 
          />
        </div>
        
        {/* Central Card */}
        <div className="bg-surface-container-low/70 backdrop-blur-2xl p-8 sm:p-10 rounded-[2rem] shadow-[0_8px_40px_rgb(0,0,0,0.4)] border border-surface-variant/50 max-w-[420px] w-full mx-auto relative overflow-hidden">
          
          <div className="text-center mb-8">
            <h2 className="text-[28px] font-bold text-on-surface tracking-tight leading-tight">Welcome back</h2>
            <p className="text-on-surface-variant mt-2 text-sm font-medium">Continue your journey to productivity.</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 py-3 px-4 rounded-2xl text-sm font-semibold flex items-center gap-2.5 mb-6 border border-red-100">
              <AlertCircle size={18} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Email or Username</label>
              <input 
                type="email" 
                required
                className="w-full px-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all duration-300 font-medium text-slate-700 text-sm placeholder-slate-400 outline-none" 
                placeholder="hello@mindful.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="relative">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Password</label>
                <a href="#" className="text-xs font-bold text-purple-600 hover:text-purple-700 transition-colors">Forgot?</a>
              </div>
              <div className="relative">
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  required
                  className="w-full pl-4 pr-12 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all duration-300 font-medium text-slate-700 text-sm placeholder-slate-400 outline-none tracking-wide" 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-purple-600 transition-colors focus:outline-none p-1"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full relative group overflow-hidden bg-gradient-to-r from-purple-600 to-blue-500 text-white py-4 rounded-2xl text-sm font-bold transition-all shadow-[0_8px_20px_-4px_rgba(91,99,226,0.3)] hover:shadow-[0_12px_25px_-4px_rgba(91,99,226,0.4)] flex items-center justify-center gap-2 mt-6 disabled:opacity-75 disabled:cursor-not-allowed hover:-translate-y-0.5"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-0"></div>
              <div className="relative z-10 flex items-center gap-2">
                {loading ? <Loader2 size={18} className="animate-spin" /> : null}
                {loading ? "Logging in..." : "Log in"}
              </div>
            </button>
          </form>

          <div className="relative mt-8 mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-700/50"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-surface-container-low text-slate-400 font-medium tracking-wide">OR CONTINUE WITH</span>
            </div>
          </div>

          <div className="flex justify-center w-full [&>div]:w-full opacity-90 hover:opacity-100 transition-opacity">
            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                setLoading(true);
                setError('');
                try {
                  await loginWithGoogle(credentialResponse.credential);
                  navigate('/');
                } catch (err) {
                  setError(err.message || 'Google Auth Failed');
                } finally {
                  setLoading(false);
                }
              }}
              onError={() => {
                setError('Google Authentication was cancelled or failed.');
              }}
              theme="filled_black"
              size="large"
              width="100%"
              shape="pill"
              text="continue_with"
            />
          </div>

          <p className="text-center mt-8 text-slate-500 text-sm font-medium">
            New here? <Link to="/signup" className="text-purple-600 font-bold hover:text-purple-700 transition-colors">Create an account</Link>
          </p>
        </div>

        {/* Security Badges */}
        <div className="mt-8 flex justify-center items-center gap-6 text-xs font-bold text-slate-400 uppercase tracking-wider">
          <div className="flex items-center gap-2">
            <Lock size={14} className="text-slate-400" />
            <span>Secure Access</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield size={14} className="text-slate-400" />
            <span>Encrypted</span>
          </div>
        </div>

      </div>

      {/* Global Footer */}
      <footer className="w-full max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center text-xs font-medium text-slate-400 z-10 relative">
        <p>© 2026 Mindful Inc. Designed for Focus.</p>
        <div className="flex gap-6 mt-4 md:mt-0">
          <a href="#" className="hover:text-slate-600 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-slate-600 transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-slate-600 transition-colors">Support</a>
        </div>
      </footer>

    </div>
  );
};

export default Login;
