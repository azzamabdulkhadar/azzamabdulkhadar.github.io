export default function SectionLabel({ children }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
      fontFamily: 'var(--mono)', fontSize: 'var(--text-xs)', color: 'var(--accent)',
      marginBottom: 'var(--space-sm)', textTransform: 'uppercase', letterSpacing: '0.1em',
    }}>
      <span style={{ width: 20, height: 1, background: 'var(--accent)', display: 'inline-block' }} />
      {children}
      <span style={{ width: 20, height: 1, background: 'var(--accent)', display: 'inline-block' }} />
    </div>
  );
}
