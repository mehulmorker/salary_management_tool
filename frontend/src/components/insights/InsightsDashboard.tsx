import type { DashboardSummary, CountrySalaryStats } from '../../types';

interface InsightsDashboardProps {
  summary?:         DashboardSummary;
  countryStats?:    CountrySalaryStats[];
  isLoading?:       boolean;
  error?:           Error;
  onCountrySelect?: (country: string) => void;
}

const fmtNum = new Intl.NumberFormat('en-US');
const fmtUsd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

const statCard: React.CSSProperties = {
  flex: '1 1 200px',
  background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
  color: '#fff',
  borderRadius: 12,
  padding: '24px 28px',
  boxShadow: '0 4px 12px rgba(14,165,233,0.25)',
};

const th: React.CSSProperties = {
  padding: '10px 16px',
  textAlign: 'left',
  fontWeight: 600,
  fontSize: 13,
  color: '#475569',
  background: '#f8fafc',
  borderBottom: '2px solid #e2e8f0',
  whiteSpace: 'nowrap',
};

const td: React.CSSProperties = {
  padding: '10px 16px',
  fontSize: 14,
  color: '#1e293b',
  borderBottom: '1px solid #f1f5f9',
  whiteSpace: 'nowrap',
};

export function InsightsDashboard({
  summary,
  countryStats = [],
  isLoading,
  error,
  onCountrySelect,
}: InsightsDashboardProps) {
  if (isLoading) {
    return <p style={{ color: '#64748b', padding: 24 }}>Loading…</p>;
  }

  if (error) {
    return <p role="alert" style={{ color: '#ef4444', padding: 24 }}>Error: {error.message}</p>;
  }

  return (
    <div>
      {summary && (
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 28 }}>
          <div style={statCard}>
            <p style={{ margin: '0 0 6px', fontSize: 13, opacity: 0.85, fontWeight: 500 }}>Total Employees</p>
            <p style={{ margin: 0, fontSize: 32, fontWeight: 700 }}>{fmtNum.format(summary.totalActiveEmployees)}</p>
          </div>
          <div style={{ ...statCard, background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', boxShadow: '0 4px 12px rgba(139,92,246,0.25)' }}>
            <p style={{ margin: '0 0 6px', fontSize: 13, opacity: 0.85, fontWeight: 500 }}>Annual Payroll</p>
            <p style={{ margin: 0, fontSize: 32, fontWeight: 700 }}>{fmtUsd.format(summary.totalAnnualPayroll)}</p>
          </div>
          <div style={{ ...statCard, background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', boxShadow: '0 4px 12px rgba(16,185,129,0.25)' }}>
            <p style={{ margin: '0 0 6px', fontSize: 13, opacity: 0.85, fontWeight: 500 }}>Average Salary</p>
            <p style={{ margin: 0, fontSize: 32, fontWeight: 700 }}>{fmtUsd.format(summary.averageSalary)}</p>
          </div>
        </div>
      )}

      {countryStats.length > 0 && (
        <div style={{ overflowX: 'auto', borderRadius: 8, border: '1px solid #e2e8f0' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 640 }}>
            <thead>
              <tr>
                {['Country','Headcount','Avg Salary','Min','Max','Median','Payroll'].map(h => (
                  <th key={h} style={th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {countryStats.map((row) => (
                <tr
                  key={row.countryCode}
                  onClick={() => onCountrySelect?.(row.country)}
                  style={{ cursor: onCountrySelect ? 'pointer' : undefined, transition: 'background 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#f0f9ff')}
                  onMouseLeave={e => (e.currentTarget.style.background = '')}
                >
                  <td style={{ ...td, fontWeight: 600 }}>{row.country}</td>
                  <td style={td}>{fmtNum.format(row.headcount)}</td>
                  <td style={{ ...td, color: '#0ea5e9', fontWeight: 600 }}>{fmtUsd.format(row.avgSalary)}</td>
                  <td style={{ ...td, color: '#64748b' }}>{fmtUsd.format(row.minSalary)}</td>
                  <td style={{ ...td, color: '#64748b' }}>{fmtUsd.format(row.maxSalary)}</td>
                  <td style={td}>{fmtUsd.format(row.medianSalary)}</td>
                  <td style={td}>{fmtUsd.format(row.totalPayroll)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
