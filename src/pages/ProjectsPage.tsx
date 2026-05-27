import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GitBranch, Ticket, Hash, Star, ArrowRight, Activity } from 'lucide-react';
import { mockProjects } from '../data/mockData';
import { Badge } from '../components/ui';

const langColor: Record<string, string> = {
  'Go': '#00ADD8', 'Python': '#3776AB', 'TypeScript': '#3178C6', 'Rust': '#CE422B',
};

const ProjectsPage: React.FC = () => {
  const navigate = useNavigate();

  const statusVariant = (s: string): 'green' | 'orange' | 'red' => {
    if (s === 'healthy') return 'green';
    if (s === 'warning') return 'orange';
    return 'red';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black">Projects</h1>
          <p className="text-text-secondary text-sm mt-1">{mockProjects.length} repositories indexed</p>
        </div>
        <button className="btn-primary text-sm py-2 px-4">+ Add Project</button>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {mockProjects.map((project, i) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ y: -3 }}
            onClick={() => navigate(`/projects/${project.id}`)}
            className="card p-6 cursor-pointer"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-blue/20 to-accent-purple/20 border border-accent-blue/10 flex items-center justify-center">
                  <span className="text-base font-black text-accent-blue">{project.name[0].toUpperCase()}</span>
                </div>
                <div>
                  <h3 className="font-bold text-sm font-mono">{project.name}</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: langColor[project.language] || '#94A3B8' }} />
                    <span className="text-[11px] text-text-muted">{project.language}</span>
                  </div>
                </div>
              </div>
              <Badge variant={statusVariant(project.status)} dot size="sm">{project.status}</Badge>
            </div>

            <p className="text-xs text-text-secondary leading-relaxed mb-4 line-clamp-2">{project.description}</p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="text-center p-2 bg-bg-elevated rounded-lg border border-white/5">
                <GitBranch size={11} className="text-text-muted mx-auto mb-1" />
                <div className="text-xs font-bold">{project.prCount}</div>
                <div className="text-[9px] text-text-muted">PRs</div>
              </div>
              <div className="text-center p-2 bg-bg-elevated rounded-lg border border-white/5">
                <Ticket size={11} className="text-text-muted mx-auto mb-1" />
                <div className="text-xs font-bold">{project.jiraCount}</div>
                <div className="text-[9px] text-text-muted">Tickets</div>
              </div>
              <div className="text-center p-2 bg-bg-elevated rounded-lg border border-white/5">
                <Hash size={11} className="text-text-muted mx-auto mb-1" />
                <div className="text-xs font-bold">{project.slackActivity}</div>
                <div className="text-[9px] text-text-muted">Threads</div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-[11px] text-text-muted">
                <Star size={10} /> {project.stars}
              </div>
              <div className="flex items-center gap-1 text-[11px] text-text-muted">
                <Activity size={10} /> {project.lastActivity}
              </div>
              <ArrowRight size={12} className="text-text-muted" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsPage;
