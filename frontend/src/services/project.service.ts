import api from './api';
import { mockProjects } from '../data/mockData';

export const projectService = {
  async list() {
    try {
      const { data } = await api.get('/projects');
      return data.projects;
    } catch {
      return mockProjects;
    }
  },

  async get(id: string) {
    try {
      const { data } = await api.get(`/projects/${id}`);
      return data;
    } catch {
      return mockProjects.find(p => p.id === id) || mockProjects[0];
    }
  },

  async create(payload: { 
    name: string; 
    description?: string; 
    language?: string; 
    repo_url?: string;
    github_token?: string;
    jira_token?: string;
    slack_token?: string;
  }) {
    const { data } = await api.post('/projects', payload);
    return data;
  },

  async delete(id: string) {
    await api.delete(`/projects/${id}`);
  },

  async updateIntegrations(id: string, payload: {
    github_token?: string;
    jira_token?: string;
    slack_token?: string;
    llm_api_key?: string;
  }) {
    const { data } = await api.put(`/projects/${id}/integrations`, payload);
    return data;
  },
};
