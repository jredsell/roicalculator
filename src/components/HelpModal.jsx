import React, { useState } from 'react';
import { X, Calculator, Lightbulb, TrendingUp } from 'lucide-react';

export default function HelpModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('usecases');

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 style={{ margin: 0, color: 'var(--text-primary)' }}>ROI Calculator Guide</h2>
          <button className="btn btn-icon" onClick={onClose} style={{ background: 'transparent', color: 'var(--text-secondary)' }}>
            <X size={24} />
          </button>
        </div>
        
        <div className="modal-tabs">
          <button 
            className={`tab-btn ${activeTab === 'usecases' ? 'active' : ''}`}
            onClick={() => setActiveTab('usecases')}
          >
            <Lightbulb size={18} /> Use Cases
          </button>
          <button 
            className={`tab-btn ${activeTab === 'math' ? 'active' : ''}`}
            onClick={() => setActiveTab('math')}
          >
            <Calculator size={18} /> How the Math Works
          </button>
          <button 
            className={`tab-btn ${activeTab === 'results' ? 'active' : ''}`}
            onClick={() => setActiveTab('results')}
          >
            <TrendingUp size={18} /> Interpreting Results
          </button>
        </div>

        <div className="modal-body" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
          {activeTab === 'usecases' && (
            <div className="help-section">
              <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>Understanding Use Case Categories</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Different types of interactions generate value in different ways. Choose the right category to ensure accurate calculations.</p>
              
              <div className="use-case-card mb-4 p-4" style={{ background: 'var(--btn-secondary-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--accent-secondary)' }}>Triage</h4>
                <p style={{ marginBottom: '0.5rem' }}><strong>What it is:</strong> The AI acts as the first point of contact to understand the customer's intent and route them to the correct human department. It doesn't fully solve the problem, but saves the human agent from doing the initial preamble.</p>
                <p style={{ margin: 0 }}><strong>Example:</strong> A customer calls and says, <em>"I need to talk to someone about my mortgage."</em> The AI understands the intent and directly routes the call to the Mortgage team.</p>
              </div>

              <div className="use-case-card mb-4 p-4" style={{ background: 'var(--btn-secondary-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--accent-secondary)' }}>Data Collection</h4>
                <p style={{ marginBottom: '0.5rem' }}><strong>What it is:</strong> The AI intercepts the conversation to gather necessary information, verify identity, or collect forms <em>before</em> handing the customer over to a human agent to finish the work.</p>
                <p style={{ margin: 0 }}><strong>Example:</strong> The AI asks for the customer's account number and date of birth, authenticating them before the human agent joins the chat.</p>
              </div>

              <div className="use-case-card mb-4 p-4" style={{ background: 'var(--btn-secondary-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--accent-secondary)' }}>General Enquiries</h4>
                <p style={{ marginBottom: '0.5rem' }}><strong>What it is:</strong> The AI fully resolves common, informational questions by leveraging a knowledge base (like FAQs) without human intervention.</p>
                <p style={{ margin: 0 }}><strong>Example:</strong> <em>"What are your store opening hours on Sunday?"</em> or <em>"Do you offer international shipping to Canada?"</em></p>
              </div>

              <div className="use-case-card p-4" style={{ background: 'var(--btn-secondary-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--accent-secondary)' }}>Transactional</h4>
                <p style={{ marginBottom: '0.5rem' }}><strong>What it is:</strong> The highest-value automation. The AI integrates with backend systems (via APIs) to complete an end-to-end process or action for the customer.</p>
                <p style={{ margin: 0 }}><strong>Example:</strong> <em>"I need to reset my password"</em>, taking a payment, or processing a refund for a returned item.</p>
              </div>
            </div>
          )}

          {activeTab === 'math' && (
            <div className="help-section">
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
            <div className="help-section">
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
