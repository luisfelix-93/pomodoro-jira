/// <reference types="vite/client" />
/// <reference types="react" />
/// <reference types="react-dom" />

interface Window {
  electron?: {
    ping: () => Promise<string>;
    createMiniWindow: () => void;
    onWindowMinimized: (callback: () => void) => () => void;
    onWindowRestored: (callback: () => void) => () => void;
    sendSyncState: (state: any) => void;
    onStateSynced: (callback: (state: any) => void) => () => void;
    sendTimerAction: (action: string) => void;
    onTimerAction: (callback: (action: string) => void) => () => void;
    expandMainWindow: () => void;
  };
}
