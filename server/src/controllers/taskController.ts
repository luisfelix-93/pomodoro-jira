import { Request, Response } from 'express';
import { dbRequest } from '../services/db';
import { JiraClient } from '../services/jira';

export class TaskController {
  
  static async list(req: Request, res: Response): Promise<void> {
    try {
        const excludeStatus = req.query.excludeStatus ? (req.query.excludeStatus as string).split(',') : [];
        const where = excludeStatus.length > 0 ? {
            status: { notIn: excludeStatus }
        } : {};

        const tasks = await dbRequest.prisma.task.findMany({
            where,
            orderBy: { updatedAt: 'desc' }
        });
        res.json(tasks);
    } catch (error) {
        console.error('List tasks error:', error);
        res.status(500).json({ error: 'Database error' });
    }
  }

  static async sync(req: Request, res: Response): Promise<void> {
    try {
        // 1. Get User Config
        const config = await dbRequest.prisma.userConfig.findFirst({
            orderBy: { id: 'desc' }
        });

        if (!config) {
            res.status(401).json({ error: 'No Jira configuration found' });
            return;
        }

        // 2. Fetch from Jira
        const jira = new JiraClient({ 
            domain: config.jiraDomain, 
            email: config.email, 
            apiToken: config.apiToken,
            accessToken: config.accessToken,
            cloudId: config.cloudId
        });

        // JQL: Assigned to current user AND (Unresolved OR Updated recently)
        // This ensures we capture tasks that were moved to Done recently
        const jql = `assignee = currentUser() AND (resolution = Unresolved OR updated >= -30d) ORDER BY updated DESC`;
        const issues = await jira.searchIssues(jql);

        // 3. Upsert to DB
        const upsertConfig = issues.map((issue: any) => {
            return dbRequest.prisma.task.upsert({
                where: { id: issue.key },
                update: {
                    summary: issue.fields.summary,
                    status: issue.fields.status.name,
                    projectKey: issue.fields.project.key,
                    priorityUrl: issue.fields.priority?.iconUrl,
                    updatedAt: new Date(issue.fields.updated)
                },
                create: {
                    id: issue.key,
                    summary: issue.fields.summary,
                    status: issue.fields.status.name,
                    projectKey: issue.fields.project.key,
                    priorityUrl: issue.fields.priority?.iconUrl,
                    updatedAt: new Date(issue.fields.updated)
                }
            });
        });

        await dbRequest.prisma.$transaction(upsertConfig);

        // 4. Return new list (filtered)
        const excludeStatus = req.query.excludeStatus ? (req.query.excludeStatus as string).split(',') : [];
        const where = excludeStatus.length > 0 ? {
            status: { notIn: excludeStatus }
        } : {};

        const tasks = await dbRequest.prisma.task.findMany({
            where,
            orderBy: { updatedAt: 'desc' }
        });
        
        res.json({ success: true, count: issues.length, tasks });

    } catch (error: any) {
        console.error('Sync tasks error:', error);
        res.status(500).json({ 
            error: error.message || 'Sync failed',
            details: error.response?.data || undefined,
            code: error.response?.status || undefined
        });
    }
  }
}
