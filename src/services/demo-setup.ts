// File: src/services/demo-setup.ts
// This file would typically not exist in a real app,
// but is used to provide mock data for the demo

import { 
  TicketState, 
  NewTicketState,
  TicketSource,
  TicketCategory,
  TicketPriority 
} from '../types/ticket-states';

// Create a new ticket for demo purposes
export const createDemoTicket = (
  customSource?: TicketSource,
  customCategory?: TicketCategory,
  customPriority?: TicketPriority
): NewTicketState => {
  // Demo ticket data
  return {
    id: `T-${Math.floor(1000 + Math.random() * 9000)}`,
    customerId: 'C-5001',
    subject: 'Unable to access Dave app',
    description: 'I\'m trying to log in but keep getting an authentication error message. I\'ve tried resetting my password multiple times but still can\'t get in.',
    category: customCategory || 'account_access',
    priority: customPriority || 'high',
    state: 'new',
    source: customSource || 'app',
    createdAt: new Date(),
    updatedAt: new Date(),
    autoClassificationConfidence: 0.92
  };
};

// Create demo agents for assigning tickets
export const getDemoAgents = () => [
  { id: 'A-1001', name: 'Alex Rivera', status: 'available' },
  { id: 'A-1002', name: 'Taylor Chen', status: 'busy' },
  { id: 'A-1003', name: 'Jordan Patel', status: 'available' }
];

// Get sample resolutions for various ticket types
export const getSampleResolutions = (category: TicketCategory): string[] => {
  const resolutions: Record<TicketCategory, string[]> = {
    'account_access': [
      'Guided customer through password reset process',
      'Resolved account lockout due to too many failed login attempts',
      'Fixed email verification issue that was preventing login'
    ],
    'advance_request': [
      'Approved advance request for $75',
      'Explained advance eligibility requirements',
      'Scheduled advance for customer\'s next payday'
    ],
    'banking_issue': [
      'Resolved connection issue with customer\'s linked bank account',
      'Updated customer\'s routing information',
      'Fixed transaction posting delay'
    ],
    'payment_problem': [
      'Processed manual payment to clear customer\'s balance',
      'Set up automatic payment schedule',
      'Waived late fee due to system error'
    ],
    'side_hustle': [
      'Explained Side Hustle application process',
      'Resolved payment issue with gig provider',
      'Updated customer\'s gig preferences'
    ],
    'technical_error': [
      'Cleared app cache to resolve display issue',
      'Guided customer through app reinstallation process',
      'Fixed account sync issue between web and mobile'
    ],
    'other': [
      'Addressed customer\'s feedback about app features',
      'Provided information on upcoming product changes',
      'Resolved miscellaneous account question'
    ]
  };
  
  return resolutions[category] || resolutions.other;
};

// Get common third parties we might be waiting on
export const getCommonThirdParties = (): string[] => [
  'Customer\'s Bank',
  'Payroll Provider',
  'Credit Bureau',
  'Payment Processor',
  'Side Hustle Partner'
];