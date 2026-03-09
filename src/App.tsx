import { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';
import { LoginGate } from '@/pages/LoginGate';
import { TaskOrbit } from '@/pages/TaskOrbit';
import { FocusVoid } from '@/pages/FocusVoid';
import { LogLedger } from '@/pages/LogLedger';
import { MiniTimer } from '@/pages/MiniTimer';
import { CallbackPage } from '@/pages/CallbackPage';
import { GlobalWorklogModal } from '@/components/ui/GlobalWorklogModal';
import { useTimerStore } from '@/store/useTimerStore';
import { useTaskStore } from '@/store/useTaskStore';

function App() {
  const timerState = useTimerStore();
  const activeTaskId = useTaskStore(state => state.activeTaskId);

  // Sync state to Electron Mini Window
  useEffect(() => {
    // We only want to run this if we are NOT in the mini window ourselves.
    // The mini window runs on the /mini route.
    if (window.location.hash.includes('#/mini')) return;

    if (window.electron) {
        window.electron.sendSyncState({
            mode: timerState.mode,
            timeLeft: timerState.timeLeft,
            timeElapsed: timerState.timeElapsed,
            isRunning: timerState.isRunning,
            totalDuration: timerState.totalDuration,
            taskCode: activeTaskId
        });
    }
  }, [
    timerState.mode, 
    timerState.timeLeft, 
    timerState.timeElapsed, 
    timerState.isRunning, 
    timerState.totalDuration, 
    activeTaskId
  ]);

  // Handle actions from Mini Window
  useEffect(() => {
    if (window.location.hash.includes('#/mini')) return;

    if (window.electron) {
        const cleanupAction = window.electron.onTimerAction((action: string) => {
            if (action === 'play') timerState.start();
            if (action === 'pause') timerState.pause();
            if (action === 'stop') {
                timerState.pause(); // Pause timer while noting
                timerState.setPromptingWorklog(true);
                window.electron?.expandMainWindow();
            }
        });

        const cleanupMinimize = window.electron.onWindowMinimized(() => {
            // Only show mini timer if a timer is active (running or paused but not idle)
            const isTimerActive = timerState.mode !== 'IDLE';
            if (isTimerActive && window.electron) {
                window.electron.createMiniWindow();
            }
        });

        return () => {
            cleanupAction();
            cleanupMinimize();
        };
    }
  }, [timerState.start, timerState.pause, timerState.stop, timerState.mode]);

  // Handle OAuth callback before rendering the HashRouter app.
  // The Atlassian server redirects to a real path `/callback`, not a hash path.
  // We render the CallbackPage directly under a BrowserRouter in this case.
  if (window.location.pathname === '/callback') {
    return (
      <BrowserRouter>
        <CallbackPage />
      </BrowserRouter>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginGate />} />
        <Route path="/orbit" element={<TaskOrbit />} />
        <Route path="/focus" element={<FocusVoid />} />
        <Route path="/ledger" element={<LogLedger />} />
        <Route path="/mini" element={<MiniTimer />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {!window.location.hash.includes('#/mini') && <GlobalWorklogModal />}
    </Router>
  );
}

export default App;
