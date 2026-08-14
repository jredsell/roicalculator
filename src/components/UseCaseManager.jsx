import React, { useState } from 'react'
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react'

const CATEGORIES = ['Triage', 'General Enquiries', 'Transactional', 'Data Collection']

export const CATEGORY_CONFIG = {
  'Triage': {
    description: "Calculates time saved by routing customers correctly, eliminating manual transfer time. Includes units to understand the user's intent and route them to the appropriate area.",
    defaultUnits: 15,
    defaultDigitalMessages: 4,
    defaultAiTalkTime: 1,
    defaultResolutionRate: 0,
    defaultHandlingTime: 3,
    defaultHandoverTime: 1,
    defaultTransferRate: 15,
    defaultTransferTime: 3,
    showResolutionRate: false,
    showHandlingTime: false,
    showHandoverTime: false,
    showTransferRate: true,
    showTransferTime: true,
  },
  'General Enquiries': {
    description: "Calculates value from resolving common questions and saving time on handovers. Includes units to triage the enquiry, provide an answer, and pass to an agent if required.",
    defaultUnits: 30,
    defaultDigitalMessages: 8,
    defaultAiTalkTime: 2,
    defaultResolutionRate: 65,
    defaultHandlingTime: 4,
    defaultHandoverTime: 1.5,
    defaultTransferRate: 0,
    defaultTransferTime: 0,
    showResolutionRate: true,
    showHandlingTime: true,
    showHandoverTime: true,
  },
  'Transactional': {
    description: "Calculates ROI for automating the most common end-to-end tasks (e.g., booking appointments, taking payments). The cost of units does not include triage.",
    defaultUnits: 40,
    defaultDigitalMessages: 12,
    defaultAiTalkTime: 3,
    defaultResolutionRate: 60,
    defaultHandlingTime: 6,
    defaultHandoverTime: 3,
    defaultTransferRate: 0,
    defaultTransferTime: 0,
    showResolutionRate: true,
    showHandlingTime: true,
    showHandoverTime: true,
  },
  'Data Collection': {
    description: "Calculates time saved by gathering information before agent handover. Includes units to collect and clean 5-10 questions. The cost of triage is not included.",
    defaultUnits: 20,
    defaultDigitalMessages: 6,
    defaultAiTalkTime: 2,
    defaultResolutionRate: 0,
    defaultHandlingTime: 5,
    defaultHandoverTime: 2.5,
    defaultTransferRate: 0,
    defaultTransferTime: 0,
    showResolutionRate: false,
    showHandlingTime: false,
    showHandoverTime: true,
  }
}

export default function UseCaseManager({ useCases, setUseCases }) {
  const [expandedCards, setExpandedCards] = useState({})

  const toggleCard = (id) => {
    setExpandedCards(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const addUseCase = () => {
    const newId = Date.now().toString()
    setUseCases([{
      id: newId,
      name: 'New Custom Use Case',
      category: 'General Enquiries',
      channel: 'Voice',
      unitsPerInteraction: 30,
      digitalMessagesPerInteraction: 8,
      digitalConcurrency: 1,
      aiTalkTime: 2,
      totalInteractions: 1000,
      engagementRate: 100,
      resolutionRate: 65,
      actualHandlingTime: 4,
      handoverTimeSaved: 1.5,
      transferRate: 15,
      transferTime: 3
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
          if (config) {
            updatedUc.unitsPerInteraction = config.defaultUnits
            updatedUc.digitalMessagesPerInteraction = config.defaultDigitalMessages
            updatedUc.aiTalkTime = config.defaultAiTalkTime
            updatedUc.resolutionRate = config.defaultResolutionRate
            updatedUc.actualHandlingTime = config.defaultHandlingTime
            updatedUc.handoverTimeSaved = config.defaultHandoverTime
            updatedUc.transferRate = config.defaultTransferRate
            updatedUc.transferTime = config.defaultTransferTime
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
                <label className="form-label" style={{ marginBottom: '0.125rem' }}>Channel</label>
                <div className="text-secondary" style={{ fontSize: '0.75rem', lineHeight: 1.2, marginBottom: '0.25rem' }}>Voice or Digital.</div>
                <select 
                  className="form-select no-print" 
                  value={uc.channel || 'Voice'} 
                  onChange={(e) => updateUseCase(uc.id, 'channel', e.target.value)}
                >
                  <option value="Voice">Voice</option>
                  <option value="Digital">Digital</option>
                </select>
              </div>

              <div className="form-group">
                {renderLabel("Total Monthly Interactions", uc.totalInteractions, "The total volume per month. Drives the baseline scale.")}
                <div className="input-wrapper">
                  <input 
                    type="number" 
                    className="form-input no-print" 
                    value={uc.totalInteractions} 
                    onChange={(e) => updateUseCase(uc.id, 'totalInteractions', parseNumber(e.target.value))}
                  />
                </div>
              </div>
            </div>

            <div style={{ marginTop: '1rem' }} className="no-print">
              <button 
                className="btn btn-secondary btn-sm" 
                onClick={() => toggleCard(uc.id)}
                style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <span>Advanced Assumptions & Configuration</span>
                {expandedCards[uc.id] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
            </div>

            {expandedCards[uc.id] && (
              <div className="grid-3 no-print" style={{ marginTop: '1rem', padding: '1.25rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <div className="form-group">
                  {renderLabel("AI Engagement Rate (%)", uc.engagementRate, "Percentage of interactions the AI intercepts. Affects AI unit consumption.")}
                  <div className="input-wrapper">
                    <input 
                      type="number" 
                      className="form-input" 
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
                  <div className="input-wrapper">
                    <input 
                      type="number" 
                      className="form-input" 
                      value={uc.unitsPerInteraction} 
                      onChange={(e) => updateUseCase(uc.id, 'unitsPerInteraction', parseNumber(e.target.value))}
                    />
                  </div>
                </div>

              {uc.channel === 'Digital' && (
                <div className="form-group">
                  {renderLabel("Digital Messages per Interaction", uc.digitalMessagesPerInteraction, "Average number of messages sent in a digital interaction.")}
                  <div className="input-wrapper">
                    <input 
                      type="number" 
                      className="form-input no-print" 
                      value={uc.digitalMessagesPerInteraction} 
                      onChange={(e) => updateUseCase(uc.id, 'digitalMessagesPerInteraction', parseNumber(e.target.value))}
                    />
                  </div>
                </div>
              )}

              {uc.channel === 'Voice' && (
                <div className="form-group">
                  {renderLabel("AI Talk Time (mins)", uc.aiTalkTime, "Average time the AI spends talking. Used for speech costs.")}
                  <div className="input-wrapper">
                    <input 
                      type="number" 
                      className="form-input no-print" 
                      value={uc.aiTalkTime} 
                      onChange={(e) => updateUseCase(uc.id, 'aiTalkTime', parseNumber(e.target.value))}
                    />
                  </div>
                </div>
              )}

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
                  <div className="input-wrapper">
                    <input 
                      type="number" 
                      className="form-input no-print" 
                      value={uc.actualHandlingTime} 
                      onChange={(e) => updateUseCase(uc.id, 'actualHandlingTime', parseNumber(e.target.value))}
                      step="any"
                    />
                  </div>
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
                  <div className="input-wrapper">
                    <input 
                      type="number" 
                      className="form-input no-print" 
                      value={uc.transferTime} 
                      onChange={(e) => updateUseCase(uc.id, 'transferTime', parseNumber(e.target.value))}
                      step="any"
                    />
                  </div>
                </div>
              )}

              {CATEGORY_CONFIG[uc.category]?.showHandoverTime !== false && (
                <div className="form-group">
                  {renderLabel("Time Saved on Handover (mins)", uc.handoverTimeSaved, "Time saved on interactions that were engaged but NOT fully resolved.")}
                  <div className="input-wrapper">
                    <input 
                      type="number" 
                      className="form-input no-print" 
                      value={uc.handoverTimeSaved} 
                      onChange={(e) => updateUseCase(uc.id, 'handoverTimeSaved', parseNumber(e.target.value))}
                      step="any"
                    />
                  </div>
                </div>
              )}
              </div>
            )}
            
            <div className="mt-4 pt-4" style={{ borderTop: '1px dashed var(--border-color)' }}>
              <div className="text-secondary" style={{ fontSize: '0.85rem', marginBottom: '1rem', fontStyle: 'italic' }}>
                {uc.category === 'Triage' ? (
                  `*Based on ${uc.transferRate || 0}% of interactions currently being misrouted, taking an agent ${uc.transferTime || 0} minutes to transfer.`
                ) : uc.category === 'Data Collection' ? (
                  `*Based on saving an agent ${uc.handoverTimeSaved || 0} minutes of manual data entry before handing over.`
                ) : (
                  `*Based on fully resolving ${uc.resolutionRate || 0}% of interactions (saving ${uc.actualHandlingTime || 0} mins each) and saving ${uc.handoverTimeSaved || 0} mins on the remaining handovers.`
                )}
                {uc.channel === 'Digital' && (uc.digitalConcurrency > 1) && ` Reduced by a digital concurrency factor of ${uc.digitalConcurrency}.`}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
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
                  {uc.channel === 'Digital' ? (
                    <>
                      <div className="metric-label">Digital Messages</div>
                      <div className="metric-value" style={{ fontSize: '1.25rem', color: 'var(--accent-secondary)' }}>
                        {Math.round((uc.totalInteractions * (uc.engagementRate / 100)) * (uc.digitalMessagesPerInteraction || 0)).toLocaleString()}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="metric-label">Voice Hours</div>
                      <div className="metric-value" style={{ fontSize: '1.25rem', color: 'var(--accent-secondary)' }}>
                        {((uc.totalInteractions * (uc.engagementRate / 100)) * (uc.aiTalkTime || 0) / 60).toFixed(1)}
                      </div>
                    </>
                  )}
                </div>
                <div>
                  <div className="metric-label">Total Human Time Saved</div>
                  <div className="metric-value success" style={{ fontSize: '1.25rem' }}>
                    {(() => {
                      const engaged = uc.totalInteractions * (uc.engagementRate / 100);
                      const concurrency = (uc.channel === 'Digital' && uc.digitalConcurrency > 0) ? uc.digitalConcurrency : 1;
                      if (uc.category === 'Triage') {
                        const transfers = engaged * ((uc.transferRate || 0) / 100);
                        return Math.round(((transfers * (uc.transferTime || 0)) / concurrency) / 60).toLocaleString();
                      } else {
                        const resolved = engaged * ((uc.resolutionRate || 0) / 100);
                        const handover = engaged - resolved;
                        return Math.round((((resolved * (uc.actualHandlingTime || 0)) + (handover * (uc.handoverTimeSaved || 0))) / concurrency) / 60).toLocaleString();
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
