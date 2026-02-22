import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {
    // Add IPC methods here
    ping: () => ipcRenderer.invoke('ping'),

    // Mini Timer APIs
    createMiniWindow: () => ipcRenderer.send('create-mini-window'),
    onWindowMinimized: (callback: () => void) => {
        const handler = () => callback();
        ipcRenderer.on('window-minimized', handler);
        return () => ipcRenderer.removeListener('window-minimized', handler);
    },
    onWindowRestored: (callback: () => void) => {
        const handler = () => callback();
        ipcRenderer.on('window-restored', handler);
        return () => ipcRenderer.removeListener('window-restored', handler);
    },
    
    // State Synchronization
    sendSyncState: (state: any) => ipcRenderer.send('sync-state-to-mini', state),
    onStateSynced: (callback: (state: any) => void) => {
        const handler = (_event: any, state: any) => callback(state);
        ipcRenderer.on('state-synced', handler);
        return () => ipcRenderer.removeListener('state-synced', handler);
    },

    // Actions
    sendTimerAction: (action: string) => ipcRenderer.send('timer-action-from-mini', action),
    onTimerAction: (callback: (action: string) => void) => {
        const handler = (_event: any, action: string) => callback(action);
        ipcRenderer.on('timer-action', handler);
        return () => ipcRenderer.removeListener('timer-action', handler);
    },
    expandMainWindow: () => ipcRenderer.send('expand-main-window'),
});
