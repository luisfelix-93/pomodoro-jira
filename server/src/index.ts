import express from 'express';
import cors from 'cors';
import { dbRequest } from './services/db';
import { authRouter } from './routes/auth';
import { taskRouter } from './routes/tasks';
import { worklogRouter } from './routes/worklogs';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/tasks', taskRouter);
app.use('/api/worklogs', worklogRouter);

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

(async () => {
    try {
        console.log('🔄 Connecting to database...');
        await dbRequest.connect();
        console.log('✅ Database connected.');
        
        console.log('🚀 Starting server...');
        const server = app.listen(PORT, () => {
            console.log(`✅ Server running on http://localhost:${PORT}`);
        });

        server.on('error', (err) => {
            console.error('❌ Server error:', err);
        });

    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
})();
