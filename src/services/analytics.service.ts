import api from './api';
import { mockAnalytics, mockTopQuestions, mockKnowledgeGaps } from '../data/mockData';

export const analyticsService = {
  async getOverview() {
    try {
      const { data } = await api.get('/analytics/overview');
      return data.data;
    } catch {
      return {
        total_projects: 5,
        total_repositories: 23,
        jira_tickets_indexed: 3241,
        slack_threads_indexed: 8912,
        ai_queries_today: 87,
        knowledge_confidence_score: 91,
      };
    }
  },

  async getQueryActivity() {
    try {
      const { data } = await api.get('/analytics/queries');
      return data.data;
    } catch {
      return mockAnalytics;
    }
  },

  async getTopQuestions() {
    try {
      const { data } = await api.get('/analytics/top-questions');
      return data.data;
    } catch {
      return mockTopQuestions;
    }
  },

  async getKnowledgeGaps() {
    try {
      const { data } = await api.get('/analytics/knowledge-gaps');
      return data.data;
    } catch {
      return mockKnowledgeGaps;
    }
  },
};
