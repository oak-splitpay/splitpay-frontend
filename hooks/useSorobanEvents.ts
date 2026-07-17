/**
 * React Hook for Soroban Event Subscriptions
 * 
 * Manages subscription lifecycle and provides real-time payment updates
 */

import { useEffect, useCallback, useRef } from 'react';
import { 
  sorobanEventSubscriber, 
  PaymentEvent, 
  SorobanEventListener 
} from '@/lib/sorobanEvents';

export interface UseSorobanEventsOptions {
  splitId: string;
  contractAddress: string;
  onPaymentUpdate: (event: PaymentEvent) => void;
  onError?: (error: Error) => void;
  enabled?: boolean;
}

/**
 * Hook for subscribing to Soroban payment events
 * 
 * Automatically handles subscription cleanup on unmount
 */
export function useSorobanEvents({
  splitId,
  contractAddress,
  onPaymentUpdate,
  onError,
  enabled = true,
}: UseSorobanEventsOptions): void {
  const unsubscribeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    try {
      // Subscribe to events
      const listener: SorobanEventListener = {
        splitId,
        contractAddress,
        onPaymentUpdate,
        onError,
      };

      unsubscribeRef.current = sorobanEventSubscriber.subscribe(listener);

      // Cleanup on unmount
      return () => {
        unsubscribeRef.current?.();
      };
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Unknown error');
      onError?.(err);
    }
  }, [splitId, contractAddress, onPaymentUpdate, onError, enabled]);
}

/**
 * Hook to manually trigger event polling (fallback mechanism)
 * 
 * Returns a function to check for pending events
 */
export function usePendingEvents(splitId: string) {
  return useCallback(() => {
    return sorobanEventSubscriber.getPendingEvents(splitId);
  }, [splitId]);
}

/**
 * Hook to stop listening to all events
 * 
 * Can be called on page unmount or when navigating away
 */
export function useUnsubscribeAll() {
  return useCallback(() => {
    sorobanEventSubscriber.unsubscribeAll();
  }, []);
}
