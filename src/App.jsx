import { useState, useMemo } from 'react'
import { Calculator, Download, Plus, Settings, BarChart3, Printer } from 'lucide-react'
import * as XLSX from 'xlsx'

import GlobalSettings from './components/GlobalSettings'
import UseCaseManager from './components/UseCaseManager'
import ResultsDashboard from './components/ResultsDashboard'

const DEFAULT_GLOBAL_SETTINGS = {
  agentLicenseCost: 65, // per agent/month
  aiEnablementCost: 5, // per agent/month
  numberOfAgents: 100, // Total number of agents to base the global cost on
  includedAiUnits: 1000, // units included per agent
  additionalBundleCost: 95, // Cost per bundle
  additionalBundleSize: 50000, // Units per bundle
  fteWeeklyHours: 37.5 // Hours
}

const DEFAULT_USE_CASE = {
  id: '1',
  name: 'Initial Triage',
  category: 'Triage',
  unitsPerInteraction: 5,
  totalInteractions: 5000,
  engagementRate: 100,
  resolutionRate: 40,
  actualHandlingTime: 3, // minutes
  handoverTimeSaved: 1, // minutes
  fullyLoadedAgentCost: 35000 // Annual cost
}

function App() {
  const [globalSettings, setGlobalSettings] = useState(DEFAULT_GLOBAL_SETTINGS)
  const [useCases, setUseCases] = useState([DEFAULT_USE_CASE])
  const [activeTab, setActiveTab] = useState('calculator') // 'calculator', 'settings'

  // Calculations
  const results = useMemo(() => {
    let totalUnitsRequired = 0
    let totalTimeSavedMinutes = 0
    let totalCurrentAgentCostMonthly = 0 // Cost of humans doing this work
    let totalHumanFteRequired = 0
    let totalFteSaved = 0

    // Working hours calculations
    // 37.5 hours/week * 52 weeks / 12 months = average monthly hours per FTE
    const monthlyHoursPerFte = ((globalSettings.fteWeeklyHours || 0) * 52) / 12
    const monthlyMinutesPerFte = monthlyHoursPerFte * 60

    useCases.forEach(uc => {
      const engagedInteractions = (uc.totalInteractions || 0) * ((uc.engagementRate || 0) / 100)
      const fullyResolvedInteractions = engagedInteractions * ((uc.resolutionRate || 0) / 100)
      const handedOverInteractions = engagedInteractions - fullyResolvedInteractions
      
      // Units for this use case
      totalUnitsRequired += engagedInteractions * (uc.unitsPerInteraction || 0)
      
      // Time saved (minutes) per month
      const fullTimeSaved = fullyResolvedInteractions * (uc.actualHandlingTime || 0)
      const partialTimeSaved = handedOverInteractions * (uc.handoverTimeSaved || 0)
      const timeSaved = fullTimeSaved + partialTimeSaved
      totalTimeSavedMinutes += timeSaved
      
      // FTEs saved for this use case
      const fteSaved = monthlyMinutesPerFte > 0 ? (timeSaved / monthlyMinutesPerFte) : 0
      totalFteSaved += fteSaved

      // Current human cost (monthly) for the automated portion if humans did it
      // Annual cost / 12 = monthly cost per FTE
      const monthlyFteCost = (uc.fullyLoadedAgentCost || 0) / 12
      totalCurrentAgentCostMonthly += fteSaved * monthlyFteCost
    })

    // Global AI Costs
    const totalIncludedUnits = (globalSettings.numberOfAgents || 0) * (globalSettings.includedAiUnits || 0)
    const baseAiMonthlyCost = (globalSettings.numberOfAgents || 0) * ((globalSettings.aiEnablementCost || 0) + (globalSettings.agentLicenseCost || 0))
    
    // Additional Bundles needed
    const extraUnitsNeeded = Math.max(0, totalUnitsRequired - totalIncludedUnits)
    const bundleSize = globalSettings.additionalBundleSize || 1
    const bundlesNeeded = Math.ceil(extraUnitsNeeded / bundleSize)
    const additionalBundlesCost = bundlesNeeded * (globalSettings.additionalBundleCost || 0)
    
    const totalAiMonthlyCost = baseAiMonthlyCost + additionalBundlesCost

    // Base software cost without AI (just the agent licenses)
    const baseSoftwareCost = (globalSettings.numberOfAgents || 0) * (globalSettings.agentLicenseCost || 0)

    // Total Savings (Cost avoided by automating - Cost of AI software + Cost of Base Software)
    // Actually, saving is: Human Cost Avoided - (Total AI Software Cost - Base Software Cost)
    const incrementalAiCost = totalAiMonthlyCost - baseSoftwareCost
    const netMonthlySavings = totalCurrentAgentCostMonthly - incrementalAiCost
    const netYearlySavings = netMonthlySavings * 12
    const roiPercentage = incrementalAiCost > 0 ? (netMonthlySavings / incrementalAiCost) * 100 : (netMonthlySavings > 0 ? 100 : 0)
    const paybackMonths = totalCurrentAgentCostMonthly > 0 ? (incrementalAiCost * 12) / totalCurrentAgentCostMonthly : 0

    return {
      totalUnitsRequired,
      totalIncludedUnits,
      extraUnitsNeeded,
      bundlesNeeded,
      totalAiMonthlyCost,
      incrementalAiCost,
      baseSoftwareCost,
      totalTimeSavedMinutes,
      totalTimeSavedHours: totalTimeSavedMinutes / 60,
      totalFteSaved,
      totalCurrentAgentCostMonthly,
      netMonthlySavings,
      netYearlySavings,
      roiPercentage,
      paybackMonths
    }
  }, [globalSettings, useCases])

  const exportExcel = () => {
    const settingsData = [
      ['Setting', 'Value'],
      ['Total Number of Human Agents', globalSettings.numberOfAgents],
      ['Agent License Cost (£/month)', globalSettings.agentLicenseCost],
      ['AI Enablement Cost (£/agent/month)', globalSettings.aiEnablementCost],
      ['Included AI Units (per agent/month)', globalSettings.includedAiUnits],
      ['Additional Bundle Cost (£)', globalSettings.additionalBundleCost],
      ['Additional Bundle Size (Units)', globalSettings.additionalBundleSize],
      ['FTE Weekly Working Hours', globalSettings.fteWeeklyHours],
    ];
    
    const useCasesData = [
      ['Name', 'Category', 'Interactions/Mo', 'Engagement (%)', 'Resolution (%)', 'Units/Interaction', 'Full Time (mins)', 'Handover Time (mins)', 'Human Agent Cost (£/yr)'],
      ...useCases.map(uc => [
        uc.name,
        uc.category,
        uc.totalInteractions,
        uc.engagementRate,
        uc.resolutionRate,
        uc.unitsPerInteraction,
        uc.actualHandlingTime,
        uc.handoverTimeSaved,
        uc.fullyLoadedAgentCost
      ])
    ];

    const resultsData = [
      ['Metric', 'Value'],
      ['Total Units Required/Mo', results.totalUnitsRequired],
      ['Included Units', results.totalIncludedUnits],
      ['Extra Units Needed', results.extraUnitsNeeded],
      ['Bundles Needed', results.bundlesNeeded],
      ['Total AI Monthly Cost (£)', results.totalAiMonthlyCost],
      ['Base Software Cost (£)', results.baseSoftwareCost],
      ['Total Time Saved (Hours/Mo)', results.totalTimeSavedHours],
      ['Total FTEs Saved', results.totalFteSaved],
      ['Current Human Handling Cost (£/Mo)', results.totalCurrentAgentCostMonthly],
      ['Net Monthly Savings (£)', results.netMonthlySavings],
      ['Net Yearly Savings (£)', results.netYearlySavings],
      ['Estimated ROI (%)', results.roiPercentage]
    ];

    const wb = XLSX.utils.book_new();
    
    const wsSettings = XLSX.utils.aoa_to_sheet(settingsData);
    XLSX.utils.book_append_sheet(wb, wsSettings, "Global Settings");
    
    const wsUseCases = XLSX.utils.aoa_to_sheet(useCasesData);
    XLSX.utils.book_append_sheet(wb, wsUseCases, "Use Cases");
    
    const wsResults = XLSX.utils.aoa_to_sheet(resultsData);
    XLSX.utils.book_append_sheet(wb, wsResults, "Results Summary");
    
    XLSX.writeFile(wb, 'AI_ROI_Report.xlsx');
  }

  return (
    <div className="app-container">
      <header className="header no-print">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))', padding: '0.75rem', borderRadius: 'var(--radius-lg)' }}>
            <Calculator size={28} color="white" />
          </div>
          <div>
            <h1>AI Contact Centre ROI</h1>
            <p className="text-secondary">Calculate the value of your Virtual Agent automation</p>
          </div>
        </div>
        
        <div className="header-actions">
          <button 
            className={`btn ${activeTab === 'calculator' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('calculator')}
          >
            <BarChart3 size={18} /> Calculator
          </button>
          <button 
            className={`btn ${activeTab === 'settings' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('settings')}
          >
            <Settings size={18} /> Settings
          </button>
          <button className="btn btn-secondary no-print" onClick={exportExcel}>
            <Download size={18} /> Export Excel
          </button>
          <button className="btn btn-primary no-print" onClick={() => window.print()}>
            <Printer size={18} /> Generate PDF Report
          </button>
        </div>
      </header>

      <main id="report-content">
        {/* Printable Header - Only visible in PDF */}
        <div className="print-only" style={{ display: 'none', marginBottom: '2rem' }}>
          <h1 style={{ color: 'black' }}>AI Contact Centre ROI Report</h1>
          <p>Generated on {new Date().toLocaleDateString()}</p>
        </div>

        {activeTab === 'settings' ? (
          <GlobalSettings settings={globalSettings} setSettings={setGlobalSettings} />
        ) : (
          <div className="dashboard-grid">
            <div className="no-print">
              <UseCaseManager useCases={useCases} setUseCases={setUseCases} />
            </div>
            <div>
              <ResultsDashboard results={results} useCases={useCases} globalSettings={globalSettings} />
            </div>
          </div>
        )}

        {/* Print-Only Tables */}
        <div className="print-only use-case-print-table" style={{ marginTop: '2rem' }}>
          <h2>Global Assumptions</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '2rem' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '0.75rem', borderBottom: '2px solid var(--border-color)', color: 'var(--text-secondary)' }}>Agent License Cost</th>
                <th style={{ textAlign: 'left', padding: '0.75rem', borderBottom: '2px solid var(--border-color)', color: 'var(--text-secondary)' }}>AI Enablement Cost</th>
                <th style={{ textAlign: 'left', padding: '0.75rem', borderBottom: '2px solid var(--border-color)', color: 'var(--text-secondary)' }}>Included Units/Agent</th>
                <th style={{ textAlign: 'left', padding: '0.75rem', borderBottom: '2px solid var(--border-color)', color: 'var(--text-secondary)' }}>Bundle (Units/Cost)</th>
                <th style={{ textAlign: 'left', padding: '0.75rem', borderBottom: '2px solid var(--border-color)', color: 'var(--text-secondary)' }}>FTE Weekly Hours</th>
                <th style={{ textAlign: 'left', padding: '0.75rem', borderBottom: '2px solid var(--border-color)', color: 'var(--text-secondary)' }}>Total Agents</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>£{globalSettings.agentLicenseCost} / mo</td>
                <td style={{ padding: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>£{globalSettings.aiEnablementCost} / mo</td>
                <td style={{ padding: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>{(globalSettings.includedAiUnits || 0).toLocaleString()}</td>
                <td style={{ padding: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>{(globalSettings.additionalBundleSize || 0).toLocaleString()} for £{globalSettings.additionalBundleCost}</td>
                <td style={{ padding: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>{globalSettings.fteWeeklyHours}</td>
                <td style={{ padding: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>{globalSettings.numberOfAgents}</td>
              </tr>
            </tbody>
          </table>

          <h2>Use Case Breakdown</h2>
          <table className="use-case-print-table">
            <thead>
              <tr>
                <th>Use Case Name</th>
                <th>Category</th>
                <th>Interactions / Mo</th>
                <th>Engagement (%)</th>
                <th>Resolution (%)</th>
                <th>Units / Interaction</th>
                <th>Full Time (mins)</th>
                <th>Handover Time (mins)</th>
                <th>Human Agent Cost (£/yr)</th>
              </tr>
            </thead>
            <tbody>
              {useCases.map(uc => (
                <tr key={uc.id}>
                  <td>{uc.name}</td>
                  <td>{uc.category}</td>
                  <td>{(uc.totalInteractions || 0).toLocaleString()}</td>
                  <td>{uc.engagementRate || 0}%</td>
                  <td>{uc.resolutionRate || 0}%</td>
                  <td>{(uc.unitsPerInteraction || 0).toLocaleString()}</td>
                  <td>{uc.actualHandlingTime || 0}</td>
                  <td>{uc.handoverTimeSaved || 0}</td>
                  <td>£{(uc.fullyLoadedAgentCost || 0).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}

export default App
