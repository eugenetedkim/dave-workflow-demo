// File: src/components/StateFlowDiagram.tsx
import React from 'react';

interface StateFlowDiagramProps {
  currentState: string;
}

export const StateFlowDiagram: React.FC<StateFlowDiagramProps> = ({ currentState }) => {
  return (
    <div className="state-diagram">
      <svg width="850" height="380" viewBox="0 0 850 380">
        {/* Background */}
        <rect width="850" height="380" fill="#f8fafc" rx="8" />
        
        {/* State boxes */}
        <g>
          {/* New state */}
          <rect 
            x="50" 
            y="160" 
            width="100" 
            height="60" 
            rx="8" 
            fill={currentState === 'new' ? "#e3f8ff" : "white"} 
            stroke={currentState === 'new' ? "#0c66e4" : "#e2e8f0"}
            strokeWidth="2"
          />
          <text x="100" y="190" textAnchor="middle" fontSize="14" fontWeight="500">New</text>
          
          {/* Open state */}
          <rect 
            x="220" 
            y="160" 
            width="100" 
            height="60" 
            rx="8" 
            fill={currentState === 'open' ? "#e3f8ff" : "white"} 
            stroke={currentState === 'open' ? "#0c66e4" : "#e2e8f0"}
            strokeWidth="2"
          />
          <text x="270" y="190" textAnchor="middle" fontSize="14" fontWeight="500">Open</text>
          
          {/* In Progress state */}
          <rect 
            x="390" 
            y="160" 
            width="100" 
            height="60" 
            rx="8" 
            fill={currentState === 'in_progress' ? "#fff7e6" : "white"} 
            stroke={currentState === 'in_progress' ? "#ff8b00" : "#e2e8f0"}
            strokeWidth="2"
          />
          <text x="440" y="190" textAnchor="middle" fontSize="14" fontWeight="500">In Progress</text>
          
          {/* Waiting states */}
          <rect 
            x="390" 
            y="60" 
            width="100" 
            height="60" 
            rx="8" 
            fill={currentState === 'waiting_for_customer' ? "#ffe9d9" : "white"} 
            stroke={currentState === 'waiting_for_customer' ? "#f35627" : "#e2e8f0"}
            strokeWidth="2"
          />
          <text x="440" y="85" textAnchor="middle" fontSize="14" fontWeight="500">Waiting for</text>
          <text x="440" y="105" textAnchor="middle" fontSize="14" fontWeight="500">Customer</text>
          
          <rect 
            x="390" 
            y="260" 
            width="100" 
            height="60" 
            rx="8" 
            fill={currentState === 'waiting_for_third_party' ? "#f3e8ff" : "white"} 
            stroke={currentState === 'waiting_for_third_party' ? "#8250df" : "#e2e8f0"}
            strokeWidth="2"
          />
          <text x="440" y="285" textAnchor="middle" fontSize="14" fontWeight="500">Waiting for</text>
          <text x="440" y="305" textAnchor="middle" fontSize="14" fontWeight="500">Third Party</text>
          
          {/* Resolved state */}
          <rect 
            x="560" 
            y="160" 
            width="100" 
            height="60" 
            rx="8" 
            fill={currentState === 'resolved' ? "#dcf3e3" : "white"} 
            stroke={currentState === 'resolved' ? "#0a7d33" : "#e2e8f0"}
            strokeWidth="2"
          />
          <text x="610" y="190" textAnchor="middle" fontSize="14" fontWeight="500">Resolved</text>
          
          {/* Closed state */}
          <rect 
            x="730" 
            y="160" 
            width="100" 
            height="60" 
            rx="8" 
            fill={currentState === 'closed' ? "#eaecf0" : "white"} 
            stroke={currentState === 'closed' ? "#505f79" : "#e2e8f0"}
            strokeWidth="2"
          />
          <text x="780" y="190" textAnchor="middle" fontSize="14" fontWeight="500">Closed</text>
        </g>
        
        {/* Transition arrows */}
        <g>
          {/* New to Open */}
          <line x1="150" y1="190" x2="220" y2="190" stroke="#e2e8f0" strokeWidth="2" />
          <polygon points="215,185 220,190 215,195" fill="#e2e8f0" />
          
          {/* Open to In Progress */}
          <line x1="320" y1="190" x2="390" y2="190" stroke="#e2e8f0" strokeWidth="2" />
          <polygon points="385,185 390,190 385,195" fill="#e2e8f0" />
          
          {/* In Progress to Waiting for Customer */}
          <line x1="440" y1="160" x2="440" y2="120" stroke="#e2e8f0" strokeWidth="2" />
          <polygon points="435,125 440,120 445,125" fill="#e2e8f0" />
          
          {/* Waiting for Customer to In Progress */}
          <line x1="430" y1="120" x2="430" y2="160" stroke="#e2e8f0" strokeWidth="2" />
          <polygon points="425,155 430,160 435,155" fill="#e2e8f0" />
          
          {/* In Progress to Waiting for Third Party */}
          <line x1="440" y1="220" x2="440" y2="260" stroke="#e2e8f0" strokeWidth="2" />
          <polygon points="435,255 440,260 445,255" fill="#e2e8f0" />
          
          {/* Waiting for Third Party to In Progress */}
          <line x1="430" y1="260" x2="430" y2="220" stroke="#e2e8f0" strokeWidth="2" />
          <polygon points="425,225 430,220 435,225" fill="#e2e8f0" />
          
          {/* In Progress to Resolved */}
          <line x1="490" y1="190" x2="560" y2="190" stroke="#e2e8f0" strokeWidth="2" />
          <polygon points="555,185 560,190 555,195" fill="#e2e8f0" />
          
          {/* Resolved to In Progress (reopened) */}
          <path d="M 560,180 Q 525,150 490,180" stroke="#e2e8f0" strokeWidth="2" fill="transparent" />
          <polygon points="495,175 490,180 495,185" fill="#e2e8f0" />
          
          {/* Waiting for Customer to Resolved */}
          <path d="M 490,90 Q 540,90 580,160" stroke="#e2e8f0" strokeWidth="2" fill="transparent" />
          <polygon points="575,155 580,160 585,155" fill="#e2e8f0" />
          
          {/* Waiting for Third Party to Resolved */}
          <path d="M 490,290 Q 540,290 580,220" stroke="#e2e8f0" strokeWidth="2" fill="transparent" />
          <polygon points="575,225 580,220 585,225" fill="#e2e8f0" />
          
          {/* Resolved to Closed */}
          <line x1="660" y1="190" x2="730" y2="190" stroke="#e2e8f0" strokeWidth="2" />
          <polygon points="725,185 730,190 725,195" fill="#e2e8f0" />
          
          {/* Direct paths to Closed */}
          <path d="M 150,150 Q 450,30 730,150" stroke="#e2e8f0" strokeWidth="2" fill="transparent" />
          <polygon points="725,155 730,150 725,145" fill="#e2e8f0" />
          
          <path d="M 320,150 Q 450,50 730,150" stroke="#e2e8f0" strokeWidth="2" fill="transparent" />
          <polygon points="725,155 730,150 725,145" fill="#e2e8f0" />
          
          <path d="M 490,160 Q 600,100 730,160" stroke="#e2e8f0" strokeWidth="2" fill="transparent" />
          <polygon points="725,165 730,160 725,155" fill="#e2e8f0" />
        </g>
        
        {/* Current state highlight */}
        <g>
          <circle 
            cx={currentState === 'new' ? 100 : 
                currentState === 'open' ? 270 : 
                currentState === 'in_progress' ? 440 : 
                currentState === 'waiting_for_customer' ? 440 : 
                currentState === 'waiting_for_third_party' ? 440 : 
                currentState === 'resolved' ? 610 : 780}
            cy={currentState === 'waiting_for_customer' ? 90 : 
                currentState === 'waiting_for_third_party' ? 290 : 190}
            r="5"
            fill="red"
          />
        </g>
        
        {/* Legend */}
        <g transform="translate(50, 340)">
          <text fontSize="12" fontWeight="500">Current State:</text>
          <circle cx="100" cy="0" r="5" fill="red" />
        </g>
      </svg>
    </div>
  );
};