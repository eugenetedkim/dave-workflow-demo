// File: src/services/ticket-transition.service.ts

import {
  TicketState,
  NewTicketState,
  OpenTicketState,
  InProgressTicketState,
  WaitingForCustomerState,
  WaitingForThirdPartyState,
  ResolvedTicketState,
  ClosedTicketState,
  AllowedNextStates,
  isNewTicket,
  isOpenTicket,
  isInProgressTicket,
  isWaitingForCustomer,
  isWaitingForThirdParty,
  isResolvedTicket,
  TicketNote
} from '../types/ticket-states';

/**
 * Service for handling type-safe ticket state transitions
 */
export class TicketTransitionService {
  /**
   * Transition from New to Open state
   */
  transitionToOpen(ticket: NewTicketState, agentId: string): OpenTicketState {
    if (!isNewTicket(ticket)) {
      throw new Error(`Cannot transition to Open: Ticket ${(ticket as any).id} is not in New state`);
    }

    const now = new Date();
    const responseDeadline = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hour SLA

    return {
      ...ticket,
      state: 'open',
      assignedTo: agentId,
      assignedAt: now,
      responseDeadline,
      updatedAt: now
    };
  }

  /**
   * Transition from Open to In Progress state
   */
  transitionToInProgress(ticket: OpenTicketState): InProgressTicketState {
    if (!isOpenTicket(ticket)) {
      throw new Error(`Cannot transition to In Progress: Ticket ${(ticket as any).id} is not in Open state`);
    }

    const now = new Date();

    return {
      ...ticket,
      state: 'in_progress',
      lastCustomerContact: now,
      notes: [],
      updatedAt: now
    };
  }

  /**
   * Transition to Waiting For Customer state
   */
  transitionToWaitingForCustomer(
    ticket: InProgressTicketState,
    note: string
  ): WaitingForCustomerState {
    if (!isInProgressTicket(ticket)) {
      throw new Error(`Cannot transition to Waiting For Customer: Ticket ${(ticket as any).id} is not in In Progress state`);
    }

    const now = new Date();
    const followUp = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000); // 2 day follow-up

    const ticketNote: TicketNote = {
      id: `note-${Date.now()}`,
      authorId: ticket.assignedTo,
      authorType: 'agent',
      content: note,
      createdAt: now,
      isInternal: false
    };

    return {
      ...ticket,
      state: 'waiting_for_customer',
      lastAgentResponse: now,
      customerContactAttempts: 1,
      followUpScheduled: followUp,
      notes: [...ticket.notes, ticketNote],
      updatedAt: now
    };
  }

  /**
   * Transition to Waiting For Third Party state
   */
  transitionToWaitingForThirdParty(
    ticket: InProgressTicketState,
    thirdPartyName: string,
    expectedResponseDate?: Date
  ): WaitingForThirdPartyState {
    if (!isInProgressTicket(ticket)) {
      throw new Error(`Cannot transition to Waiting For Third Party: Ticket ${(ticket as any).id} is not in In Progress state`);
    }

    const now = new Date();

    const ticketNote: TicketNote = {
      id: `note-${Date.now()}`,
      authorId: ticket.assignedTo,
      authorType: 'agent',
      content: `Waiting for response from ${thirdPartyName}`,
      createdAt: now,
      isInternal: true
    };

    return {
      ...ticket,
      state: 'waiting_for_third_party',
      thirdPartyName,
      contactedAt: now,
      expectedResponseDate,
      notes: [...ticket.notes, ticketNote],
      updatedAt: now
    };
  }

  /**
   * Transition to Resolved state
   */
  transitionToResolved(
    ticket: InProgressTicketState | WaitingForCustomerState | WaitingForThirdPartyState,
    resolution: string
  ): ResolvedTicketState {
    if (!isInProgressTicket(ticket) && !isWaitingForCustomer(ticket) && !isWaitingForThirdParty(ticket)) {
      throw new Error(`Cannot transition to Resolved: Invalid current state`);
    }

    const now = new Date();
    const confirmationDeadline = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000); // 3 day wait

    // Use type assertion since we've already validated with if check
    const notes = 'notes' in ticket ? ticket.notes : [];

    const ticketNote: TicketNote = {
      id: `note-${Date.now()}`,
      authorId: ticket.assignedTo,
      authorType: 'agent',
      content: `Resolution: ${resolution}`,
      createdAt: now,
      isInternal: false
    };

    return {
      ...ticket,
      state: 'resolved',
      resolution,
      resolvedAt: now,
      pendingConfirmationUntil: confirmationDeadline,
      notes: [...notes, ticketNote],
      updatedAt: now
    };
  }

  /**
   * Transition to Closed state
   */
  transitionToClosed(
    ticket: ResolvedTicketState,
    satisfactionScore?: number,
    feedback?: string
  ): ClosedTicketState {
    if (!isResolvedTicket(ticket)) {
      throw new Error(`Cannot transition to Closed: Ticket ${(ticket as any).id} is not in Resolved state`);
    }

    const now = new Date();

    return {
      ...ticket,
      state: 'closed',
      closedAt: now,
      satisfactionScore,
      feedback,
      updatedAt: now
    };
  }

  /**
   * Generic state transition function that ensures type safety
   * This showcases how TypeScript's type system can enforce business rules
   */
  transition<CurrentState extends TicketState['state'], NextState extends AllowedNextStates<CurrentState>>(
    ticket: Extract<TicketState, { state: CurrentState }>,
    nextState: NextState,
    transitionData: any
  ): Extract<TicketState, { state: NextState }> {
    switch (nextState) {
      case 'open':
        return this.transitionToOpen(ticket as NewTicketState, transitionData.agentId) as any;
      case 'in_progress':
        return this.transitionToInProgress(ticket as OpenTicketState) as any;
      case 'waiting_for_customer':
        return this.transitionToWaitingForCustomer(
          ticket as InProgressTicketState,
          transitionData.note
        ) as any;
      case 'waiting_for_third_party':
        return this.transitionToWaitingForThirdParty(
          ticket as InProgressTicketState,
          transitionData.thirdPartyName,
          transitionData.expectedResponseDate
        ) as any;
      case 'resolved':
        return this.transitionToResolved(
          ticket as InProgressTicketState | WaitingForCustomerState | WaitingForThirdPartyState,
          transitionData.resolution
        ) as any;
      case 'closed':
        return this.transitionToClosed(
          ticket as ResolvedTicketState,
          transitionData.satisfactionScore,
          transitionData.feedback
        ) as any;
      default:
        // This should be unreachable due to the type constraints
        throw new Error(`Invalid state transition from ${ticket.state} to ${nextState}`);
    }
  }
}