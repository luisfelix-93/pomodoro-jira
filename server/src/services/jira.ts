import axios, { AxiosInstance } from 'axios';

export interface JiraCredentials {
  domain?: string | null;
  email?: string | null;
  apiToken?: string | null;
  accessToken?: string | null;
  cloudId?: string | null;
}

export class JiraClient {
  private axiosInstance: AxiosInstance;

  constructor(private credentials: JiraCredentials) {
    let baseURL = '';
    let authHeader = '';

    if (credentials.accessToken && credentials.cloudId) {
      baseURL = `https://api.atlassian.com/ex/jira/${credentials.cloudId}/rest/api/3`;
      authHeader = `Bearer ${credentials.accessToken}`;
    } else if (credentials.domain && credentials.email && credentials.apiToken) {
      let cleanDomain = credentials.domain.trim();
      cleanDomain = cleanDomain.replace(/^https?:\/\//, '');
      cleanDomain = cleanDomain.split('/')[0];
      cleanDomain = cleanDomain.replace(/\.atlassian\.net$/, '');
        
      baseURL = `https://${cleanDomain}.atlassian.net/rest/api/3`;
      const auth = Buffer.from(`${credentials.email}:${credentials.apiToken}`).toString('base64');
      authHeader = `Basic ${auth}`;
    } else {
      throw new Error("Invalid Jira credentials provided");
    }

    console.log('🔗 Jira Client BaseURL:', baseURL); // Debug log

    this.axiosInstance = axios.create({
      baseURL,
      headers: {
        'Authorization': authHeader,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
  }

  public async getMyself(): Promise<any> {
    try {
      console.log('👤 Fetching myself...');
      const response = await this.axiosInstance.get('/myself');
      console.log('✅ Myself fetched successfully');
      return response.data;
    } catch (error: any) {
      console.error('Jira Auth Error:', error.response?.status, error.response?.data || error.message);
      throw new Error(`Invalid Jira Credentials or Domain (Status: ${error.response?.status})`);
    }
  }

  public async searchIssues(jql: string): Promise<any> {
    try {
        console.log('🔍 Searching issues with JQL:', jql);
        console.log('🌐 Request URL:', `${this.axiosInstance.defaults.baseURL}/search/jql`);
        
        const response = await this.axiosInstance.post('/search/jql', {
            jql,
            fields: ['summary', 'status', 'project', 'priority', 'updated'],
            maxResults: 50
        });
        console.log('✅ Search successful, found:', response.data.issues.length);
        return response.data.issues;
    } catch (error: any) {
      console.error('❌ Jira Search Error:', error.response?.status, error.response?.data || error.message);
      if (error.response?.status === 404 || error.response?.status === 410) {
          throw new Error(`Jira API unreachable (${error.response.status}). Check if the project/issues exist and you have permission.`);
      }
      throw error;
    }
  }
  public async addWorklog(issueKey: string, durationSeconds: number, comment: string | null, started: Date): Promise<any> {
    try {
        const response = await this.axiosInstance.post(`/issue/${issueKey}/worklog`, {
            timeSpentSeconds: durationSeconds,
            comment: comment ? {
                type: "doc",
                version: 1,
                content: [{
                    type: "paragraph",
                    content: [{ type: "text", text: comment }]
                }]
            } : undefined,
            started: started.toISOString().replace('Z', '+0000') // Jira expects specific format sometimes, but ISO usually works. 
            // Actually Jira 3.0 uses "2021-01-01T12:00:00.000+0000" usually. 
            // Let's use simple ISO first.
        });
        return response.data;
    } catch (error) {
        console.error('Jira Add Worklog Error:', error);
        throw error;
    }
  }
}
