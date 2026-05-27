import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, ArrowRight, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ name: '', email: '', company: '', workspace: '' });
  const [loading, setLoading] = useState(false);

  const handleNext = () => step < 3 ? setStep(step + 1) : handleSubmit();

  const handleSubmit = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    login(formData.email || 'new@company.com', 'admin');
    navigate('/dashboard');
  };

  const inputClass = "w-full bg-bg-elevated border border-white/8 rounded-xl px-4 py-2.5 text-sm text-text-primary outline-none focus:border-accent-blue/40 transition-all placeholder:text-text-muted";

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 hero-gradient bg-grid opacity-50" />

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center">
              <Brain size={20} className="text-white" />
            </div>
          </Link>
          <h1 className="text-2xl font-black">Create your workspace</h1>
          <p className="text-text-secondary text-sm mt-2">Get started in 2 minutes</p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3].map(s => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                s < step ? 'bg-accent-green text-white' : s === step ? 'bg-accent-blue text-white' : 'bg-bg-elevated text-text-muted'
              }`}>
                {s < step ? <CheckCircle size={14} /> : s}
              </div>
              {s < 3 && <div className={`w-8 h-px ${s < step ? 'bg-accent-green' : 'bg-white/10'}`} />}
            </div>
          ))}
        </div>

        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass rounded-2xl p-8 border border-white/8"
        >
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="font-bold text-lg">Personal Info</h2>
              <div>
                <label className="text-xs text-text-secondary mb-1.5 block">Full Name</label>
                <input className={inputClass} placeholder="Alex Chen" value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div>
                <label className="text-xs text-text-secondary mb-1.5 block">Work Email</label>
                <input className={inputClass} placeholder="alex@company.com" type="email" value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })} />
              </div>
              <div>
                <label className="text-xs text-text-secondary mb-1.5 block">Company</label>
                <input className={inputClass} placeholder="Acme Corp" value={formData.company}
                  onChange={e => setFormData({ ...formData, company: e.target.value })} />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="font-bold text-lg">Create Workspace</h2>
              <p className="text-sm text-text-secondary">Your workspace is where your team collaborates on engineering knowledge.</p>
              <div>
                <label className="text-xs text-text-secondary mb-1.5 block">Workspace Name</label>
                <input className={inputClass} placeholder="Backend Engineering" value={formData.workspace}
                  onChange={e => setFormData({ ...formData, workspace: e.target.value })} />
              </div>
              <div className="glass-blue rounded-xl p-4 text-sm">
                <div className="text-accent-blue font-semibold mb-1">You'll be the Team Leader</div>
                <div className="text-text-secondary text-xs">As Team Leader, you can connect integrations, invite members, and manage the workspace.</div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="font-bold text-lg">Ready to launch 🚀</h2>
              <p className="text-sm text-text-secondary">Your workspace is configured. Connect your first integration to start indexing engineering data.</p>
              <div className="space-y-3">
                {['GitHub Repository', 'Jira Project', 'Slack Workspace'].map(item => (
                  <div key={item} className="flex items-center gap-3 p-3 bg-bg-elevated rounded-xl border border-white/5">
                    <div className="w-2 h-2 rounded-full bg-text-muted" />
                    <span className="text-sm text-text-secondary">{item}</span>
                    <span className="ml-auto text-xs text-text-muted">Connect later</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={handleNext}
            disabled={loading}
            className="btn-primary w-full py-2.5 flex items-center justify-center gap-2 mt-6"
          >
            {loading ? (
              <><span className="typing-dot" /><span className="typing-dot" /><span className="typing-dot" /></>
            ) : step === 3 ? (
              <>Launch Workspace <ArrowRight size={15} /></>
            ) : (
              <>Continue <ArrowRight size={15} /></>
            )}
          </button>

          <p className="text-center text-xs text-text-muted mt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-accent-blue hover:underline">Sign in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default SignupPage;
