import { Routes, Route, Navigate } from 'react-router-dom';
import { PageLayout } from './components/shared/PageLayout';
import { EmployeesPage } from './pages/EmployeesPage';
import { InsightsPage } from './pages/InsightsPage';

function App() {
  return (
    <Routes>
      <Route element={<PageLayout />}>
        <Route path="/"          element={<Navigate to="/employees" replace />} />
        <Route path="/employees" element={<EmployeesPage />} />
        <Route path="/insights"  element={<InsightsPage />} />
      </Route>
    </Routes>
  );
}

export default App;
