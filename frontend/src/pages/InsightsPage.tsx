import { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';
import { InsightsDashboard } from '../components/insights/InsightsDashboard';
import {
  useSummary, useByCountry, useByJobTitle,
  useByDepartment, useBySeniority, useTopEarners, useDistribution,
} from '../hooks/useInsights';

const COLORS = ['#0ea5e9','#8b5cf6','#10b981','#f59e0b','#ef4444','#ec4899','#06b6d4','#84cc16','#f97316','#6366f1'];
const fmtUsd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
const fmtNum = new Intl.NumberFormat('en-US');

const card: React.CSSProperties = {
  background: '#fff', borderRadius: 8, padding: 24,
  boxShadow: '0 1px 4px rgba(0,0,0,0.08)', marginBottom: 24,
};

const sectionTitle: React.CSSProperties = {
  margin: '0 0 16px', fontSize: 18, fontWeight: 600, color: '#0f172a',
};

export function InsightsPage() {
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [topN, setTopN] = useState(10);

  const summary     = useSummary();
  const byCountry   = useByCountry();
  const byJobTitle  = useByJobTitle(selectedCountry || undefined);
  const byDept      = useByDepartment();
  const bySeniority = useBySeniority();
  const topEarners  = useTopEarners(topN, selectedCountry || undefined);
  const distribution = useDistribution(10000, selectedCountry || undefined);

  return (
    <div>
      <h1 style={{ margin: '0 0 24px' }}>Salary Insights</h1>

      {/* Summary dashboard */}
      <div style={card}>
        <InsightsDashboard
          summary={summary.data}
          countryStats={byCountry.data}
          isLoading={summary.isLoading || byCountry.isLoading}
          error={summary.error ?? byCountry.error ?? undefined}
          onCountrySelect={c => setSelectedCountry(prev => prev === c ? '' : c)}
        />
        {selectedCountry && (
          <p style={{ margin: '12px 0 0', color: '#0ea5e9', fontSize: 14 }}>
            Filtering by: <strong>{selectedCountry}</strong>{' '}
            <button onClick={() => setSelectedCountry('')} style={{ marginLeft: 8, cursor: 'pointer' }}>✕ Clear</button>
          </p>
        )}
      </div>

      {/* Country avg salary bar chart */}
      {byCountry.data && byCountry.data.length > 0 && (
        <div style={card}>
          <h2 style={sectionTitle}>Average Salary by Country</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={byCountry.data} margin={{ top: 4, right: 16, left: 16, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="country" angle={-30} textAnchor="end" interval={0} tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v) => typeof v === 'number' ? fmtUsd.format(v) : ''} />
              <Bar dataKey="avgSalary" fill="#0ea5e9" name="Avg Salary" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Job title insights */}
      <div style={card}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
          <h2 style={{ ...sectionTitle, margin: 0 }}>Avg Salary by Job Title</h2>
          <select
            value={selectedCountry}
            onChange={e => setSelectedCountry(e.target.value)}
            style={{ padding: '6px 10px', border: '1px solid #cbd5e1', borderRadius: 6 }}
          >
            <option value="">All countries</option>
            {byCountry.data?.map(c => (
              <option key={c.countryCode} value={c.country}>{c.country}</option>
            ))}
          </select>
        </div>
        {!selectedCountry && <p style={{ color: '#94a3b8' }}>Select a country above to drill down.</p>}
        {byJobTitle.isLoading && <p>Loading…</p>}
        {byJobTitle.data && (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ background: '#f1f5f9' }}>
                  {['Job Title','Headcount','Avg Salary','Min','Max'].map(h => (
                    <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {byJobTitle.data.map(r => (
                  <tr key={r.jobTitle} style={{ borderTop: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '8px 12px' }}>{r.jobTitle}</td>
                    <td style={{ padding: '8px 12px' }}>{fmtNum.format(r.headcount)}</td>
                    <td style={{ padding: '8px 12px', fontWeight: 600 }}>{fmtUsd.format(r.avgSalary)}</td>
                    <td style={{ padding: '8px 12px', color: '#64748b' }}>{fmtUsd.format(r.minSalary)}</td>
                    <td style={{ padding: '8px 12px', color: '#64748b' }}>{fmtUsd.format(r.maxSalary)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Department breakdown — pie */}
      {byDept.data && byDept.data.length > 0 && (
        <div style={card}>
          <h2 style={sectionTitle}>Payroll Share by Department</h2>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            <ResponsiveContainer width={320} height={260}>
              <PieChart>
                <Pie data={byDept.data} dataKey="payrollShare" nameKey="department" cx="50%" cy="50%" outerRadius={100}>
                  {byDept.data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v) => typeof v === 'number' ? `${v.toFixed(1)}%` : ''} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ flex: 1, overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                <thead>
                  <tr style={{ background: '#f1f5f9' }}>
                    {['Department','Headcount','Avg Salary','Payroll Share'].map(h => (
                      <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {byDept.data.map(d => (
                    <tr key={d.department} style={{ borderTop: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '8px 12px' }}>{d.department}</td>
                      <td style={{ padding: '8px 12px' }}>{fmtNum.format(d.headcount)}</td>
                      <td style={{ padding: '8px 12px' }}>{fmtUsd.format(d.avgSalary)}</td>
                      <td style={{ padding: '8px 12px' }}>{d.payrollShare.toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Seniority pay */}
      {bySeniority.data && bySeniority.data.length > 0 && (
        <div style={card}>
          <h2 style={sectionTitle}>Average Salary by Seniority</h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={bySeniority.data} margin={{ top: 4, right: 16, left: 16, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="seniorityLevel" />
              <YAxis tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v) => typeof v === 'number' ? fmtUsd.format(v) : ''} />
              <Bar dataKey="avgSalary" fill="#8b5cf6" name="Avg Salary" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Salary distribution */}
      {distribution.data && distribution.data.length > 0 && (
        <div style={card}>
          <h2 style={sectionTitle}>Salary Distribution {selectedCountry ? `— ${selectedCountry}` : ''}</h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={distribution.data} margin={{ top: 4, right: 16, left: 16, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="rangeStart" tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
              <YAxis />
              <Tooltip labelFormatter={v => `$${(v/1000).toFixed(0)}k – $${(v/1000 + 10).toFixed(0)}k`} />
              <Bar dataKey="count" fill="#10b981" name="Employees" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Top earners */}
      <div style={card}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
          <h2 style={{ ...sectionTitle, margin: 0 }}>Top Earners</h2>
          <select
            value={topN}
            onChange={e => setTopN(Number(e.target.value))}
            style={{ padding: '6px 10px', border: '1px solid #cbd5e1', borderRadius: 6 }}
          >
            {[5, 10, 25, 50].map(n => <option key={n} value={n}>Top {n}</option>)}
          </select>
        </div>
        {topEarners.isLoading && <p>Loading…</p>}
        {topEarners.data && (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ background: '#f1f5f9' }}>
                  {['#','Name','Job Title','Department','Country','Seniority','Salary'].map(h => (
                    <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {topEarners.data.map((e, i) => (
                  <tr key={e.id} style={{ borderTop: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '8px 12px', color: '#94a3b8' }}>{i + 1}</td>
                    <td style={{ padding: '8px 12px', fontWeight: 600 }}>{e.fullName}</td>
                    <td style={{ padding: '8px 12px' }}>{e.jobTitle}</td>
                    <td style={{ padding: '8px 12px' }}>{e.department}</td>
                    <td style={{ padding: '8px 12px' }}>{e.country}</td>
                    <td style={{ padding: '8px 12px' }}>{e.seniorityLevel}</td>
                    <td style={{ padding: '8px 12px', fontWeight: 600, color: '#0ea5e9' }}>{fmtUsd.format(e.salary)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
