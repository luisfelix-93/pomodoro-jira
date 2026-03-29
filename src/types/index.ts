export interface JiraUser {
  accountId: string;
  displayName: string;
  email: string;
  active: boolean;
  avatarUrls: {
    '48x48': string;
    '24x24': string;
    '16x16': string;
    '32x32': string;
  };
}

export interface JiraIssue {
  id: string;
  key: string;
  fields: {
    summary: string;
    status: {
      name: string;
    };
    priority?: {
      name: string;
      iconUrl: string;
    };
  };
}

export interface WorklogDraft {
  id: number;
  jiraIssueId: string; // The Key, e.g., PROJ-123
  startTime: string; // ISO
  durationSeconds: number;
  memo: string;
  status: 'draft' | 'synced' | 'discarded';
}

export interface CalendarWorklogEntry {
  id: string | number;
  issueKey: string;
  issueSummary: string;
  startTime: string;
  durationSeconds: number;
  comment: string;
  jiraWorklogId?: string;
  verificationStatus?: string;
}
