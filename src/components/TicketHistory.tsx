// File: src/components/TicketHistory.tsx
import React from 'react';

interface HistoryItem {
  time: Date;
  title: string;
  details: string;
  state: string;
}

interface TicketHistoryProps {
  history: HistoryItem[];
}

export const TicketHistory: React.FC<TicketHistoryProps> = ({ history }) => {
  return (
    <div className="history-list">
      {history.length === 0 ? (
        <p>No history available for this ticket.</p>
      ) : (
        <>
          {history.map((item, index) => (
            <div key={index} className="history-item">
              <div className="history-time">{item.time.toLocaleString()}</div>
              <div className="history-title">{item.title}</div>
              <div className="history-details">{item.details}</div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};