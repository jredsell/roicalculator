import React from 'react'
import { Plus, Trash2 } from 'lucide-react'

const CATEGORIES = ['Triage', 'General Enquiries', 'Transactional', 'Data Collection']

export default function UseCaseManager({ useCases, setUseCases }) {
  const addUseCase = () => {
    const newId = Date.now().toString()
    setUseCases([...useCases, {
      id: newId,
      name: 'New Use Case',
      category: 'General Enquiries',
      unitsPerInteraction: 10,
      totalInteractions: 1000,
      percentToAutomate: 50,
      actualHandlingTime: 5,
      fullyLoadedAgentCost: 35000
    }])
  }

  const removeUseCase = (id) => {
    setUseCases(useCases.filter(uc => uc.id !== id))
  }

  const updateUseCase = (id, field, value) => {
    setUseCases(useCases.map(uc => {
      if (uc.id === id) {
        return { ...uc, [field]: value }
      }
      return uc
    }))
  }

  const parseNumber = (val) => {
    if (val === '') return '';
    const parsed = parseFloat(val);
    return Number.isNaN(parsed) ? '' : parsed;
  }

  const renderLabel = (text, value, title) => (
    <label className={`form-label ${value === '' ? 'text-danger' : ''}`} title={title}>
      {text} {value === '' && '*'}
    </label>
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

            <div className="grid-3">
              <div className="form-group">
                <label className="form-label">Category</label>
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
                {renderLabel("Total Monthly Interactions", uc.totalInteractions)}
                <input 
                  type="number" 
                  className="form-input no-print" 
                  value={uc.totalInteractions} 
                  onChange={(e) => updateUseCase(uc.id, 'totalInteractions', parseNumber(e.target.value))}
                />
              </div>

              <div className="form-group">
                {renderLabel("Automation Target (%)", uc.percentToAutomate)}
                <div className="input-wrapper">
                  <input 
                    type="number" 
                    className="form-input no-print" 
                    value={uc.percentToAutomate} 
                    onChange={(e) => updateUseCase(uc.id, 'percentToAutomate', parseNumber(e.target.value))}
                    max="100"
                    min="0"
                  />
                </div>
              </div>

              <div className="form-group">
                {renderLabel("Units per Interaction", uc.unitsPerInteraction)}
                <input 
                  type="number" 
                  className="form-input no-print" 
                  value={uc.unitsPerInteraction} 
                  onChange={(e) => updateUseCase(uc.id, 'unitsPerInteraction', parseNumber(e.target.value))}
                />
              </div>

              <div className="form-group">
                {renderLabel("Agent Handling Time (mins)", uc.actualHandlingTime)}
                <input 
                  type="number" 
                  className="form-input no-print" 
                  value={uc.actualHandlingTime} 
                  onChange={(e) => updateUseCase(uc.id, 'actualHandlingTime', parseNumber(e.target.value))}
                />
              </div>

              <div className="form-group">
                {renderLabel("Fully Loaded Cost (£/yr) ℹ️", uc.fullyLoadedAgentCost, "Includes salary, benefits, taxes, equipment, and facility costs.")}
                <div className="input-wrapper">
                  <span className="input-icon no-print">£</span>
                  <input 
                    type="number" 
                    className="form-input no-print" 
                    value={uc.fullyLoadedAgentCost} 
                    onChange={(e) => updateUseCase(uc.id, 'fullyLoadedAgentCost', parseNumber(e.target.value))}
                  />
                </div>
              </div>
            </div>
            
            <div className="mt-4 pt-4" style={{ borderTop: '1px dashed var(--border-color)' }}>
              <div className="grid-3">
                <div>
                  <div className="metric-label">Automated Volume</div>
                  <div className="metric-value" style={{ fontSize: '1.25rem' }}>
                    {Math.round(uc.totalInteractions * (uc.percentToAutomate / 100)).toLocaleString()} / mo
                  </div>
                </div>
                <div>
                  <div className="metric-label">Units Required</div>
                  <div className="metric-value primary" style={{ fontSize: '1.25rem' }}>
                    {Math.round((uc.totalInteractions * (uc.percentToAutomate / 100)) * uc.unitsPerInteraction).toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="metric-label">Human Time Saved</div>
                  <div className="metric-value success" style={{ fontSize: '1.25rem' }}>
                    {Math.round((uc.totalInteractions * (uc.percentToAutomate / 100) * uc.actualHandlingTime) / 60).toLocaleString()} hrs
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
