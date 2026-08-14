import React, { useState, useMemo, useEffect } from 'react';
import { calculateResults } from '../utils/calculatorEngine';
import { ArrowRightLeft, TrendingUp, TrendingDown, Clock, MessageSquare, Phone, ChevronDown, ChevronUp, PlusCircle } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { CATEGORY_CONFIG } from './UseCaseManager';

export default function ChannelShiftModeller({ useCases, globalSettings, onAddProjected }) {
  const [shiftPercentage, setShiftPercentage] = useState(40);
  const [digitalAssumptions, setDigitalAssumptions] = useState({});
  const [expandedCards, setExpandedCards] = useState({});

  // 1. Initialize digital assumptions for any Voice use case that doesn't have them yet
  useEffect(() => {
    const voiceUseCases = useCases.filter(uc => uc.channel === 'Voice');
    setDigitalAssumptions(prev => {
      const updated = { ...prev };
      let changed = false;
      voiceUseCases.forEach(uc => {
        if (!updated[uc.id]) {
          const config = CATEGORY_CONFIG[uc.category];
          updated[uc.id] = {
            unitsPerInteraction: config?.defaultUnits || 30,
            digitalMessagesPerInteraction: config?.defaultDigitalMessages || 8,
            resolutionRate: config?.defaultResolutionRate || 65,
            actualHandlingTime: config?.defaultHandlingTime || 4,
            handoverTimeSaved: config?.defaultHandoverTime || 1.5,
            transferRate: config?.defaultTransferRate || 0,
            transferTime: config?.defaultTransferTime || 0,
            engagementRate: uc.engagementRate || 100
          };
          changed = true;
        }
      });
      return changed ? updated : prev;
    });
  }, [useCases]);

  // 2. Calculate Current Results
  const currentResults = useMemo(() => {
    return calculateResults(useCases, globalSettings);
  }, [useCases, globalSettings]);

  // 3. Generate Projected Use Cases based on Shift Percentage
  const projectedUseCases = useMemo(() => {
    // Deep clone the use cases
    const cloned = JSON.parse(JSON.stringify(useCases));
    const projectedDigital = [];
    
    cloned.forEach(uc => {
      if (uc.channel === 'Voice') {
        const shiftVolume = Math.round((uc.totalInteractions || 0) * (shiftPercentage / 100));
        uc.totalInteractions -= shiftVolume; // Deduct volume from Voice
        
        // Create the auto-generated digital counterpart
        if (shiftVolume > 0 && digitalAssumptions[uc.id]) {
          const assumptions = digitalAssumptions[uc.id];
          projectedDigital.push({
            id: `projected-digital-${uc.id}`,
            name: `${uc.name} (Digital Shift)`,
            category: uc.category,
            channel: 'Digital',
            totalInteractions: shiftVolume,
            engagementRate: assumptions.engagementRate,
            unitsPerInteraction: assumptions.unitsPerInteraction,
            digitalMessagesPerInteraction: assumptions.digitalMessagesPerInteraction,
            resolutionRate: assumptions.resolutionRate,
            actualHandlingTime: assumptions.actualHandlingTime,
            handoverTimeSaved: assumptions.handoverTimeSaved,
            transferRate: assumptions.transferRate,
            transferTime: assumptions.transferTime,
            aiTalkTime: 0 // Not applicable for digital
          });
        }
      }
    });

    return [...cloned, ...projectedDigital];
  }, [useCases, shiftPercentage, digitalAssumptions]);

  // 4. Calculate Projected Results
  const projectedResults = useMemo(() => {
    return calculateResults(projectedUseCases, globalSettings);
  }, [projectedUseCases, globalSettings]);

  const formatCurrency = (val) => new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(val);
  const formatNumber = (val) => new Intl.NumberFormat('en-US').format(Math.round(val));

  const totalCurrentVoiceInteractions = useCases.filter(uc => uc.channel === 'Voice').reduce((sum, uc) => sum + (uc.totalInteractions || 0), 0);
  const totalCurrentDigitalInteractions = useCases.filter(uc => uc.channel === 'Digital').reduce((sum, uc) => sum + (uc.totalInteractions || 0), 0);
  
  const totalProjectedVoiceInteractions = projectedUseCases.filter(uc => uc.channel === 'Voice').reduce((sum, uc) => sum + (uc.totalInteractions || 0), 0);
  const totalProjectedDigitalInteractions = projectedUseCases.filter(uc => uc.channel === 'Digital').reduce((sum, uc) => sum + (uc.totalInteractions || 0), 0);

  const additionalSavings = projectedResults.netMonthlySavings - currentResults.netMonthlySavings;

  const updateAssumption = (voiceId, field, value) => {
    setDigitalAssumptions(prev => ({
      ...prev,
      [voiceId]: {
        ...prev[voiceId],
        [field]: value
      }
    }));
  };

  const parseNumber = (val) => {
    if (val === '') return '';
    const parsed = parseFloat(val);
    return Number.isNaN(parsed) ? '' : parsed;
  }

  const toggleCard = (id) => {
    setExpandedCards(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const renderLabel = (text, value, description) => (
    <div style={{ marginBottom: '0.25rem' }}>
      <label className={`form-label ${value === '' ? 'text-danger' : ''}`} style={{ marginBottom: '0.125rem' }}>
        {text} {value === '' && '*'}
      </label>
      {description && <div className="text-secondary" style={{ fontSize: '0.75rem', lineHeight: 1.2 }}>{description}</div>}
    </div>
  )

  const voiceUseCasesList = useCases.filter(uc => uc.channel === 'Voice');

  const currentChartData = [
    { name: 'Voice', value: totalCurrentVoiceInteractions },
    { name: 'Digital', value: totalCurrentDigitalInteractions },
  ];

  const projectedChartData = [
    { name: 'Voice', value: totalProjectedVoiceInteractions },
    { name: 'Digital', value: totalProjectedDigitalInteractions },
  ];

  const COLORS = {
    'Voice': 'var(--text-muted)',
    'Digital': 'var(--accent-primary)'
  };

  return (
    <div className="flex" style={{ flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header and Controls */}
      <div className="card" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
        <h2 className="mb-4 flex items-center gap-2">
          <div style={{ padding: '0.5rem', background: 'var(--primary-alpha)', borderRadius: 'var(--radius-md)' }}>
            <ArrowRightLeft size={24} color="var(--accent-primary)" />
          </div>
          Channel Shift Modeller
        </h2>
        <p className="text-secondary mb-4">
          Model the impact of successfully deflecting voice calls to digital channels. This automatically redirects volume from your Voice use cases into dynamically generated Digital use cases.
        </p>
        
        <div style={{ padding: '1.5rem', background: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <div className="flex" style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <label style={{ fontWeight: 600, fontSize: '1.1rem' }}>Target Voice-to-Digital Shift</label>
            <span className="metric-value primary" style={{ fontSize: '1.5rem' }}>{shiftPercentage}%</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={shiftPercentage} 
            onChange={(e) => setShiftPercentage(Number(e.target.value))}
            style={{ width: '100%', cursor: 'pointer' }}
          />
          <div className="flex text-secondary" style={{ justifyContent: 'space-between', fontSize: '0.9rem', marginTop: '0.5rem' }}>
            <span>0% (Current State)</span>
            <span>Industry Avg: ~40%</span>
            <span>100% (Full Digital)</span>
          </div>
        </div>
      </div>

      {/* Impact Summary */}
      <div className="card" style={{ background: additionalSavings > 0 ? 'linear-gradient(135deg, var(--bg-secondary), var(--success-alpha))' : 'var(--bg-secondary)', borderLeft: `4px solid ${additionalSavings > 0 ? 'var(--accent-success)' : 'var(--text-muted)'}` }}>
        <p style={{ fontSize: '1.2rem', margin: 0, lineHeight: '1.6', color: 'var(--text-primary)' }}>
          Shifting <strong>{shiftPercentage}%</strong> of voice interactions to digital channels generates <strong>{formatCurrency(additionalSavings)}</strong> in extra monthly value, bringing your total monthly value to <strong style={{ color: 'var(--accent-success)' }}>{formatCurrency(projectedResults.netMonthlySavings)}</strong>.
          {Math.abs(projectedResults.totalFteSaved - currentResults.totalFteSaved) > 0.1 && (
            <span> This also changes your human capacity savings by <strong>{(projectedResults.totalFteSaved - currentResults.totalFteSaved).toFixed(1)} FTEs</strong>.</span>
          )}
        </p>
        {additionalSavings > 0 && (
          <p style={{ fontSize: '0.9rem', margin: '1rem 0 0 0', color: 'var(--text-secondary)', padding: '0.85rem', background: 'var(--bg-primary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', lineHeight: '1.5' }}>
            <strong>Where does this extra value come from?</strong> Even if the human time saved (FTEs) remains similar across channels, digital interactions have a lower cost to serve than Voice. This difference generates additional savings.
          </p>
        )}
      </div>

      {/* Comparison Grid */}
      <div className="grid-2">
        {/* Current State */}
        <div className="card">
          <h3 className="mb-4" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>Current State</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="flex" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="flex items-center gap-2">
                <Phone size={18} className="text-secondary" />
                <span>Voice Interactions</span>
              </div>
              <strong>{formatNumber(totalCurrentVoiceInteractions)}</strong>
            </div>
            
            <div className="flex" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="flex items-center gap-2">
                <MessageSquare size={18} className="text-secondary" />
                <span>Digital Interactions</span>
              </div>
              <strong>{formatNumber(totalCurrentDigitalInteractions)}</strong>
            </div>

            <div className="flex" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="flex items-center gap-2">
                <Clock size={18} className="text-secondary" />
                <span>Speech Hours Required</span>
              </div>
              <strong>{formatNumber(currentResults.totalSpeechHours)} hrs</strong>
            </div>

            <div className="flex" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="flex items-center gap-2">
                <MessageSquare size={18} className="text-secondary" />
                <span>Digital Messages Required</span>
              </div>
              <strong>{formatNumber(currentResults.totalDigitalMessages)} msgs</strong>
            </div>

            <div className="flex" style={{ justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px dashed var(--border-color)' }}>
              <span style={{ fontWeight: 600 }}>Net Monthly Value</span>
              <strong style={{ fontSize: '1.2rem' }}>{formatCurrency(currentResults.netMonthlySavings)}</strong>
            </div>
          </div>
        </div>

        {/* Projected State */}
        <div className="card" style={{ border: '2px solid var(--accent-primary)' }}>
          <h3 className="mb-4" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', color: 'var(--accent-primary)' }}>Projected State ({shiftPercentage}% Shift)</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="flex" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="flex items-center gap-2">
                <Phone size={18} className="text-secondary" />
                <span>Voice Interactions</span>
              </div>
              <div className="flex items-center gap-2">
                <strong style={{ color: totalProjectedVoiceInteractions < totalCurrentVoiceInteractions ? 'var(--accent-success)' : 'inherit' }}>
                  {formatNumber(totalProjectedVoiceInteractions)}
                </strong>
                {totalProjectedVoiceInteractions < totalCurrentVoiceInteractions && <TrendingDown size={14} color="var(--accent-success)" />}
              </div>
            </div>
            
            <div className="flex" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="flex items-center gap-2">
                <MessageSquare size={18} className="text-secondary" />
                <span>Digital Interactions</span>
              </div>
              <div className="flex items-center gap-2">
                <strong style={{ color: totalProjectedDigitalInteractions > totalCurrentDigitalInteractions ? 'var(--accent-primary)' : 'inherit' }}>
                  {formatNumber(totalProjectedDigitalInteractions)}
                </strong>
                {totalProjectedDigitalInteractions > totalCurrentDigitalInteractions && <TrendingUp size={14} color="var(--accent-primary)" />}
              </div>
            </div>

            <div className="flex" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="flex items-center gap-2">
                <Clock size={18} className="text-secondary" />
                <span>Speech Hours Required</span>
              </div>
              <div className="flex items-center gap-2">
                <strong style={{ color: projectedResults.totalSpeechHours < currentResults.totalSpeechHours ? 'var(--accent-success)' : 'inherit' }}>
                  {formatNumber(projectedResults.totalSpeechHours)} hrs
                </strong>
                {projectedResults.totalSpeechHours < currentResults.totalSpeechHours && <TrendingDown size={14} color="var(--accent-success)" />}
              </div>
            </div>

            <div className="flex" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="flex items-center gap-2">
                <MessageSquare size={18} className="text-secondary" />
                <span>Digital Messages Required</span>
              </div>
              <div className="flex items-center gap-2">
                <strong style={{ color: projectedResults.totalDigitalMessages > currentResults.totalDigitalMessages ? 'var(--accent-primary)' : 'inherit' }}>
                  {formatNumber(projectedResults.totalDigitalMessages)} msgs
                </strong>
                {projectedResults.totalDigitalMessages > currentResults.totalDigitalMessages && <TrendingUp size={14} color="var(--accent-primary)" />}
              </div>
            </div>

            <div className="flex" style={{ justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px dashed var(--border-color)' }}>
              <span style={{ fontWeight: 600 }}>Projected Monthly Value</span>
              <div className="flex items-center gap-2">
                <strong style={{ fontSize: '1.2rem', color: additionalSavings > 0 ? 'var(--accent-success)' : 'inherit' }}>
                  {formatCurrency(projectedResults.netMonthlySavings)}
                </strong>
                {additionalSavings > 0 && <TrendingUp size={16} color="var(--accent-success)" />}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Chart */}
      <div className="card mt-4" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
        <h3 className="mb-4">Interaction Volume Shift</h3>
        <div className="grid-2">
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h4 className="text-secondary mb-2">Current State</h4>
            <div style={{ width: '100%', height: '250px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={currentChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {currentChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
                    formatter={(value) => formatNumber(value)}
                  />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h4 className="text-secondary mb-2">Projected State ({shiftPercentage}% Shift)</h4>
            <div style={{ width: '100%', height: '250px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={projectedChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {projectedChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
                    formatter={(value) => formatNumber(value)}
                  />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      </div>

      {/* Projected Digital Assumptions */}
      <div className="card mt-4" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
        <h3 className="mb-4">Projected Digital Equivalents</h3>
        <p className="text-secondary mb-4" style={{ fontSize: '0.9rem' }}>
          Adjust the assumed digital metrics below to see how they impact your projected ROI.
        </p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {voiceUseCasesList.map((uc) => {
            const assumptions = digitalAssumptions[uc.id];
            if (!assumptions) return null;
            const shiftVolume = Math.round((uc.totalInteractions || 0) * (shiftPercentage / 100));
            
            return (
              <div key={uc.id} style={{ background: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
                <button 
                  onClick={() => toggleCard(uc.id)}
                  style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-primary)', fontWeight: 600 }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span className="badge" style={{ background: 'var(--primary-alpha)', color: 'var(--accent-primary)' }}>{uc.category}</span>
                    <span>{uc.name} (Digital Equivalent)</span>
                  </div>
                  {expandedCards[uc.id] ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                
                {expandedCards[uc.id] && (
                  <div style={{ padding: '1.25rem', borderTop: '1px solid var(--border-color)' }}>
                    <div className="grid-3">
                      <div className="form-group">
                        {renderLabel("AI Engagement Rate (%)", assumptions.engagementRate)}
                        <div className="input-wrapper">
                          <input 
                            type="number" 
                            className="form-input" 
                            value={assumptions.engagementRate} 
                            onChange={(e) => {
                              let val = parseNumber(e.target.value);
                              if (val !== '') val = Math.max(0, Math.min(100, val));
                              updateAssumption(uc.id, 'engagementRate', val);
                            }}
                          />
                        </div>
                      </div>
                      
                      <div className="form-group">
                        {renderLabel("Units per Interaction", assumptions.unitsPerInteraction)}
                        <div className="input-wrapper">
                          <input 
                            type="number" 
                            className="form-input" 
                            value={assumptions.unitsPerInteraction} 
                            onChange={(e) => updateAssumption(uc.id, 'unitsPerInteraction', parseNumber(e.target.value))}
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        {renderLabel("Digital Messages per Interaction", assumptions.digitalMessagesPerInteraction)}
                        <div className="input-wrapper">
                          <input 
                            type="number" 
                            className="form-input" 
                            value={assumptions.digitalMessagesPerInteraction} 
                            onChange={(e) => updateAssumption(uc.id, 'digitalMessagesPerInteraction', parseNumber(e.target.value))}
                          />
                        </div>
                      </div>

                      {CATEGORY_CONFIG[uc.category]?.showResolutionRate && (
                        <div className="form-group">
                          {renderLabel("Full Resolution Rate (%)", assumptions.resolutionRate)}
                          <div className="input-wrapper">
                            <input 
                              type="number" 
                              className="form-input" 
                              value={assumptions.resolutionRate} 
                              onChange={(e) => {
                                let val = parseNumber(e.target.value);
                                if (val !== '') val = Math.max(0, Math.min(100, val));
                                updateAssumption(uc.id, 'resolutionRate', val);
                              }}
                            />
                          </div>
                        </div>
                      )}

                      {CATEGORY_CONFIG[uc.category]?.showHandlingTime && (
                        <div className="form-group">
                          {renderLabel("Full Agent Handling Time (mins)", assumptions.actualHandlingTime)}
                          <div className="input-wrapper">
                            <input 
                              type="number" 
                              className="form-input" 
                              value={assumptions.actualHandlingTime} 
                              onChange={(e) => updateAssumption(uc.id, 'actualHandlingTime', parseNumber(e.target.value))}
                              step="any"
                            />
                          </div>
                        </div>
                      )}
                      
                      {CATEGORY_CONFIG[uc.category]?.showHandoverTime !== false && (
                        <div className="form-group">
                          {renderLabel("Time Saved on Handover (mins)", assumptions.handoverTimeSaved)}
                          <div className="input-wrapper">
                            <input 
                              type="number" 
                              className="form-input" 
                              value={assumptions.handoverTimeSaved} 
                              onChange={(e) => updateAssumption(uc.id, 'handoverTimeSaved', parseNumber(e.target.value))}
                              step="any"
                            />
                          </div>
                        </div>
                      )}

                      {CATEGORY_CONFIG[uc.category]?.showTransferRate && (
                        <div className="form-group">
                          {renderLabel("% of Transferred Calls", assumptions.transferRate)}
                          <div className="input-wrapper">
                            <input 
                              type="number" 
                              className="form-input" 
                              value={assumptions.transferRate} 
                              onChange={(e) => {
                                let val = parseNumber(e.target.value);
                                if (val !== '') val = Math.max(0, Math.min(100, val));
                                updateAssumption(uc.id, 'transferRate', val);
                              }}
                            />
                          </div>
                        </div>
                      )}

                      {CATEGORY_CONFIG[uc.category]?.showTransferTime && (
                        <div className="form-group">
                          {renderLabel("Time to Transfer (mins)", assumptions.transferTime)}
                          <div className="input-wrapper">
                            <input 
                              type="number" 
                              className="form-input" 
                              value={assumptions.transferTime} 
                              onChange={(e) => updateAssumption(uc.id, 'transferTime', parseNumber(e.target.value))}
                              step="any"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {shiftVolume > 0 && (
                  <div style={{ padding: '0.75rem 1.25rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end', background: 'var(--bg-secondary)' }}>
                    <button 
                      className="btn btn-primary btn-sm"
                      onClick={() => {
                        if (onAddProjected) {
                          const digitalEquivalent = projectedUseCases.find(p => p.id === 'projected-digital-' + uc.id);
                          onAddProjected(uc.id, shiftVolume, digitalEquivalent);
                        }
                      }}
                      title="Apply this channel shift to your main calculator"
                      style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                    >
                      <PlusCircle size={16} /> Apply Shift
                    </button>
                  </div>
                )}
              </div>
            );
          })}
          {voiceUseCasesList.length === 0 && (
            <div className="text-center p-4 text-muted">
              No voice use cases defined to shift.
            </div>
          )}
        </div>
        
      </div>

    </div>
  );
}
