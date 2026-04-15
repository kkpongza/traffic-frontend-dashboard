import React from 'react';
import { DIRECTION_LABEL } from '../constants/phases';

const DIRS = ['N', 'S', 'E', 'W'];

const styles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '12px',
  },
  card: {
    background: '#141414',
    border: '1px solid #2a2a2a',
    borderRadius: '16px',
    padding: '20px',
    textAlign: 'center',
  },
  dir: {
    fontSize: '1rem',
    color: '#888888',
  },
  count: {
    fontSize: '2.5rem',
    color: '#ffffff',
    fontWeight: 'bold',
  },
  unit: {
    fontSize: '1rem',
    color: '#888888',
  },
};

export default function LaneTotals({ laneTotals }) {
  return (
    <div>
      <h3 style={{ marginBottom: '12px', color: '#888888', fontSize: '1.25rem' }}>
        จำนวนรถแต่ละทิศ
      </h3>
      <div style={styles.grid}>
        {DIRS.map((dir) => (
          <div key={dir} style={styles.card}>
            <div style={styles.dir}>{dir} — {DIRECTION_LABEL[dir]}</div>
            <div style={styles.count}>{laneTotals?.[dir] ?? '–'}</div>
            <div style={styles.unit}>คัน</div>
          </div>
        ))}
      </div>
    </div>
  );
}
