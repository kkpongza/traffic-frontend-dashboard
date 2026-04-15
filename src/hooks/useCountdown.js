import { useState, useEffect } from 'react';
import { YELLOW_SEC, ALL_RED_SEC } from '../constants/phases';

export function useCountdown(status) {
  const [remainingMs, setRemainingMs] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!status?.phaseStartedAt || !status?.greenTimeSec) return;
      const elapsed = Date.now() - new Date(status.phaseStartedAt).getTime();
      const totalMs = (status.greenTimeSec + YELLOW_SEC + ALL_RED_SEC) * 1000;
      setRemainingMs(Math.max(0, totalMs - elapsed));
    }, 500);
    return () => clearInterval(interval);
  }, [status]);

  const totalSec = status?.greenTimeSec
    ? status.greenTimeSec + YELLOW_SEC + ALL_RED_SEC
    : 0;
  const remainingSec = Math.ceil(remainingMs / 1000);

  // Determine signal phase: green → yellow → red (all-red)
  let signalPhase = 'green';
  if (remainingSec <= ALL_RED_SEC) {
    signalPhase = 'allred';
  } else if (remainingSec <= ALL_RED_SEC + YELLOW_SEC) {
    signalPhase = 'yellow';
  }

  return { remainingMs, remainingSec, totalSec, signalPhase };
}
