import React from 'react';
import { PHASE_LABEL } from '../constants/phases';
import { useCountdown } from '../hooks/useCountdown';
import { IntersectionDiagram } from './IntersectionDiagram';

const PHASE_TO_DIR = { N_GO: 'north', S_GO: 'south', E_GO: 'east', W_GO: 'west' };
const ALL_DIRS = ['north', 'south', 'east', 'west'];

function buildLightStates(phase, signalPhase) {
  const activeDir = PHASE_TO_DIR[phase];
  return Object.fromEntries(
    ALL_DIRS.map((dir) => {
      if (signalPhase === 'allred') return [dir, 'red'];
      if (dir === activeDir) return [dir, signalPhase]; // 'green' or 'yellow'
      return [dir, 'red'];
    })
  );
}

// Next phase preview: always full green for the upcoming direction
function buildNextLightStates(phase) {
  const activeDir = PHASE_TO_DIR[phase];
  return Object.fromEntries(
    ALL_DIRS.map((dir) => [dir, dir === activeDir ? 'green' : 'red'])
  );
}

const styles = {
  wrapper: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },
  currentCard: (signalPhase) => ({
    background:
      signalPhase === 'yellow' ? '#713f12' :
      signalPhase === 'allred' ? '#450a0a' :
      '#166534',
    border: `1px solid ${
      signalPhase === 'yellow' ? '#ca8a04' :
      signalPhase === 'allred' ? '#ef4444' :
      '#16a34a'
    }`,
    borderRadius: '16px',
    padding: '28px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  }),
  nextCard: {
    background: '#1f1f1f',
    border: '1px solid #2a2a2a',
    borderRadius: '16px',
    padding: '28px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '1rem',
    color: '#888888',
  },
  phaseText: {
    fontSize: '3rem',
    color: '#ffffff',
    fontWeight: 'bold',
    lineHeight: 1.1,
  },
  countdown: (signalPhase) => ({
    fontSize: '3rem',
    fontWeight: 'bold',
    color:
      signalPhase === 'yellow'
        ? '#eab308'
        : signalPhase === 'allred'
        ? '#ef4444'
        : '#22c55e',
    lineHeight: 1.1,
  }),
  unit: {
    fontSize: '1.25rem',
    color: '#888888',
  },
};

export default function PhaseInfo({ status }) {
  const { remainingSec, signalPhase } = useCountdown(status);
  const currentLabel = PHASE_LABEL[status?.currentPhase] ?? status?.currentPhase ?? '–';
  const nextLabel = PHASE_LABEL[status?.nextPhase] ?? status?.nextPhase ?? '–';

  const currentLightStates = buildLightStates(status?.currentPhase, signalPhase);
  const nextLightStates = buildNextLightStates(status?.nextPhase);

  return (
    <div style={styles.wrapper}>
      {/* Current Phase */}
      <div style={styles.currentCard(signalPhase)}>
        <div style={styles.label}>เฟสปัจจุบัน — ไฟเขียว</div>
        <h1 style={styles.phaseText}>{currentLabel}</h1>
        <div style={{ marginTop: '4px' }}>
          <span style={styles.countdown(signalPhase)}>{remainingSec}</span>
          <span style={styles.unit}> วินาที</span>
        </div>
        <div style={styles.label}>เวลาไฟเขียว: {status?.greenTimeSec ?? '–'} วินาที</div>
        <div style={{ marginTop: '16px' }}>
          <IntersectionDiagram lightStates={currentLightStates} currentPhase={status?.currentPhase} />
        </div>
      </div>

      {/* Next Phase */}
      <div style={styles.nextCard}>
        {status?.nextPhase == null ? (
          <>
            <div style={styles.label}>เฟสถัดไป</div>
            <h2 style={{ fontSize: '1.75rem', color: '#444444', fontWeight: 'bold', marginTop: '4px' }}>
              Real-time
            </h2>
            <div style={{ fontSize: '1rem', color: '#444444', marginTop: '4px' }}>
              ระบบตัดสินใจจาก pressure ขณะเปลี่ยนเฟส
            </div>
            <div style={{
              marginTop: 'auto', paddingTop: '24px',
              display: 'flex', flexDirection: 'column', gap: '6px',
            }}>
              {['N_GO','E_GO','S_GO','W_GO'].map((p) => (
                <div key={p} style={{
                  display: 'flex', justifyContent: 'space-between',
                  fontSize: '0.9rem', color: '#444444',
                }}>
                  <span>{PHASE_LABEL[p]}</span>
                  <span>pressure จะถูกคำนวณ ณ เวลานั้น</span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <div style={styles.label}>เฟสถัดไป</div>
            <h2 style={{ fontSize: '2.5rem', color: '#ffffff', fontWeight: 'bold' }}>
              {nextLabel}
            </h2>
            <div style={{ fontSize: '1rem', color: '#444444' }}>รอคิวถัดไป</div>
            <div style={{ marginTop: '16px' }}>
              <IntersectionDiagram lightStates={nextLightStates} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
