import { Request, Response } from 'express';
import { dbRequest } from '../services/db';
import { JiraClient } from '../services/jira';

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
        const worklogs = await dbRequest.prisma.worklog.findMany({
            orderBy: { startTime: 'desc' },
            include: { task: true }
        });
        res.json(worklogs);
    } catch (error) {
        console.error('List worklogs error:', error);
        res.status(500).json({ error: 'Database error' });
    }
  }

  static async sync(req: Request, res: Response): Promise<void> {
    try {
        // 1. Get Config
        const config = await dbRequest.prisma.userConfig.findFirst({ orderBy: { id: 'desc' } });
        if (!config) {
            res.status(401).json({ error: 'No Jira configuration found' });
            return;
        }

        // 2. Get Pending Worklogs
        const pendingLogs = await dbRequest.prisma.worklog.findMany({
            where: { verificationStatus: 'PENDING' }
        });

        if (pendingLogs.length === 0) {
            res.json({ success: true, count: 0 });
            return;
        }

        const jira = new JiraClient({ 
            domain: config.jiraDomain, 
            email: config.email, 
            apiToken: config.apiToken 
        });

        // 3. Push to Jira (Sequential for now to avoid rate limits/race)
        let syncedCount = 0;
        const errors = [];

        for (const log of pendingLogs) {
            try {
                // Jira requires timeSpentSeconds, comment, started
                const response = await jira.addWorklog(
                    log.issueKey, 
                    log.durationSeconds, 
                    log.comment, 
                    log.startTime
                );

                // If successful, update local status
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
                // Mark as FAILED or keep as PENDING? FAILED allows user to retry manually or edit.
                await dbRequest.prisma.worklog.update({
                    where: { id: log.id },
                    data: { verificationStatus: 'FAILED' } // Or keep PENDING to retry automatically
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
