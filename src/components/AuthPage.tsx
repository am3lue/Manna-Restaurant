import React, { useState } from 'react';
import { ChefHat, Lock, User as UserIcon, ArrowRight, ShieldCheck, Utensils } from 'lucide-react';
import { UserRole } from '../types';
import { Link } from 'react-router-dom';

interface AuthPageProps {
  onLogin: (role: UserRole, userName: string) => void;
}

export default function AuthPage({ onLogin }: AuthPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (data.success) {
        onLogin(data.user.role as UserRole, data.user.name);
      } else {
        setError(data.error || 'Authentication failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-amber-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-emerald-500/10 blur-[120px] rounded-full" />
      </div>

      <div className="w-full max-w-md relative z-10">
        
        {/* Logo Section */}
        <div className="text-center mb-10 space-y-4">
          <div className="w-20 h-20 bg-slate-900 border border-slate-800 rounded-3xl mx-auto flex items-center justify-center shadow-2xl shadow-amber-500/10 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-transparent rounded-3xl opacity-50" />
            <ChefHat className="w-10 h-10 text-amber-500 relative z-10" />
          </div>
          <div>
            <h1 className="text-4xl font-serif text-white tracking-tight">Manna <span className="text-amber-500 italic">Arusha</span></h1>
            <p className="text-xs text-slate-500 uppercase tracking-[0.3em] font-black mt-3">Digital Restaurant System</p>
          </div>
        </div>

        {/* Auth Card */}
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/60 rounded-[2.5rem] p-8 shadow-2xl mb-6">
          
          <div className="flex justify-center mb-8">
            <h2 className="text-sm font-black uppercase tracking-widest text-amber-500 border-b-2 border-amber-500 pb-2">
              System Access
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {error && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-center">
                <p className="text-xs font-bold text-rose-500">{error}</p>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 pl-1">Username</label>
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                  required
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username" 
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-3.5 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 pl-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                  required
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password" 
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-3.5 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all"
                />
              </div>
            </div>

            <button 
              disabled={loading}
              type="submit" 
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-4 rounded-2xl text-xs uppercase tracking-[0.2em] shadow-xl shadow-amber-500/10 transition-all flex items-center justify-center gap-2 mt-4 active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>
          
          <div className="mt-8 pt-6 border-t border-slate-800/60 text-center">
            <p className="text-[10px] text-slate-500 font-medium mb-4 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" /> Secured Access Portal
            </p>
            <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800">
              <p className="text-[9px] text-slate-500 text-left font-mono">
                <strong className="text-slate-400">Launch Credentials:</strong><br />
                User: admin | Pass: admin123<br />
                User: kitchen | Pass: kitchen123<br />
                User: guest | Pass: guest
              </p>
            </div>
          </div>
        </div>

        {/* Public Menu Link for SEO / Guests */}
        <Link to="/menu" className="group flex items-center justify-between bg-slate-900/40 border border-slate-800/60 rounded-[2rem] p-5 hover:bg-slate-900 transition-all">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-500/10 rounded-xl group-hover:bg-amber-500/20 transition-colors">
              <Utensils className="w-5 h-5 text-amber-500" />
            </div>
            <div className="text-left">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Public Menu</h3>
              <p className="text-[10px] text-slate-500 mt-0.5">Browse available dishes without login</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-amber-500 transition-colors" />
        </Link>
      </div>
    </div>
  );
}
