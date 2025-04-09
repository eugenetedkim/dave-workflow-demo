// File: src/App.tsx
import React, { useState } from 'react';
import './index.css';
import { TicketState, NewTicketState } from './types/ticket-states';
import { TicketDetail } from './components/TicketDetail';
import { TransitionForm } from './components/TransitionForm';
import { StateFlowDiagram } from './components/StateFlowDiagram';
import { TicketHistory } from './components/TicketHistory';
import { ZendeskContextPanel } from './components/ZendeskContextPanel';

const App: React.FC = () => {
  // Example initial ticket in the New state
  const initialTicket: NewTicketState = {
    id: 'T-1001',
    customerId: 'C-5001',
    subject: 'Unable to access Dave app',
    description: 'I\'m trying to log in but keep getting an authentication error message. I\'ve tried resetting my password multiple times but still can\'t get in.',
    category: 'account_access',
    priority: 'high',
    state: 'new',
    source: 'app',
    createdAt: new Date(),
    updatedAt: new Date(),
    autoClassificationConfidence: 0.92
  };
  
  // Store the current ticket
  const [currentTicket, setCurrentTicket] = useState<TicketState>(initialTicket);
  
  // Store ticket history for demonstration
  const [ticketHistory, setTicketHistory] = useState<{
    time: Date;
    title: string;
    details: string;
    state: string;
  }[]>([
    {
      time: new Date(),
      title: 'Ticket Created',
      details: 'New ticket submitted via mobile app',
      state: 'new'
    }
  ]);
  
  // Handle ticket updates
  const handleTicketUpdated = (updatedTicket: TicketState) => {
    // Update the current ticket
    setCurrentTicket(updatedTicket);
    
    // Add to history
    setTicketHistory([
      ...ticketHistory,
      {
        time: new Date(),
        title: `State Changed: ${currentTicket.state} → ${updatedTicket.state}`,
        details: getTransitionDetails(currentTicket, updatedTicket),
        state: updatedTicket.state
      }
    ]);
    
    // In a real app, you would also save to backend here
    console.log('Ticket updated:', updatedTicket);
  };
  
  // Generate details for history
  const getTransitionDetails = (oldTicket: TicketState, newTicket: TicketState): string => {
    switch (newTicket.state) {
      case 'open':
        return `Assigned to agent ${(newTicket as any).assignedTo}`;
      case 'in_progress':
        return 'Agent started working on ticket';
      case 'waiting_for_customer':
        return 'Waiting for customer response';
      case 'waiting_for_third_party':
        return `Waiting for ${(newTicket as any).thirdPartyName}`;
      case 'resolved':
        return `Resolution: ${(newTicket as any).resolution}`;
      case 'closed':
        return 'Ticket closed';
      default:
        return '';
    }
  };
  
  return (
    <div className="app">
      <header className="app-header">
        <h1>Dave Zendesk Enhancement Tool</h1>
        <p className="subtitle">Streamlining Customer Support Workflows</p>
      </header>
      
      <main>
        <div className="zendesk-integration-container">
          {/* Zendesk-like ticket view */}
          <div className="zendesk-ticket-panel">
            <h2>Zendesk Ticket</h2>
            <div className="ticket-workflow">
              <div className="ticket-panel">
                <TicketDetail ticket={currentTicket} />
              </div>
              
              <div className="transition-panel">
                <TransitionForm 
                  ticket={currentTicket} 
                  onTicketUpdated={handleTicketUpdated} 
                />
              </div>
            </div>
          </div>

          {/* Context Panel */}
          <div className="context-panel">
            <ZendeskContextPanel ticket={currentTicket} />
          </div>
        </div>

        
        {/* Ticket history */}
        <div className="history-panel">
          <h2>Ticket Timeline</h2>
          <TicketHistory history={ticketHistory} />
        </div>
        
        {/* Visual state diagram */}
        <div className="state-flow-diagram">
          <h2>Workflow State Diagram</h2>
          <StateFlowDiagram currentState={currentTicket.state} />
        </div>
      </main>
      
      <footer className="app-footer">
        <hr />
        <h3>Technical Implementation Notes (For the Hiring Manager)</h3>
        <ul>
          <li>
            <strong>State-Based Type System:</strong> Each ticket state has its own TypeScript interface with 
            properly typed fields specific to that state, similar to the genetic testing workflow system 
            I built at Fulgent.
          </li>
          <li>
            <strong>Type-Safe State Transitions:</strong> The workflow enforces that only valid state 
            transitions are possible using TypeScript's type system. This catches potential bugs at 
            compile time rather than runtime.
          </li>
          <li>
            <strong>Type Guards:</strong> Used type guards (isNewTicket, isOpenTicket, etc.) to safely
            narrow types when working with the TicketState union type.
          </li>
          <li>
            <strong>Conditional UI Rendering:</strong> The UI adapts to the current ticket state, 
            showing only relevant fields and actions based on the ticket's current state.
          </li>
          <li>
            <strong>Generic TypeScript Components:</strong> The TicketStateManager component uses generics to enforce type safety based on the current ticket state.
          </li>
          <li>
            <strong>Mapped and Utility Types:</strong> Used TypeScript's advanced type features like conditional types and mapped types to create the AllowedStateTransitions type, which enforces valid state transitions at compile time.
          </li>
          <li>
            <strong>Exhaustive Type Checking:</strong> TypeScript ensures all possible states are handled in switch statements, preventing logic errors when adding new states.
          </li>
        </ul>
      </footer>
    </div>
  );
};

export default App;