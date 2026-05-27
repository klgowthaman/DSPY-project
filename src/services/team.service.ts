import api from './api';
import { mockTeamMembers } from '../data/mockData';

export const teamService = {
  async listMembers() {
    try {
      const { data } = await api.get('/team/members');
      return data.members;
    } catch {
      return mockTeamMembers;
    }
  },

  async invite(email: string, role: 'engineer' | 'viewer') {
    const { data } = await api.post('/team/members/invite', { email, role });
    return data;
  },

  async remove(memberId: string) {
    await api.delete(`/team/members/${memberId}`);
  },

  async updateRole(memberId: string, role: string) {
    const { data } = await api.patch(`/team/members/${memberId}/role`, { role });
    return data;
  },
};
