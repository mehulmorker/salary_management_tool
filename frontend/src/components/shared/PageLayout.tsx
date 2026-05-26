import { NavLink, Outlet } from 'react-router-dom';

export function PageLayout() {
  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'system-ui, sans-serif' }}>
      {/* Sidebar — sticky, never scrolls */}
      <nav style={{
        width: 220, background: '#1e293b', color: '#f8fafc',
        padding: '24px 0', display: 'flex', flexDirection: 'column', gap: 4,
        position: 'sticky', top: 0, height: '100vh', flexShrink: 0, overflowY: 'auto',
      }}>
        <div style={{ padding: '0 20px 24px', fontSize: 18, fontWeight: 700, color: '#38bdf8' }}>
          💼 SalaryHQ
        </div>
        {[
          { to: '/employees', label: '👥 Employees' },
          { to: '/insights',  label: '📊 Insights'  },
        ].map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            style={({ isActive }) => ({
              display: 'block', padding: '10px 20px', textDecoration: 'none',
              color: isActive ? '#38bdf8' : '#cbd5e1',
              background: isActive ? '#0f172a' : 'transparent',
              borderLeft: isActive ? '3px solid #38bdf8' : '3px solid transparent',
            })}
          >
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Main content — scrolls independently */}
      <main style={{ flex: 1, padding: '32px', background: '#f8fafc', overflowY: 'auto', height: '100vh' }}>
        <Outlet />
      </main>
    </div>
  );
}
