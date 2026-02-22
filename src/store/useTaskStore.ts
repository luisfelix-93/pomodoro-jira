import { create } from 'zustand';
import { JiraIssue, WorklogDraft } from '@/types';
import { jiraApi } from '@/services/api/jira';

interface TaskState {
  issues: JiraIssue[];
  drafts: WorklogDraft[];
  activeTaskId: string | null;
  isLoading: boolean;

  setIssues: (issues: JiraIssue[]) => void;
  addDraft: (draft: WorklogDraft) => void;
  updateDraft: (id: number, updates: Partial<WorklogDraft>) => void;
  setActiveTask: (issueId: string | null) => void;
  fetchTasks: () => Promise<void>;
  getActiveIssue: () => JiraIssue | undefined;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  issues: [],
  drafts: [],
  activeTaskId: null,
  isLoading: false,

  setIssues: (issues) => set({ issues }),
  
  addDraft: (draft) => set((state) => ({ 
    drafts: [...state.drafts, draft] 
  })),

  updateDraft: (id, updates) => set((state) => ({
    drafts: state.drafts.map((d) => (d.id === id ? { ...d, ...updates } : d)),
  })),

  setActiveTask: (issueId) => set({ activeTaskId: issueId }),

  // Fetch tasks with optional filters
  fetchTasks: async (excludeStatus: string[] = ['Done', 'Resolved', 'Closed', 'Concluído']) => {
    set({ isLoading: true });
    try {
        // Syncs with Jira and returns updated list
        const response = await jiraApi.syncTasks(excludeStatus); // or getTasks() if we want offline first
        
        // Map backend tasks to Frontend JiraIssue type
        // Backend Task: { id, summary, status, projectKey, priorityUrl }
        // Frontend JiraIssue: { id, key, fields: { summary, status: { name }, project: { key }, priority: { iconUrl } } }
        
        const mappedIssues: JiraIssue[] = response.tasks.map((t: any) => ({
            id: t.id,
            key: t.id,
            fields: {
                summary: t.summary,
                status: { name: t.status },
                project: { key: t.projectKey },
                priority: t.priorityUrl ? { name: 'Priority', iconUrl: t.priorityUrl } : undefined
            }
        }));

        set({ issues: mappedIssues, isLoading: false });
    } catch (error) {
        console.error('Failed to fetch tasks', error);
        set({ isLoading: false });
    }
  },

  getActiveIssue: () => {
    const { issues, activeTaskId } = get();
    return issues.find((i) => i.key === activeTaskId);
  },
}));
