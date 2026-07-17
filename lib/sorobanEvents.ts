/**
 * Soroban Event Listener Service
 * 
 * Subscribes to SplitPay contract events emitted on the Stellar network
 * instead of polling Horizon for payment status updates.
 */

import { SubscriptionResponse } from 'stellar-sdk';

export interface PaymentEvent {
  type: 'payment_confirmed' | 'payment_failed' | 'payment_initiated';
  participant: string;
  amount: string;
  timestamp: number;
  transactionHash: string;
  status: 'paid' | 'pending' | 'failed';
}

export interface SorobanEventListener {
  splitId: string;
  contractAddress: string;
  onPaymentUpdate: (event: PaymentEvent) => void;
  onError?: (error: Error) => void;
}

/**
 * Creates a Soroban event subscription for a specific split
 */
export class SorobanEventSubscriber {
  private subscriptions: Map<string, SubscriptionResponse> = new Map();
  private eventQueue: Map<string, PaymentEvent[]> = new Map();

  /**
   * Subscribe to payment events for a specific split contract
   * 
   * @param listener - Configuration with splitId, contractAddress, and callbacks
   * @returns Unsubscribe function
   */
  subscribe(listener: SorobanEventListener): () => void {
    const { splitId, contractAddress, onPaymentUpdate, onError } = listener;

    // Initialize event queue for this split
    if (!this.eventQueue.has(splitId)) {
      this.eventQueue.set(splitId, []);
    }

    // Start listening to Soroban events via JSON-RPC websocket
    this.connectToSorobanEvents(splitId, contractAddress, onPaymentUpdate, onError);

    // Return unsubscribe function
    return () => {
      this.unsubscribe(splitId);
    };
  }

  /**
   * Connect to Soroban event stream and parse payment events
   */
  private connectToSorobanEvents(
    splitId: string,
    contractAddress: string,
    onPaymentUpdate: (event: PaymentEvent) => void,
    onError?: (error: Error) => void
  ): void {
    try {
      // In a real implementation, this would connect to a Soroban RPC endpoint
      // For now, we provide the infrastructure for when Soroban events are available
      
      const eventSubscription = this.createEventSubscription(
        splitId,
        contractAddress,
        onPaymentUpdate,
        onError
      );

      this.subscriptions.set(splitId, eventSubscription);
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Unknown error');
      onError?.(err);
    }
  }

  /**
   * Create a mock event subscription (to be replaced with actual Soroban RPC)
   */
  private createEventSubscription(
    splitId: string,
    contractAddress: string,
    onPaymentUpdate: (event: PaymentEvent) => void,
    onError?: (error: Error) => void
  ): SubscriptionResponse {
    // This is a placeholder that implements the structure
    // In production, this would connect to Soroban JSON-RPC websocket
    return {
      close: () => this.unsubscribe(splitId),
    } as SubscriptionResponse;
  }

  /**
   * Process incoming Soroban event and emit payment update
   */
  processEvent(splitId: string, rawEvent: any): void {
    try {
      const event = this.parseContractEvent(rawEvent);
      const queue = this.eventQueue.get(splitId) || [];
      queue.push(event);
      this.eventQueue.set(splitId, queue);
    } catch (error) {
      console.error('Failed to process Soroban event:', error);
    }
  }

  /**
   * Parse raw Soroban contract event into PaymentEvent
   */
  private parseContractEvent(rawEvent: any): PaymentEvent {
    return {
      type: rawEvent.type || 'payment_confirmed',
      participant: rawEvent.from || '',
      amount: rawEvent.amount || '0',
      timestamp: rawEvent.timestamp || Date.now(),
      transactionHash: rawEvent.txnHash || '',
      status: rawEvent.status || 'pending',
    };
  }

  /**
   * Unsubscribe from events for a specific split
   */
  unsubscribe(splitId: string): void {
    const subscription = this.subscriptions.get(splitId);
    if (subscription) {
      subscription.close();
      this.subscriptions.delete(splitId);
      this.eventQueue.delete(splitId);
    }
  }

  /**
   * Get pending events for a split
   */
  getPendingEvents(splitId: string): PaymentEvent[] {
    return this.eventQueue.get(splitId) || [];
  }

  /**
   * Clear all subscriptions
   */
  unsubscribeAll(): void {
    this.subscriptions.forEach((subscription) => {
      subscription.close();
    });
    this.subscriptions.clear();
    this.eventQueue.clear();
  }
}

// Singleton instance
export const sorobanEventSubscriber = new SorobanEventSubscriber();
