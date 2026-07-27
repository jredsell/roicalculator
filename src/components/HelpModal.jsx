import React, { useState } from 'react';
import { X, Calculator, TrendingUp, Settings as SettingsIcon, Layers } from 'lucide-react';

export default function HelpModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('settings');

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '850px', width: '90%' }}>
        <div className="modal-header">
          <h2 style={{ margin: 0, color: 'var(--text-primary)' }}>ROI Calculator Guide</h2>
          <button className="btn btn-icon" onClick={onClose} style={{ background: 'transparent', color: 'var(--text-secondary)' }}>
            <X size={24} />
          </button>
        </div>
        
        <div className="modal-tabs" style={{ display: 'flex', overflowX: 'auto', gap: '0.5rem', paddingBottom: '0.5rem' }}>
          <button 
            className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
            style={{ whiteSpace: 'nowrap' }}
          >
            <SettingsIcon size={18} /> Global Settings
          </button>
          <button 
            className={`tab-btn ${activeTab === 'usecases' ? 'active' : ''}`}
            onClick={() => setActiveTab('usecases')}
            style={{ whiteSpace: 'nowrap' }}
          >
            <Layers size={18} /> Use Cases & Fields
          </button>
          <button 
            className={`tab-btn ${activeTab === 'math' ? 'active' : ''}`}
            onClick={() => setActiveTab('math')}
            style={{ whiteSpace: 'nowrap' }}
          >
            <Calculator size={18} /> How the Math Works
          </button>
          <button 
            className={`tab-btn ${activeTab === 'results' ? 'active' : ''}`}
            onClick={() => setActiveTab('results')}
            style={{ whiteSpace: 'nowrap' }}
          >
            <TrendingUp size={18} /> Interpreting Results
          </button>
        </div>

        <div className="modal-body" style={{ maxHeight: '65vh', overflowY: 'auto', paddingRight: '0.5rem' }}>
          
          {activeTab === 'settings' && (
            <div className="help-section animate-fade-in">
              <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>Global System Settings</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                These settings configure the baseline metrics for your contact centre and the pricing model for your AI provider. Fill these out first to ensure accurate calculations.
              </p>
              
              <div className="grid-2" style={{ gap: '1rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
                <div className="help-card" style={{ background: 'var(--btn-secondary-bg)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--accent-primary)' }}>Total Number of Human Agents</h4>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>The total headcount of human customer service agents currently handling interactions in your business.</p>
                </div>
                
                <div className="help-card" style={{ background: 'var(--btn-secondary-bg)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--accent-primary)' }}>Agent License Cost (£/month)</h4>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>The existing monthly software license cost you pay for each human agent (e.g., your CCaaS platform).</p>
                </div>

                <div className="help-card" style={{ background: 'var(--btn-secondary-bg)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--accent-primary)' }}>AI Enablement Cost (£/agent/month)</h4>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>The monthly premium or uplift cost per agent to enable AI capabilities in your platform.</p>
                </div>

                <div className="help-card" style={{ background: 'var(--btn-secondary-bg)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--accent-primary)' }}>Included AI Units (per agent/month)</h4>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>The number of AI interactions (units) that come included for free with each AI-enabled agent license.</p>
                </div>

                <div className="help-card" style={{ background: 'var(--btn-secondary-bg)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--accent-primary)' }}>Additional Bundle Cost (£)</h4>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>The price to purchase a bundle of extra AI units if your total usage exceeds the included allowance.</p>
                </div>

                <div className="help-card" style={{ background: 'var(--btn-secondary-bg)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--accent-primary)' }}>Additional Bundle Size (Units)</h4>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>The number of AI units provided in one additional bundle (e.g., £500 for a bundle of 10,000 units).</p>
                </div>

                <div className="help-card" style={{ background: 'var(--btn-secondary-bg)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--accent-primary)' }}>FTE Weekly Working Hours</h4>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Standard hours a Full-Time Equivalent (FTE) works per week. Used to convert saved minutes into FTE savings.</p>
                </div>

                <div className="help-card" style={{ background: 'var(--btn-secondary-bg)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--accent-primary)' }}>FTE Yearly Cost (£)</h4>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>The fully loaded annual cost of one human agent (including salary, taxes, benefits, and overhead).</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'usecases' && (
            <div className="help-section animate-fade-in">
              <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>Use Cases & Calculator Fields</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                Use cases represent the specific scenarios where AI interacts with customers. Define these to calculate your operational savings.
              </p>
              
              <h4 style={{ color: 'var(--accent-secondary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>1. Use Case Categories</h4>
              <div style={{ display: 'grid', gap: '1rem', marginBottom: '2rem' }}>
                <div className="use-case-card p-3" style={{ background: 'var(--btn-secondary-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <strong style={{ color: 'var(--text-primary)' }}>Triage:</strong> AI acts as the first point of contact to understand intent and route to the correct human. It doesn't solve the problem, but saves the human from doing initial preamble.
                </div>
                <div className="use-case-card p-3" style={{ background: 'var(--btn-secondary-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <strong style={{ color: 'var(--text-primary)' }}>Data Collection:</strong> AI intercepts the conversation to gather necessary info (e.g. account numbers, identity verification) <em>before</em> handing over to a human.
                </div>
                <div className="use-case-card p-3" style={{ background: 'var(--btn-secondary-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <strong style={{ color: 'var(--text-primary)' }}>General Enquiries:</strong> AI fully resolves common, informational questions by leveraging a knowledge base (FAQs) without human intervention.
                </div>
                <div className="use-case-card p-3" style={{ background: 'var(--btn-secondary-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <strong style={{ color: 'var(--text-primary)' }}>Transactional:</strong> Highest-value automation. AI integrates with backend systems to complete an end-to-end process (e.g. taking payments, resetting passwords).
                </div>
              </div>

              <h4 style={{ color: 'var(--accent-secondary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>2. Calculator Fields</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <li>
                  <strong style={{ color: 'var(--text-primary)' }}>Category:</strong> Choose the type of interaction. This determines which fields apply (e.g., Triage doesn't calculate Full Resolution).
                </li>
                <li>
                  <strong style={{ color: 'var(--text-primary)' }}>Total Monthly Interactions:</strong> The overall baseline volume for this specific scenario every month.
                </li>
                <li>
                  <strong style={{ color: 'var(--text-primary)' }}>AI Engagement Rate (%):</strong> The percentage of total interactions that the AI will actually intercept and attempt to process.
                </li>
                <li>
                  <strong style={{ color: 'var(--text-primary)' }}>Units per Interaction:</strong> The amount of AI units consumed each time the AI engages with this scenario (affects AI software cost).
                </li>
                <li>
                  <strong style={{ color: 'var(--text-primary)' }}>Full Resolution Rate (%):</strong> <em>(Enquiries/Transactional only)</em> The percentage of engaged interactions the AI fully solves without any human help.
                </li>
                <li>
                  <strong style={{ color: 'var(--text-primary)' }}>Full Agent Handling Time (mins):</strong> <em>(Enquiries/Transactional only)</em> The average time it takes a human to completely resolve this scenario end-to-end.
                </li>
                <li>
                  <strong style={{ color: 'var(--text-primary)' }}>Time Saved on Handover (mins):</strong> The average human time saved when the AI intercepts, collects some info, but ultimately has to hand over to a human to finish.
                </li>
              </ul>
            </div>
          )}

          {activeTab === 'math' && (
            <div className="help-section animate-fade-in">
              <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>How the Math Works (100% Transparency)</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>The calculator uses standard financial modeling to convert raw minutes into monetary savings.</p>
              
              <ul className="math-list" style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <li>
                  <strong style={{ color: 'var(--accent-primary)', fontSize: '1.1rem' }}>Gross Time Saved</strong> <br/>
                  <code style={{ background: 'var(--input-bg)', padding: '0.25rem 0.5rem', borderRadius: '4px', display: 'inline-block', margin: '0.5rem 0', color: 'var(--text-primary)' }}>
                    (Fully Resolved Interactions × Full Handling Time) + (Handover Interactions × Handover Time Saved)
                  </code>
                  <p className="text-secondary mt-1" style={{ margin: 0 }}>Calculates the total human minutes avoided each month across all use cases.</p>
                </li>
                <li>
                  <strong style={{ color: 'var(--accent-primary)', fontSize: '1.1rem' }}>FTEs Saved</strong> <br/>
                  <code style={{ background: 'var(--input-bg)', padding: '0.25rem 0.5rem', borderRadius: '4px', display: 'inline-block', margin: '0.5rem 0', color: 'var(--text-primary)' }}>
                    Total Time Saved / Average Monthly Minutes per FTE
                  </code>
                  <p className="text-secondary mt-1" style={{ margin: 0 }}>Converts total minutes saved into Full-Time Equivalents (based on the FTE Weekly Hours setting).</p>
                </li>
                <li>
                  <strong style={{ color: 'var(--accent-primary)', fontSize: '1.1rem' }}>Gross Financial Savings (£)</strong> <br/>
                  <code style={{ background: 'var(--input-bg)', padding: '0.25rem 0.5rem', borderRadius: '4px', display: 'inline-block', margin: '0.5rem 0', color: 'var(--text-primary)' }}>
                    FTEs Saved × (Fully Loaded Annual Agent Cost / 12)
                  </code>
                  <p className="text-secondary mt-1" style={{ margin: 0 }}>Converts the saved human capacity into monthly financial value.</p>
                </li>
                <li>
                  <strong style={{ color: 'var(--accent-primary)', fontSize: '1.1rem' }}>Incremental AI Cost (£)</strong> <br/>
                  <code style={{ background: 'var(--input-bg)', padding: '0.25rem 0.5rem', borderRadius: '4px', display: 'inline-block', margin: '0.5rem 0', color: 'var(--text-primary)' }}>
                    (Total Agents × AI Enablement Cost) + Extra AI Bundles Cost
                  </code>
                  <p className="text-secondary mt-1" style={{ margin: 0 }}>The extra software cost incurred specifically to run the AI, above standard human agent licenses.</p>
                </li>
              </ul>
            </div>
          )}

          {activeTab === 'results' && (
            <div className="help-section animate-fade-in">
              <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>Interpreting the Results Dashboard</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Understanding the final metrics to present your business case with confidence.</p>

              <div className="result-card mb-4 p-4" style={{ background: 'var(--success-alpha)', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--accent-success)' }}>
                <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--accent-success)' }}>Projected Net Savings</h4>
                <p style={{ margin: 0 }}>This is the bottom-line financial value. It equals the <strong>Gross Financial Savings</strong> minus the <strong>Incremental AI Cost</strong>. If this number is positive, the AI generates more value in saved human capacity than it costs to operate.</p>
              </div>

              <div className="result-card mb-4 p-4" style={{ background: 'var(--secondary-alpha)', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--accent-secondary)' }}>
                <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--accent-secondary)' }}>Human Capacity Freed (FTEs)</h4>
                <p style={{ margin: 0 }}>The number of Full-Time Equivalents whose time has been completely freed up. These agents are not necessarily replaced; they can be repurposed to handle higher-value, complex tasks that AI cannot handle.</p>
              </div>

              <div className="result-card mb-4 p-4" style={{ background: 'var(--primary-alpha)', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--accent-primary)' }}>
                <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--accent-primary)' }}>Estimated ROI (%)</h4>
                <p style={{ margin: 0 }}>Calculated as <code>(Net Monthly Savings / Incremental AI Cost) × 100</code>. An ROI of 100% means the AI pays for itself and generates an equal amount of profit on top.</p>
              </div>

              <div className="result-card p-4" style={{ background: 'var(--btn-secondary-bg)', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--text-muted)' }}>
                <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-secondary)' }}>Payback Period (Months)</h4>
                <p style={{ margin: 0 }}>If you were to pay the <strong>Annual</strong> AI software cost upfront, this tells you how many months of human savings it takes to break even on that investment. Calculated as <code>(Incremental Monthly AI Cost × 12) / Gross Monthly Financial Savings</code>.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

