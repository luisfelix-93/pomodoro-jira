import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { spawn, ChildProcess } from 'child_process';
import fs from 'fs';

let mainWindow: BrowserWindow | null = null;
let serverProcess: ChildProcess | null = null;

const isDev = process.env.NODE_ENV === 'development';

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
        },
    });

    if (isDev) {
        mainWindow.loadURL('http://localhost:5173');
        mainWindow.webContents.openDevTools();
    } else {
        mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
    }
}

function startServer() {
    if (isDev) {
        // In dev, we assume the user is running the server separately or we spawn it differently.
        // For now, let's assume the user runs 'npm run dev' which runs everything.
        // We'll rely on concurrently to run the server in dev.
        console.log('In dev mode, assuming server is running via concurrently');
        return;
    }

    // Prod logic for spawning server
    const serverPath = path.join(process.resourcesPath, 'server/dist/index.js');
    
    // Use the user's appData directory for the database to avoid readonly errors in Program Files
    const userDataPath = app.getPath('userData');
    
    // Prisma SQLite expects forward slashes even on Windows
    const dbPath = path.join(userDataPath, 'database.sqlite').replace(/\\/g, '/');
    const dbUrl = `file:${dbPath}`;
    
    console.log(`Checking for database at: ${dbPath}`);

    if (!fs.existsSync(dbPath)) {
        console.log('Database not found in userData. Copying seed database...');
        const seedDbPath = path.join(process.resourcesPath, 'server', 'seed.sqlite');
        try {
            if (fs.existsSync(seedDbPath)) {
                fs.copyFileSync(seedDbPath, dbPath);
                console.log('Seed database copied successfully!');
            } else {
                console.warn('Seed database not found at', seedDbPath);
            }
        } catch (error) {
            console.error('Failed to copy seed database:', error);
        }
    }

    // Always ensure the database is writable by the user
    try {
        if (fs.existsSync(dbPath)) {
            fs.chmodSync(dbPath, 0o666);
        }
    } catch (e) {
        console.error('Failed to change permissions for database:', e);
    }

    serverProcess = spawn('node', [serverPath], {
        env: {
            ...process.env,
            DATABASE_URL: dbUrl
        }
    });
}

app.whenReady().then(() => {
    startServer();
    createWindow();

    ipcMain.handle('ping', () => 'pong');

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
    if (serverProcess) {
        serverProcess.kill();
    }
});
