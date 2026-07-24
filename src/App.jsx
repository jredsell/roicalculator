import { useState, useMemo } from 'react'
import { Calculator, Download, Plus, Settings, BarChart3 } from 'lucide-react'
import html2pdf from 'html2pdf.js'

import GlobalSettings from './components/GlobalSettings'
import UseCaseManager from './components/UseCaseManager'
import ResultsDashboard from './components/ResultsDashboard'

const DEFAULT_GLOBAL_SETTINGS = {
  agentLicenseCost: 50, // per agent/month
  aiEnablementCost: 20, // per agent/month
  numberOfAgents: 100, // Total number of agents to base the global cost on
  includedAiUnits: 10000, // units included per agent
  additionalBundleCost: 15, // Cost per bundle
  additionalBundleSize: 50000, // Units per bundle
  fteWeeklyHours: 37.5 // Hours
}

const DEFAULT_USE_CASE = {
  id: '1',
  name: 'Initial Triage',
  category: 'Triage',
  unitsPerInteraction: 5,
  totalInteractions: 5000,
  percentToAutomate: 40,
  actualHandlingTime: 3, // minutes
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
    const monthlyHoursPerFte = (globalSettings.fteWeeklyHours * 52) / 12
    const monthlyMinutesPerFte = monthlyHoursPerFte * 60

    useCases.forEach(uc => {
      const automatedInteractions = uc.totalInteractions * (uc.percentToAutomate / 100)
      
      // Units for this use case
      totalUnitsRequired += automatedInteractions * uc.unitsPerInteraction
      
      // Time saved (minutes) per month
      const timeSaved = automatedInteractions * uc.actualHandlingTime
      totalTimeSavedMinutes += timeSaved
      
      // FTEs saved for this use case
      const fteSaved = timeSaved / monthlyMinutesPerFte
      totalFteSaved += fteSaved

      // Current human cost (monthly) for the automated portion if humans did it
      // Annual cost / 12 = monthly cost per FTE
      const monthlyFteCost = uc.fullyLoadedAgentCost / 12
      totalCurrentAgentCostMonthly += fteSaved * monthlyFteCost
    })

    // Global AI Costs
    const totalIncludedUnits = globalSettings.numberOfAgents * globalSettings.includedAiUnits
    const baseAiMonthlyCost = globalSettings.numberOfAgents * (globalSettings.aiEnablementCost + globalSettings.agentLicenseCost)
    
    // Additional Bundles needed
    const extraUnitsNeeded = Math.max(0, totalUnitsRequired - totalIncludedUnits)
    const bundlesNeeded = Math.ceil(extraUnitsNeeded / globalSettings.additionalBundleSize)
    const additionalBundlesCost = bundlesNeeded * globalSettings.additionalBundleCost
    
    const totalAiMonthlyCost = baseAiMonthlyCost + additionalBundlesCost

    // Base software cost without AI (just the agent licenses)
    const baseSoftwareCost = globalSettings.numberOfAgents * globalSettings.agentLicenseCost

    // Total Savings (Cost avoided by automating - Cost of AI software + Cost of Base Software)
    // Actually, saving is: Human Cost Avoided - (Total AI Software Cost - Base Software Cost)
    const netMonthlySavings = totalCurrentAgentCostMonthly - (totalAiMonthlyCost - baseSoftwareCost)
    const netYearlySavings = netMonthlySavings * 12

    return {
      totalUnitsRequired,
      totalIncludedUnits,
      extraUnitsNeeded,
      bundlesNeeded,
      totalAiMonthlyCost,
      baseSoftwareCost,
      totalTimeSavedMinutes,
      totalTimeSavedHours: totalTimeSavedMinutes / 60,
      totalFteSaved,
      totalCurrentAgentCostMonthly,
      netMonthlySavings,
      netYearlySavings
    }
  }, [globalSettings, useCases])

  const exportPDF = () => {
    const element = document.getElementById('report-content')
    const opt = {
      margin:       10,
      filename:     'AI_ROI_Report.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    }
    
    // Temporarily add a class to body or wrapper to hide non-print elements
    document.body.classList.add('exporting-pdf')
    
    html2pdf().set(opt).from(element).save().then(() => {
      document.body.classList.remove('exporting-pdf')
    })
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
          <button className="btn btn-secondary" onClick={exportPDF}>
            <Download size={18} /> Export PDF
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
            <div>
              <UseCaseManager useCases={useCases} setUseCases={setUseCases} />
            </div>
            <div>
              <ResultsDashboard results={results} useCases={useCases} globalSettings={globalSettings} />
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
