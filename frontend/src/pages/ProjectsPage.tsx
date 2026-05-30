import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { GitBranch, Ticket, Hash, Star, ArrowRight, Activity, Plus } from 'lucide-react';
import { mockProjects } from '../data/mockData';
import { Badge } from '../components/ui';
import { projectService } from '../services/project.service';

const langColor: Record<string, string> = {
  'Go': '#00ADD8', 'Python': '#3776AB', 'TypeScript': '#3178C6', 'Rust': '#CE422B',
};

const ProjectsPage: React.FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '', language: 'Go' });

  const statusVariant = (s: string): 'green' | 'orange' | 'red' => {
    if (s === 'healthy') return 'green';
    if (s === 'warning') return 'orange';
    return 'red';
  };

  React.useEffect(() => {
    projectService.list().then(data => {
      setProjects(data);
      setLoading(false);
    });
  }, []);

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.name.trim()) return;
    try {
      const created = await projectService.create({
        name: newProject.name.trim(),
        description: newProject.description.trim() || 'No description provided.',
      });
      setProjects(prev => [created, ...prev]);
      setNewProject({ name: '', description: '', language: 'Go' });
      setAddOpen(false);
      navigate(`/projects/${created.id}`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in relative">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black">Projects</h1>
          <p className="text-text-secondary text-sm mt-1">{projects.length} repositories indexed</p>
        </div>
        <button onClick={() => setAddOpen(true)} className="btn-primary text-sm py-2 px-4 flex items-center gap-1.5">
          <Plus size={14} /> Add Project
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-text-secondary animate-pulse">Loading projects...</div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {projects.length === 0 ? (
          <div className="col-span-full card p-12 text-center border-dashed border-white/10 mt-4">
            <GitBranch size={32} className="text-text-muted mx-auto mb-4" />
            <h3 className="font-bold text-lg mb-2">No projects indexed yet</h3>
            <p className="text-sm text-text-secondary mb-6 max-w-sm mx-auto">
              Connect a GitHub repository or add a project to start retrieving engineering knowledge.
            </p>
            <button onClick={() => setAddOpen(true)} className="btn-primary text-sm py-2 px-6 flex items-center gap-1.5 mx-auto">
              <Plus size={14} /> Add Your First Project
            </button>
          </div>
        ) : (
          projects.map((project, i) => (
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
          ))
        )}
      </div>
      )}

      {/* Add Project Modal */}
      <AnimatePresence>
        {addOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass rounded-2xl p-8 max-w-md w-full mx-4 border border-white/10"
            >
              <h3 className="font-bold text-lg mb-2 text-text-primary">
                Create New Project
              </h3>
              <p className="text-sm text-text-secondary mb-6">
                Configure your project details.
              </p>
              
              <form onSubmit={handleAddProject} className="space-y-4">
                <div>
                  <label className="text-xs text-text-secondary mb-1.5 block font-medium">Project Name</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. core-auth-service"
                    value={newProject.name}
                    onChange={e => setNewProject({ ...newProject, name: e.target.value })}
                    className="w-full bg-bg-elevated border border-white/8 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-accent-blue/40 transition-all text-text-primary placeholder:text-text-muted"
                  />
                </div>
                <div>
                  <label className="text-xs text-text-secondary mb-1.5 block font-medium">Description</label>
                  <textarea
                    placeholder="Brief description of the service's purpose and architecture..."
                    value={newProject.description}
                    onChange={e => setNewProject({ ...newProject, description: e.target.value })}
                    className="w-full h-24 bg-bg-elevated border border-white/8 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-accent-blue/40 transition-all text-text-primary placeholder:text-text-muted resize-none"
                  />
                </div>
                <div className="flex gap-3 pt-4 border-t border-white/10 mt-4">
                  <button type="button" onClick={() => setAddOpen(false)} className="btn-secondary flex-1 py-2">
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary flex-1 py-2 flex items-center justify-center gap-1.5">
                    <Plus size={14} /> Create Project
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectsPage;
