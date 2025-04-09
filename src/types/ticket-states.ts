// File: src/types/ticket-states.ts

/**
 * Base interface for all ticket states
 */
export interface BaseTicketState {
  id: string;
  customerId: string;
  subject: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Types of support tickets
 */
export type TicketCategory = 
  | 'account_access'
  | 'advance_request'
  | 'banking_issue'
  | 'payment_problem'
  | 'side_hustle'
  | 'technical_error'
  | 'other';

/**
 * Priority levels for tickets
 */
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';

/**
 * Source of the support ticket
 */
export type TicketSource = 'chat' | 'email' | 'phone' | 'app' | 'ai_escalation';

// ==========================================================
// STATE-SPECIFIC INTERFACES
// ==========================================================
// Each state has its own interface with specific properties

/**
 * New ticket state
 * This is the initial state for all tickets
 */
export interface NewTicketState extends BaseTicketState {
  state: 'new';
  source: TicketSource;
  autoClassificationConfidence?: number; // AI classification confidence
}

/**
 * Open ticket state
 * Ticket has been acknowledged but work hasn't started
 */
export interface OpenTicketState extends BaseTicketState {
  state: 'open';
  source: TicketSource;
  assignedTo: string; // Agent ID
  assignedAt: Date;
  responseDeadline: Date; // SLA deadline
}

/**
 * In Progress ticket state
 * Active work is being done on the ticket
 */
export interface InProgressTicketState extends BaseTicketState {
  state: 'in_progress';
  assignedTo: string; // Agent ID
  assignedAt: Date;
  responseDeadline: Date;
  lastCustomerContact: Date;
  notes: TicketNote[];
}

/**
 * Waiting For Customer state
 * Awaiting customer response before proceeding
 */
export interface WaitingForCustomerState extends BaseTicketState {
  state: 'waiting_for_customer';
  assignedTo: string;
  lastAgentResponse: Date;
  customerContactAttempts: number;
  followUpScheduled?: Date;
  notes: TicketNote[];
}

/**
 * Waiting For Third-party state
 * Awaiting response from external partner
 */
export interface WaitingForThirdPartyState extends BaseTicketState {
  state: 'waiting_for_third_party';
  assignedTo: string;
  thirdPartyName: string;
  contactedAt: Date;
  expectedResponseDate?: Date;
  notes: TicketNote[];
}

/**
 * Resolved ticket state
 * Solution provided, awaiting confirmation
 */
export interface ResolvedTicketState extends BaseTicketState {
  state: 'resolved';
  assignedTo: string;
  resolution: string;
  resolvedAt: Date;
  pendingConfirmationUntil: Date;
  notes: TicketNote[];
}

/**
 * Closed ticket state
 * Ticket is completed and closed
 */
export interface ClosedTicketState extends BaseTicketState {
  state: 'closed';
  resolution: string;
  resolvedAt: Date;
  closedAt: Date;
  satisfactionScore?: number; // 1-5 rating
  feedback?: string;
}

/**
 * Notes attached to tickets
 */
export interface TicketNote {
  id: string;
  authorId: string;
  authorType: 'agent' | 'system' | 'customer';
  content: string;
  createdAt: Date;
  isInternal: boolean; // True for notes only visible to agents
}

// ==========================================================
// UNION TYPE FOR ALL POSSIBLE TICKET STATES
// ==========================================================
// This allows TypeScript to verify all state transitions are valid

export type TicketState = 
  | NewTicketState
  | OpenTicketState
  | InProgressTicketState
  | WaitingForCustomerState
  | WaitingForThirdPartyState
  | ResolvedTicketState
  | ClosedTicketState;

// ==========================================================
// TYPE GUARDS FOR STATE CHECKING
// ==========================================================
// These functions provide type safety when checking ticket states

export const isNewTicket = (ticket: TicketState): ticket is NewTicketState => 
  ticket.state === 'new';

export const isOpenTicket = (ticket: TicketState): ticket is OpenTicketState => 
  ticket.state === 'open';

export const isInProgressTicket = (ticket: TicketState): ticket is InProgressTicketState => 
  ticket.state === 'in_progress';

export const isWaitingForCustomer = (ticket: TicketState): ticket is WaitingForCustomerState => 
  ticket.state === 'waiting_for_customer';

export const isWaitingForThirdParty = (ticket: TicketState): ticket is WaitingForThirdPartyState => 
  ticket.state === 'waiting_for_third_party';

export const isResolvedTicket = (ticket: TicketState): ticket is ResolvedTicketState => 
  ticket.state === 'resolved';

export const isClosedTicket = (ticket: TicketState): ticket is ClosedTicketState => 
  ticket.state === 'closed';

// ==========================================================
// STATE TRANSITION UTILITY TYPES
// ==========================================================
// These enforce valid state transitions at compile time

/**
 * Maps each state to allowed next states
 * This enforces valid workflow transitions at the type level
 */
export type AllowedStateTransitions = {
  'new': 'open' | 'closed';
  'open': 'in_progress' | 'closed';
  'in_progress': 'waiting_for_customer' | 'waiting_for_third_party' | 'resolved' | 'closed';
  'waiting_for_customer': 'in_progress' | 'resolved' | 'closed';
  'waiting_for_third_party': 'in_progress' | 'resolved' | 'closed';
  'resolved': 'in_progress' | 'closed';
  'closed': never; // Cannot transition from closed
};

/**
 * Gets the type of a specific state
 */
export type TicketStateType<S extends TicketState['state']> = Extract<TicketState, { state: S }>;

/**
 * Gets allowed next states for a given state
 */
export type AllowedNextStates<S extends TicketState['state']> = AllowedStateTransitions[S];

/**
 * Type that enforces a valid state transition
 */
export type ValidStateTransition <
  From extends TicketState['state'],
  To extends AllowedNextStates<From>
> = {
  from: TicketStateType<From>;
  to: TicketStateType<To>;
};