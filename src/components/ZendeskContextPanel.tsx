// src/components/ZendeskContextPanel.tsx
import React from 'react';
import { TicketState } from '../types/ticket-states';

interface ZendeskContextPanelProps {
  ticket: TicketState;
}

export const ZendeskContextPanel: React.FC<ZendeskContextPanelProps> = ({ ticket }) => {
  return (
    <div className="zendesk-context-panel">
      <h2>Customer Context</h2>
      
      <section className="customer-profile">
        <h3>Customer Profile</h3>
        <div className="profile-detail">
          <strong>Customer ID:</strong> {ticket.customerId}
        </div>
        <div className="profile-detail">
          <strong>Account Status:</strong> 
          <span className="status-badge status-active">Active</span>
        </div>
        <div className="profile-detail">
          <strong>Account Created:</strong> 
          {new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toLocaleDateString()}
        </div>
      </section>
      
      <section className="recent-interactions">
        <h3>Recent Interactions</h3>
        <ul>
          <li>
            <span className="interaction-date">Mar 15, 2025</span>
            <span className="interaction-type">App Login Issue</span>
            <span className="interaction-status status-resolved">Resolved</span>
          </li>
          <li>
            <span className="interaction-date">Feb 22, 2025</span>
            <span className="interaction-type">Advance Request</span>
            <span className="interaction-status status-closed">Closed</span>
          </li>
        </ul>
      </section>
      
      <section className="ai-suggestions">
        <h3>AI-Powered Suggestions</h3>
        <div className="suggestion-card">
          <strong>Recommended Action:</strong>
          <p>Reset app credentials and verify two-factor authentication setup</p>
          <div className="confidence-score">
            Confidence: 85%
          </div>
        </div>
      </section>
    </div>
  );
};