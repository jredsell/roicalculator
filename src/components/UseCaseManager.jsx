import React from 'react'
import { Plus, Trash2 } from 'lucide-react'

const CATEGORIES = ['Triage', 'General Enquiries', 'Transactional', 'Data Collection']

const CATEGORY_CONFIG = {
  'Triage': {
    description: "Calculates the time saved by having the AI correctly route customers, eliminating the time human agents spend answering and then transferring calls that went to the wrong area.",
    showResolutionRate: false,
    showHandlingTime: false,
    showHandoverTime: false,
    showTransferRate: true,
    showTransferTime: true,
  },
  'Data Collection': {
    description: "Calculates time saved when the AI collects required forms, details, or verifications before passing the conversation to an agent.",
    showResolutionRate: false,
    showHandlingTime: false,
    showHandoverTime: true,
  },
  'General Enquiries': {
    description: "Calculates the value of the AI fully resolving common questions without human intervention, plus time saved on interactions it attempts but has to hand over.",
    showResolutionRate: true,
    showHandlingTime: true,
    showHandoverTime: true,
  },
  'Transactional': {
    description: "Calculates the ROI of the AI automating end-to-end processes (like booking appointments, password resets, or taking payments).",
    showResolutionRate: true,
    showHandlingTime: true,
    showHandoverTime: true,
  }
}

export default function UseCaseManager({ useCases, setUseCases }) {
  const addUseCase = () => {
    const newId = Date.now().toString()
    setUseCases([{
      id: newId,
      name: 'New Use Case',
      category: 'General Enquiries',
      unitsPerInteraction: 0,
      totalInteractions: 1000,
      engagementRate: 100,
      resolutionRate: 50,
      actualHandlingTime: 5,
      handoverTimeSaved: 1.5,
      transferRate: 20,
      transferTime: 2
    }, ...useCases])
  }

  const removeUseCase = (id) => {
    setUseCases(useCases.filter(uc => uc.id !== id))
  }

  const updateUseCase = (id, field, value) => {
    setUseCases(useCases.map(uc => {
      if (uc.id === id) {
        const updatedUc = { ...uc, [field]: value }
        if (field === 'category') {
          const config = CATEGORY_CONFIG[value]
          if (config && !config.showResolutionRate) {
            updatedUc.resolutionRate = 0
          }
        }
        return updatedUc
      }
      return uc
    }))
  }

  const parseNumber = (val) => {
    if (val === '') return '';
    const parsed = parseFloat(val);
    return Number.isNaN(parsed) ? '' : parsed;
  }

  const renderLabel = (text, value, description) => (
    <div style={{ marginBottom: '0.25rem' }}>
      <label className={`form-label ${value === '' ? 'text-danger' : ''}`} style={{ marginBottom: '0.125rem' }}>
        {text} {value === '' && '*'}
      </label>
      {description && <div className="text-secondary" style={{ fontSize: '0.75rem', lineHeight: 1.2 }}>{description}</div>}
    </div>
  )

  return (
    <div className="card">
      <div className="use-case-header">
        <div>
          <h2 className="card-title" style={{ marginBottom: 0 }}>Use Cases</h2>
          <p className="text-secondary" style={{ fontSize: '0.875rem' }}>Define scenarios where AI will automate interactions.</p>
        </div>
        <button className="btn btn-primary no-print" onClick={addUseCase}>
          <Plus size={16} /> Add Use Case
        </button>
      </div>

      <div className="use-case-list">
        {useCases.map((uc, index) => (
          <div key={uc.id} className="use-case-item">
            <div className="use-case-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <span className="badge">Use Case {index + 1}</span>
                <input 
                  type="text" 
                  className={`form-input no-print ${uc.name === '' ? 'text-danger' : ''}`} 
                  value={uc.name} 
                  onChange={(e) => updateUseCase(uc.id, 'name', e.target.value)}
                  style={{ width: '250px', padding: '0.375rem 0.75rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', fontWeight: 600, fontSize: '1.1rem' }}
                />
              </div>
              <button className="btn btn-icon btn-danger no-print" onClick={() => removeUseCase(uc.id)}>
                <Trash2 size={16} />
              </button>
            </div>

            <div style={{ marginBottom: '1rem', padding: '0.75rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--accent-secondary)' }}>
              <strong>{uc.category}</strong>: {CATEGORY_CONFIG[uc.category]?.description || ''}
            </div>

            <div className="grid-3">
              <div className="form-group">
                <label className="form-label" style={{ marginBottom: '0.125rem' }}>Category</label>
                <div className="text-secondary" style={{ fontSize: '0.75rem', lineHeight: 1.2, marginBottom: '0.25rem' }}>The type of interaction to automate.</div>
                <select 
                  className="form-select no-print" 
                  value={uc.category} 
                  onChange={(e) => updateUseCase(uc.id, 'category', e.target.value)}
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                {renderLabel("Total Monthly Interactions", uc.totalInteractions, "The total volume per month. Drives the baseline scale.")}
                <input 
                  type="number" 
                  className="form-input no-print" 
                  value={uc.totalInteractions} 
                  onChange={(e) => updateUseCase(uc.id, 'totalInteractions', parseNumber(e.target.value))}
                />
              </div>

              <div className="form-group">
                {renderLabel("AI Engagement Rate (%)", uc.engagementRate, "Percentage of interactions the AI intercepts. Affects AI unit consumption.")}
                <div className="input-wrapper">
                  <input 
                    type="number" 
                    className="form-input no-print" 
                    value={uc.engagementRate} 
                    onChange={(e) => {
                      let val = parseNumber(e.target.value);
                      if (val !== '') val = Math.max(0, Math.min(100, val));
                      updateUseCase(uc.id, 'engagementRate', val);
                    }}
                    max="100" min="0"
                  />
                </div>
              </div>

              <div className="form-group">
                {renderLabel("Units per Interaction", uc.unitsPerInteraction, "Units consumed each time the AI engages. Drives AI Software Cost.")}
                <input 
                  type="number" 
                  className="form-input no-print" 
                  value={uc.unitsPerInteraction} 
                  onChange={(e) => updateUseCase(uc.id, 'unitsPerInteraction', parseNumber(e.target.value))}
                />
              </div>

              {CATEGORY_CONFIG[uc.category]?.showResolutionRate && (
                <div className="form-group">
                  {renderLabel("Full Resolution Rate (%)", uc.resolutionRate, "The % the AI solves completely. Calculates primary time saved.")}
                  <div className="input-wrapper">
                    <input 
                      type="number" 
                      className="form-input no-print" 
                      value={uc.resolutionRate} 
                      onChange={(e) => {
                        let val = parseNumber(e.target.value);
                        if (val !== '') val = Math.max(0, Math.min(100, val));
                        updateUseCase(uc.id, 'resolutionRate', val);
                      }}
                      max="100" min="0"
                    />
                  </div>
                </div>
              )}

              {CATEGORY_CONFIG[uc.category]?.showHandlingTime && (
                <div className="form-group">
                  {renderLabel("Full Agent Handling Time (mins)", uc.actualHandlingTime, "Normal human time to resolve end-to-end. Used for fully resolved savings.")}
                  <input 
                    type="number" 
                    className="form-input no-print" 
                    value={uc.actualHandlingTime} 
                    onChange={(e) => updateUseCase(uc.id, 'actualHandlingTime', parseNumber(e.target.value))}
                    step="any"
                  />
                </div>
              )}

              {CATEGORY_CONFIG[uc.category]?.showTransferRate && (
                <div className="form-group">
                  {renderLabel("% of Transferred Calls", uc.transferRate, "The percentage of calls currently going to the wrong area that the AI will now route correctly.")}
                  <div className="input-wrapper">
                    <input 
                      type="number" 
                      className="form-input no-print" 
                      value={uc.transferRate} 
                      onChange={(e) => {
                        let val = parseNumber(e.target.value);
                        if (val !== '') val = Math.max(0, Math.min(100, val));
                        updateUseCase(uc.id, 'transferRate', val);
                      }}
                      max="100" min="0"
                    />
                  </div>
                </div>
              )}

              {CATEGORY_CONFIG[uc.category]?.showTransferTime && (
                <div className="form-group">
                  {renderLabel("Time to Transfer (mins)", uc.transferTime, "The average time a human agent spends answering and transferring a misrouted call.")}
                  <input 
                    type="number" 
                    className="form-input no-print" 
                    value={uc.transferTime} 
                    onChange={(e) => updateUseCase(uc.id, 'transferTime', parseNumber(e.target.value))}
                    step="any"
                  />
                </div>
              )}

              {CATEGORY_CONFIG[uc.category]?.showHandoverTime !== false && (
                <div className="form-group">
                  {renderLabel("Time Saved on Handover (mins)", uc.handoverTimeSaved, "Time saved on interactions that were engaged but NOT fully resolved.")}
                  <input 
                    type="number" 
                    className="form-input no-print" 
                    value={uc.handoverTimeSaved} 
                    onChange={(e) => updateUseCase(uc.id, 'handoverTimeSaved', parseNumber(e.target.value))}
                    step="any"
                  />
                </div>
              )}
            </div>
            
            <div className="mt-4 pt-4" style={{ borderTop: '1px dashed var(--border-color)' }}>
              <div className="grid-3">
                <div>
                  <div className="metric-label">Total Engaged / Mo</div>
                  <div className="metric-value" style={{ fontSize: '1.25rem' }}>
                    {Math.round(uc.totalInteractions * (uc.engagementRate / 100)).toLocaleString()}
                  </div>
                  <div className="metric-subtext">
                    {uc.category === 'Triage' ? (
                      <>{Math.round((uc.totalInteractions * (uc.engagementRate / 100)) * ((uc.transferRate || 0) / 100)).toLocaleString()} Transfers Saved | {Math.round((uc.totalInteractions * (uc.engagementRate / 100)) * (1 - ((uc.transferRate || 0) / 100))).toLocaleString()} Routed Normally</>
                    ) : (
                      <>{Math.round((uc.totalInteractions * (uc.engagementRate / 100)) * ((uc.resolutionRate || 0) / 100)).toLocaleString()} Resolved | {Math.round((uc.totalInteractions * (uc.engagementRate / 100)) * (1 - ((uc.resolutionRate || 0) / 100))).toLocaleString()} Handover</>
                    )}
                  </div>
                </div>
                <div>
                  <div className="metric-label">Total Units Required</div>
                  <div className="metric-value primary" style={{ fontSize: '1.25rem' }}>
                    {Math.round((uc.totalInteractions * (uc.engagementRate / 100)) * uc.unitsPerInteraction).toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="metric-label">Total Human Time Saved</div>
                  <div className="metric-value success" style={{ fontSize: '1.25rem' }}>
                    {(() => {
                      const engaged = uc.totalInteractions * (uc.engagementRate / 100);
                      if (uc.category === 'Triage') {
                        const transfers = engaged * ((uc.transferRate || 0) / 100);
                        return Math.round((transfers * (uc.transferTime || 0)) / 60).toLocaleString();
                      } else {
                        const resolved = engaged * ((uc.resolutionRate || 0) / 100);
                        const handover = engaged - resolved;
                        return Math.round(((resolved * (uc.actualHandlingTime || 0)) + (handover * (uc.handoverTimeSaved || 0))) / 60).toLocaleString();
                      }
                    })()} hrs
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        {useCases.length === 0 && (
          <div className="text-center p-8 text-muted">
            No use cases defined. Add a use case to begin calculating ROI.
          </div>
        )}
      </div>
    </div>
  )
}
