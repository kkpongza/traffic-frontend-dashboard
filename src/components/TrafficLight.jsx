import React from 'react';
import { ALL_PHASES, PHASE_LABEL, PHASE_DIRECTION, DIRECTION_LABEL } from '../constants/phases';

const styles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '16px',
  },
  card: (isActive) => ({
    background: isActive ? '#166534' : '#1f1f1f',
    border: `1px solid ${isActive ? '#16a34a' : '#2a2a2a'}`,
    borderRadius: '16px',
    padding: '28px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
  }),
  light: (isActive) => ({
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    background: isActive ? '#22c55e' : '#ef4444',
    boxShadow: isActive
      ? '0 0 24px #22c55e88'
      : '0 0 12px #ef444444',
  }),
  dirLabel: {
    fontSize: '1.5rem',
    color: '#ffffff',
    fontWeight: 'bold',
  },
  dirSub: {
    fontSize: '1.1rem',
    color: '#888888',
  },
  carCount: {
    fontSize: '2rem',
    color: '#ffffff',
    fontWeight: 'bold',
  },
  carLabel: {
    fontSize: '1rem',
    color: '#888888',
  },
};

export default function TrafficLight({ currentPhase, laneTotals }) {
  const activeDir = PHASE_DIRECTION[currentPhase];

  return (
    <div style={styles.grid}>
      {ALL_PHASES.map((phase) => {
        const dir = PHASE_DIRECTION[phase];
        const isActive = dir === activeDir;
        const count = laneTotals?.[dir] ?? '–';

        return (
          <div key={phase} style={styles.card(isActive)}>
            <div style={styles.light(isActive)} />
            <div>
              <div style={styles.dirLabel}>{dir}</div>
              <div style={styles.dirSub}>{DIRECTION_LABEL[dir]}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={styles.carCount}>{count}</div>
              <div style={styles.carLabel}>คัน</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
