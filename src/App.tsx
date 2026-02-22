import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LoginGate } from '@/pages/LoginGate';
import { TaskOrbit } from '@/pages/TaskOrbit';
import { FocusVoid } from '@/pages/FocusVoid';
import { LogLedger } from '@/pages/LogLedger';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginGate />} />
        <Route path="/orbit" element={<TaskOrbit />} />
        <Route path="/focus" element={<FocusVoid />} />
        <Route path="/ledger" element={<LogLedger />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
