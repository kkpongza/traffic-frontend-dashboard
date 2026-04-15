import React from 'react';
import { useDashboard } from '../hooks/useDashboard';
import PhaseInfo from '../components/PhaseInfo';
import DecisionReason from '../components/DecisionReason';

const styles = {
  page: {
    minHeight: '100vh',
    background: '#0a0a0a',
    padding: '24px 32px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '1px solid #2a2a2a',
    paddingBottom: '16px',
  },
  title: {
    fontSize: '1.5rem',
    color: '#ffffff',
  },
  statusBadge: (state) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 16px',
    borderRadius: '999px',
    fontSize: '1rem',
    border: '1px solid',
    ...(state === 'connected'
      ? { background: '#14532d', borderColor: '#16a34a', color: '#86efac' }
      : state === 'error'
      ? { background: '#450a0a', borderColor: '#ef4444', color: '#fca5a5' }
      : { background: '#1f1f1f', borderColor: '#2a2a2a', color: '#888888' }),
  }),
  dot: (state) => ({
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background:
      state === 'connected' ? '#22c55e' : state === 'error' ? '#ef4444' : '#888888',
  }),
  sectionTitle: {
    fontSize: '1.25rem',
    color: '#888888',
  },
  logoutBtn: {
    background: 'transparent',
    border: '1px solid #2a2a2a',
    borderRadius: '8px',
    padding: '8px 16px',
    fontSize: '1rem',
    color: '#888888',
    cursor: 'pointer',
  },
};

const CONNECTION_LABEL = {
  connected: 'เชื่อมต่อแล้ว',
  connecting: 'กำลังเชื่อมต่อ...',
  error: 'การเชื่อมต่อมีปัญหา',
  disconnected: 'ยังไม่ได้เชื่อมต่อ',
};

const PHASES = [
  { phase: 'N_GO', dir: 'N', label: 'เหนือ' },
  { phase: 'S_GO', dir: 'S', label: 'ใต้' },
  { phase: 'E_GO', dir: 'E', label: 'ตะวันออก' },
  { phase: 'W_GO', dir: 'W', label: 'ตะวันตก' },
];

function PhaseTabs({ currentPhase, laneTotals }) {
  return (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      {PHASES.map(({ phase, dir, label }) => {
        const isActive = currentPhase === phase;
        const count = laneTotals?.[dir] ?? '–';
        return (
          <div
            key={phase}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              borderRadius: '999px',
              fontSize: '0.85rem',
              border: '1px solid',
              background: isActive ? '#166534' : '#1f1f1f',
              borderColor: isActive ? '#16a34a' : '#2a2a2a',
              color: isActive ? '#86efac' : '#888888',
            }}
          >
            <span style={{ fontWeight: 'bold', color: isActive ? '#ffffff' : '#888888' }}>{dir}</span>
            <span>{label}</span>
            <span
              style={{
                background: isActive ? '#14532d' : '#141414',
                borderRadius: '999px',
                padding: '1px 8px',
                fontSize: '0.8rem',
                color: isActive ? '#86efac' : '#444444',
                fontWeight: 'bold',
              }}
            >
              {count} คัน
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default function DashboardPage({ onLogout }) {
  const { status, connectionState } = useDashboard(true);

  const laneTotals = status?.lastDecision?.meta?.laneTotals;

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <h2 style={styles.title}>Smart Traffic Dashboard — {status?.intersectionId ?? '...'}</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={styles.statusBadge(connectionState)}>
            <div style={styles.dot(connectionState)} />
            {CONNECTION_LABEL[connectionState]}
          </div>
          <button style={styles.logoutBtn} onClick={onLogout}>
            ออกจากระบบ
          </button>
        </div>
      </div>

      {/* Section 1: Current Phase + Countdown */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', flexWrap: 'wrap' }}>
          <span style={styles.sectionTitle}>สถานะปัจจุบัน</span>
          <PhaseTabs currentPhase={status?.currentPhase} laneTotals={laneTotals} />
        </div>
        {status ? (
          <PhaseInfo status={status} />
        ) : (
          <div style={{ color: '#444444', fontSize: '1.25rem' }}>กำลังโหลดข้อมูล...</div>
        )}
      </section>

      {/* Section 3: Decision Reason */}
      <section>
        <div style={styles.sectionTitle}>เหตุผลการตัดสินใจ</div>
        <DecisionReason
          lastDecision={status?.lastDecision}
          greenTimeSec={status?.greenTimeSec}
        />
      </section>
    </div>
  );
}
