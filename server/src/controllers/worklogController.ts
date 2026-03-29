import { Request, Response } from 'express';
import { dbRequest } from '../services/db';
import { JiraClient } from '../services/jira';
import { ensureFreshToken } from '../services/tokenRefresh';

export class WorklogController {
  
  static async create(req: Request, res: Response): Promise<void> {
    const { issueKey, durationSeconds, comment, startTime } = req.body;

    try {
        const worklog = await dbRequest.prisma.worklog.create({
            data: {
                issueKey,
                durationSeconds,
                comment,
                startTime: new Date(startTime),
                verificationStatus: 'PENDING'
            }
        });
        res.json(worklog);
    } catch (error) {
        console.error('Create worklog error:', error);
        res.status(500).json({ error: 'Database error' });
    }
  }

  static async list(req: Request, res: Response): Promise<void> {
    try {
        const { month, year, startDate, endDate } = req.query;
        let whereClause = {};

        if (startDate && endDate) {
            whereClause = {
                startTime: {
                    gte: new Date(startDate as string),
                    lt: new Date(endDate as string)
                }
            };
        } else if (month && year) {
            const m = parseInt(month as string, 10);
            const y = parseInt(year as string, 10);

            const startOfMonth = new Date(y, m, 1);
            const endOfMonth = new Date(y, m + 1, 1);

            whereClause = {
                startTime: {
                    gte: startOfMonth,
                    lt: endOfMonth
                }
            };
        }

        const worklogs = await dbRequest.prisma.worklog.findMany({
            where: whereClause,
            orderBy: { startTime: 'desc' },
            include: { task: true }
        });
        res.json(worklogs);
    } catch (error) {
        console.error('List worklogs error:', error);
        res.status(500).json({ error: 'Database error' });
    }
  }

  static async update(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { durationSeconds, startTime, comment } = req.body;

    try {
        const data: Record<string, any> = {};
        if (durationSeconds !== undefined) data.durationSeconds = durationSeconds;
        if (startTime !== undefined) data.startTime = new Date(startTime);
        if (comment !== undefined) data.comment = comment;

        const worklog = await dbRequest.prisma.worklog.update({
            where: { id: id as string },
            data
        });
        res.json(worklog);
    } catch (error) {
        console.error('Update worklog error:', error);
        res.status(500).json({ error: 'Failed to update worklog' });
    }
  }

  static async sync(req: Request, res: Response): Promise<void> {
    try {
        const config = await dbRequest.prisma.userConfig.findFirst({ orderBy: { id: 'desc' } });
        if (!config) {
            res.status(401).json({ error: 'No Jira configuration found' });
            return;
        }

        const pendingLogs = await dbRequest.prisma.worklog.findMany({
            where: { verificationStatus: { in: ['PENDING', 'FAILED'] } }
        });

        if (pendingLogs.length === 0) {
            res.json({ success: true, count: 0 });
            return;
        }

        // Refresh token if needed before making Jira API calls
        const freshConfig = await ensureFreshToken(config);

        const jira = new JiraClient({ 
            domain: freshConfig.jiraDomain, 
            email: freshConfig.email, 
            apiToken: freshConfig.apiToken,
            accessToken: freshConfig.accessToken,
            cloudId: freshConfig.cloudId
        });

        let syncedCount = 0;
        const errors = [];

        for (const log of pendingLogs) {
            try {
                const response = await jira.addWorklog(
                    log.issueKey, 
                    log.durationSeconds, 
                    log.comment, 
                    log.startTime
                );

                await dbRequest.prisma.worklog.update({
                    where: { id: log.id },
                    data: { 
                        verificationStatus: 'SYNCED',
                        jiraWorklogId: response.id 
                    }
                });
                syncedCount++;

            } catch (err: any) {
                console.error(`Failed to sync worklog ${log.id}:`, err?.response?.data || err.message);
                errors.push({ id: log.id, error: err?.response?.data || err.message });
                await dbRequest.prisma.worklog.update({
                    where: { id: log.id },
                    data: { verificationStatus: 'FAILED' }
                });
            }
        }

        res.json({ success: true, count: syncedCount, errors });

    } catch (error) {
        console.error('Sync worklogs error:', error);
        res.status(500).json({ error: 'Sync failed' });
    }
  }

  static async delete(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    try {
        await dbRequest.prisma.worklog.delete({
            where: { id: id as string }
        });
        res.json({ success: true });
    } catch (error) {
        console.error('Delete worklog error:', error);
        res.status(500).json({ error: 'Failed to delete worklog' });
    }
  }
}
