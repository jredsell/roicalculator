import React, { useState } from 'react';
import { X, Calculator, TrendingUp, Settings as SettingsIcon, Layers, BookOpen, ArrowRightLeft } from 'lucide-react';

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
            className={`tab-btn ${activeTab === 'assumptions' ? 'active' : ''}`}
            onClick={() => setActiveTab('assumptions')}
            style={{ whiteSpace: 'nowrap' }}
          >
            <BookOpen size={18} /> Assumptions & Best Practices
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
          <button 
            className={`tab-btn ${activeTab === 'channel-shift' ? 'active' : ''}`}
            onClick={() => setActiveTab('channel-shift')}
            style={{ whiteSpace: 'nowrap' }}
          >
            <ArrowRightLeft size={18} /> Channel Shift
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
                  <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--accent-primary)' }}>Agent Licence Cost (£/month)</h4>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>The existing monthly software licence cost you pay for each human agent (e.g., your CCaaS platform).</p>
                </div>

                <div className="help-card" style={{ background: 'var(--btn-secondary-bg)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--accent-primary)' }}>AI Enablement Cost (£/agent/month)</h4>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>The monthly premium or uplift cost per agent to enable AI capabilities in your platform.</p>
                </div>

                <div className="help-card" style={{ background: 'var(--btn-secondary-bg)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--accent-primary)' }}>Included AI Units (per agent/month)</h4>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>The number of AI interactions (units) that come included for free with each AI-enabled agent licence.</p>
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
                  <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--accent-primary)' }}>Speech Cost per 100 Hours (£)</h4>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>The cost for processing speech in Voice use cases. Calculated in blocks of 100 hours.</p>
                </div>

                <div className="help-card" style={{ background: 'var(--btn-secondary-bg)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--accent-primary)' }}>Bundled Digital Messages</h4>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>The number of free digital messages included per agent per month.</p>
                </div>

                <div className="help-card" style={{ background: 'var(--btn-secondary-bg)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--accent-primary)' }}>Digital Msg Bundle Cost & Size</h4>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Cost and amount of extra messages when you exceed the bundled limit.</p>
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
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
                <div className="help-card" style={{ background: 'var(--btn-secondary-bg)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>Triage</h4>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>AI acts as the first point of contact to route customers correctly, eliminating manual transfer time. Includes units to understand the user's intent and route them to the appropriate area.</p>
                </div>
                <div className="help-card" style={{ background: 'var(--btn-secondary-bg)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>Data Collection</h4>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>AI gathers required information (e.g., 5-10 questions) before handing over to a human agent, saving manual data entry time. Triage costs are not included here.</p>
                </div>
                <div className="help-card" style={{ background: 'var(--btn-secondary-bg)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>General Enquiries</h4>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>AI resolves common questions. Calculates savings from full resolutions and time saved on handovers. Includes units to triage, answer, and hand over if required.</p>
                </div>
                <div className="help-card" style={{ background: 'var(--btn-secondary-bg)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>Transactional</h4>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Highest-value automation where AI completes end-to-end tasks (e.g., booking appointments, taking payments). Triage costs are not included here.</p>
                </div>
              </div>

              <h4 style={{ color: 'var(--accent-secondary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>2. Calculator Fields</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                <div className="help-card" style={{ background: 'var(--btn-secondary-bg)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>Category</h4>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Choose the type of interaction. This determines which fields apply (e.g., Triage doesn't calculate Full Resolution).</p>
                </div>
                <div className="help-card" style={{ background: 'var(--btn-secondary-bg)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>Total Monthly Interactions</h4>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>The overall baseline volume for this specific scenario every month.</p>
                </div>
                <div className="help-card" style={{ background: 'var(--btn-secondary-bg)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>AI Engagement Rate (%)</h4>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>The percentage of total interactions that the AI will actually intercept and attempt to process.</p>
                </div>
                <div className="help-card" style={{ background: 'var(--btn-secondary-bg)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>Units per Interaction</h4>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>The amount of AI units consumed each time the AI engages with this scenario (affects AI software cost).</p>
                </div>
                <div className="help-card" style={{ background: 'var(--btn-secondary-bg)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>Channel</h4>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Choose Voice or Digital. This determines whether to calculate Speech Costs or Digital Messaging Costs.</p>
                </div>
                <div className="help-card" style={{ background: 'var(--btn-secondary-bg)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>AI Talk Time (Voice) / Msgs (Digital)</h4>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>The average time the AI spends talking (in minutes), or the number of digital messages per interaction.</p>
                </div>
                <div className="help-card" style={{ background: 'var(--btn-secondary-bg)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>Full Resolution Rate (%)</h4>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}><em>(Enquiries/Transactional only)</em> The percentage of engaged interactions the AI fully solves without any human help.</p>
                </div>
                <div className="help-card" style={{ background: 'var(--btn-secondary-bg)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>Full Agent Handling Time (mins)</h4>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}><em>(Enquiries/Transactional only)</em> The average time it takes a human to completely resolve this scenario end-to-end.</p>
                </div>
                <div className="help-card" style={{ background: 'var(--btn-secondary-bg)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>% of Transferred Calls</h4>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}><em>(Triage only)</em> The percentage of calls currently going to the wrong area that the AI will now route correctly, saving transfer time.</p>
                </div>
                <div className="help-card" style={{ background: 'var(--btn-secondary-bg)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>Time to Transfer (mins)</h4>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}><em>(Triage only)</em> The average time a human agent spends speaking to a customer just to transfer them to the correct department.</p>
                </div>
                <div className="help-card" style={{ background: 'var(--btn-secondary-bg)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>Time Saved on Handover (mins)</h4>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}><em>(Non-Triage only)</em> The average human time saved when the AI intercepts, collects some info, but ultimately has to hand over to a human to finish.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'assumptions' && (
            <div className="help-section animate-fade-in">
              <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>Understanding the Baseline Assumptions</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                When you click "Add Use Case", the calculator injects highly realistic default metrics based on industry standards. Use the explanations below to guide discussions with a CFO or Operations Director.
              </p>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '1.5rem' }}>
                <div className="help-card" style={{ background: 'var(--btn-secondary-bg)', padding: '1.25rem', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--accent-success)', border: '1px solid var(--border-color)' }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-primary)', fontSize: '1.1rem' }}>1. Handover Time Saved (1.5 to 3 mins)</h4>
                  <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}><strong>Question:</strong> "If the AI fails to resolve the issue and has to pass it to a human, how are we saving 1.5 minutes?"</p>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    <strong>Explanation:</strong> In a traditional contact centre, a human agent spends the first 60-90 seconds on the "Discovery Phase" (greeting, security checks, and understanding the issue). 
                    When an AI handles the front end, it completes this initial phase. Upon handover, it passes a summary directly to the agent's screen. The agent skips the discovery phase and jumps straight into solving the problem, saving 1.5 to 3 minutes on every escalated interaction.
                  </p>
                </div>

                <div className="help-card" style={{ background: 'var(--btn-secondary-bg)', padding: '1.25rem', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--accent-primary)', border: '1px solid var(--border-color)' }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-primary)', fontSize: '1.1rem' }}>2. AI Talk Time (2 to 3 mins)</h4>
                  <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}><strong>Question:</strong> "Why does an AI voice call take 2 minutes? Our IVR takes 30 seconds."</p>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    <strong>Explanation:</strong> Generative AI is conversational, not a "Press 1" menu. It provides rich, natural language answers. Text-to-Speech (TTS) engines read this out at a normal human speed of ~140 words per minute. A standard multi-turn interaction (e.g., User asks question -&gt; AI explains -&gt; User asks follow up -&gt; AI answers -&gt; Goodbye) naturally stretches to 90–120 seconds of active AI processing and speaking time.
                  </p>
                </div>

                <div className="help-card" style={{ background: 'var(--btn-secondary-bg)', padding: '1.25rem', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--accent-secondary)', border: '1px solid var(--border-color)' }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-primary)', fontSize: '1.1rem' }}>3. Full Resolution Rates (60% to 65%)</h4>
                  <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}><strong>Question:</strong> "Is 65% containment actually realistic for general enquiries?"</p>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    <strong>Explanation:</strong> Yes. Modern Generative AI powered by RAG (Retrieval-Augmented Generation) connected to a clean knowledge base typically resolves 60-70% of tier-1 informational queries right out of the box. We default to 65% to provide a realistic, defensible baseline without overpromising 90%+ automation.
                  </p>
                </div>

                <div className="help-card" style={{ background: 'var(--btn-secondary-bg)', padding: '1.25rem', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--text-muted)', border: '1px solid var(--border-color)' }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-primary)', fontSize: '1.1rem' }}>4. Digital Messages (8 to 12 per interaction)</h4>
                  <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}><strong>Question:</strong> "Why does a single digital transaction use 12 AI messages?"</p>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    <strong>Explanation:</strong> A digital interaction is measured in individual message bubbles sent by the AI. A fully resolved transactional interaction involves a back-and-forth flow: Greeting (1), Identity collection (2-3), Intent confirmation (1), Executing the action and explaining the result (3-4), and Sign-off (1-2), averaging roughly 12 AI-generated messages.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'math' && (
            <div className="help-section animate-fade-in">
              <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>Calculation Methodology (100% Transparency)</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>We use standard, auditable financial modeling to convert raw interaction minutes into definitive monetary savings.</p>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '1.5rem' }}>
                <div className="help-card" style={{ background: 'var(--btn-secondary-bg)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--accent-primary)', fontSize: '1.1rem' }}>1. Time Avoidance (Gross Time Saved)</h4>
                  <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>We calculate the total human minutes avoided each month by identifying interactions the AI successfully intercepts and processes without human intervention.</p>
                  <code style={{ background: 'var(--bg-color)', padding: '0.75rem', borderRadius: '6px', display: 'block', margin: '0', color: 'var(--text-primary)', border: '1px solid var(--border-color)', fontSize: '0.85rem', lineHeight: '1.6' }}>
                    <strong>For Enquiries/Transactional:</strong><br/>
                    (Fully Resolved Interactions × Full Handling Time) + (Handed Over Interactions × Handover Time Saved)<br/>
                    <br/>
                    <strong>For Triage:</strong><br/>
                    (Transfers Saved × Time to Transfer)
                  </code>
                </div>
                
                <div className="help-card" style={{ background: 'var(--btn-secondary-bg)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--accent-primary)', fontSize: '1.1rem' }}>2. Repurposed Capacity (FTEs Saved)</h4>
                  <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>We convert total minutes saved into Full-Time Equivalents (FTEs) by standardising the working hours in a month.</p>
                  <code style={{ background: 'var(--bg-color)', padding: '0.75rem', borderRadius: '6px', display: 'block', margin: '0', color: 'var(--text-primary)', border: '1px solid var(--border-color)', fontSize: '0.85rem', lineHeight: '1.6' }}>
                    <strong>Average Monthly Minutes per FTE = </strong><br/>
                    ((FTE Weekly Hours × 52 weeks) / 12 months) × 60 minutes<br/>
                    <br/>
                    <strong>Total FTEs Saved = </strong><br/>
                    Total Time Saved (Minutes) / Average Monthly Minutes per FTE
                  </code>
                </div>

                <div className="help-card" style={{ background: 'var(--btn-secondary-bg)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--accent-primary)', fontSize: '1.1rem' }}>3. Gross Financial Savings (£)</h4>
                  <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>We calculate the monetary value of the human capacity that has been repurposed (i.e. the human handling cost avoided).</p>
                  <code style={{ background: 'var(--bg-color)', padding: '0.75rem', borderRadius: '6px', display: 'block', margin: '0', color: 'var(--text-primary)', border: '1px solid var(--border-color)', fontSize: '0.85rem', lineHeight: '1.6' }}>
                    <strong>Current Human Handling Cost (Monthly) = </strong><br/>
                    Total FTEs Saved × (Fully Loaded Annual Agent Cost / 12)
                  </code>
                </div>

                <div className="help-card" style={{ background: 'var(--btn-secondary-bg)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--accent-primary)', fontSize: '1.1rem' }}>4. Incremental AI Cost (£)</h4>
                  <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>This determines the true, net-new software cost incurred by deploying the AI. It deducts your existing base licences from the total AI package cost to isolate the <em>premium</em> you are paying for AI.</p>
                  <code style={{ background: 'var(--bg-color)', padding: '0.75rem', borderRadius: '6px', display: 'block', margin: '0', color: 'var(--text-primary)', border: '1px solid var(--border-color)', fontSize: '0.85rem', lineHeight: '1.6' }}>
                    <strong>Base AI Licence Cost = </strong><br/>
                    Total Agents × (Agent Licence Cost + AI Enablement Cost)<br/>
                    <br/>
                    <strong>Total AI Software Cost = </strong><br/>
                    Base AI Licence Cost + Extra AI Bundles Cost + Speech Cost + Extra Digital Msgs Cost<br/>
                    <br/>
                    <strong>Incremental AI Cost = </strong><br/>
                    Total AI Software Cost - (Total Agents × Agent Licence Cost)
                  </code>
                </div>

                <div className="help-card" style={{ background: 'var(--btn-secondary-bg)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--accent-primary)', fontSize: '1.1rem' }}>5. Financial Value & ROI (£)</h4>
                  <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>The final value generation metrics that combine the human cost avoided and the incremental AI cost.</p>
                  <code style={{ background: 'var(--bg-color)', padding: '0.75rem', borderRadius: '6px', display: 'block', margin: '0', color: 'var(--text-primary)', border: '1px solid var(--border-color)', fontSize: '0.85rem', lineHeight: '1.6' }}>
                    <strong>Financial Value of Freed Capacity = </strong><br/>
                    Current Human Handling Cost (Monthly) - Incremental AI Cost<br/>
                    <br/>
                    <strong>Return on Investment (ROI) % = </strong><br/>
                    (Financial Value / Incremental AI Cost) × 100
                  </code>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'results' && (
            <div className="help-section animate-fade-in">
              <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>Interpreting the Results Dashboard</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Understanding the final metrics to present your business case with confidence.</p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                <div className="result-card" style={{ background: 'var(--success-alpha)', padding: '1.25rem', borderRadius: 'var(--radius-md)', borderTop: '4px solid var(--accent-success)', borderLeft: '1px solid var(--border-color)', borderRight: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--accent-success)' }}>Financial Value of Freed Capacity</h4>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    Bottom-line financial value. Equals <strong>Gross Savings</strong> minus <strong>AI Cost</strong>. If positive, the AI generates more value in human capacity than it costs to operate.
                  </p>
                </div>

                <div className="result-card" style={{ background: 'var(--secondary-alpha)', padding: '1.25rem', borderRadius: 'var(--radius-md)', borderTop: '4px solid var(--accent-secondary)', borderLeft: '1px solid var(--border-color)', borderRight: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--accent-secondary)' }}>Human Capacity Freed (FTEs)</h4>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    The number of Full-Time Equivalents fully freed up. They aren't necessarily replaced, but can be repurposed for higher-value, complex tasks.
                  </p>
                </div>

                <div className="result-card" style={{ background: 'var(--primary-alpha)', padding: '1.25rem', borderRadius: 'var(--radius-md)', borderTop: '4px solid var(--accent-primary)', borderLeft: '1px solid var(--border-color)', borderRight: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--accent-primary)' }}>Estimated ROI (%)</h4>
                  <code style={{ background: 'var(--bg-color)', padding: '0.25rem 0.5rem', borderRadius: '4px', display: 'inline-block', margin: '0.5rem 0', fontSize: '0.8rem', color: 'var(--text-primary)' }}>
                    (Financial Value / Incremental AI Cost) × 100
                  </code>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    An ROI of 100% means the AI pays for itself and generates an equal amount of profit on top.
                  </p>
                </div>

                <div className="result-card" style={{ background: 'var(--btn-secondary-bg)', padding: '1.25rem', borderRadius: 'var(--radius-md)', borderTop: '4px solid var(--text-muted)', borderLeft: '1px solid var(--border-color)', borderRight: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-secondary)' }}>Payback Period (Months)</h4>
                  <code style={{ background: 'var(--bg-color)', padding: '0.25rem 0.5rem', borderRadius: '4px', display: 'inline-block', margin: '0.5rem 0', fontSize: '0.8rem', color: 'var(--text-primary)' }}>
                    (Monthly AI Cost × 12) / Gross Monthly Savings
                  </code>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    If paying the annual AI cost upfront, this is how many months of human savings it takes to break even on that investment.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'channel-shift' && (
            <div className="help-section animate-fade-in">
              <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>Channel Shift Modeller</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                Understand how the system models the impact of deflecting volume from Voice to Digital channels.
              </p>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '1.5rem' }}>
                <div className="help-card" style={{ background: 'var(--btn-secondary-bg)', padding: '1.25rem', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--accent-primary)', border: '1px solid var(--border-color)' }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-primary)', fontSize: '1.1rem' }}>1. How the Shift Works</h4>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    The modeller automatically pairs up your Voice and Digital use cases based on their <strong>Category</strong>. For example, it pairs "Voice Triage" with "Digital Triage". When you use the slider to shift 40%, it mathematically deducts 40% of the interaction volume from Voice Triage and adds it to Digital Triage.
                  </p>
                </div>

                <div className="help-card" style={{ background: 'var(--btn-secondary-bg)', padding: '1.25rem', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--accent-secondary)', border: '1px solid var(--border-color)' }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-primary)', fontSize: '1.1rem' }}>2. Cost Differences</h4>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    Voice interactions incur AI speech processing costs, whereas Digital interactions consume AI text messages. Digital interactions generally have a lower cost to serve than Voice. Deflecting volume to Digital channels reduces overall operational costs, yielding a stronger ROI.
                  </p>
                </div>

                <div className="help-card" style={{ background: 'var(--btn-secondary-bg)', padding: '1.25rem', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--accent-success)', border: '1px solid var(--border-color)' }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-primary)', fontSize: '1.1rem' }}>3. The "Return to Voice" Reality</h4>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    While digital is cheaper and easier for routine tasks, customers still overwhelmingly prefer human voice for high-urgency or complex issues. The industry average for a successful digital shift with an excellent AI implementation sits between <strong>40% and 60%</strong>. The modeller defaults to 40% to provide a realistic, defensible business case rather than assuming an unrealistic 100% digital transition.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

