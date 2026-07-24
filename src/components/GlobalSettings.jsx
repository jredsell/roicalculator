import React from 'react'

export default function GlobalSettings({ settings, setSettings }) {
  const handleChange = (e) => {
    const { name, value } = e.target
    setSettings(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }))
  }

  return (
    <div className="card">
      <h2 className="card-title">Global System Settings</h2>
      <p className="text-secondary mb-4">Configure the base costs and variables for your contact centre and AI provider.</p>
      
      <div className="grid-3">
        <div className="form-group">
          <label className="form-label">Total Number of Human Agents</label>
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
          <label className="form-label">Agent License Cost (£/month)</label>
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
          <label className="form-label">AI Enablement Cost (£/agent/month)</label>
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
          <label className="form-label">Included AI Units (per agent/month)</label>
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
          <label className="form-label">Additional Bundle Cost (£)</label>
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
          <label className="form-label">Additional Bundle Size (Units)</label>
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
          <label className="form-label">FTE Weekly Working Hours</label>
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
