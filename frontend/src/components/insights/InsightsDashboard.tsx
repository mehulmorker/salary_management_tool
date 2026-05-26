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

export function InsightsDashboard({
  summary,
  countryStats = [],
  isLoading,
  error,
  onCountrySelect,
}: InsightsDashboardProps) {
  if (isLoading) {
    return <p>Loading…</p>;
  }

  if (error) {
    return <p role="alert">Error: {error.message}</p>;
  }

  return (
    <div>
      {summary && (
        <section aria-label="Summary">
          <div>
            <h3>Total Employees</h3>
            <p>{fmtNum.format(summary.totalActiveEmployees)}</p>
          </div>
          <div>
            <h3>Annual Payroll</h3>
            <p>{fmtUsd.format(summary.totalAnnualPayroll)}</p>
          </div>
          <div>
            <h3>Average Salary</h3>
            <p>{fmtNum.format(summary.averageSalary)}</p>
          </div>
        </section>
      )}

      {countryStats.length > 0 && (
        <section aria-label="By Country">
          <table>
            <thead>
              <tr>
                <th>Country</th>
                <th>Headcount</th>
                <th>Avg Salary</th>
                <th>Min</th>
                <th>Max</th>
                <th>Payroll</th>
              </tr>
            </thead>
            <tbody>
              {countryStats.map((row) => (
                <tr
                  key={row.countryCode}
                  onClick={() => onCountrySelect?.(row.country)}
                  style={{ cursor: onCountrySelect ? 'pointer' : undefined }}
                >
                  <td>{row.country}</td>
                  <td>{fmtNum.format(row.headcount)}</td>
                  <td>{fmtUsd.format(row.avgSalary)}</td>
                  <td>{fmtUsd.format(row.minSalary)}</td>
                  <td>{fmtUsd.format(row.maxSalary)}</td>
                  <td>{fmtUsd.format(row.totalPayroll)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
}
