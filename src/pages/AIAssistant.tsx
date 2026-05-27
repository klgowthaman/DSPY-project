import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send, ChevronDown, ChevronUp, Sparkles, RotateCcw,
  AlertTriangle, BookOpen, FolderOpen
} from 'lucide-react';
import { streamAIQuerySSE } from '../services/ai.service';
import { mockSuggestedQuestions, mockProjects } from '../data/mockData';
import type { ChatMessage } from '../types';
import { AITypingIndicator, ConfidenceBar, CitationChip, Badge, GlassCard } from '../components/ui';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';


function parseMarkdown(text: string): React.ReactNode {
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;

  while ((match = codeBlockRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(<span key={lastIndex} dangerouslySetInnerHTML={{ __html: formatInline(text.slice(lastIndex, match.index)) }} />);
    }
    parts.push(
      <div key={match.index} className="my-3 rounded-xl overflow-hidden border border-white/5">
        <div className="flex items-center justify-between px-3 py-1.5 bg-white/5 border-b border-white/5">
          <span className="text-[10px] font-mono text-text-muted">{match[1] || 'code'}</span>
        </div>
        <SyntaxHighlighter
          language={match[1] || 'text'}
          style={vscDarkPlus}
          customStyle={{ margin: 0, background: '#0d1117', fontSize: '12px', padding: '12px' }}
        >
          {match[2].trim()}
        </SyntaxHighlighter>
      </div>
    );
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(<span key={lastIndex} dangerouslySetInnerHTML={{ __html: formatInline(text.slice(lastIndex)) }} />);
  }

  return <>{parts}</>;
}

function formatInline(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-text-primary font-semibold">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="text-text-secondary">$1</em>')
    .replace(/`(.*?)`/g, '<code class="font-mono text-accent-blue bg-accent-blue/10 px-1.5 py-0.5 rounded text-xs">$1</code>')
    .replace(/^> (.*)/gm, '<div class="border-l-2 border-accent-blue/40 pl-3 text-text-secondary italic my-2">$1</div>')
    .replace(/^\d+\. (.*)/gm, '<div class="ml-2 my-1">• $1</div>')
    .replace(/\n\n/g, '<br/><br/>')
    .replace(/\n/g, '<br/>');
}

const AIAssistant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedProject, setSelectedProject] = useState('all');
  const [expandedReasoning, setExpandedReasoning] = useState<string | null>(null);
  const [showCitations, setShowCitations] = useState<string | null>(null);
  const [liveReasoning, setLiveReasoning] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const streamingMsgRef = useRef<string | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isTyping) return;
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString(),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    setLiveReasoning([]);

    // Create placeholder AI message for streaming
    const aiMsgId = (Date.now() + 1).toString();
    streamingMsgRef.current = aiMsgId;
    const aiMsg: ChatMessage = {
      id: aiMsgId,
      role: 'assistant',
      content: '',
      timestamp: new Date().toLocaleTimeString(),
      confidence: 0,
      citations: [],
      reasoning: [],
    };
    setMessages(prev => [...prev, aiMsg]);

    await streamAIQuerySSE(
      text,
      selectedProject,
      // onReasoning
      (step, _idx) => {
        setLiveReasoning(prev => [...prev, step]);
      },
      // onToken — append to the streaming message
      (token) => {
        setMessages(prev =>
          prev.map(m =>
            m.id === aiMsgId ? { ...m, content: m.content + token } : m
          )
        );
      },
      // onComplete — set final citations + confidence
      ({ confidence, citations, reasoning }) => {
        setMessages(prev =>
          prev.map(m =>
            m.id === aiMsgId
              ? {
                  ...m,
                  confidence,
                  citations: citations as unknown as ChatMessage['citations'],
                  reasoning,
                }
              : m
          )
        );
        setLiveReasoning([]);
        setIsTyping(false);
      },
    );

    setIsTyping(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setExpandedReasoning(null);
    setShowCitations(null);
    setLiveReasoning([]);
    streamingMsgRef.current = null;
  };

  return (
    <div className="flex h-[calc(100vh-136px)] gap-4 animate-fade-in">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center">
              <Sparkles size={15} className="text-white" />
            </div>
            <div>
              <h1 className="font-bold text-base">AI Engineering Assistant</h1>
              <p className="text-xs text-text-muted">DSPy Multi-Hop ReAct · MIPROv2 Optimized</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Project Selector */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-bg-card border border-white/8 rounded-xl">
              <FolderOpen size={12} className="text-text-secondary" />
              <select
                value={selectedProject}
                onChange={e => setSelectedProject(e.target.value)}
                className="bg-transparent text-xs text-text-secondary outline-none"
              >
                <option value="all">All Projects</option>
                {mockProjects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            {messages.length > 0 && (
              <button onClick={clearChat} className="btn-secondary flex items-center gap-1.5 text-xs py-1.5 px-3">
                <RotateCcw size={11} /> Clear
              </button>
            )}
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-blue/20 to-accent-purple/20 border border-accent-blue/20 flex items-center justify-center mb-6">
                <Sparkles size={28} className="text-accent-blue" />
              </div>
              <h2 className="font-bold text-lg mb-2">Ask about your engineering history</h2>
              <p className="text-text-secondary text-sm max-w-md mb-8">
                I'll search across GitHub PRs, Jira tickets, Slack discussions, and Runbooks to answer your technical questions.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg">
                {mockSuggestedQuestions.slice(0, 4).map(q => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="text-left text-xs p-3 rounded-xl bg-bg-card border border-white/5 hover:border-accent-blue/20 hover:bg-accent-blue/5 transition-all text-text-secondary hover:text-text-primary"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          <AnimatePresence>
            {messages.map(msg => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                  msg.role === 'user' ? 'bg-accent-blue text-white' : 'bg-gradient-to-br from-accent-blue to-accent-purple text-white'
                }`}>
                  {msg.role === 'user' ? 'U' : 'AI'}
                </div>
                <div className={`max-w-[85%] space-y-2 ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col`}>
                  <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-accent-blue/20 border border-accent-blue/20 text-text-primary rounded-tr-sm'
                      : 'bg-bg-card border border-white/5 text-text-primary rounded-tl-sm'
                  }`}>
                    {msg.role === 'assistant' ? parseMarkdown(msg.content) : msg.content}
                  </div>

                  {/* AI message extras */}
                  {msg.role === 'assistant' && (
                    <div className="space-y-2 w-full">
                      {/* Confidence + Staleness */}
                      <div className="flex items-center gap-3">
                        <ConfidenceBar score={msg.confidence || 0} size="sm" />
                        <div className="flex items-center gap-1 text-[11px] text-orange-400">
                          <AlertTriangle size={10} />
                          <span>1 source may be stale ({'>'} 90 days)</span>
                        </div>
                      </div>

                      {/* Citations */}
                      {msg.citations && (
                        <div>
                          <button
                            onClick={() => setShowCitations(showCitations === msg.id ? null : msg.id)}
                            className="flex items-center gap-1.5 text-[11px] text-text-secondary hover:text-accent-blue transition-colors"
                          >
                            <BookOpen size={11} />
                            {msg.citations.length} sources cited
                            {showCitations === msg.id ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
                          </button>
                          <AnimatePresence>
                            {showCitations === msg.id && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-2 flex flex-wrap gap-2 overflow-hidden"
                              >
                                {msg.citations.map(c => (
                                  <CitationChip key={c.id} type={c.type} title={c.title} relevance={c.relevance} />
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )}

                      {/* Reasoning Trace */}
                      {msg.reasoning && (
                        <div>
                          <button
                            onClick={() => setExpandedReasoning(expandedReasoning === msg.id ? null : msg.id)}
                            className="flex items-center gap-1.5 text-[11px] text-text-secondary hover:text-accent-purple transition-colors"
                          >
                            <Sparkles size={10} />
                            View reasoning trace
                            {expandedReasoning === msg.id ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
                          </button>
                          <AnimatePresence>
                            {expandedReasoning === msg.id && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-2 bg-bg-elevated rounded-xl p-3 border border-white/5 overflow-hidden"
                              >
                                {msg.reasoning.map((step, i) => (
                                  <div key={i} className="flex items-start gap-2 py-1 text-[11px] text-text-secondary">
                                    <span className="text-accent-purple font-mono flex-shrink-0">{String(i + 1).padStart(2, '0')}</span>
                                    <span>{step}</span>
                                  </div>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )}
                    </div>
                  )}

                  <span className="text-[10px] text-text-muted">{msg.timestamp}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center text-xs font-bold flex-shrink-0">AI</div>
              <div className="bg-bg-card border border-white/5 rounded-2xl rounded-tl-sm p-4 max-w-[85%]">
                {liveReasoning.length > 0 ? (
                  <div className="space-y-1.5">
                    {liveReasoning.map((step, i) => (
                      <div key={i} className="flex items-start gap-2 text-[11px] text-text-secondary">
                        <span className="text-accent-purple font-mono flex-shrink-0">{String(i + 1).padStart(2, '0')}</span>
                        <span>{step}</span>
                      </div>
                    ))}
                    <div className="flex gap-1 mt-2">
                      {[0,1,2].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-accent-blue animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />)}
                    </div>
                  </div>
                ) : (
                  <AITypingIndicator />
                )}
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="mt-4">
          <div className="glass rounded-2xl border border-white/8 focus-within:border-accent-blue/30 transition-all">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about engineering decisions, architecture choices, or project history..."
              rows={3}
              className="w-full bg-transparent px-4 pt-4 pb-2 text-sm text-text-primary placeholder:text-text-muted resize-none outline-none"
            />
            <div className="flex items-center justify-between px-4 pb-3">
              <div className="flex items-center gap-2">
                <Badge variant="purple" size="sm">DSPy ReAct</Badge>
                <Badge variant="blue" size="sm">MIPROv2</Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-text-muted">⇧↵ new line · ↵ send</span>
                <button
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim() || isTyping}
                  className="w-8 h-8 rounded-xl bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center disabled:opacity-30 transition-opacity hover:scale-105 active:scale-95"
                >
                  <Send size={13} className="text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Context */}
      <div className="w-64 flex-shrink-0 space-y-4">
        <GlassCard padding="p-4" hover={false}>
          <h3 className="font-semibold text-sm mb-3">Active Context</h3>
          <div className="space-y-2">
            <div className="text-xs text-text-secondary flex justify-between">
              <span>Projects</span><span className="text-text-primary font-mono">5</span>
            </div>
            <div className="text-xs text-text-secondary flex justify-between">
              <span>Vector chunks</span><span className="text-text-primary font-mono">14.1K</span>
            </div>
            <div className="text-xs text-text-secondary flex justify-between">
              <span>GitHub PRs</span><span className="text-text-primary font-mono">1,847</span>
            </div>
            <div className="text-xs text-text-secondary flex justify-between">
              <span>Jira tickets</span><span className="text-text-primary font-mono">3,241</span>
            </div>
            <div className="text-xs text-text-secondary flex justify-between">
              <span>Slack threads</span><span className="text-text-primary font-mono">8,912</span>
            </div>
          </div>
        </GlassCard>

        <GlassCard padding="p-4" hover={false}>
          <h3 className="font-semibold text-sm mb-3">Suggested Questions</h3>
          <div className="space-y-1.5">
            {mockSuggestedQuestions.slice(0, 5).map(q => (
              <button
                key={q}
                onClick={() => sendMessage(q)}
                className="w-full text-left text-[11px] text-text-secondary hover:text-accent-blue p-2 rounded-lg hover:bg-accent-blue/5 transition-all leading-relaxed"
              >
                {q}
              </button>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default AIAssistant;
