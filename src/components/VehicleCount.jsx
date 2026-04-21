import React from 'react';
import { motion } from 'motion/react';

const DIRECTIONS = [
  { dir: 'N', label: 'NORTH' },
  { dir: 'S', label: 'SOUTH' },
  { dir: 'E', label: 'EAST' },
  { dir: 'W', label: 'WEST' },
];

export default function VehicleCount({ cameraData, currentPhase }) {
  if (!cameraData) {
    return (
      <div style={styles.wrapper}>
        <div style={styles.title}>VEHICLE COUNT BY LANE</div>
        <div style={{ color: '#444444', fontSize: '1.1rem' }}>กำลังรอข้อมูลกล้อง...</div>
      </div>
    );
  }

  const { lanes = [], directionTotals = {} } = cameraData;

  // Find max count across all lanes for scaling bars
  const maxCount = Math.max(1, ...lanes.map((l) => l.count));

  // Active direction from currentPhase e.g. "N_GO" → "N"
  const activeDir = currentPhase?.replace('_GO', '');

  return (
    <div style={styles.wrapper}>
      <div style={styles.title}>VEHICLE COUNT BY LANE</div>
      <div style={styles.grid}>
        {DIRECTIONS.map(({ dir, label }) => {
          const isActive = dir === activeDir;
          const dirLanes = lanes
            .filter((l) => l.direction === dir)
            .sort((a, b) => a.laneId.localeCompare(b.laneId));
          const total = directionTotals[dir] ?? 0;

          return (
            <div key={dir} style={styles.card(isActive)}>
              {/* Card Header */}
              <div style={styles.cardHeader}>
                <div style={styles.headerLeft}>
                  <div style={styles.dot(isActive)} />
                  <span style={styles.dirLabel}>{label}</span>
                </div>
                <div style={styles.totalBadge(isActive)}>
                  <CarIcon color={isActive ? '#22c55e' : '#ef4444'} />
                  <span style={styles.totalCount(isActive)}>{total}</span>
                </div>
              </div>

              {/* Lane Bars */}
              <div style={styles.laneList}>
                {dirLanes.length === 0 ? (
                  <div style={{ color: '#444444', fontSize: '0.9rem' }}>ไม่มีข้อมูล</div>
                ) : (
                  dirLanes.map((lane, i) => {
                    const pct = maxCount > 0 ? (lane.count / maxCount) * 100 : 0;
                    return (
                      <div key={lane.laneId} style={styles.laneRow}>
                        <span style={styles.laneLabel}>Lane {i + 1}</span>
                        <div style={styles.barTrack}>
                          <motion.div
                            style={styles.barFill(isActive)}
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.4, ease: 'easeOut' }}
                          />
                          <span style={styles.barCount}>{lane.count}</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CarIcon({ color }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 17H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h2" />
      <rect x="9" y="3" width="6" height="4" rx="1" />
      <path d="M19 17h2a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2" />
      <rect x="3" y="7" width="18" height="10" rx="2" />
      <circle cx="7.5" cy="17" r="1.5" />
      <circle cx="16.5" cy="17" r="1.5" />
    </svg>
  );
}

const styles = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  title: {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    color: '#ffffff',
    letterSpacing: '0.08em',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '12px',
  },
  card: (isActive) => ({
    background: isActive ? '#0d1f14' : '#141414',
    border: `1px solid ${isActive ? '#1a3a24' : '#2a2a2a'}`,
    borderRadius: '12px',
    padding: '16px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  }),
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  dot: (isActive) => ({
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    background: isActive ? '#22c55e' : '#ef4444',
    boxShadow: isActive ? '0 0 8px #22c55e' : '0 0 8px #ef4444',
    flexShrink: 0,
  }),
  dirLabel: {
    fontSize: '1rem',
    fontWeight: 'bold',
    color: '#ffffff',
    letterSpacing: '0.06em',
  },
  totalBadge: (isActive) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  }),
  totalCount: (isActive) => ({
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: isActive ? '#22c55e' : '#ef4444',
  }),
  laneList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  laneRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  laneLabel: {
    fontSize: '0.8rem',
    color: '#888888',
    width: '44px',
    flexShrink: 0,
  },
  barTrack: {
    flex: 1,
    height: '24px',
    background: '#0a0a0a',
    borderRadius: '4px',
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
  },
  barFill: (isActive) => ({
    position: 'absolute',
    left: 0,
    top: 0,
    height: '100%',
    background: isActive ? '#166534' : '#450a0a',
    borderRadius: '4px',
    minWidth: '4px',
  }),
  barCount: {
    position: 'relative',
    zIndex: 1,
    fontSize: '0.85rem',
    fontWeight: 'bold',
    color: '#ffffff',
    paddingLeft: '10px',
  },
};
