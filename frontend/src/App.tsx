import { Routes, Route, Navigate } from 'react-router-dom';

// Pages will be added in later steps
function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/employees" replace />} />
      <Route path="/employees" element={<div>Employees Page (coming soon)</div>} />
      <Route path="/insights" element={<div>Insights Page (coming soon)</div>} />
    </Routes>
  );
}

export default App;
