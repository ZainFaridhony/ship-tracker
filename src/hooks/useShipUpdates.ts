import { useEffect, useRef } from 'react';
import { Ship, ShipUpdateMessage } from '../types';

interface UseShipUpdatesOptions {
  token: string | null;
  onShips: (ships: Ship[]) => void;
  onError: (message: string) => void;
}

export const useShipUpdates = ({ token, onShips, onError }: UseShipUpdatesOptions) => {
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!token) {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
      return;
    }

    const url = (import.meta.env.VITE_WS_BASE_URL ?? 'ws://localhost:4000') + '/ws';
    console.info('Opening WebSocket for live ship updates at /ws');
    const ws = new WebSocket(url, token ? [token] : undefined);
    socketRef.current = ws;

    ws.onopen = () => {
      console.info('WebSocket connection established');
    };

    ws.onmessage = event => {
      try {
        const message = JSON.parse(event.data) as ShipUpdateMessage;
        if (message.type === 'ship_update') {
          if (!Array.isArray(message.ships)) {
            onError('Invalid ship data');
            return;
          }
          onShips(message.ships);
        } else if (message.type === 'error') {
          onError(message.details ?? message.error);
        }
      } catch (error) {
        onError(error instanceof Error ? error.message : 'Invalid ship data');
      }
    };

    ws.onerror = () => {
      onError('Unable to read ship updates');
    };

    ws.onclose = () => {
      console.info('WebSocket connection closed');
    };

    return () => {
      ws.close();
      socketRef.current = null;
    };
  }, [token, onShips, onError]);
};
