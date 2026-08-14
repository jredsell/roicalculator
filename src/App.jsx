import { useState, useMemo, useEffect, useRef } from 'react'
import { Calculator, Settings, BarChart3, HelpCircle, Upload, Save, RotateCcw, ArrowRightLeft } from 'lucide-react'

import GlobalSettings from './components/GlobalSettings'
import UseCaseManager from './components/UseCaseManager'
import ResultsDashboard from './components/ResultsDashboard'
import HelpModal from './components/HelpModal'
import ChannelShiftModeller from './components/ChannelShiftModeller'
import { calculateResults } from './utils/calculatorEngine'

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
    return calculateResults(useCases, globalSettings);
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
      } catch {
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

  const handleApplySingleShift = (voiceId, shiftedVolume, digitalEquivalent) => {
    setUseCases(prev => {
      const updated = prev.map(uc => {
        if (uc.id === voiceId) {
          return { ...uc, totalInteractions: Math.max(0, uc.totalInteractions - shiftedVolume) }
        }
        return uc
      })
      
      const newDigital = {
        ...digitalEquivalent,
        id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString() + Math.random().toString(36).substring(2, 9)
      }
      
      return [...updated, newDigital]
    })
    setActiveTab('calculator')
  }

  return (
    <div className="app-container">
      <header className="header no-print">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))', padding: '0.5rem', borderRadius: 'var(--radius-lg)' }}>
              <Calculator size={24} color="white" />
            </div>
            <h1 style={{ margin: 0, fontSize: '2rem' }}>AI Value & Savings Modeller</h1>
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
            className={`btn ${activeTab === 'calculator' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('calculator')}
          >
            <BarChart3 size={18} /> Calculator
          </button>
          <button 
            className={`btn ${activeTab === 'channel-shift' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('channel-shift')}
          >
            <ArrowRightLeft size={18} /> Channel Shift
          </button>
          <button 
            className={`btn ${activeTab === 'settings' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('settings')}
          >
            <Settings size={18} /> Settings
          </button>
          <button 
            className="btn btn-secondary no-print" 
            onClick={() => setIsHelpOpen(true)}
          >
            <HelpCircle size={18} /> Help & Guide
          </button>
        </div>
      </header>

      <main id="report-content">
        {/* Printable Header - Only visible in PDF */}
        <div className="print-only" style={{ display: 'none', marginBottom: '2rem' }}>
          <h1 style={{ color: 'black' }}>AI Value & Savings Modeller Report</h1>
          <p>Generated on {new Date().toLocaleDateString()}</p>
        </div>

        {activeTab === 'settings' ? (
          <GlobalSettings settings={globalSettings} setSettings={setGlobalSettings} />
        ) : activeTab === 'channel-shift' ? (
          <ChannelShiftModeller 
            useCases={useCases} 
            globalSettings={globalSettings} 
            onAddProjected={handleApplySingleShift}
          />
        ) : (
          <>
            <div className="dashboard-grid">
              <div className="no-print">
                <UseCaseManager useCases={useCases} setUseCases={setUseCases} />
                
                <div className="card mt-4" style={{ marginTop: '2rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
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
              </div>
              <div>
                <ResultsDashboard results={results} useCases={useCases} globalSettings={globalSettings} />
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
