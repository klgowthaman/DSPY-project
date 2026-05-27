/**
 * AI Service — real SSE streaming from FastAPI DSPy agent.
 * Falls back to mock streaming if backend is unavailable.
 */
import { authService } from './auth.service';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface AIStreamEvent {
  type: 'reasoning' | 'answer_start' | 'token' | 'citations' | 'done' | 'error';
  data: Record<string, unknown>;
}

export interface Citation {
  id: string;
  type: 'github' | 'jira' | 'slack' | 'runbook';
  title: string;
  url: string;
  excerpt: string;
  date: string;
  relevance: number;
}

export interface AIQueryResult {
  answer: string;
  confidence: number;
  citations: Citation[];
  reasoning: string[];
  sources_used: string[];
}




/**
 * Properly parse SSE events (event: + data: pairs).
 */
export async function streamAIQuerySSE(
  question: string,
  projectId: string = 'all',
  onReasoning: (step: string, index: number) => void,
  onToken: (text: string) => void,
  onComplete: (result: Omit<AIQueryResult, 'answer'>) => void,
): Promise<void> {
  const token = authService.getToken();

  try {
    const response = await fetch(`${BASE_URL}/ai/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        question,
        project_id: projectId !== 'all' ? projectId : null,
      }),
    });

    if (!response.ok) throw new Error(`Backend error: ${response.status}`);
    if (!response.body) throw new Error('No response body');

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      // Parse SSE message blocks (separated by \n\n)
      const messages = buffer.split('\n\n');
      buffer = messages.pop() || '';

      for (const message of messages) {
        if (!message.trim()) continue;
        const lines = message.split('\n');
        let eventType = 'message';
        let dataStr = '';

        for (const line of lines) {
          if (line.startsWith('event: ')) eventType = line.slice(7).trim();
          else if (line.startsWith('data: ')) dataStr = line.slice(6);
        }

        if (!dataStr) continue;
        try {
          const payload = JSON.parse(dataStr);
          handleSSEEvent(eventType, payload, onReasoning, onToken, onComplete);
        } catch {
          // Skip malformed
        }
      }
    }
  } catch (error) {
    console.warn('Backend unavailable, using mock streaming:', error);
    await mockStreamQuery(question, onReasoning, onToken, onComplete);
  }
}

function handleSSEEvent(
  eventType: string,
  payload: Record<string, unknown>,
  onReasoning: (step: string, index: number) => void,
  onToken: (text: string) => void,
  onComplete: (result: Omit<AIQueryResult, 'answer'>) => void,
) {
  switch (eventType) {
    case 'reasoning':
      onReasoning(payload.step as string, payload.index as number);
      break;
    case 'token':
      onToken(payload.text as string);
      break;
    case 'citations':
      onComplete({
        confidence: payload.confidence as number,
        citations: (payload.citations as Citation[]) || [],
        reasoning: (payload.reasoning as string[]) || [],
        sources_used: (payload.sources_used as string[]) || [],
      });
      break;
  }
}

/**
 * Mock streaming fallback when backend is offline.
 */
async function mockStreamQuery(
  question: string,
  onReasoning: (step: string, index: number) => void,
  onToken: (text: string) => void,
  onComplete: (result: Omit<AIQueryResult, 'answer'>) => void,
): Promise<void> {
  const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

  const reasoningSteps = [
    'Identified workspace: Backend Engineering',
    `Searching vector database for: "${question.slice(0, 50)}..."`,
    'Retrieved 8 relevant documents from knowledge base',
    'Multi-hop reasoning across: GitHub, Jira, Slack, Runbooks',
    'Running DSPy ReAct reasoning chain',
    'Cross-validated 3/4 sources, confidence: 94%',
  ];

  for (let i = 0; i < reasoningSteps.length; i++) {
    await sleep(350);
    onReasoning(reasoningSteps[i], i + 1);
  }

  await sleep(400);

  const mockAnswer =
    `The **order-service** switched from webhooks to polling in **PR #847** (Feb 2024) due to critical reliability issues:\n\n` +
    `\`\`\`\nWebhook delivery rate: 73% during peak traffic\nRoot cause: Firewall blocking inbound GitHub webhook calls\nImpact: 3 separate incidents in one week\n\`\`\`\n\n` +
    `**Key decision factors (from Jira BACKEND-1123 & Slack #backend-infra):**\n\n` +
    `1. **Firewall constraints** — The Kubernetes network policy blocked inbound webhook connections from GitHub's IP ranges\n` +
    `2. **Reliability requirement** — Order processing requires >99.9% event delivery guarantee\n` +
    `3. **Observability** — Polling provides predictable, auditable event ingestion with built-in retry logic\n\n` +
    `The trade-off (~30s latency vs near-real-time) was accepted because order state transitions don't require sub-second updates.\n\n` +
    `> *Start the backend and configure OPENAI_API_KEY to get real DSPy-powered answers from your engineering data.*`;

  // Stream tokens
  const chunkSize = 6;
  for (let i = 0; i < mockAnswer.length; i += chunkSize) {
    onToken(mockAnswer.slice(i, i + chunkSize));
    await sleep(20);
  }

  onComplete({
    confidence: 94,
    citations: [
      { id: 'c1', type: 'github', title: 'PR #847: Switch to polling', url: '#', excerpt: 'Webhook delivery rate dropped to 73%...', date: 'Feb 15, 2024', relevance: 0.98 },
      { id: 'c2', type: 'jira', title: 'BACKEND-1123: Webhook failures', url: '#', excerpt: 'Root cause: firewall blocking inbound connections...', date: 'Feb 10, 2024', relevance: 0.94 },
      { id: 'c3', type: 'slack', title: '#backend-infra thread', url: '#', excerpt: 'After the third incident this week...', date: 'Feb 8, 2024', relevance: 0.87 },
      { id: 'c4', type: 'runbook', title: 'Architecture Runbook v3.2', url: '#', excerpt: 'Polling interval: 30s, backoff strategy: exponential...', date: 'Mar 1, 2024', relevance: 0.82 },
    ],
    reasoning: reasoningSteps,
    sources_used: ['github', 'jira', 'slack', 'runbook'],
  });
}
