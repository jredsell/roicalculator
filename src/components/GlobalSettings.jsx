import React from 'react'

export default function GlobalSettings({ settings, setSettings }) {
  const handleChange = (e) => {
    const { name, value } = e.target
    let parsedValue = value === '' ? '' : parseFloat(value)
    if (Number.isNaN(parsedValue)) parsedValue = ''
    
    setSettings(prev => ({
      ...prev,
      [name]: parsedValue
    }))
  }

  const renderLabel = (text, name) => (
    <label className={`form-label ${settings[name] === '' ? 'text-danger' : ''}`}>
      {text} {settings[name] === '' && '*'}
    </label>
  )

  return (
    <div className="card">
      <h2 className="card-title">Global System Settings</h2>
      <p className="text-secondary mb-4">Configure the base costs and variables for your contact centre and AI provider.</p>
      
      <div className="grid-3">
        <div className="form-group">
          {renderLabel("Total Number of Human Agents", "numberOfAgents")}
          <div className="input-wrapper">
            <input 
              type="number" 
              className="form-input" 
              name="numberOfAgents"
              value={settings.numberOfAgents}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group">
          {renderLabel("Agent License Cost (£/month)", "agentLicenseCost")}
          <div className="input-wrapper">
            <span className="input-icon">£</span>
            <input 
              type="number" 
              className="form-input" 
              name="agentLicenseCost"
              value={settings.agentLicenseCost}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group">
          {renderLabel("AI Enablement Cost (£/agent/month)", "aiEnablementCost")}
          <div className="input-wrapper">
            <span className="input-icon">£</span>
            <input 
              type="number" 
              className="form-input" 
              name="aiEnablementCost"
              value={settings.aiEnablementCost}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group">
          {renderLabel("Included AI Units (per agent/month)", "includedAiUnits")}
          <div className="input-wrapper">
            <input 
              type="number" 
              className="form-input" 
              name="includedAiUnits"
              value={settings.includedAiUnits}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group">
          {renderLabel("Additional Bundle Cost (£)", "additionalBundleCost")}
          <div className="input-wrapper">
            <span className="input-icon">£</span>
            <input 
              type="number" 
              className="form-input" 
              name="additionalBundleCost"
              value={settings.additionalBundleCost}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group">
          {renderLabel("Additional Bundle Size (Units)", "additionalBundleSize")}
          <div className="input-wrapper">
            <input 
              type="number" 
              className="form-input" 
              name="additionalBundleSize"
              value={settings.additionalBundleSize}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group">
          {renderLabel("FTE Weekly Working Hours", "fteWeeklyHours")}
          <div className="input-wrapper">
            <input 
              type="number" 
              className="form-input" 
              name="fteWeeklyHours"
              value={settings.fteWeeklyHours}
              onChange={handleChange}
            />
          </div>
          <p className="metric-subtext mt-4">Used to calculate FTE savings from time saved.</p>
        </div>
      </div>
    </div>
  )
}
