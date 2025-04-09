// File: src/components/TransitionForm.tsx
import React, { useState } from 'react';
import { 
  TicketState, 
  isNewTicket,
  isOpenTicket,
  isInProgressTicket,
  isWaitingForCustomer,
  isWaitingForThirdParty,
  isResolvedTicket,
  AllowedNextStates
} from '../types/ticket-states';
import { TicketTransitionService } from '../services/ticket-transition.service';

interface TransitionFormProps {
  ticket: TicketState;
  onTicketUpdated: (updatedTicket: TicketState) => void;
}

export const TransitionForm: React.FC<TransitionFormProps> = ({ 
  ticket, 
  onTicketUpdated 
}) => {
  const transitionService = new TicketTransitionService();
  
  // Selected transition state
  const [selectedTransition, setSelectedTransition] = useState<string | null>(null);
  
  // Form fields
  const [agentId, setAgentId] = useState<string>('A-1234');
  const [note, setNote] = useState<string>('');
  const [resolution, setResolution] = useState<string>('');
  const [thirdPartyName, setThirdPartyName] = useState<string>('');
  const [satisfactionScore, setSatisfactionScore] = useState<number | undefined>(undefined);
  const [feedback, setFeedback] = useState<string>('');
  
  // Get available transitions based on current state
  const getAvailableTransitions = (): AllowedNextStates<typeof ticket.state>[] => {
    switch (ticket.state) {
      case 'new':
        return ['open', 'closed'];
      case 'open':
        return ['in_progress', 'closed'];
      case 'in_progress':
        return ['waiting_for_customer', 'waiting_for_third_party', 'resolved', 'closed'];
      case 'waiting_for_customer':
        return ['in_progress', 'resolved', 'closed'];
      case 'waiting_for_third_party':
        return ['in_progress', 'resolved', 'closed'];
      case 'resolved':
        return ['in_progress', 'closed'];
      case 'closed':
        return [];
      default:
        return [];
    }
  };
  
  // Handle transition selection
  const handleTransitionSelect = (transition: string) => {
    setSelectedTransition(transition === selectedTransition ? null : transition);
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedTransition) return;
    
    try {
      let updatedTicket: TicketState | null = null;
      
      // Handle each transition type - TypeScript ensures we're using the right data
      switch (selectedTransition) {
        case 'open':
          if (isNewTicket(ticket)) {
            updatedTicket = transitionService.transitionToOpen(ticket, agentId);
          }
          break;
        case 'in_progress':
          if (isOpenTicket(ticket)) {
            updatedTicket = transitionService.transitionToInProgress(ticket);
          } else if (isWaitingForCustomer(ticket) || isWaitingForThirdParty(ticket) || isResolvedTicket(ticket)) {
            // For simplicity, we're using any here, but in a real app you'd have proper transitions
            updatedTicket = transitionService.transition(ticket as any, 'in_progress' as any, {});
          }
          break;
        case 'waiting_for_customer':
          if (isInProgressTicket(ticket)) {
            updatedTicket = transitionService.transitionToWaitingForCustomer(ticket, note);
          }
          break;
        case 'waiting_for_third_party':
          if (isInProgressTicket(ticket)) {
            updatedTicket = transitionService.transitionToWaitingForThirdParty(
              ticket, 
              thirdPartyName
            );
          }
          break;
        case 'resolved':
          if (isInProgressTicket(ticket) || isWaitingForCustomer(ticket) || isWaitingForThirdParty(ticket)) {
            updatedTicket = transitionService.transitionToResolved(ticket as any, resolution);
          }
          break;
        case 'closed':
          if (isResolvedTicket(ticket)) {
            updatedTicket = transitionService.transitionToClosed(
              ticket, 
              satisfactionScore, 
              feedback
            );
          } else {
            // For simplicity in the demo, we're using any here
            updatedTicket = transitionService.transition(ticket as any, 'closed' as any, {});
          }
          break;
      }
      
      if (updatedTicket) {
        onTicketUpdated(updatedTicket);
        setSelectedTransition(null);
        resetFormFields();
      }
    } catch (error) {
      console.error('Error during state transition:', error);
      alert(`Failed to transition ticket: ${error}`);
    }
  };
  
  // Reset form fields
  const resetFormFields = () => {
    setNote('');
    setResolution('');
    setThirdPartyName('');
    setSatisfactionScore(undefined);
    setFeedback('');
  };
  
  // Render available transition options
  const renderTransitionOptions = () => {
    const availableTransitions = getAvailableTransitions();
    
    if (availableTransitions.length === 0) {
      return (
        <p>No transitions available for tickets in the {ticket.state.replace('_', ' ')} state.</p>
      );
    }
    
    return (
      <div className="transition-options">
        {availableTransitions.map((transition) => (
          <button
            key={transition}
            className={`transition-option ${selectedTransition === transition ? 'selected' : ''}`}
            onClick={() => handleTransitionSelect(transition)}
          >
            {transition.replace('_', ' ')}
          </button>
        ))}
      </div>
    );
  };
  
  // Render form fields based on selected transition
  const renderTransitionForm = () => {
    if (!selectedTransition) return null;
    
    return (
      <form onSubmit={handleSubmit}>
        {selectedTransition === 'open' && (
          <div className="form-group">
            <label htmlFor="agentId">Assign to Agent ID:</label>
            <input
              id="agentId"
              type="text"
              value={agentId}
              onChange={(e) => setAgentId(e.target.value)}
              required
            />
          </div>
        )}
        
        {selectedTransition === 'waiting_for_customer' && (
          <div className="form-group">
            <label htmlFor="note">Response to Customer:</label>
            <textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Enter message sent to customer..."
              required
            />
          </div>
        )}
        
        {selectedTransition === 'waiting_for_third_party' && (
          <div className="form-group">
            <label htmlFor="thirdPartyName">Third-party Name:</label>
            <input
              id="thirdPartyName"
              type="text"
              value={thirdPartyName}
              onChange={(e) => setThirdPartyName(e.target.value)}
              placeholder="Enter name of third-party service..."
              required
            />
          </div>
        )}
        
        {selectedTransition === 'resolved' && (
          <div className="form-group">
            <label htmlFor="resolution">Resolution:</label>
            <textarea
              id="resolution"
              value={resolution}
              onChange={(e) => setResolution(e.target.value)}
              placeholder="Describe how the issue was resolved..."
              required
            />
          </div>
        )}
        
        {selectedTransition === 'closed' && isResolvedTicket(ticket) && (
          <>
            <div className="form-group">
              <label htmlFor="satisfactionScore">Customer Satisfaction (1-5):</label>
              <input
                id="satisfactionScore"
                type="number"
                min="1"
                max="5"
                value={satisfactionScore || ''}
                onChange={(e) => setSatisfactionScore(parseInt(e.target.value))}
              />
            </div>
            <div className="form-group">
              <label htmlFor="feedback">Customer Feedback:</label>
              <textarea
                id="feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Enter customer feedback..."
              />
            </div>
          </>
        )}
        
        <button 
          type="submit"
          className={`transition-button transition-to-${selectedTransition}`}
        >
          Transition to {selectedTransition.replace('_', ' ')}
        </button>
      </form>
    );
  };
  
  return (
    <div className="transition-form">
      <h3>Available Transitions</h3>
      {renderTransitionOptions()}
      {renderTransitionForm()}
    </div>
  );
};