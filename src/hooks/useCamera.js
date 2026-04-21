import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL;

export function useCamera(isAuthenticated) {
  const [cameraData, setCameraData] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) return;

    async function fetchSnapshot() {
      try {
        const res = await fetch(`${API_URL}/dashboard/camera`, {
          credentials: 'include',
        });
        if (!res.ok) return;
        const { data } = await res.json();
        if (data) setCameraData(data);
      } catch {
        // SSE will catch up
      }
    }

    fetchSnapshot();

    const source = new EventSource(`${API_URL}/dashboard/camera/stream`, {
      withCredentials: true,
    });

    source.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        if (data) setCameraData(data);
      } catch {
        // ignore malformed events
      }
    };

    return () => source.close();
  }, [isAuthenticated]);

  return { cameraData };
}
