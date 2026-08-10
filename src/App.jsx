import { useState, useMemo, useEffect, useRef } from 'react'
import { Calculator, Download, Plus, Settings, BarChart3, Printer, HelpCircle, Upload, Save, RotateCcw } from 'lucide-react'
import * as XLSX from 'xlsx'

import GlobalSettings from './components/GlobalSettings'
import UseCaseManager from './components/UseCaseManager'
import ResultsDashboard from './components/ResultsDashboard'
import HelpModal from './components/HelpModal'

const DEFAULT_GLOBAL_SETTINGS = {
  agentLicenseCost: 0, // per agent/month
  aiEnablementCost: 0, // per agent/month
  numberOfAgents: 0, // Total number of agents
  includedAiUnits: 0, // units included per agent
  additionalBundleCost: 0, // Cost per bundle
  additionalBundleSize: 0, // Units per bundle
  speechCostPer100Hours: 0, // Cost per 100 hours of speech
  includedDigitalMessages: 0, // bundled per agent
  additionalDigitalBundleCost: 0, // Cost per additional messages bundle
  additionalDigitalBundleSize: 0, // Number of messages in additional bundle
  fteWeeklyHours: 37.5, // Standard UK FTE hours
  fullyLoadedAgentCost: 32500 // Average UK fully-loaded cost (Salary + Employer NI + Pension + Overheads)
}

const DEFAULT_VOICE_TRIAGE = {
  id: '1',
  name: 'Voice Triage',
  category: 'Triage',
  channel: 'Voice',
  unitsPerInteraction: 15,
  digitalMessagesPerInteraction: 5,
  totalInteractions: 5000,
  engagementRate: 100,
  resolutionRate: 0,
  actualHandlingTime: 3, // minutes
  handoverTimeSaved: 1, // minutes
  transferRate: 15,
  transferTime: 3, // minutes
  aiTalkTime: 1 // minutes (probable AI talk time)
}

const DEFAULT_DIGITAL_TRIAGE = {
  id: '2',
  name: 'Digital Triage',
  category: 'Triage',
  channel: 'Digital',
  unitsPerInteraction: 5,
  digitalMessagesPerInteraction: 4, // 4 messages sent by AI
  totalInteractions: 3000,
  engagementRate: 100,
  resolutionRate: 0,
  actualHandlingTime: 2, // minutes
  handoverTimeSaved: 1, // minutes
  transferRate: 15,
  transferTime: 1.5, // 1.5 minutes of active agent handling time
  aiTalkTime: 0 
}

const DEFAULT_VOICE_ENQUIRY = {
  id: '3',
  name: 'Voice GenAI Enquiry',
  category: 'General Enquiries',
  channel: 'Voice',
  unitsPerInteraction: 30, // GenAI uses more processing units
  digitalMessagesPerInteraction: 0,
  totalInteractions: 5000,
  engagementRate: 100,
  resolutionRate: 65, // 65% containment for a robust GenAI Knowledge Base
  actualHandlingTime: 4, // 4 mins human handling time
  handoverTimeSaved: 1.5, // 1.5 mins saved if handed over
  transferRate: 0,
  transferTime: 0,
  aiTalkTime: 2 // 2 mins AI talk time
}

const DEFAULT_DIGITAL_ENQUIRY = {
  id: '4',
  name: 'Digital GenAI Enquiry',
  category: 'General Enquiries',
  channel: 'Digital',
  unitsPerInteraction: 20, 
  digitalMessagesPerInteraction: 8, // More messages for a GenAI back-and-forth
  totalInteractions: 3000,
  engagementRate: 100,
  resolutionRate: 65, // 65% containment
  actualHandlingTime: 3, // 3 mins active human time
  handoverTimeSaved: 1.5, // 1.5 mins saved by passing context
  transferRate: 0,
  transferTime: 0,
  aiTalkTime: 0 
}

const DEFAULT_VOICE_TRANSACTIONAL = {
  id: '5',
  name: 'Voice Transactional',
  category: 'Transactional',
  channel: 'Voice',
  unitsPerInteraction: 40, // API calls & complex flows use more units
  digitalMessagesPerInteraction: 0,
  totalInteractions: 2000,
  engagementRate: 100,
  resolutionRate: 60, // Highly structured workflows have high containment
  actualHandlingTime: 6, // 6 mins human time (security, CRM lookups, compliance)
  handoverTimeSaved: 3, // 3 mins saved (e.g. ID&V and data collection already done)
  transferRate: 0,
  transferTime: 0,
  aiTalkTime: 3 // 3 mins AI talk time (reading options, confirming data)
}

const DEFAULT_DIGITAL_TRANSACTIONAL = {
  id: '6',
  name: 'Digital Transactional',
  category: 'Transactional',
  channel: 'Digital',
  unitsPerInteraction: 20, 
  digitalMessagesPerInteraction: 12, // Long flow: ID&V, collect data, confirm, receipt
  totalInteractions: 2000,
  engagementRate: 100,
  resolutionRate: 60, // 60% containment
  actualHandlingTime: 4.5, // 4.5 mins active human time
  handoverTimeSaved: 2.5, // 2.5 mins saved
  transferRate: 0,
  transferTime: 0,
  aiTalkTime: 0 
}

const DEFAULT_VOICE_DATA = {
  id: '7',
  name: 'Voice Data Collection',
  category: 'Data Collection',
  channel: 'Voice',
  unitsPerInteraction: 20, 
  digitalMessagesPerInteraction: 0,
  totalInteractions: 4000,
  engagementRate: 100,
  resolutionRate: 0, // By definition, data collection hands over to a human
  actualHandlingTime: 5, 
  handoverTimeSaved: 2.5, // 2.5 mins of tedious data entry saved
  transferRate: 0,
  transferTime: 0,
  aiTalkTime: 2 // 2 mins AI talk time to accurately capture spellings/numbers
}

const DEFAULT_DIGITAL_DATA = {
  id: '8',
  name: 'Digital Data Collection',
  category: 'Data Collection',
  channel: 'Digital',
  unitsPerInteraction: 10, 
  digitalMessagesPerInteraction: 6, // 6 messages to gather a form's worth of data
  totalInteractions: 4000,
  engagementRate: 100,
  resolutionRate: 0, 
  actualHandlingTime: 4, 
  handoverTimeSaved: 2, // 2 mins saved
  transferRate: 0,
  transferTime: 0,
  aiTalkTime: 0 
}

function App() {
  const [globalSettings, setGlobalSettings] = useState(() => {
    const saved = localStorage.getItem('roiGlobalSettings')
    return saved ? JSON.parse(saved) : DEFAULT_GLOBAL_SETTINGS
  })
  const [useCases, setUseCases] = useState(() => {
    const saved = localStorage.getItem('roiUseCases')
    return saved ? JSON.parse(saved) : []
  })
  const [activeTab, setActiveTab] = useState('calculator') // 'calculator', 'settings'
  const [isHelpOpen, setIsHelpOpen] = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => {
    localStorage.setItem('roiGlobalSettings', JSON.stringify(globalSettings))
  }, [globalSettings])

  useEffect(() => {
    localStorage.setItem('roiUseCases', JSON.stringify(useCases))
  }, [useCases])



  // Calculations
  const results = useMemo(() => {
    let totalUnitsRequired = 0
    let totalTimeSavedMinutes = 0
    let totalCurrentAgentCostMonthly = 0 // Cost of humans doing this work
    let totalFteSaved = 0
    
    let totalSpeechMinutes = 0
    let totalDigitalMessages = 0

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
      
      // Calculate Speech / Digital Messages
      if (uc.channel === 'Voice') {
        totalSpeechMinutes += engagedInteractions * (uc.aiTalkTime || 0)
      } else if (uc.channel === 'Digital') {
        totalDigitalMessages += engagedInteractions * (uc.digitalMessagesPerInteraction || 0)
      }
      
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
    
    // Speech Cost (Purchased in blocks of 100 hours)
    const totalSpeechHours = totalSpeechMinutes / 60
    const speechBlocksNeeded = Math.ceil(totalSpeechHours / 100)
    const speechCost = speechBlocksNeeded * (globalSettings.speechCostPer100Hours || 0)
    
    // Digital Messages Cost
    const totalIncludedDigitalMessages = (globalSettings.numberOfAgents || 0) * (globalSettings.includedDigitalMessages || 0)
    const extraDigitalMessagesNeeded = Math.max(0, totalDigitalMessages - totalIncludedDigitalMessages)
    const digitalBundleSize = globalSettings.additionalDigitalBundleSize || 1
    const digitalBundlesNeeded = Math.ceil(extraDigitalMessagesNeeded / digitalBundleSize)
    const additionalDigitalBundlesCost = digitalBundlesNeeded * (globalSettings.additionalDigitalBundleCost || 0)
    
    const totalAiMonthlyCost = baseAiMonthlyCost + additionalBundlesCost + speechCost + additionalDigitalBundlesCost

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
      additionalBundlesCost,
      totalSpeechHours,
      totalSpeechMinutes,
      speechCost,
      totalDigitalMessages,
      totalIncludedDigitalMessages,
      extraDigitalMessagesNeeded,
      digitalBundlesNeeded,
      additionalDigitalBundlesCost,
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
    if (window.confirm("Are you sure you want to clear all data and reset to zero?")) {
      setGlobalSettings(DEFAULT_GLOBAL_SETTINGS)
      setUseCases([])
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
      ['AI Unit Bundle Cost (£)', globalSettings.additionalBundleCost],
      ['AI Unit Bundle Size', globalSettings.additionalBundleSize],
      ['Speech Cost per 100 Hours (£)', globalSettings.speechCostPer100Hours],
      ['Bundled Digital Messages (per agent/month)', globalSettings.includedDigitalMessages],
      ['Digital Msg Bundle Cost (£)', globalSettings.additionalDigitalBundleCost],
      ['Digital Msg Bundle Size', globalSettings.additionalDigitalBundleSize],
      ['FTE Weekly Working Hours', globalSettings.fteWeeklyHours],
      ['FTE Yearly Cost (£)', globalSettings.fullyLoadedAgentCost],
    ];
    
    const useCasesData = [
      ['Name', 'Category', 'Channel', 'Interactions/Mo', 'Engagement (%)', 'Resolution/Transfer (%)', 'Units/Interaction', 'Digital Msgs', 'AI Talk Time', 'Full/Transfer Time (mins)', 'Handover Time (mins)'],
      ...useCases.map(uc => [
        uc.name,
        uc.category,
        uc.channel,
        uc.totalInteractions,
        uc.engagementRate,
        uc.category === 'Triage' ? uc.transferRate : uc.resolutionRate,
        uc.unitsPerInteraction,
        uc.channel === 'Digital' ? uc.digitalMessagesPerInteraction : 0,
        uc.channel === 'Voice' ? uc.aiTalkTime : 0,
        uc.category === 'Triage' ? uc.transferTime : uc.actualHandlingTime,
        uc.category === 'Triage' ? 0 : uc.handoverTimeSaved
      ])
    ];

    const resultsData = [
      ['Metric', 'Value'],
      ['--- AI Units ---', ''],
      ['Total Required/Mo', results.totalUnitsRequired],
      ['Included', results.totalIncludedUnits],
      ['Extra Bundles Needed', results.bundlesNeeded],
      ['Extra Cost (£/Mo)', results.additionalBundlesCost],
      ['--- Digital Messages ---', ''],
      ['Total Required/Mo', results.totalDigitalMessages],
      ['Included', results.totalIncludedDigitalMessages],
      ['Extra Bundles Needed', results.digitalBundlesNeeded],
      ['Extra Cost (£/Mo)', results.additionalDigitalBundlesCost],
      ['--- Voice / Speech ---', ''],
      ['Required (Hours/Mo)', results.totalSpeechHours],
      ['Cost (£/Mo)', results.speechCost],
      ['--- Overall Costs & ROI ---', ''],
      ['Total Monthly Software Costs (£)', results.totalAiMonthlyCost],
      ['Base Software Cost (£)', results.baseSoftwareCost],
      ['Total Time Saved (Hours/Mo)', results.totalTimeSavedHours],
      ['Total FTEs Saved', results.totalFteSaved],
      ['Current Human Handling Cost (£/Mo)', results.totalCurrentAgentCostMonthly],
      ['Financial Value of Freed Capacity (£/Mo)', results.netMonthlySavings],
      ['Financial Value of Freed Capacity (£/Yr)', results.netYearlySavings],
      ['Estimated ROI (%)', results.roiPercentage],
      ['Payback Period (Months)', results.paybackMonths]
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
      { wch: 15 }, // Channel
      { wch: 15 }, // Interactions/Mo
      { wch: 15 }, // Engagement (%)
      { wch: 25 }, // Resolution/Transfer (%)
      { wch: 15 }, // Units/Interaction
      { wch: 15 }, // Digital Msgs
      { wch: 15 }, // AI Talk Time
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
      'B13': '#,##0',
      'B14': '#,##0',
      'B15': '#,##0',
      'B16': '#,##0',
      'B17': '£#,##0.00',
      'B18': '£#,##0.00',
      'B19': '£#,##0.00',
      'B20': '#,##0.0"%"'
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
          <>
            <div className="dashboard-grid">
              <div className="no-print">
                <UseCaseManager useCases={useCases} setUseCases={setUseCases} />
              </div>
              <div>
                <ResultsDashboard results={results} useCases={useCases} globalSettings={globalSettings} />
              </div>
            </div>

            <div className="card mt-4 print-page" style={{ marginTop: '2rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
              <h2 className="mb-4">Total Usage Requirements</h2>
              <div className="grid-3">
                <div>
                  <div className="metric-label">Total AI Units Needed</div>
                  <div className="metric-value primary" style={{ fontSize: '2rem' }}>
                    {Math.round(results.totalUnitsRequired).toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="metric-label">Total Speech Hours Needed</div>
                  <div className="metric-value" style={{ fontSize: '2rem', color: 'var(--accent-secondary)' }}>
                    {Math.round(results.totalSpeechHours).toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="metric-label">Total Digital Messages Needed</div>
                  <div className="metric-value" style={{ fontSize: '2rem', color: 'var(--accent-secondary)' }}>
                    {Math.round(results.totalDigitalMessages).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </>
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


        </div>
      </main>

      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  )
}

export default App
