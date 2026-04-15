import React, { useState } from 'react';

const styles = {
  page: {
    minHeight: '100vh',
    background: '#0a0a0a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    background: '#141414',
    border: '1px solid #2a2a2a',
    borderRadius: '16px',
    padding: '48px 40px',
    width: '100%',
    maxWidth: '480px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  title: {
    fontSize: '2rem',
    color: '#ffffff',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: '1.1rem',
    color: '#888888',
    textAlign: 'center',
    marginTop: '-12px',
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '1.1rem',
    color: '#888888',
  },
  input: {
    background: '#0a0a0a',
    border: '1px solid #2a2a2a',
    borderRadius: '10px',
    padding: '14px 18px',
    fontSize: '1.25rem',
    color: '#ffffff',
    outline: 'none',
    width: '100%',
  },
  inputFocus: {
    borderColor: '#16a34a',
  },
  button: {
    background: '#166534',
    border: '1px solid #16a34a',
    borderRadius: '10px',
    padding: '16px',
    fontSize: '1.25rem',
    color: '#ffffff',
    cursor: 'pointer',
    width: '100%',
    marginTop: '8px',
  },
  buttonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  error: {
    background: '#450a0a',
    border: '1px solid #ef4444',
    borderRadius: '10px',
    padding: '14px 18px',
    fontSize: '1.1rem',
    color: '#fca5a5',
    textAlign: 'center',
  },
};

export default function LoginPage({ onLogin, error, loading }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    onLogin(username, password);
  }

  return (
    <div style={styles.page}>
      <form style={styles.card} onSubmit={handleSubmit}>
        <div>
          <h2 style={styles.title}>ระบบจราจรอัจฉริยะ</h2>
          <p style={styles.subtitle}>Smart Traffic Dashboard</p>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        <div style={styles.fieldGroup}>
          <label style={styles.label}>ชื่อผู้ใช้</label>
          <input
            style={styles.input}
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="กรอก username"
            autoComplete="username"
            required
          />
        </div>

        <div style={styles.fieldGroup}>
          <label style={styles.label}>รหัสผ่าน</label>
          <input
            style={styles.input}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="กรอก password"
            autoComplete="current-password"
            required
          />
        </div>

        <button
          style={{
            ...styles.button,
            ...(loading ? styles.buttonDisabled : {}),
          }}
          type="submit"
          disabled={loading}
        >
          {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
        </button>
      </form>
    </div>
  );
}
