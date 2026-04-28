import React from 'react';
import { PHASE_LABEL } from '../constants/phases';

// ─── Shared styles ────────────────────────────────────────────────────────────

const s = {
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
  grid2: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '16px',
  },
  row: { display: 'flex', flexDirection: 'column', gap: '4px' },
  rowLabel: { fontSize: '1rem', color: '#888888' },
  rowValue: { fontSize: '1.5rem', color: '#ffffff', fontWeight: 'bold' },
  formulaBox: {
    marginTop: '16px',
    background: '#0a0a0a',
    borderRadius: '10px',
    padding: '14px 18px',
    fontSize: '1.1rem',
    color: '#888888',
  },
  highlight: { color: '#22c55e', fontWeight: 'bold' },
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
    marginBottom: '16px',
  },
  strategyTag: {
    display: 'inline-block',
    background: '#1f1f1f',
    border: '1px solid #2a2a2a',
    borderRadius: '6px',
    padding: '2px 10px',
    fontSize: '0.85rem',
    color: '#444444',
    marginBottom: '16px',
  },
};

// ─── SIMPLE_CYCLE_BASED / QUEUE_BASED ─────────────────────────────────────────

function DecisionSimple({ meta, strategy, greenTimeSec }) {
  const fromLabel = PHASE_LABEL[meta?.from] ?? meta?.from ?? '–';
  const formula =
    meta?.perCarRate != null && meta?.actualCars != null
      ? `3 + (${meta.perCarRate} × ${meta.actualCars}) = ${greenTimeSec} วินาที`
      : '–';
  const desc =
    strategy === 'QUEUE_BASED'
      ? 'นับรถในคิว × เวลาต่อคัน + ค่าคงที่'
      : 'วนเฟสตามลำดับ × เวลาต่อคัน + ค่าคงที่';

  return (
    <>
      {meta?.fallback && <div style={s.warningBadge}>⚠ ไม่มีข้อมูลกล้อง — ใช้ค่า default</div>}

      <div style={s.grid2}>
        <div style={s.row}>
          <span style={s.rowLabel}>รถในทิศนี้</span>
          <span style={s.rowValue}>{meta?.actualCars ?? '–'} คัน</span>
        </div>
        <div style={s.row}>
          <span style={s.rowLabel}>เวลาไฟเขียว</span>
          <span style={s.rowValue}>{greenTimeSec ?? '–'} วินาที</span>
        </div>
        <div style={s.row}>
          <span style={s.rowLabel}>มาจากเฟส</span>
          <span style={s.rowValue}>{fromLabel}</span>
        </div>
        <div style={s.row}>
          <span style={s.rowLabel}>จำนวน samples</span>
          <span style={s.rowValue}>{meta?.sampleCount ?? '–'}</span>
        </div>
      </div>

      <div style={s.formulaBox}>
        <div style={{ marginBottom: '6px', fontSize: '0.9rem', color: '#444444' }}>{desc}</div>
        <span style={{ color: '#888888' }}>สูตร: </span>
        <span style={s.highlight}>{formula}</span>
      </div>
    </>
  );
}

// ─── MAXPRESSURE_SWITCHING_LOSS ───────────────────────────────────────────────

const PHASE_ORDER = ['N_GO', 'E_GO', 'S_GO', 'W_GO'];

function PressureBar({ phaseId, raw, biased, isWinner, isCurrent, bias }) {
  const maxVal = Math.max(raw, biased, 0.01);
  const rawPct = (raw / maxVal) * 100;
  const biasedPct = (biased / maxVal) * 100;
  const label = PHASE_LABEL[phaseId] ?? phaseId;

  return (
    <div
      style={{
        background: isWinner ? '#0d1f14' : '#0a0a0a',
        border: `1px solid ${isWinner ? '#16a34a' : '#1f1f1f'}`,
        borderRadius: '10px',
        padding: '12px 14px',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
      }}
    >
      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '1rem', fontWeight: 'bold', color: isWinner ? '#86efac' : '#888888' }}>
            {label}
          </span>
          {isCurrent && (
            <span style={{
              fontSize: '0.7rem', background: '#713f12', border: '1px solid #ca8a04',
              borderRadius: '4px', padding: '1px 6px', color: '#fde68a',
            }}>
              ×{bias}
            </span>
          )}
          {isWinner && (
            <span style={{
              fontSize: '0.7rem', background: '#14532d', border: '1px solid #16a34a',
              borderRadius: '4px', padding: '1px 6px', color: '#86efac',
            }}>
              ชนะ
            </span>
          )}
        </div>
        <span style={{ fontSize: '0.9rem', color: isWinner ? '#86efac' : '#888888' }}>
          {biased.toFixed(1)}
        </span>
      </div>

      {/* Raw pressure bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '0.75rem', color: '#444444', width: '32px' }}>raw</span>
        <div style={{ flex: 1, height: '6px', background: '#1f1f1f', borderRadius: '3px' }}>
          <div style={{
            width: `${rawPct}%`, height: '100%',
            background: isWinner ? '#166534' : '#2a2a2a',
            borderRadius: '3px',
          }} />
        </div>
        <span style={{ fontSize: '0.75rem', color: '#444444', width: '32px', textAlign: 'right' }}>
          {raw.toFixed(1)}
        </span>
      </div>

      {/* Biased pressure bar */}
      {isCurrent && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.75rem', color: '#ca8a04', width: '32px' }}>bias</span>
          <div style={{ flex: 1, height: '6px', background: '#1f1f1f', borderRadius: '3px' }}>
            <div style={{
              width: `${biasedPct}%`, height: '100%',
              background: '#713f12',
              borderRadius: '3px',
            }} />
          </div>
          <span style={{ fontSize: '0.75rem', color: '#ca8a04', width: '32px', textAlign: 'right' }}>
            {biased.toFixed(1)}
          </span>
        </div>
      )}
    </div>
  );
}

function DecisionMaxPressure({ meta, strategy, greenTimeSec, currentPhase }) {
  const pressures = meta?.pressures ?? {};
  const biasedPressures = meta?.biasedPressures ?? {};
  const bias = meta?.switchingBias ?? 1.2;
  const fromLabel = PHASE_LABEL[meta?.from] ?? meta?.from ?? '–';

  // Find winning phase (max biased pressure)
  const winnerPhase = Object.entries(biasedPressures).reduce(
    (best, [phase, val]) => (val > (biasedPressures[best] ?? -Infinity) ? phase : best),
    PHASE_ORDER[0]
  );

  const formula =
    meta?.flowRate != null && meta?.actualCars != null && meta?.reactionTime != null
      ? `${meta.actualCars} ÷ ${meta.flowRate} + ${meta.reactionTime} = ${greenTimeSec} วินาที`
      : `${greenTimeSec ?? '–'} วินาที`;

  return (
    <>
      {/* Algorithm steps */}
      <div style={{
        background: '#0a0a0a', borderRadius: '10px',
        padding: '14px 18px', marginBottom: '20px',
        display: 'flex', flexDirection: 'column', gap: '6px',
      }}>
        {[
          'หา lane ที่หนาแน่นสุดในแต่ละทิศ',
          'คำนวณ pressure = flowRate × maxCars ต่อทิศ',
          `เพิ่ม bias ×${bias} ให้เฟสปัจจุบัน แล้วหาเฟสที่ pressure สูงสุด`,
          'คำนวณเวลาไฟเขียว = maxCars ÷ flowRate + reactionTime',
        ].map((step, i) => (
          <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
            <span style={{
              fontSize: '0.8rem', fontWeight: 'bold', color: '#22c55e',
              minWidth: '18px', marginTop: '1px',
            }}>{i + 1}.</span>
            <span style={{ fontSize: '0.9rem', color: '#888888' }}>{step}</span>
          </div>
        ))}
      </div>

      {/* Pressure bars */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '16px' }}>
        {PHASE_ORDER.map((phase) => (
          <PressureBar
            key={phase}
            phaseId={phase}
            raw={pressures[phase] ?? 0}
            biased={biasedPressures[phase] ?? pressures[phase] ?? 0}
            isWinner={phase === winnerPhase}
            isCurrent={phase === currentPhase}
            bias={bias}
          />
        ))}
      </div>

      {/* Stats row */}
      <div style={{ ...s.grid2, marginBottom: '0' }}>
        <div style={s.row}>
          <span style={s.rowLabel}>รถในทิศที่ชนะ</span>
          <span style={s.rowValue}>{meta?.actualCars ?? '–'} คัน</span>
        </div>
        <div style={s.row}>
          <span style={s.rowLabel}>มาจากเฟส</span>
          <span style={s.rowValue}>{fromLabel}</span>
        </div>
      </div>

      <div style={s.formulaBox}>
        <div style={{ marginBottom: '6px', fontSize: '0.9rem', color: '#444444' }}>
          เวลาไฟเขียว = maxCars ÷ flowRate + reactionTime
        </div>
        <span style={{ color: '#888888' }}>สูตร: </span>
        <span style={s.highlight}>{formula}</span>
      </div>
    </>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function DecisionReason({ lastDecision, greenTimeSec, currentPhase }) {
  if (!lastDecision) {
    return (
      <div style={s.card}>
        <h3 style={s.title}>เหตุผลการตัดสินใจ</h3>
        <p style={{ color: '#444444' }}>ยังไม่มีข้อมูล</p>
      </div>
    );
  }

  const { meta, strategy } = lastDecision;
  const isMaxPressure = strategy === 'MAXPRESSURE_SWITCHING_LOSS';

  return (
    <div style={s.card}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h3 style={{ ...s.title, marginBottom: 0 }}>เหตุผลการตัดสินใจ</h3>
        <span style={s.strategyTag}>{strategy ?? '–'}</span>
      </div>

      {isMaxPressure ? (
        <DecisionMaxPressure
          meta={meta}
          strategy={strategy}
          greenTimeSec={greenTimeSec ?? lastDecision.greenTimeSec}
          currentPhase={currentPhase}
        />
      ) : (
        <DecisionSimple
          meta={meta}
          strategy={strategy}
          greenTimeSec={greenTimeSec ?? lastDecision.greenTimeSec}
        />
      )}
    </div>
  );
}
