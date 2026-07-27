import React from 'react'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts'
import { TrendingUp, TrendingDown, Users, Clock, Zap } from 'lucide-react'

export default function ResultsDashboard({ results, useCases, globalSettings }) {
  // Prepare data for Savings Comparison Chart
  const costComparisonData = [
    {
      name: 'Human Only Cost',
      'Base Agent Licenses': results.baseSoftwareCost,
      'AI Software Cost': 0,
      'Speech/Digital Cost': 0,
      'Human Handling Cost': results.totalCurrentAgentCostMonthly,
    },
    {
      name: 'With Virtual Agent',
      'Base Agent Licenses': results.baseSoftwareCost,
      'AI Software Cost': results.totalAiMonthlyCost - results.baseSoftwareCost - results.speechCost - results.additionalDigitalBundlesCost,
      'Speech/Digital Cost': results.speechCost + results.additionalDigitalBundlesCost,
      'Human Handling Cost': 0, // In this specific calculation, we are looking at the portion being automated.
    }
  ]

  // Prepare data for Use Case Breakdown
  const useCaseData = useCases.map(uc => {
    const engagedInteractions = (uc.totalInteractions || 0) * ((uc.engagementRate || 0) / 100);
    const fullyResolvedInteractions = engagedInteractions * ((uc.resolutionRate || 0) / 100);
    const handedOverInteractions = engagedInteractions - fullyResolvedInteractions;

    return {
      name: uc.name,
      units: engagedInteractions * (uc.unitsPerInteraction || 0),
      timeSavedHours: ((fullyResolvedInteractions * (uc.actualHandlingTime || 0)) + (handedOverInteractions * (uc.handoverTimeSaved || 0))) / 60
    };
  }).filter(uc => uc.units > 0)

  const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444']

  const formatCurrency = (val) => new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(val)
  const formatNumber = (val) => new Intl.NumberFormat('en-US').format(Math.round(val))

  const isNetPositive = results.netMonthlySavings > 0

  return (
    <div className="flex" style={{ flexDirection: 'column', gap: '2rem' }}>
      {/* Top Metrics Summary */}
      <div className="print-page">
        <div className="grid-3">
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <div style={{ padding: '0.5rem', background: 'var(--success-alpha)', borderRadius: 'var(--radius-md)' }}>
              <TrendingUp size={24} color="var(--accent-success)" />
            </div>
            <h3 style={{ margin: 0 }}>Projected Savings</h3>
          </div>
          <div className="metric-value success" style={{ fontSize: '2.5rem' }}>
            {formatCurrency(results.netMonthlySavings)}
            <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 400, marginLeft: '0.5rem' }}>/ month</span>
          </div>
          <div className="text-secondary mt-2">
            {formatCurrency(results.netYearlySavings)} / year
          </div>
          <p className="metric-subtext mt-4">
            Cost avoided by automating work minus the cost of the AI software required to do so.
          </p>
        </div>

        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <div style={{ padding: '0.5rem', background: 'var(--secondary-alpha)', borderRadius: 'var(--radius-md)' }}>
              <Users size={24} color="var(--accent-secondary)" />
            </div>
            <h3 style={{ margin: 0 }}>Human Capacity Freed</h3>
          </div>
          <div className="metric-value primary" style={{ fontSize: '2.5rem' }}>
            {results.totalFteSaved.toFixed(1)} FTEs
          </div>
          <div className="text-secondary mt-2">
            {formatNumber(results.totalTimeSavedHours)} hours / month
          </div>
          <p className="metric-subtext mt-4">
            Based on {globalSettings.fteWeeklyHours} hour work week. These agents can be repurposed to higher-value tasks.
          </p>
        </div>

        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <div style={{ padding: '0.5rem', background: 'var(--primary-alpha)', borderRadius: 'var(--radius-md)' }}>
              <Clock size={24} color="var(--accent-primary)" />
            </div>
            <h3 style={{ margin: 0 }}>Estimated ROI</h3>
          </div>
          <div className="metric-value" style={{ fontSize: '2.5rem', color: 'var(--accent-primary)' }}>
            {formatNumber(results.roiPercentage)}%
          </div>
          <div className="text-secondary mt-2">
            Payback Period: {results.paybackMonths.toFixed(1)} months
          </div>
          <p className="metric-subtext mt-4">
            Calculated as net savings divided by the incremental cost of the AI software. Payback assumes an annual investment.
          </p>
        </div>
      </div>
      </div>

      {/* Charts */}
      <div className="print-page">
      <div className="grid-2">
        <div className="card">
          <h3 className="mb-4">Monthly Cost Comparison (Automated Portion)</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={costComparisonData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis dataKey="name" stroke="var(--text-secondary)" />
                <YAxis stroke="var(--text-secondary)" tickFormatter={(val) => '£' + val} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
                  formatter={(value) => formatCurrency(value)}
                />
                <Legend />
                <Bar dataKey="Human Handling Cost" stackId="a" fill="var(--text-muted)" />
                <Bar dataKey="Base Agent Licenses" stackId="a" fill="var(--accent-secondary)" />
                <Bar dataKey="AI Software Cost" stackId="a" fill="var(--accent-primary)" />
                <Bar dataKey="Speech/Digital Cost" stackId="a" fill="var(--accent-success)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h3 className="mb-4">Time Saved by Use Case (Hours/Month)</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={useCaseData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="timeSavedHours"
                  nameKey="name"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {useCaseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
                  formatter={(value) => formatNumber(value) + ' hrs'}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      </div>

      {/* AI Units Breakdown */}
      <div className="print-page">
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <Zap size={20} className="text-primary" />
          <h3 style={{ margin: 0 }}>AI Unit Consumption & Costs</h3>
        </div>
        
        <div className="grid-3 mb-4">
          <div className="metric-card">
            <div className="metric-label">Total Units Required</div>
            <div className="metric-value">{formatNumber(results.totalUnitsRequired)}</div>
            <div className="metric-subtext">per month</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Included Units</div>
            <div className="metric-value">{formatNumber(results.totalIncludedUnits)}</div>
            <div className="metric-subtext">Base licenses ({globalSettings.numberOfAgents} agents)</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Extra Bundles Needed</div>
            <div className="metric-value">{results.bundlesNeeded}</div>
            <div className="metric-subtext">
              Cost: {formatCurrency(results.additionalBundlesCost)} / mo
            </div>
          </div>
        </div>
        
        <div className="grid-2 mb-4">
          {/* Speech Section */}
          <div style={{ background: 'var(--btn-secondary-bg)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
            <h4 style={{ margin: '0 0 1rem 0', color: 'var(--text-primary)', fontSize: '1rem' }}>Voice / Speech Cost</h4>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span className="text-secondary">Speech Required:</span>
              <span className="font-medium">{formatNumber(results.totalSpeechHours)} hours</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed var(--border-color)', paddingTop: '0.5rem' }}>
              <span className="text-secondary">Speech Cost:</span>
              <span className="font-medium text-primary">{formatCurrency(results.speechCost)}</span>
            </div>
          </div>

          {/* Digital Messages Section */}
          <div style={{ background: 'var(--btn-secondary-bg)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
            <h4 style={{ margin: '0 0 1rem 0', color: 'var(--text-primary)', fontSize: '1rem' }}>Digital Messages Cost</h4>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span className="text-secondary">Msgs Required / Included:</span>
              <span className="font-medium">{formatNumber(results.totalDigitalMessages)} / {formatNumber(results.totalIncludedDigitalMessages)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span className="text-secondary">Extra Bundles Needed:</span>
              <span className="font-medium">{results.digitalBundlesNeeded}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed var(--border-color)', paddingTop: '0.5rem' }}>
              <span className="text-secondary">Extra Msgs Cost:</span>
              <span className="font-medium text-primary">{formatCurrency(results.additionalDigitalBundlesCost)}</span>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center p-4" style={{ background: 'var(--btn-secondary-bg)', borderRadius: 'var(--radius-md)' }}>
          <span className="font-medium text-secondary">Total Monthly Software Cost (Base + AI)</span>
          <span className="metric-value" style={{ fontSize: '1.5rem' }}>{formatCurrency(results.totalAiMonthlyCost)}</span>
        </div>
      </div>
      </div>
    </div>
  )
}
