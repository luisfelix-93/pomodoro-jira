import { app, BrowserWindow, ipcMain, screen } from 'electron';
import path from 'path';
import { spawn, ChildProcess } from 'child_process';
import fs from 'fs';

let mainWindow: BrowserWindow | null = null;
let miniWindow: BrowserWindow | null = null;
let serverProcess: ChildProcess | null = null;

const isDev = process.env.NODE_ENV === 'development';

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        minWidth: 900,
        minHeight: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
            backgroundThrottling: false,
        },
    });

    if (isDev) {
        mainWindow.loadURL('http://localhost:5173');
        // mainWindow.webContents.openDevTools();
    } else {
        mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
    }

    mainWindow.on('minimize', () => {
        // We will check if a timer is running via IPC before creating, or we can just emit an event to the renderer.
        // Actually, the renderer should tell the main process if a timer is active, but a simpler way 
        // is to let the renderer send an IPCC message 'window-minimized' when it detects window blur/minimize.
        // However, mainWindow.on('minimize') is perfectly reliable.
        mainWindow?.webContents.send('window-minimized');
    });

    mainWindow.on('restore', () => {
        mainWindow?.webContents.send('window-restored');
        if (miniWindow && !miniWindow.isDestroyed()) {
            miniWindow.close();
            miniWindow = null;
        }
    });
}

function createMiniWindow() {
    if (miniWindow && !miniWindow.isDestroyed()) {
        miniWindow.focus();
        return;
    }

    const primaryDisplay = screen.getPrimaryDisplay();
    const { width, height } = primaryDisplay.workAreaSize;

    miniWindow = new BrowserWindow({
        width: 300,
        height: 120,
        x: width - 320, // Bottom right corner
        y: height - 140,
        frame: false,
        alwaysOnTop: true,
        transparent: true,
        resizable: false,
        hasShadow: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
        },
    });

    if (isDev) {
        miniWindow.loadURL('http://localhost:5173/#/mini');
    } else {
        // Electron loads the index.html and then react-router handles the hash
        miniWindow.loadURL(`file://${path.join(__dirname, '../dist/index.html')}#/mini`);
    }

    // Pass the current state immediately if possible, but the mini window will request it when it mounts
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

    // Mini Timer IPC
    ipcMain.on('create-mini-window', () => {
        createMiniWindow();
    });

    ipcMain.on('sync-state-to-mini', (_event, state) => {
        if (miniWindow && !miniWindow.isDestroyed()) {
            miniWindow.webContents.send('state-synced', state);
        }
    });

    ipcMain.on('timer-action-from-mini', (_event, action) => {
        if (mainWindow && !mainWindow.isDestroyed()) {
            mainWindow.webContents.send('timer-action', action);
        }
    });

    ipcMain.on('expand-main-window', () => {
        if (mainWindow && !mainWindow.isDestroyed()) {
            if (mainWindow.isMinimized()) mainWindow.restore();
            mainWindow.show();
            mainWindow.focus();
        }
        if (miniWindow && !miniWindow.isDestroyed()) {
            miniWindow.close();
            miniWindow = null;
        }
    });

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
