import React, { useState } from 'react';
import ReactFlow, {
  type Node, type Edge, Background, Controls, MiniMap,
  useNodesState, useEdgesState, BackgroundVariant,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { motion } from 'framer-motion';
import { Network, GitBranch, Ticket, Hash, BookOpen, Cpu, Filter } from 'lucide-react';
import { Badge } from '../components/ui';

const nodeColors: Record<string, string> = {
  service: '#4F8CFF',
  pr: '#8B5CF6',
  ticket: '#06B6D4',
  slack: '#22C55E',
  decision: '#F59E0B',
  runbook: '#EF4444',
};

const initialNodes: Node[] = [
  // Services
  { id: 'order-service', type: 'default', position: { x: 300, y: 200 }, data: { label: 'order-service', type: 'service' } },
  { id: 'payment-service', type: 'default', position: { x: 600, y: 100 }, data: { label: 'payment-service', type: 'service' } },
  { id: 'auth-gateway', type: 'default', position: { x: 50, y: 350 }, data: { label: 'auth-gateway', type: 'service' } },
  { id: 'notification-hub', type: 'default', position: { x: 600, y: 350 }, data: { label: 'notification-hub', type: 'service' } },
  // PRs
  { id: 'pr-847', type: 'default', position: { x: 200, y: 50 }, data: { label: 'PR #847: Polling', type: 'pr' } },
  { id: 'pr-891', type: 'default', position: { x: 500, y: 500 }, data: { label: 'PR #891: Circuit Breaker', type: 'pr' } },
  // Tickets
  { id: 'jira-1123', type: 'default', position: { x: 800, y: 200 }, data: { label: 'BACKEND-1123', type: 'ticket' } },
  { id: 'jira-1156', type: 'default', position: { x: 800, y: 400 }, data: { label: 'BACKEND-1156', type: 'ticket' } },
  // Slack
  { id: 'slack-infra', type: 'default', position: { x: 50, y: 100 }, data: { label: '#backend-infra', type: 'slack' } },
  // Decisions
  { id: 'decision-polling', type: 'default', position: { x: 300, y: 430 }, data: { label: 'ADR: Polling > Webhooks', type: 'decision' } },
  // Runbooks
  { id: 'runbook-arch', type: 'default', position: { x: 100, y: 550 }, data: { label: 'Runbook: Architecture', type: 'runbook' } },
].map(node => ({
  ...node,
  style: {
    background: `${nodeColors[node.data.type]}15`,
    border: `1.5px solid ${nodeColors[node.data.type]}50`,
    borderRadius: 10,
    color: '#F8FAFC',
    fontSize: 11,
    fontWeight: 600,
    padding: '8px 12px',
    minWidth: 140,
    textAlign: 'center' as const,
  },
}));

const initialEdges: Edge[] = [
  { id: 'e1', source: 'pr-847', target: 'order-service', markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#8B5CF6', strokeWidth: 1.5 }, label: 'modified' },
  { id: 'e2', source: 'jira-1123', target: 'pr-847', markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#06B6D4', strokeWidth: 1.5 }, label: 'triggered' },
  { id: 'e3', source: 'slack-infra', target: 'jira-1123', markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#22C55E', strokeWidth: 1.5 }, label: 'reported' },
  { id: 'e4', source: 'decision-polling', target: 'order-service', markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#F59E0B', strokeWidth: 1.5 }, label: 'governs' },
  { id: 'e5', source: 'pr-891', target: 'payment-service', markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#8B5CF6', strokeWidth: 1.5 } },
  { id: 'e6', source: 'jira-1156', target: 'order-service', markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#06B6D4', strokeWidth: 1.5 } },
  { id: 'e7', source: 'order-service', target: 'payment-service', style: { stroke: '#4F8CFF44', strokeWidth: 1 }, label: 'calls' },
  { id: 'e8', source: 'order-service', target: 'notification-hub', style: { stroke: '#4F8CFF44', strokeWidth: 1 }, label: 'emits' },
  { id: 'e9', source: 'auth-gateway', target: 'order-service', style: { stroke: '#4F8CFF44', strokeWidth: 1 }, label: 'authenticates' },
  { id: 'e10', source: 'runbook-arch', target: 'decision-polling', style: { stroke: '#EF444444', strokeWidth: 1 }, label: 'documents' },
];

const legendItems = [
  { type: 'service', label: 'Service', icon: Cpu },
  { type: 'pr', label: 'Pull Request', icon: GitBranch },
  { type: 'ticket', label: 'Jira Ticket', icon: Ticket },
  { type: 'slack', label: 'Slack Thread', icon: Hash },
  { type: 'decision', label: 'ADR/Decision', icon: Network },
  { type: 'runbook', label: 'Runbook', icon: BookOpen },
];

const KnowledgeGraph: React.FC = () => {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const filteredNodes = activeFilter
    ? nodes.map(n => ({ ...n, hidden: n.data.type !== activeFilter && activeFilter !== null }))
    : nodes;

  return (
    <div className="space-y-4 animate-fade-in h-[calc(100vh-136px)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between flex-shrink-0">
        <div>
          <h1 className="text-2xl font-black">Knowledge Graph</h1>
          <p className="text-text-secondary text-sm mt-1">Interactive visualization of engineering decisions, services, and data sources</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="blue" dot>{nodes.length} nodes</Badge>
          <Badge variant="purple" dot>{edges.length} connections</Badge>
        </div>
      </div>

      {/* Legend + Filters */}
      <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
        <Filter size={13} className="text-text-muted" />
        <span className="text-xs text-text-muted">Filter:</span>
        <button
          onClick={() => setActiveFilter(null)}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${!activeFilter ? 'bg-accent-blue text-white' : 'bg-bg-elevated text-text-secondary hover:bg-white/10'}`}
        >
          All
        </button>
        {legendItems.map(item => (
          <button
            key={item.type}
            onClick={() => setActiveFilter(activeFilter === item.type ? null : item.type)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
              activeFilter === item.type ? 'text-white' : 'bg-bg-elevated text-text-secondary hover:bg-white/10'
            }`}
            style={activeFilter === item.type ? { background: nodeColors[item.type] } : {}}
          >
            <span className="w-2 h-2 rounded-full" style={{ background: nodeColors[item.type] }} />
            {item.label}
          </button>
        ))}
      </div>

      {/* Graph Canvas */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex-1 rounded-2xl overflow-hidden border border-white/8"
      >
        <ReactFlow
          nodes={filteredNodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          fitView
          attributionPosition="bottom-right"
          edgesFocusable={false}
          elementsSelectable={true}
          style={{ background: '#0B0F19' }}
        >
          <Background color="#4F8CFF" gap={40} size={0.5} variant={BackgroundVariant.Dots} />
          <Controls />
          <MiniMap
            nodeColor={(n) => nodeColors[n.data?.type] || '#4F8CFF'}
            maskColor="rgba(11,15,25,0.85)"
          />
        </ReactFlow>
      </motion.div>
    </div>
  );
};

export default KnowledgeGraph;
