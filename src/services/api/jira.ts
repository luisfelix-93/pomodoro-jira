import axios from 'axios';

// Create axios instance pointing to our Local Backend
const apiClient = axios.create({
  baseURL: 'http://localhost:3001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const jiraApi = {
  // Login now goes to our backend, which validates with Jira
  login: async (domain: string, email: string, token: string) => {
    const response = await apiClient.post('/auth/login', { domain, email, token });
    return response.data;
  },

  // Get status of local backend session
  getStatus: async () => {
    const response = await apiClient.get('/auth/status');
    return response.data;
  },

  // Logout from local backend session
  logout: async () => {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  },

  // Tasks now fetched from local DB (which syncs with Jira)
  getTasks: async (excludeStatus?: string[]) => {
    const params = excludeStatus ? { excludeStatus: excludeStatus.join(',') } : {};
    const response = await apiClient.get('/tasks', { params });
    return response.data;
  },

  // Trigger sync from Jira to Local DB
  syncTasks: async (excludeStatus?: string[]) => {
    const params = excludeStatus ? { excludeStatus: excludeStatus.join(',') } : {};
    const response = await apiClient.post('/tasks/sync', {}, { params });
    return response.data;
  },

  getMyself: async () => {
      // Compatibility method: map backend login/status to "myself" structure if needed
      // Or simply return mocked user data since backend handles auth now.
      // But useAuthStore expects this. Let's redirect to getStatus or keep simple.
      // Actually, let's update useAuthStore to use `login` instead.
      throw new Error('Deprecated: Use login() instead'); 
  },

  searchIssues: async () => {
      throw new Error('Deprecated: Use getTasks() or syncTasks()');
  },

  addWorklog: async (issueId: string, worklog: any) => {
      // Backend expects: { issueKey, durationSeconds, comment, startTime }
      const response = await apiClient.post('/worklogs', {
          issueKey: issueId,
          durationSeconds: worklog.timeSpentSeconds, 
          comment: worklog.comment, 
          startTime: worklog.started
      });
      return response.data;
  },
  
  syncWorklogs: async () => {
      const response = await apiClient.post('/worklogs/sync');
      return response.data;
  },

  getWorklogs: async (month?: number, year?: number) => {
      const params: any = {};
      if (month !== undefined && year !== undefined) {
          params.month = month;
          params.year = year;
      }
      const response = await apiClient.get('/worklogs', { params });
      return response.data;
  },

  deleteWorklog: async (id: string | number) => {
      const response = await apiClient.delete(`/worklogs/${id}`);
      return response.data;
  }
};

