import React, { useState } from 'react'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, ComposedChart, Area, Line
} from 'recharts'
import { TrendingUp, Users, Clock, HelpCircle, X } from 'lucide-react'

const CustomYAxisTick = (props) => {
  const { x, y, payload } = props;
  const text = payload.value || '';
  const fontSize = text.length > 30 ? 9 : text.length > 20 ? 10 : 12;
  
  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={4} textAnchor="end" fill="var(--text-secondary)" fontSize={fontSize}>
        {text}
      </text>
    </g>
  );
};


export default function ResultsDashboard({ results, useCases, globalSettings }) {
  const [activeTooltip, setActiveTooltip] = useState(null)
  
  // Prepare data for Savings Comparison Chart
  const costComparisonData = [
    {
      name: 'Human Only Cost',
      'Base Agent Licences': results.baseSoftwareCost,
      'AI Software Cost': 0,
      'Speech/Digital Cost': 0,
      'Human Handling Cost': results.totalOriginalEngagedCostMonthly || results.totalCurrentAgentCostMonthly,
    },
    {
      name: 'With Virtual Agent',
      'Base Agent Licences': results.baseSoftwareCost,
      'AI Software Cost': results.totalAiMonthlyCost - results.baseSoftwareCost - results.speechCost - results.additionalDigitalBundlesCost,
      'Speech/Digital Cost': results.speechCost + results.additionalDigitalBundlesCost,
      'Human Handling Cost': results.totalRemainingHumanCostMonthly || 0,
    }
  ]

  // Prepare data for Use Case Breakdown
  const useCaseData = useCases.map(uc => {
    const engagedInteractions = (uc.totalInteractions || 0) * ((uc.engagementRate || 0) / 100);
    const fullyResolvedInteractions = engagedInteractions * ((uc.resolutionRate || 0) / 100);
    const handedOverInteractions = engagedInteractions - fullyResolvedInteractions;

    let timeSaved = 0;
    if (uc.category === 'Triage') {
      const transferredInteractions = engagedInteractions * ((uc.transferRate || 0) / 100);
      timeSaved = transferredInteractions * (uc.transferTime || 0);
    } else {
      timeSaved = (fullyResolvedInteractions * (uc.actualHandlingTime || 0)) + (handedOverInteractions * (uc.handoverTimeSaved || 0));
    }

    return {
      id: uc.id,
      name: uc.name,
      units: engagedInteractions * (uc.unitsPerInteraction || 0),
      timeSavedHours: timeSaved / 60
    };
  }).filter(uc => uc.units > 0)

  const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444']
  
  // Create consistent color mapping by Use Case ID
  const useCaseColorMap = {}
  useCases.forEach((uc, index) => {
    useCaseColorMap[uc.id] = COLORS[index % COLORS.length]
  })

  const formatCurrency = (val) => new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(val)
  const formatNumber = (val) => new Intl.NumberFormat('en-US').format(Math.round(val))

  // Prepare data for Cumulative ROI Timeline
  const roiTimelineData = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    return {
      month: `Mo ${month}`,
      'Annual AI Investment': results.incrementalAiCost * 12,
      'Cumulative Value Generated': results.totalCurrentAgentCostMonthly * month
    };
  });

  // Prepare data for Financial Value by Use Case
  const useCaseFinancialData = useCases.map(uc => {
    const engagedInteractions = (uc.totalInteractions || 0) * ((uc.engagementRate || 0) / 100);
    const fullyResolvedInteractions = engagedInteractions * ((uc.resolutionRate || 0) / 100);
    const handedOverInteractions = engagedInteractions - fullyResolvedInteractions;
    
    let timeSaved = 0;
    if (uc.category === 'Triage') {
      const transferredInteractions = engagedInteractions * ((uc.transferRate || 0) / 100);
      timeSaved = transferredInteractions * (uc.transferTime || 0);
    } else {
      timeSaved = (fullyResolvedInteractions * (uc.actualHandlingTime || 0)) + (handedOverInteractions * (uc.handoverTimeSaved || 0));
    }

    const monthlyMinutesPerFte = (((globalSettings.fteWeeklyHours || 0) * 52) / 12) * 60;
    const fteSaved = monthlyMinutesPerFte > 0 ? (timeSaved / monthlyMinutesPerFte) : 0;
    const monthlyFteCost = (globalSettings.fullyLoadedAgentCost || 0) / 12;
    const valueGenerated = fteSaved * monthlyFteCost;

    return {
      id: uc.id,
      name: uc.name,
      'Monthly Value (£)': valueGenerated
    };
  }).filter(uc => uc['Monthly Value (£)'] > 0).sort((a, b) => b['Monthly Value (£)'] - a['Monthly Value (£)']);

  const totalVoiceVolume = useCases.filter(uc => uc.channel === 'Voice').reduce((sum, uc) => sum + (uc.totalInteractions || 0), 0);
  const totalDigitalVolume = useCases.filter(uc => uc.channel === 'Digital').reduce((sum, uc) => sum + (uc.totalInteractions || 0), 0);
  
  const channelSplitData = [
    { name: 'Voice', value: totalVoiceVolume },
    { name: 'Digital', value: totalDigitalVolume }
  ];

  const CHANNEL_COLORS = {
    'Voice': 'var(--text-muted)',
    'Digital': 'var(--accent-primary)'
  };

  const isNetPositive = results.netMonthlySavings > 0;
  
  const hasCosts = globalSettings.agentLicenseCost > 0 || globalSettings.aiEnablementCost > 0 || globalSettings.additionalBundleCost > 0 || globalSettings.speechCostPer100Hours > 0 || globalSettings.additionalDigitalBundleCost > 0;

  return (
    <div className="flex" style={{ flexDirection: 'column', gap: '2rem' }}>
      
      {/* Executive Summary Narrative */}
      {isNetPositive && hasCosts && (
        <div className="card" style={{ background: 'linear-gradient(135deg, var(--bg-secondary), var(--primary-alpha))', borderLeft: '4px solid var(--accent-primary)' }}>
          <p style={{ fontSize: '1.2rem', margin: 0, lineHeight: '1.6', color: 'var(--text-primary)' }}>
            By automating these use cases, you could potentially free up <strong style={{ color: 'var(--accent-primary)' }}>{results.totalFteSaved.toFixed(1)} FTEs</strong> of capacity. 
            Whether realised as direct savings through headcount reduction or as added value by reallocating staff to higher-impact work, this represents <strong style={{ color: 'var(--accent-success)' }}>{formatCurrency(results.netMonthlySavings)}</strong> monthly—delivering a return on your investment in <strong style={{ color: 'var(--text-primary)' }}>{results.paybackMonths.toFixed(1)} months</strong>.
          </p>
        </div>
      )}
      {!hasCosts && results.totalFteSaved > 0 && (
        <div className="card" style={{ background: 'linear-gradient(135deg, var(--bg-secondary), var(--primary-alpha))', borderLeft: '4px solid var(--accent-primary)' }}>
          <p style={{ fontSize: '1.2rem', margin: 0, lineHeight: '1.6', color: 'var(--text-primary)' }}>
            By automating these use cases, you could potentially free up <strong style={{ color: 'var(--accent-primary)' }}>{results.totalFteSaved.toFixed(1)} FTEs</strong> of capacity.
          </p>
        </div>
      )}

      {/* Top Metrics Summary */}
      <div className="print-page">
        <div style={{ display: 'grid', gridTemplateColumns: hasCosts ? 'repeat(3, 1fr)' : '1fr', gap: '1.5rem' }}>
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <div style={{ padding: '0.5rem', background: 'var(--secondary-alpha)', borderRadius: 'var(--radius-md)' }}>
              <Users size={24} color="var(--accent-secondary)" />
            </div>
            <h3 style={{ margin: 0 }}>Potential Capacity Freed</h3>
          </div>
          <div className="metric-value primary" style={{ fontSize: '2.5rem' }}>
            {results.totalFteSaved.toFixed(1)} FTEs
          </div>
          <div className="text-secondary mt-2">
            {formatNumber(results.totalTimeSavedHours)} hours / month
          </div>
          <p className="metric-subtext mt-4">
            Estimated hours of manual work that could be redirected. Calculated by dividing projected automated interaction time by a standard {globalSettings.fteWeeklyHours}-hour work week.
          </p>
        </div>

        {hasCosts && (
          <>
            <div className="card">
              <div className="flex items-center gap-2 mb-4">
                <div style={{ padding: '0.5rem', background: 'var(--success-alpha)', borderRadius: 'var(--radius-md)' }}>
                  <TrendingUp size={24} color="var(--accent-success)" />
                </div>
                <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', position: 'relative' }}>
                  Potential Value of Freed Capacity
                  <button 
                    onClick={() => setActiveTooltip(activeTooltip === 'financial' ? null : 'financial')}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', padding: 0 }}
                  >
                    <HelpCircle size={16} />
                  </button>
                  {activeTooltip === 'financial' && (
                    <div style={{
                      position: 'absolute',
                      top: '100%',
                      left: '0',
                      marginTop: '0.5rem',
                      width: '280px',
                      backgroundColor: 'var(--bg-secondary)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-md)',
                      padding: '1rem',
                      zIndex: 10,
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                        <strong style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>Hard vs Soft Savings</strong>
                        <button onClick={() => setActiveTooltip(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={14} /></button>
                      </div>
                      <p style={{ margin: 0, fontSize: '0.85rem', lineHeight: 1.4, color: 'var(--text-secondary)', fontWeight: 400 }}>
                        To realise this as hard cash savings, the business must shrink headcount via natural attrition or repurpose these agents to other areas or departments.
                      </p>
                    </div>
                  )}
                </h3>
              </div>
              <div className="metric-value success" style={{ fontSize: '2.5rem' }}>
                {formatCurrency(results.netMonthlySavings)}
                <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 400, marginLeft: '0.5rem' }}>/ month</span>
              </div>
              <div className="text-secondary mt-2">
                {formatCurrency(results.netYearlySavings)} / year
              </div>
              <p className="metric-subtext mt-4">
                Potential cost reduction after software investments. Calculated as: Current human handling cost minus the new AI software cost.
              </p>
            </div>

            <div className="card">
              <div className="flex items-center gap-2 mb-4">
                <div style={{ padding: '0.5rem', background: 'var(--primary-alpha)', borderRadius: 'var(--radius-md)' }}>
                  <Clock size={24} color="var(--accent-primary)" />
                </div>
                <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', position: 'relative' }}>
                  Estimated Payback
                  <button 
                    onClick={() => setActiveTooltip(activeTooltip === 'roi' ? null : 'roi')}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', padding: 0 }}
                  >
                    <HelpCircle size={16} />
                  </button>
                  {activeTooltip === 'roi' && (
                    <div style={{
                      position: 'absolute',
                      top: '100%',
                      left: '0',
                      marginTop: '0.5rem',
                      width: '280px',
                      backgroundColor: 'var(--bg-secondary)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-md)',
                      padding: '1rem',
                      zIndex: 10,
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                        <strong style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>ROI Calculation</strong>
                        <button onClick={() => setActiveTooltip(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={14} /></button>
                      </div>
                      <p style={{ margin: 0, fontSize: '0.85rem', lineHeight: 1.4, color: 'var(--text-secondary)', fontWeight: 400 }}>
                        ROI is achieved when the value of the freed human capacity exceeds the AI software cost. This assumes freed capacity is realised as cash savings or growth.
                      </p>
                    </div>
                  )}
                </h3>
              </div>
              <div className="metric-value" style={{ fontSize: '2.5rem', color: 'var(--accent-primary)' }}>
                {formatNumber(results.roiPercentage)}%
              </div>
              <div className="text-secondary mt-2">
                Payback Period: {results.paybackMonths.toFixed(1)} months
              </div>
              <p className="metric-subtext mt-4">
                Your investment pays for itself in {results.paybackMonths.toFixed(1)} months. Calculated as the annual incremental AI software cost divided by the gross monthly value generated.
              </p>
            </div>
          </>
        )}
      </div>
      </div>

      {/* Charts */}
      <div className="print-page">
      
      {/* Channel Split Chart */}
      <div className="card mb-4" style={{ breakInside: 'avoid', marginTop: '1.5rem' }}>
        <h3 className="mb-4">Current Channel Split (Interaction Volume)</h3>
        <div style={{ width: '100%', height: '250px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={channelSplitData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {channelSplitData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CHANNEL_COLORS[entry.name]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
                formatter={(value) => formatNumber(value)}
              />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid-2">
        {hasCosts && (
          <div className="card" style={{ breakInside: 'avoid' }}>
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
                  <Bar dataKey="Base Agent Licences" stackId="a" fill="var(--accent-secondary)" />
                  <Bar dataKey="AI Software Cost" stackId="a" fill="var(--accent-primary)" />
                  <Bar dataKey="Speech/Digital Cost" stackId="a" fill="var(--accent-success)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        <div className="card" style={{ breakInside: 'avoid', gridColumn: hasCosts ? 'auto' : 'span 2' }}>
          <h3 className="mb-4">Time Saved by Use Case (Hours/Month)</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={useCaseData}
                layout="vertical"
                margin={{ top: 20, right: 30, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" horizontal={false} />
                <XAxis type="number" stroke="var(--text-secondary)" />
                <YAxis dataKey="name" type="category" stroke="var(--text-secondary)" width={140} tick={<CustomYAxisTick />} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
                  formatter={(value) => formatNumber(value) + ' hrs'}
                />
                <Bar dataKey="timeSavedHours" fill="var(--accent-primary)" radius={[0, 4, 4, 0]}>
                  {useCaseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={useCaseColorMap[entry.id]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
      </div>
      </div>

      {hasCosts && (
        <div className="grid-2" style={{ marginTop: '2rem' }}>
          <div className="card" style={{ breakInside: 'avoid' }}>
            <h3 className="mb-4">12-Month ROI Timeline (Break-Even)</h3>
            <p className="text-secondary" style={{ fontSize: '0.9rem', marginBottom: '1.5rem' }}>Assuming the incremental AI software cost is paid annually upfront.</p>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={roiTimelineData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                  <XAxis dataKey="month" stroke="var(--text-secondary)" />
                  <YAxis stroke="var(--text-secondary)" tickFormatter={(val) => '£' + (val / 1000) + 'k'} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
                    formatter={(value) => formatCurrency(value)}
                  />
                  <Legend />
                  <Area type="monotone" dataKey="Cumulative Value Generated" fill="var(--success-alpha)" stroke="var(--accent-success)" strokeWidth={3} />
                  <Line type="stepAfter" dataKey="Annual AI Investment" stroke="var(--accent-primary)" strokeWidth={3} strokeDasharray="5 5" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card" style={{ breakInside: 'avoid' }}>
            <h3 className="mb-4">Financial Value by Use Case (£/Month)</h3>
            <p className="text-secondary" style={{ fontSize: '0.9rem', marginBottom: '1.5rem' }}>The monthly gross human handling cost avoided by each use case.</p>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={useCaseFinancialData}
                  layout="vertical"
                  margin={{ top: 20, right: 30, left: 10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" horizontal={false} />
                  <XAxis type="number" stroke="var(--text-secondary)" tickFormatter={(val) => '£' + (val / 1000) + 'k'} />
                  <YAxis dataKey="name" type="category" stroke="var(--text-secondary)" width={140} tick={<CustomYAxisTick />} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
                    formatter={(value) => formatCurrency(value)}
                  />
                  <Bar dataKey="Monthly Value (£)" fill="var(--accent-primary)" radius={[0, 4, 4, 0]}>
                    {useCaseFinancialData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={useCaseColorMap[entry.id]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
      </div>


    </div>
  )
}
