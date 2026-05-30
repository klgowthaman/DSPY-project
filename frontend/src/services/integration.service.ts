import api from './api';
import { mockIntegrations } from '../data/mockData';

export const integrationService = {
  async list() {
    try {
      const { data } = await api.get('/integrations');
      return data.integrations;
    } catch {
      return mockIntegrations;
    }
  },

  async connect(type: string, token: string, baseUrl?: string) {
    const { data } = await api.post(`/integrations/${type}/connect`, {
      token,
      base_url: baseUrl,
    });
    return data;
  },

  async sync(type: string) {
    const { data } = await api.post(`/integrations/${type}/sync`);
    return data;
  },

  async disconnect(type: string) {
    const { data } = await api.delete(`/integrations/${type}`);
    return data;
  },
};
