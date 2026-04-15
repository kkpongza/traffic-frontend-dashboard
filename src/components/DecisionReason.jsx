import React from 'react';
import { PHASE_LABEL } from '../constants/phases';

const styles = {
  card: {
    background: '#141414',
    border: '1px solid #2a2a2a',
    borderRadius: '16px',
    padding: '28px',
  },
  title: {
    fontSize: '1.5rem',
    color: '#ffffff',
    marginBottom: '20px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '16px',
  },
  row: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  rowLabel: {
    fontSize: '1rem',
    color: '#888888',
  },
  rowValue: {
    fontSize: '1.5rem',
    color: '#ffffff',
    fontWeight: 'bold',
  },
  formula: {
    marginTop: '16px',
    background: '#0a0a0a',
    borderRadius: '10px',
    padding: '14px 18px',
    fontSize: '1.1rem',
    color: '#888888',
  },
  formulaValue: {
    color: '#22c55e',
    fontWeight: 'bold',
  },
  warningBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    background: '#7c2d12',
    border: '1px solid #ea580c',
    borderRadius: '8px',
    padding: '8px 16px',
    fontSize: '1rem',
    color: '#fed7aa',
    marginTop: '16px',
  },
};

export default function DecisionReason({ lastDecision, greenTimeSec }) {
  if (!lastDecision) {
    return (
      <div style={styles.card}>
        <h3 style={styles.title}>เหตุผลการตัดสินใจ</h3>
        <p style={{ color: '#444444' }}>ยังไม่มีข้อมูล</p>
      </div>
    );
  }

  const { meta, strategy } = lastDecision;
  const fromLabel = PHASE_LABEL[meta?.from] ?? meta?.from ?? '–';
  const formula = meta?.perCarRate != null && meta?.actualCars != null
    ? `3 + (${meta.perCarRate} × ${meta.actualCars}) = ${greenTimeSec ?? lastDecision.greenTimeSec} วินาที`
    : '–';

  return (
    <div style={styles.card}>
      <h3 style={styles.title}>เหตุผลการตัดสินใจ</h3>

      {meta?.fallback && (
        <div style={styles.warningBadge}>
          ⚠ ไม่มีข้อมูลกล้อง — ใช้ค่า default
        </div>
      )}

      <div style={{ ...styles.grid, marginTop: meta?.fallback ? '16px' : '0' }}>
        <div style={styles.row}>
          <span style={styles.rowLabel}>รถในทิศนี้</span>
          <span style={styles.rowValue}>{meta?.actualCars ?? '–'} คัน</span>
        </div>
        <div style={styles.row}>
          <span style={styles.rowLabel}>เวลาไฟเขียว</span>
          <span style={styles.rowValue}>{greenTimeSec ?? lastDecision.greenTimeSec ?? '–'} วินาที</span>
        </div>
        <div style={styles.row}>
          <span style={styles.rowLabel}>มาจากเฟส</span>
          <span style={styles.rowValue}>{fromLabel}</span>
        </div>
        <div style={styles.row}>
          <span style={styles.rowLabel}>กลยุทธ์</span>
          <span style={{ ...styles.rowValue, fontSize: '1.1rem', color: '#888888' }}>
            {strategy ?? '–'}
          </span>
        </div>
        <div style={styles.row}>
          <span style={styles.rowLabel}>จำนวน samples</span>
          <span style={styles.rowValue}>{meta?.sampleCount ?? '–'}</span>
        </div>
      </div>

      <div style={styles.formula}>
        <span style={{ color: '#888888' }}>สูตร: </span>
        <span style={styles.formulaValue}>{formula}</span>
      </div>
    </div>
  );
}
