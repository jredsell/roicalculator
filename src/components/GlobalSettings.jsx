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

  const renderLabel = (text, name, description) => (
    <div style={{ marginBottom: '0.25rem' }}>
      <label className={`form-label ${settings[name] === '' ? 'text-danger' : ''}`} style={{ marginBottom: '0.125rem' }}>
        {text} {settings[name] === '' && '*'}
      </label>
      {description && <div className="text-secondary" style={{ fontSize: '0.75rem', lineHeight: 1.2 }}>{description}</div>}
    </div>
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
          {renderLabel("Agent Licence Cost (£/month)", "agentLicenseCost")}
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
          {renderLabel("Speech Cost per 100 Hours (£)", "speechCostPer100Hours")}
          <div className="input-wrapper">
            <span className="input-icon">£</span>
            <input 
              type="number" 
              className="form-input" 
              name="speechCostPer100Hours"
              value={settings.speechCostPer100Hours}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group">
          {renderLabel("Bundled Digital Messages (per agent/month)", "includedDigitalMessages")}
          <div className="input-wrapper">
            <input 
              type="number" 
              className="form-input" 
              name="includedDigitalMessages"
              value={settings.includedDigitalMessages}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group">
          {renderLabel("Digital Msg Bundle Cost (£)", "additionalDigitalBundleCost")}
          <div className="input-wrapper">
            <span className="input-icon">£</span>
            <input 
              type="number" 
              className="form-input" 
              name="additionalDigitalBundleCost"
              value={settings.additionalDigitalBundleCost}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group">
          {renderLabel("Digital Msg Bundle Size", "additionalDigitalBundleSize")}
          <div className="input-wrapper">
            <input 
              type="number" 
              className="form-input" 
              name="additionalDigitalBundleSize"
              value={settings.additionalDigitalBundleSize}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group">
          {renderLabel("FTE Weekly Working Hours", "fteWeeklyHours", "Used to calculate FTE savings from time saved.")}
          <div className="input-wrapper">
            <input 
              type="number" 
              className="form-input" 
              name="fteWeeklyHours"
              value={settings.fteWeeklyHours}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group">
          {renderLabel("FTE Yearly Cost (£)", "fullyLoadedAgentCost", "Average UK fully-loaded cost including base salary, Employer National Insurance (NI), workplace pension, and operational overheads.")}
          <div className="input-wrapper">
            <span className="input-icon">£</span>
            <input 
              type="number" 
              className="form-input" 
              name="fullyLoadedAgentCost"
              value={settings.fullyLoadedAgentCost}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
