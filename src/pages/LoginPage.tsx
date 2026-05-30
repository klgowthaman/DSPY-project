import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, Eye, EyeOff, ArrowRight, GitBranch, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('alex.chen@company.com');
  const [password, setPassword] = useState('••••••••');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<'admin' | 'engineer' | 'viewer'>('admin');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    login(email, password);
    navigate('/dashboard');
  };

  const quickLogins = [
    { label: 'Team Leader', role: 'admin' as const, email: 'alex.chen@company.com', color: '#4F8CFF' },
    { label: 'Engineer', role: 'engineer' as const, email: 'sarah.kim@company.com', color: '#8B5CF6' },
    { label: 'Viewer', role: 'viewer' as const, email: 'marcus.webb@company.com', color: '#22C55E' },
  ];

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 hero-gradient bg-grid opacity-50" />
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-accent-blue/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/3 w-64 h-64 bg-accent-purple/5 rounded-full blur-3xl" />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center">
              <Brain size={20} className="text-white" />
            </div>
            <span className="font-bold text-lg">IMA</span>
          </Link>
          <h1 className="text-2xl font-black">Welcome back</h1>
          <p className="text-text-secondary text-sm mt-2">Sign in to your workspace</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-8 border border-white/8"
        >
          {/* Quick Role Login */}
          <div className="mb-6">
            <p className="text-xs text-text-muted mb-3 uppercase tracking-wider">Demo — Quick Login</p>
            <div className="grid grid-cols-3 gap-2">
              {quickLogins.map(q => (
                <button
                  key={q.role}
                  onClick={() => { setRole(q.role); setEmail(q.email); }}
                  className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
                    role === q.role
                      ? 'border-opacity-50 text-white'
                      : 'border-white/10 text-text-secondary hover:border-white/20'
                  }`}
                  style={role === q.role ? { borderColor: q.color, background: `${q.color}20`, color: q.color } : {}}
                >
                  {q.label}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs text-text-secondary mb-1.5 block font-medium">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-bg-elevated border border-white/8 rounded-xl px-4 py-2.5 text-sm text-text-primary outline-none focus:border-accent-blue/40 transition-all"
              />
            </div>
            <div>
              <label className="text-xs text-text-secondary mb-1.5 block font-medium">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-bg-elevated border border-white/8 rounded-xl px-4 py-2.5 text-sm text-text-primary outline-none focus:border-accent-blue/40 transition-all pr-10"
                />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary">
                  {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-2.5 flex items-center justify-center gap-2"
            >
              {loading ? (
                <><span className="typing-dot" /><span className="typing-dot" /><span className="typing-dot" /></>
              ) : (
                <>Sign In <ArrowRight size={15} /></>
              )}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/5" />
            </div>
            <div className="relative flex justify-center text-xs text-text-muted">
              <span className="bg-bg-card px-3">or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button className="btn-secondary flex items-center justify-center gap-2 py-2.5 text-sm">
              <GitBranch size={15} /> GitHub
            </button>
            <button className="btn-secondary flex items-center justify-center gap-2 py-2.5 text-sm">
              <Zap size={15} /> SSO
            </button>
          </div>

          <p className="text-center text-xs text-text-muted mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="text-accent-blue hover:underline">Sign up</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
