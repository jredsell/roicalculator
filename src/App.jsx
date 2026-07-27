import { useState, useMemo, useEffect, useRef } from 'react'
import { Calculator, Download, Plus, Settings, BarChart3, Printer, HelpCircle, Sun, Moon, Upload, Save, RotateCcw } from 'lucide-react'
import * as XLSX from 'xlsx'

import GlobalSettings from './components/GlobalSettings'
import UseCaseManager from './components/UseCaseManager'
import ResultsDashboard from './components/ResultsDashboard'
import HelpModal from './components/HelpModal'

const DEFAULT_GLOBAL_SETTINGS = {
  agentLicenseCost: 0, // per agent/month
  aiEnablementCost: 0, // per agent/month
  numberOfAgents: 100, // Total number of agents to base the global cost on
  includedAiUnits: 0, // units included per agent
  additionalBundleCost: 0, // Cost per bundle
  additionalBundleSize: 0, // Units per bundle
  fteWeeklyHours: 37.5, // Hours
  fullyLoadedAgentCost: 30000 // Annual cost
}

const DEFAULT_USE_CASE = {
  id: '1',
  name: 'Initial Triage',
  category: 'Triage',
  unitsPerInteraction: 15,
  totalInteractions: 5000,
  engagementRate: 100,
  resolutionRate: 0,
  actualHandlingTime: 3, // minutes
  handoverTimeSaved: 1, // minutes
  transferRate: 20,
  transferTime: 2 // minutes
}

function App() {
  const [globalSettings, setGlobalSettings] = useState(() => {
    const saved = localStorage.getItem('roiGlobalSettings')
    return saved ? JSON.parse(saved) : DEFAULT_GLOBAL_SETTINGS
  })
  const [useCases, setUseCases] = useState(() => {
    const saved = localStorage.getItem('roiUseCases')
    return saved ? JSON.parse(saved) : [DEFAULT_USE_CASE]
  })
  const [activeTab, setActiveTab] = useState('calculator') // 'calculator', 'settings'
  const [isHelpOpen, setIsHelpOpen] = useState(false)
  const [theme, setTheme] = useState('light')
  const fileInputRef = useRef(null)

  useEffect(() => {
    localStorage.setItem('roiGlobalSettings', JSON.stringify(globalSettings))
  }, [globalSettings])

  useEffect(() => {
    localStorage.setItem('roiUseCases', JSON.stringify(useCases))
  }, [useCases])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  }

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
      let timeSaved = 0
      if (uc.category === 'Triage') {
        const transferredInteractions = engagedInteractions * ((uc.transferRate || 0) / 100)
        timeSaved = transferredInteractions * (uc.transferTime || 0)
      } else {
        const fullTimeSaved = fullyResolvedInteractions * (uc.actualHandlingTime || 0)
        const partialTimeSaved = handedOverInteractions * (uc.handoverTimeSaved || 0)
        timeSaved = fullTimeSaved + partialTimeSaved
      }
      totalTimeSavedMinutes += timeSaved
      
      // FTEs saved for this use case
      const fteSaved = monthlyMinutesPerFte > 0 ? (timeSaved / monthlyMinutesPerFte) : 0
      totalFteSaved += fteSaved

      // Current human cost (monthly) for the automated portion if humans did it
      // Annual cost / 12 = monthly cost per FTE
      const monthlyFteCost = (globalSettings.fullyLoadedAgentCost || 0) / 12
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

  const exportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ globalSettings, useCases }, null, 2))
    const downloadAnchorNode = document.createElement('a')
    downloadAnchorNode.setAttribute("href", dataStr)
    downloadAnchorNode.setAttribute("download", "roi_calculator_config.json")
    document.body.appendChild(downloadAnchorNode)
    downloadAnchorNode.click()
    downloadAnchorNode.remove()
  }

  const importJson = (event) => {
    const file = event.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result)
        if (data.globalSettings) setGlobalSettings(data.globalSettings)
        if (data.useCases) setUseCases(data.useCases)
      } catch (error) {
        alert("Error parsing JSON file")
      }
    }
    reader.readAsText(file)
    event.target.value = null
  }

  const resetData = () => {
    if (window.confirm("Are you sure you want to clear all data and reset to defaults?")) {
      setGlobalSettings(DEFAULT_GLOBAL_SETTINGS)
      setUseCases([DEFAULT_USE_CASE])
      localStorage.removeItem('roiGlobalSettings')
      localStorage.removeItem('roiUseCases')
    }
  }

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
      ['FTE Yearly Cost (£)', globalSettings.fullyLoadedAgentCost],
    ];
    
    const useCasesData = [
      ['Name', 'Category', 'Interactions/Mo', 'Engagement (%)', 'Resolution/Transfer (%)', 'Units/Interaction', 'Full/Transfer Time (mins)', 'Handover Time (mins)'],
      ...useCases.map(uc => [
        uc.name,
        uc.category,
        uc.totalInteractions,
        uc.engagementRate,
        uc.category === 'Triage' ? uc.transferRate : uc.resolutionRate,
        uc.unitsPerInteraction,
        uc.category === 'Triage' ? uc.transferTime : uc.actualHandlingTime,
        uc.category === 'Triage' ? 0 : uc.handoverTimeSaved
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
    
    // Helper to format cells
    const formatCells = (ws, formats) => {
      Object.keys(formats).forEach(cell => {
        if (ws[cell]) ws[cell].z = formats[cell];
      });
    };

    const wsSettings = XLSX.utils.aoa_to_sheet(settingsData);
    wsSettings['!cols'] = [{ wch: 35 }, { wch: 20 }];
    formatCells(wsSettings, {
      'B2': '#,##0',
      'B3': '£#,##0.00',
      'B4': '£#,##0.00',
      'B5': '#,##0',
      'B6': '£#,##0.00',
      'B7': '#,##0',
      'B8': '0.0',
      'B9': '£#,##0.00'
    });
    XLSX.utils.book_append_sheet(wb, wsSettings, "Global Settings");
    
    const wsUseCases = XLSX.utils.aoa_to_sheet(useCasesData);
    wsUseCases['!cols'] = [
      { wch: 25 }, // Name
      { wch: 20 }, // Category
      { wch: 15 }, // Interactions/Mo
      { wch: 15 }, // Engagement (%)
      { wch: 25 }, // Resolution/Transfer (%)
      { wch: 15 }, // Units/Interaction
      { wch: 25 }, // Full/Transfer Time (mins)
      { wch: 25 }  // Handover Time (mins)
    ];
    XLSX.utils.book_append_sheet(wb, wsUseCases, "Use Cases");
    
    const wsResults = XLSX.utils.aoa_to_sheet(resultsData);
    wsResults['!cols'] = [{ wch: 35 }, { wch: 20 }];
    formatCells(wsResults, {
      'B2': '#,##0',
      'B3': '#,##0',
      'B4': '#,##0',
      'B5': '#,##0',
      'B6': '£#,##0.00',
      'B7': '£#,##0.00',
      'B8': '#,##0.0',
      'B9': '#,##0.0',
      'B10': '£#,##0.00',
      'B11': '£#,##0.00',
      'B12': '£#,##0.00',
      'B13': '#,##0.0"%"'
    });
    XLSX.utils.book_append_sheet(wb, wsResults, "Results Summary");
    
    XLSX.writeFile(wb, 'AI_ROI_Report.xlsx');
  }

  return (
    <div className="app-container">
      <header className="header no-print">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))', padding: '0.5rem', borderRadius: 'var(--radius-lg)' }}>
              <Calculator size={24} color="white" />
            </div>
            <h1 style={{ margin: 0, fontSize: '2rem' }}>AI Contact Centre ROI</h1>
          </div>
          <p className="text-secondary" style={{ margin: 0 }}>Calculate the value of your Virtual Agent automation</p>
        </div>
        
        <div className="header-actions">
          <button 
            className="btn btn-secondary no-print btn-icon"
            onClick={toggleTheme}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          
          <button 
            className="btn btn-secondary no-print btn-icon"
            onClick={resetData}
            title="Reset to Defaults"
          >
            <RotateCcw size={18} />
          </button>
          
          <button 
            className="btn btn-secondary no-print btn-icon"
            onClick={exportJson}
            title="Export JSON Config"
          >
            <Save size={18} />
          </button>
          
          <button 
            className="btn btn-secondary no-print btn-icon"
            onClick={() => fileInputRef.current?.click()}
            title="Import JSON Config"
          >
            <Upload size={18} />
          </button>
          <input 
            type="file" 
            accept=".json" 
            style={{ display: 'none' }} 
            ref={fileInputRef}
            onChange={importJson}
          />

          <button 
            className="btn btn-secondary no-print" 
            onClick={() => setIsHelpOpen(true)}
          >
            <HelpCircle size={18} /> Help & Guide
          </button>
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
        <div className="print-only" style={{ marginTop: '2rem' }}>
          <div className="print-page">
            <h2>Use Case Breakdown</h2>
            <table className="use-case-print-table" style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '2rem' }}>
              <thead>
                <tr>
                  <th>Use Case Name</th>
                  <th>Category</th>
                  <th>Interactions / Mo</th>
                  <th>Engagement (%)</th>
                  <th>Resolution/Transfer (%)</th>
                  <th>Units / Interaction</th>
                  <th>Full/Transfer Time (mins)</th>
                  <th>Handover Time (mins)</th>
                </tr>
              </thead>
              <tbody>
                {useCases.map(uc => (
                  <tr key={uc.id}>
                    <td>{uc.name}</td>
                    <td>{uc.category}</td>
                    <td>{(uc.totalInteractions || 0).toLocaleString()}</td>
                    <td>{uc.engagementRate || 0}%</td>
                    <td>{uc.category === 'Triage' ? (uc.transferRate || 0) : (uc.resolutionRate || 0)}%</td>
                    <td>{(uc.unitsPerInteraction || 0).toLocaleString()}</td>
                    <td>{uc.category === 'Triage' ? (uc.transferTime || 0) : (uc.actualHandlingTime || 0)}</td>
                    <td>{uc.category === 'Triage' ? 0 : (uc.handoverTimeSaved || 0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="print-page">
            <h2>Global Assumptions</h2>
            <table className="use-case-print-table" style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '2rem' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', padding: '0.75rem', borderBottom: '2px solid var(--border-color)', color: 'var(--text-secondary)' }}>Agent License Cost</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem', borderBottom: '2px solid var(--border-color)', color: 'var(--text-secondary)' }}>AI Enablement Cost</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem', borderBottom: '2px solid var(--border-color)', color: 'var(--text-secondary)' }}>Included Units/Agent</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem', borderBottom: '2px solid var(--border-color)', color: 'var(--text-secondary)' }}>Bundle (Units/Cost)</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem', borderBottom: '2px solid var(--border-color)', color: 'var(--text-secondary)' }}>FTE Weekly Hours</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem', borderBottom: '2px solid var(--border-color)', color: 'var(--text-secondary)' }}>FTE Yearly Cost</th>
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
                  <td style={{ padding: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>£{(globalSettings.fullyLoadedAgentCost || 0).toLocaleString()}</td>
                  <td style={{ padding: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>{globalSettings.numberOfAgents}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  )
}

export default App
