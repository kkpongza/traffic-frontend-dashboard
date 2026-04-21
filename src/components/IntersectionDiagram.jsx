import { motion } from 'motion/react';

function TrafficLight({ state, direction }) {
  const isVertical = direction === 'vertical';

  return (
    <div
      className={`flex gap-1 ${isVertical ? 'flex-col' : 'flex-row'} bg-[#0a0e1a] p-1.5 rounded-md border border-[#1a2332]`}
      style={{
        display: 'flex',
        flexDirection: isVertical ? 'column' : 'row',
        gap: '4px',
        background: '#0a0e1a',
        padding: '6px',
        borderRadius: '6px',
        border: '1px solid #1a2332',
      }}
    >
      {/* Green Light */}
      <motion.div
        style={{ width: '12px', height: '12px', borderRadius: '50%' }}
        animate={{
          backgroundColor: state === 'green' ? '#00ff88' : '#18261f',
          boxShadow: state === 'green' ? '0 0 12px #00ff88, 0 0 24px #00ff8880' : 'none',
        }}
        transition={{ duration: 0.3 }}
      />
      {/* Yellow Light */}
      <motion.div
        style={{ width: '12px', height: '12px', borderRadius: '50%' }}
        animate={{
          backgroundColor: state === 'yellow' ? '#ffd93d' : '#2a2618',
          boxShadow: state === 'yellow' ? '0 0 12px #ffd93d, 0 0 24px #ffd93d80' : 'none',
        }}
        transition={{ duration: 0.3 }}
      />
      {/* Red Light */}
      <motion.div
        style={{ width: '12px', height: '12px', borderRadius: '50%' }}
        animate={{
          backgroundColor: state === 'red' ? '#ff2e63' : '#2a1820',
          boxShadow: state === 'red' ? '0 0 12px #ff2e63, 0 0 24px #ff2e6380' : 'none',
        }}
        transition={{ duration: 0.3 }}
      />
    </div>
  );
}

export function IntersectionDiagram({ lightStates }) {
  const activeDirection = Object.entries(lightStates).find(
    ([_, state]) => state === 'green' || state === 'yellow'
  )?.[0];

  const isYellowPhase = Object.values(lightStates).some((state) => state === 'yellow');

  const labelStyle = {
    fontSize: '10px',
    color: '#6b7aa1',
    fontFamily: 'monospace',
    textAlign: 'center',
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ position: 'relative', width: '320px', height: '320px' }}>
        {/* Intersection SVG */}
        <svg viewBox="0 0 320 320" style={{ width: '100%', height: '100%' }}>
          {/* Road - Vertical */}
          <rect x="110" y="0" width="100" height="320" fill="#1a2332" />
          {/* Road - Horizontal */}
          <rect x="0" y="110" width="320" height="100" fill="#1a2332" />
          {/* Center Intersection */}
          <rect x="110" y="110" width="100" height="100" fill="#2a3547" />

          {/* Road Markings - Vertical */}
          <line x1="160" y1="0" x2="160" y2="100" stroke="#6b7aa1" strokeWidth="2" strokeDasharray="8,8" />
          <line x1="160" y1="220" x2="160" y2="320" stroke="#6b7aa1" strokeWidth="2" strokeDasharray="8,8" />

          {/* Road Markings - Horizontal */}
          <line x1="0" y1="160" x2="100" y2="160" stroke="#6b7aa1" strokeWidth="2" strokeDasharray="8,8" />
          <line x1="220" y1="160" x2="320" y2="160" stroke="#6b7aa1" strokeWidth="2" strokeDasharray="8,8" />

          {/* Flow Arrows - North */}
          {activeDirection === 'north' && !isYellowPhase && (
            <>
              <motion.path d="M 175 60 L 175 255" stroke="#00ff88" strokeWidth="3" fill="none"
                initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.6, ease: 'easeOut' }} />
              <motion.polygon points="175,260 168,248 182,248" fill="#00ff88"
                initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.3 }} />


              <motion.path d="M 175 80 Q 180 140 230 140" stroke="#00ff88" strokeWidth="2" strokeOpacity="0.6" fill="none" strokeDasharray="4,4"
                initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 0.6 }}
                transition={{ duration: 0.6, delay: 0.2 }} />
              <motion.polygon points="230,140 218,134 218,146" fill="#00ff88" opacity="0.6"
                initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.3 }} />


              <motion.path d="M 175 80 Q 180 170 110 180" stroke="#00ff88" strokeWidth="2" fill="none"
                initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.1 }} />
              <motion.polygon points="100,180 111,174 111,186" fill="#00ff88"
                initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.3 }} />
            </>
          )}

          {/* Flow Arrows - South */}
          {activeDirection === 'south' && !isYellowPhase && (
            <>
              <motion.path d="M 145 260 L 145 65" stroke="#00ff88" strokeWidth="3" fill="none"
                initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.6, ease: 'easeOut' }} />
              <motion.polygon points="145,60 138,72 152,72" fill="#00ff88"
                initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.3 }} />


              <motion.path d="M 145 240 Q 150 180 100 180" stroke="#00ff88" strokeWidth="2" strokeOpacity="0.6" fill="none" strokeDasharray="4,4"
                initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 0.6 }}
                transition={{ duration: 0.6, delay: 0.2 }} />
              <motion.polygon points="100,180 112,186 112,174" fill="#00ff88" opacity="0.6"
                initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 0.6, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.3 }} />


              <motion.path d="M 145 240 Q 140 130 220 130" stroke="#00ff88" strokeWidth="2" fill="none"
                initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.1 }} />
              <motion.polygon points="223,130 211,124 211,136" fill="#00ff88"
                initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.3 }} />
            </>
          )}

          {/* Flow Arrows - East */}
          {activeDirection === 'east' && !isYellowPhase && (
            <>
              <motion.path d="M 260 175 L 65 175" stroke="#00ff88" strokeWidth="3" fill="none"
                initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.6, ease: 'easeOut' }} />
              <motion.polygon points="60,175 72,168 72,182" fill="#00ff88"
                initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.3 }} />


              <motion.path d="M 240 175 Q 180 170 180 220" stroke="#00ff88" strokeWidth="2" strokeOpacity="0.6" fill="none" strokeDasharray="4,4"
                initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 0.6 }}
                transition={{ duration: 0.6, delay: 0.2 }} />
              <motion.polygon points="180,220 174,208 186,208" fill="#00ff88" opacity="0.6"
                initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.3 }} />
              
              
              <motion.path d="M 240 175 Q 140 180 140 100" stroke="#00ff88" strokeWidth="2" fill="none"
                initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.1 }} />
              <motion.polygon points="140,95 134,107 146,107" fill="#00ff88"
                initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.3 }} />
            </>
          )}

          {/* Flow Arrows - West */}
          {activeDirection === 'west' && !isYellowPhase && (
            <>
              <motion.path d="M 60 145 L 255 145" stroke="#00ff88" strokeWidth="3" fill="none"
                initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.6, ease: 'easeOut' }} />
              <motion.polygon points="260,145 248,138 248,152" fill="#00ff88"
                initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.3 }} />
              
              
              <motion.path d="M 80 145 Q 140 140 140 90" stroke="#00ff88" strokeWidth="2" strokeOpacity="0.6" fill="none" strokeDasharray="4,4"
                initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 0.6 }}
                transition={{ duration: 0.6, delay: 0.2 }} />
              <motion.polygon points="140,85 134,97 146,97" fill="#00ff88" opacity="0.6"
                initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.3 }} />
                
              <motion.path d="M 80 145 Q 190 150 190 230" stroke="#00ff88" strokeWidth="2" fill="none"
                initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.1 }} />
              <motion.polygon points="190,235 184,223 196,223" fill="#00ff88"
                initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.3 }} />
            </>
          )}
        </svg>

        {/* North Light - Top right */}
        <div style={{ position: 'absolute', top: '64px', left: '50%', transform: 'translateX(12px)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <TrafficLight state={lightStates.north} direction="vertical" />
            <span style={labelStyle}>NORTH</span>
          </div>
        </div>

        {/* South Light - Bottom left */}
        <div style={{ position: 'absolute', bottom: '64px', left: '50%', transform: 'translateX(-32px)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <span style={labelStyle}>SOUTH</span>
            <TrafficLight state={lightStates.south} direction="vertical" />
          </div>
        </div>

        {/* East Light - Right bottom */}
        <div style={{ position: 'absolute', right: '64px', top: '50%', transform: 'translateY(12px)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <TrafficLight state={lightStates.east} direction="vertical" />
            <span style={labelStyle}>EAST</span>
          </div>
        </div>

        {/* West Light - Left top */}
        <div style={{ position: 'absolute', left: '64px', top: '50%', transform: 'translateY(-32px)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <TrafficLight state={lightStates.west} direction="vertical" />
            <span style={labelStyle}>WEST</span>
          </div>
        </div>

        {/* Legend */}
        {activeDirection && !isYellowPhase && (
          <motion.div
            style={{
              position: 'absolute',
              bottom: '40px',
              left: '75%',
              transform: 'translateX(-50%)',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              fontSize: '10px',
              whiteSpace: 'nowrap',
            }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ width: '12px', height: '3px', background: '#00ff88' }} />
              <span style={{ color: '#6b7aa1', fontFamily: 'monospace' }}>Straight/Left</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ width: '12px', height: '1px', background: '#00ff88', opacity: 0.6, borderTop: '1px dashed #00ff88' }} />
              <span style={{ color: '#6b7aa1', fontFamily: 'monospace' }}>Left (Free)</span>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
