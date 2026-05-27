import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3, AlertTriangle, BookOpen,
  MessageSquare, Activity, Brain
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, RadarChart, Radar,
  PolarGrid, PolarAngleAxis,
} from 'recharts';
import { mockAnalytics, mockTopQuestions, mockKnowledgeGaps } from '../data/mockData';
import { Badge, GlassCard } from '../components/ui';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="custom-tooltip">
      <p className="text-text-secondary text-xs mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color }} className="text-xs font-semibold">
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
};

const usageBySource = [
  { name: 'GitHub', value: 38, color: '#4F8CFF' },
  { name: 'Jira', value: 27, color: '#8B5CF6' },
  { name: 'Slack', value: 24, color: '#22C55E' },
  { name: 'Runbooks', value: 11, color: '#F59E0B' },
];

const teamActivity = [
  { member: 'Alex C.', queries: 87, saved: 14, confidence: 92 },
  { member: 'Sarah K.', queries: 62, saved: 9, confidence: 89 },
  { member: 'Priya P.', queries: 45, saved: 7, confidence: 91 },
  { member: 'James L.', queries: 38, saved: 5, confidence: 87 },
  { member: 'Marcus W.', queries: 22, saved: 3, confidence: 85 },
];

const radarData = [
  { topic: 'Architecture', score: 78 },
  { topic: 'Deployments', score: 42 },
  { topic: 'APIs', score: 85 },
  { topic: 'DB Schema', score: 55 },
  { topic: 'Auth Flow', score: 71 },
  { topic: 'Monitoring', score: 64 },
];

const AnalyticsDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black">Analytics</h1>
          <p className="text-text-secondary text-sm mt-1">Team knowledge insights and usage patterns</p>
        </div>
        <div className="flex gap-1 bg-bg-card border border-white/8 rounded-xl p-1">
          {(['7d', '30d', '90d'] as const).map(r => (
            <button
              key={r}
              onClick={() => setTimeRange(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                timeRange === r ? 'bg-accent-blue text-white' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: MessageSquare, label: 'Total Queries', value: '513', change: '+12%', color: '#4F8CFF' },
          { icon: Brain, label: 'Avg Confidence', value: '91%', change: '+3pts', color: '#8B5CF6' },
          { icon: Activity, label: 'Active Users', value: '11', change: '+2', color: '#22C55E' },
          { icon: BookOpen, label: 'Stale Docs', value: '7', change: '-3', color: '#F59E0B' },
        ].map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="card p-5"
          >
            <div className="flex items-center gap-2 mb-3">
              <kpi.icon size={14} style={{ color: kpi.color }} />
              <span className="text-xs text-text-muted">{kpi.label}</span>
            </div>
            <div className="text-2xl font-black">{kpi.value}</div>
            <div className="text-xs text-accent-green mt-1">{kpi.change} vs prev period</div>
          </motion.div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Activity Chart */}
        <div className="lg:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-sm">Query Volume & Confidence</h2>
            <Badge variant="blue" size="sm">Last 7 days</Badge>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={mockAnalytics}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="date" tick={{ fill: '#94A3B8', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#94A3B8', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="queries" fill="#4F8CFF" radius={[4, 4, 0, 0]} name="Queries" />
              <Bar dataKey="users" fill="#8B5CF6" radius={[4, 4, 0, 0]} name="Active Users" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Source Distribution */}
        <div className="card p-6">
          <h2 className="font-bold text-sm mb-4">Source Usage</h2>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={usageBySource} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value">
                {usageBySource.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: '#1a2236', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-3">
            {usageBySource.map(s => (
              <div key={s.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: s.color }} />
                  <span className="text-text-secondary">{s.name}</span>
                </div>
                <span className="font-semibold">{s.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Questions */}
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 size={14} className="text-accent-blue" />
            <h2 className="font-bold text-sm">Most Asked Questions</h2>
          </div>
          <div className="space-y-3">
            {mockTopQuestions.map((q, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-xs font-mono text-text-muted w-5 flex-shrink-0">{String(i + 1).padStart(2, '0')}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-text-secondary truncate">{q.question}</p>
                  <div className="h-1 bg-bg-elevated rounded-full mt-1.5 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-accent-blue"
                      style={{ width: `${(q.count / mockTopQuestions[0].count) * 100}%` }}
                    />
                  </div>
                </div>
                <span className="text-xs font-semibold text-text-primary flex-shrink-0">{q.count}</span>
                <span className={`text-[10px] ${q.trend === 'up' ? 'text-accent-green' : q.trend === 'down' ? 'text-red-400' : 'text-text-muted'}`}>
                  {q.trend === 'up' ? '↑' : q.trend === 'down' ? '↓' : '→'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Knowledge Gaps Radar */}
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={14} className="text-accent-orange" />
            <h2 className="font-bold text-sm">Knowledge Coverage</h2>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.06)" />
              <PolarAngleAxis dataKey="topic" tick={{ fill: '#94A3B8', fontSize: 10 }} />
              <Radar dataKey="score" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.15} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Knowledge Gaps Table */}
      <GlassCard hover={false}>
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle size={14} className="text-accent-orange" />
          <h3 className="font-semibold text-sm">Knowledge Gaps Detected</h3>
          <Badge variant="orange" size="sm">{mockKnowledgeGaps.length} areas</Badge>
        </div>
        <div className="space-y-3">
          {mockKnowledgeGaps.map((gap, i) => (
            <div key={i} className="flex items-center gap-4">
              <span className="text-sm text-text-secondary w-48 flex-shrink-0">{gap.area}</span>
              <div className="flex-1 h-1.5 bg-bg-elevated rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${gap.score}%`,
                    background: gap.score < 40 ? '#EF4444' : gap.score < 60 ? '#F59E0B' : '#22C55E',
                  }}
                />
              </div>
              <span className="text-xs font-semibold w-10 text-right">{gap.score}%</span>
              <Badge
                variant={gap.severity === 'critical' ? 'red' : gap.severity === 'warning' ? 'orange' : 'gray'}
                size="sm"
              >
                {gap.severity}
              </Badge>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Team Activity */}
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Activity size={14} className="text-accent-blue" />
          <h2 className="font-bold text-sm">Team Activity</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {['Member', 'Queries', 'Saved', 'Avg. Confidence'].map(h => (
                  <th key={h} className="text-left py-2 px-3 text-xs text-text-muted font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {teamActivity.map((member, i) => (
                <tr key={i} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-accent-blue/20 flex items-center justify-center text-[10px] font-bold text-accent-blue">
                        {member.member.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="text-text-primary text-xs">{member.member}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-xs font-semibold">{member.queries}</td>
                  <td className="py-3 px-3 text-xs text-text-secondary">{member.saved}</td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-bg-elevated rounded-full overflow-hidden max-w-20">
                        <div className="h-full rounded-full bg-accent-green" style={{ width: `${member.confidence}%` }} />
                      </div>
                      <span className="text-xs font-semibold text-accent-green">{member.confidence}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
