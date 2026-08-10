import React, { useState, useMemo } from 'react';
import { calculateResults } from '../utils/calculatorEngine';
import { ArrowRightLeft, TrendingUp, TrendingDown, Clock, MessageSquare, Phone } from 'lucide-react';

export default function ChannelShiftModeller({ useCases, globalSettings }) {
  const [shiftPercentage, setShiftPercentage] = useState(40);

  // 1. Calculate Current Results
  const currentResults = useMemo(() => {
    return calculateResults(useCases, globalSettings);
  }, [useCases, globalSettings]);

  // 2. Generate Projected Use Cases based on Shift Percentage
  const projectedUseCases = useMemo(() => {
    // Deep clone the use cases
    const cloned = JSON.parse(JSON.stringify(useCases));
    
    // Group by category to find Voice/Digital pairs
    const byCategory = {};
    cloned.forEach(uc => {
      if (!byCategory[uc.category]) byCategory[uc.category] = { Voice: null, Digital: null };
      if (uc.channel === 'Voice') byCategory[uc.category].Voice = uc;
      if (uc.channel === 'Digital') byCategory[uc.category].Digital = uc;
    });

    // Apply the shift
    Object.values(byCategory).forEach(pair => {
      if (pair.Voice && pair.Digital) {
        const shiftVolume = Math.round((pair.Voice.totalInteractions || 0) * (shiftPercentage / 100));
        pair.Voice.totalInteractions -= shiftVolume;
        pair.Digital.totalInteractions += shiftVolume;
      }
    });

    return cloned;
  }, [useCases, shiftPercentage]);

  // 3. Calculate Projected Results
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
          Model the impact of successfully deflecting voice calls to digital channels. This automatically pairs your Voice and Digital use cases by Category (e.g., Triage) and shifts the interaction volume accordingly.
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
          Shifting <strong>{shiftPercentage}%</strong> of voice interactions to digital channels would free up an additional <strong>{(projectedResults.totalFteSaved - currentResults.totalFteSaved).toFixed(1)} FTEs</strong>. 
          This generates <strong>{formatCurrency(additionalSavings)}</strong> in extra monthly value, bringing your total monthly value to <strong style={{ color: 'var(--accent-success)' }}>{formatCurrency(projectedResults.netMonthlySavings)}</strong>.
        </p>
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

    </div>
  );
}
