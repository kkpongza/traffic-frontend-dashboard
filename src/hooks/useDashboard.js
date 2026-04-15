import { useState, useEffect, useRef } from 'react';

const API_URL = import.meta.env.VITE_API_URL;

export function useDashboard(isAuthenticated) {
  const [status, setStatus] = useState(null);
  const [connectionState, setConnectionState] = useState('disconnected'); // 'disconnected' | 'connecting' | 'connected' | 'error'
  const sourceRef = useRef(null);

  useEffect(() => {
    if (!isAuthenticated) return;

    // 1. Fetch initial snapshot
    async function fetchSnapshot() {
      try {
        const res = await fetch(`${API_URL}/dashboard/status`, {
          credentials: 'include',
        });
        if (!res.ok) return;
        const { data } = await res.json();
        setStatus(data);
      } catch {
        // snapshot failed — SSE will catch up
      }
    }

    fetchSnapshot();

    // 2. Open SSE stream
    setConnectionState('connecting');
    const source = new EventSource(`${API_URL}/dashboard/stream`, {
      withCredentials: true,
    });
    sourceRef.current = source;

    source.onopen = () => setConnectionState('connected');

    source.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        setStatus(data);
        setConnectionState('connected');
      } catch {
        // ignore malformed events
      }
    };

    source.onerror = () => {
      setConnectionState('error');
    };

    return () => {
      source.close();
      setConnectionState('disconnected');
    };
  }, [isAuthenticated]);

  return { status, connectionState };
}
