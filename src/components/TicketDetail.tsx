// File: src/components/TicketDetail.tsx
import React from 'react';
import { 
  TicketState, 
  isOpenTicket,
  isInProgressTicket,
  isWaitingForCustomer,
  isWaitingForThirdParty,
  isResolvedTicket,
  isClosedTicket
} from '../types/ticket-states';

interface TicketDetailProps {
  ticket: TicketState;
}

export const TicketDetail: React.FC<TicketDetailProps> = ({ ticket }) => {
  return (
    <div className="ticket-details">
      <div className="detail-row">
        <strong>ID:</strong> {ticket.id}
      </div>
      <div className="detail-row">
        <strong>Customer:</strong> {ticket.customerId}
      </div>
      <div className="detail-row">
        <strong>Subject:</strong> {ticket.subject}
      </div>
      <div className="detail-row">
        <strong>Description:</strong> {ticket.description}
      </div>
      <div className="detail-row">
        <strong>Status:</strong> 
        <span className={`status-badge status-${ticket.state}`}>
          {ticket.state.replace('_', ' ')}
        </span>
      </div>
      <div className="detail-row">
        <strong>Priority:</strong>
        <span className={`priority-badge priority-${ticket.priority}`}>
          {ticket.priority}
        </span>
      </div>
      <div className="detail-row">
        <strong>Category:</strong> {ticket.category.replace('_', ' ')}
      </div>
      <div className="detail-row">
        <strong>Created:</strong> {ticket.createdAt.toLocaleString()}
      </div>
      <div className="detail-row">
        <strong>Updated:</strong> {ticket.updatedAt.toLocaleString()}
      </div>
      
      {/* State-specific fields - TypeScript ensures we only access fields that exist */}
      {(isOpenTicket(ticket) || isInProgressTicket(ticket) || 
        isWaitingForCustomer(ticket) || isWaitingForThirdParty(ticket) || 
        isResolvedTicket(ticket)) && (
        <div className="detail-row">
          <strong>Assigned To:</strong> {ticket.assignedTo}
        </div>
      )}
      
      {(isOpenTicket(ticket) || isInProgressTicket(ticket)) && (
        <div className="detail-row">
          <strong>Response Deadline:</strong> {ticket.responseDeadline.toLocaleString()}
        </div>
      )}
      
      {isWaitingForCustomer(ticket) && (
        <>
          <div className="detail-row">
            <strong>Last Agent Response:</strong> {ticket.lastAgentResponse.toLocaleString()}
          </div>
          <div className="detail-row">
            <strong>Contact Attempts:</strong> {ticket.customerContactAttempts}
          </div>
          {ticket.followUpScheduled && (
            <div className="detail-row">
              <strong>Follow-up Scheduled:</strong> {ticket.followUpScheduled.toLocaleString()}
            </div>
          )}
        </>
      )}
      
      {isWaitingForThirdParty(ticket) && (
        <>
          <div className="detail-row">
            <strong>Third Party:</strong> {ticket.thirdPartyName}
          </div>
          <div className="detail-row">
            <strong>Contacted At:</strong> {ticket.contactedAt.toLocaleString()}
          </div>
          {ticket.expectedResponseDate && (
            <div className="detail-row">
              <strong>Expected Response:</strong> {ticket.expectedResponseDate.toLocaleString()}
            </div>
          )}
        </>
      )}
      
      {(isResolvedTicket(ticket) || isClosedTicket(ticket)) && (
        <>
          <div className="detail-row">
            <strong>Resolution:</strong> {ticket.resolution}
          </div>
          <div className="detail-row">
            <strong>Resolved At:</strong> {ticket.resolvedAt.toLocaleString()}
          </div>
        </>
      )}
      
      {isResolvedTicket(ticket) && (
        <div className="detail-row">
          <strong>Pending Until:</strong> {ticket.pendingConfirmationUntil.toLocaleString()}
        </div>
      )}
      
      {isClosedTicket(ticket) && (
        <>
          <div className="detail-row">
            <strong>Closed At:</strong> {ticket.closedAt.toLocaleString()}
          </div>
          {ticket.satisfactionScore !== undefined && (
            <div className="detail-row">
              <strong>Satisfaction:</strong> {ticket.satisfactionScore}/5
            </div>
          )}
          {ticket.feedback && (
            <div className="detail-row">
              <strong>Feedback:</strong> {ticket.feedback}
            </div>
          )}
        </>
      )}
      
      {/* Notes section - only for states that have notes */}
      {'notes' in ticket && ticket.notes && ticket.notes.length > 0 && (
        <div className="notes-section">
          <h4>Notes</h4>
          {ticket.notes.map(note => (
            <div key={note.id} className={`note ${note.isInternal ? 'internal-note' : ''}`}>
              <div className="note-header">
                <span className="note-author">{note.authorType === 'agent' ? 'Agent' : note.authorType}</span>
                <span className="note-time">{note.createdAt.toLocaleString()}</span>
              </div>
              <div className="note-content">{note.content}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};