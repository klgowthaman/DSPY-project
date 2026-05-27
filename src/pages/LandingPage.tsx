import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Brain, ArrowRight, GitBranch, Zap, Network, Shield,
  MessageSquare, CheckCircle, ChevronRight, Star, Users, Sparkles
} from 'lucide-react';

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
};

const features = [
  {
    icon: Network, title: 'Multi-source AI Search',
    desc: 'Search across GitHub PRs, Jira tickets, Slack threads, and Runbooks simultaneously.',
    color: '#4F8CFF', gradient: 'from-blue-500/10 to-blue-500/5',
  },
  {
    icon: Brain, title: 'Engineering Decision Tracking',
    desc: 'Understand WHY decisions were made, not just what was built. Trace reasoning chains.',
    color: '#8B5CF6', gradient: 'from-purple-500/10 to-purple-500/5',
  },
  {
    icon: Sparkles, title: 'AI-Powered Knowledge Retrieval',
    desc: 'DSPy Multi-Hop ReAct Agent reasons across sources to synthesize accurate answers.',
    color: '#06B6D4', gradient: 'from-cyan-500/10 to-cyan-500/5',
  },
  {
    icon: MessageSquare, title: 'Project Context Understanding',
    desc: 'The AI understands the full context of your project history, dependencies, and architecture.',
    color: '#22C55E', gradient: 'from-green-500/10 to-green-500/5',
  },
  {
    icon: Zap, title: 'Slack + Jira + GitHub Integration',
    desc: 'Seamlessly connect your entire engineering toolchain with one-click OAuth.',
    color: '#F59E0B', gradient: 'from-orange-500/10 to-orange-500/5',
  },
  {
    icon: Shield, title: 'Confidence-Based Answers',
    desc: 'Every answer comes with a confidence score, staleness warnings, and full citations.',
    color: '#EF4444', gradient: 'from-red-500/10 to-red-500/5',
  },
];

const steps = [
  { num: '01', title: 'Connect Your Tools', desc: 'Link GitHub, Jira, Slack, and upload Runbooks in under 5 minutes.' },
  { num: '02', title: 'Index Engineering Data', desc: 'AI processes PRs, tickets, discussions, and docs into semantic embeddings.' },
  { num: '03', title: 'Ask Technical Questions', desc: 'Use natural language to ask why decisions were made or how systems work.' },
  { num: '04', title: 'AI Retrieves Answers', desc: 'Multi-hop reasoning agent searches across all connected sources.' },
  { num: '05', title: 'Get Cited Responses', desc: 'Receive answers with source links, confidence scores, and staleness warnings.' },
];

const plans = [
  {
    name: 'Starter', price: '$49', period: '/mo', color: '#4F8CFF',
    features: ['5 team members', '3 projects', 'GitHub + Jira', '1K AI queries/mo', 'Standard support'],
    cta: 'Start Free Trial',
  },
  {
    name: 'Pro', price: '$149', period: '/mo', color: '#8B5CF6', popular: true,
    features: ['25 team members', 'Unlimited projects', 'All integrations', '10K AI queries/mo', 'Priority support', 'Advanced analytics'],
    cta: 'Start Free Trial',
  },
  {
    name: 'Enterprise', price: 'Custom', period: '', color: '#22C55E',
    features: ['Unlimited members', 'Unlimited projects', 'All integrations', 'Unlimited AI queries', 'Dedicated support', 'SSO + SAML', 'Custom models'],
    cta: 'Book Demo',
  },
];

const stats = [
  { label: 'Engineering Teams', value: '2,000+' },
  { label: 'Questions Answered Daily', value: '50K+' },
  { label: 'Data Sources Indexed', value: '10M+' },
  { label: 'Avg. Confidence Score', value: '91%' },
];

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [typedText, setTypedText] = useState('');
  const fullText = 'Why does order-service use polling instead of webhooks?';

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      if (i <= fullText.length) {
        setTypedText(fullText.slice(0, i));
        i++;
      } else {
        clearInterval(timer);
      }
    }, 50);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center">
              <Brain size={16} className="text-white" />
            </div>
            <span className="font-bold text-sm">Institutional Memory Agent</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {['Features', 'How It Works', 'Pricing'].map(item => (
              <a key={item} href={`#${item.toLowerCase().replace(' ', '-')}`}
                className="text-sm text-text-secondary hover:text-text-primary transition-colors">
                {item}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/login')} className="btn-secondary text-sm py-2 px-4">
              Sign In
            </button>
            <button onClick={() => navigate('/signup')} className="btn-primary text-sm py-2 px-4">
              Start Free Trial
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-24 px-6 hero-gradient bg-grid">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-blue/5 rounded-full blur-3xl" />
          <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-accent-purple/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-5xl mx-auto text-center relative">
          <motion.div {...fadeUp} className="inline-flex items-center gap-2 glass-blue px-4 py-2 rounded-full text-xs font-medium text-accent-blue mb-8">
            <Sparkles size={12} />
            Powered by DSPy Multi-Hop ReAct Agent
            <ChevronRight size={12} />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
            className="text-5xl md:text-7xl font-black leading-tight mb-6"
          >
            Your Company's{' '}
            <span className="gradient-text">Engineering Memory</span>
            {' '}— Powered by AI
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-xl text-text-secondary max-w-3xl mx-auto mb-10 leading-relaxed"
          >
            Instantly understand why technical decisions were made across GitHub, Jira, Slack, and Runbooks.
            Stop losing institutional knowledge when engineers leave.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-4 mb-16"
          >
            <button
              onClick={() => navigate('/signup')}
              className="btn-primary flex items-center gap-2 py-3 px-8 text-base"
            >
              Start Free Trial <ArrowRight size={16} />
            </button>
            <button
              onClick={() => navigate('/login')}
              className="btn-secondary flex items-center gap-2 py-3 px-8 text-base"
            >
              Book Demo
            </button>
          </motion.div>

          {/* Live Demo Card */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="glass rounded-2xl p-6 max-w-3xl mx-auto text-left border border-white/8"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="ml-2 text-xs text-text-muted font-mono">IMA · AI Assistant</span>
            </div>
            <div className="mb-4 p-3 bg-bg-elevated rounded-xl border border-white/5">
              <div className="text-xs text-text-muted mb-2">You asked:</div>
              <div className="text-sm text-text-primary font-mono">
                {typedText}<span className="animate-pulse">|</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="text-xs text-text-secondary">
                <span className="text-accent-blue font-semibold">IMA</span> · Confidence: 94% · 4 sources
              </div>
              <div className="text-sm text-text-primary leading-relaxed">
                The order-service switched to polling in{' '}
                <span className="text-accent-blue font-mono">PR #847</span> because webhook delivery reliability dropped to 73% during peak traffic.
                The root cause was firewall rules blocking inbound GitHub webhook calls, documented in{' '}
                <span className="text-accent-purple font-mono">BACKEND-1123</span>.
              </div>
              <div className="flex flex-wrap gap-2">
                {['PR #847', 'BACKEND-1123', '#backend-infra', 'Runbook v3.2'].map((source, i) => (
                  <span key={i} className="text-[11px] px-2 py-1 bg-white/5 border border-white/8 rounded-lg text-text-secondary font-mono">
                    {source}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 border-y border-white/5">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-3xl font-black gradient-text mb-1">{stat.value}</div>
              <div className="text-sm text-text-secondary">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-xs font-semibold text-accent-blue uppercase tracking-widest">Features</span>
              <h2 className="text-4xl font-black mt-3 mb-4">Everything your engineering team needs</h2>
              <p className="text-text-secondary text-lg max-w-2xl mx-auto">
                Built for modern engineering teams who value institutional knowledge and fast onboarding.
              </p>
            </motion.div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -4 }}
                className={`card p-6 bg-gradient-to-br ${feature.gradient} border border-white/5`}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: `${feature.color}20`, border: `1px solid ${feature.color}30` }}
                >
                  <feature.icon size={20} style={{ color: feature.color }} />
                </div>
                <h3 className="font-bold text-base mb-2">{feature.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-6 bg-bg-card/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-semibold text-accent-purple uppercase tracking-widest">How It Works</span>
            <h2 className="text-4xl font-black mt-3">Get answers in minutes, not days</h2>
          </div>
          <div className="space-y-6">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.15 }}
                viewport={{ once: true }}
                className="flex items-start gap-6 p-6 card"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-blue/20 to-accent-purple/20 border border-accent-blue/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-black gradient-text">{step.num}</span>
                </div>
                <div>
                  <h3 className="font-bold text-base mb-1">{step.title}</h3>
                  <p className="text-sm text-text-secondary">{step.desc}</p>
                </div>
                {i < steps.length - 1 && (
                  <CheckCircle size={18} className="text-accent-green ml-auto flex-shrink-0 mt-1" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-semibold text-accent-green uppercase tracking-widest">Pricing</span>
            <h2 className="text-4xl font-black mt-3 mb-4">Simple, transparent pricing</h2>
            <p className="text-text-secondary">Start free. Scale when ready.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                viewport={{ once: true }}
                className={`card p-8 relative ${plan.popular ? 'border-accent-purple/40 scale-[1.02]' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-accent-blue to-accent-purple rounded-full text-xs font-bold text-white flex items-center gap-1">
                    <Star size={10} /> Most Popular
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="font-bold text-lg mb-1">{plan.name}</h3>
                  <div className="flex items-end gap-1">
                    <span className="text-4xl font-black" style={{ color: plan.color }}>{plan.price}</span>
                    <span className="text-text-secondary text-sm mb-1">{plan.period}</span>
                  </div>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm text-text-secondary">
                      <CheckCircle size={14} style={{ color: plan.color }} className="flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => navigate('/signup')}
                  className={plan.popular ? 'btn-primary w-full py-2.5' : 'btn-secondary w-full py-2.5'}
                >
                  {plan.cta}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-24 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center glass-blue rounded-3xl p-16 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-accent-blue/10 to-accent-purple/10" />
          <div className="relative">
            <Users size={40} className="text-accent-blue mx-auto mb-6" />
            <h2 className="text-4xl font-black mb-4">Stop losing engineering knowledge</h2>
            <p className="text-text-secondary text-lg mb-8 max-w-2xl mx-auto">
              Join 2,000+ engineering teams who use IMA to preserve institutional knowledge and onboard faster.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <button onClick={() => navigate('/signup')} className="btn-primary flex items-center gap-2 py-3 px-8 text-base">
                Start Free Trial <ArrowRight size={16} />
              </button>
              <button onClick={() => navigate('/login')} className="btn-secondary py-3 px-8 text-base">
                Book Demo
              </button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center">
                <Brain size={13} className="text-white" />
              </div>
              <span className="font-bold text-sm">Institutional Memory Agent</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-text-secondary">
              <a href="#" className="hover:text-text-primary transition-colors">Privacy</a>
              <a href="#" className="hover:text-text-primary transition-colors">Terms</a>
              <a href="#" className="hover:text-text-primary transition-colors">Docs</a>
              <a href="#" className="hover:text-text-primary transition-colors">Status</a>
            </div>
            <div className="flex items-center gap-3">
              <GitBranch size={18} className="text-text-secondary hover:text-text-primary cursor-pointer transition-colors" />
              <span className="text-xs text-text-muted">© 2025 IMA. All rights reserved.</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
