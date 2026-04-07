import { Code2, Link, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--border)',
      padding: '2rem',
      textAlign: 'center',
      background: 'var(--bg)',
    }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <span style={{ fontFamily: 'var(--mono)', color: 'var(--accent)', fontWeight: 600 }}>
          &lt;Azzam /&gt;
        </span>
        <p style={{ color: 'var(--text)', fontSize: '0.85rem' }}>
          © 2025 Azzam Abdul Khadar. Built with React & Framer Motion.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {[
            { icon: <Code2 size={18} />, href: 'https://github.com/Azzam-Abdul-Khadar' },
            { icon: <Link size={18} />, href: 'https://www.linkedin.com/in/azzam-abdul-khadar-a6656729b' },
            { icon: <Mail size={18} />, href: 'mailto:azzamcse@gmail.com' },
          ].map(({ icon, href }, i) => (
            <a key={i} href={href} target="_blank" rel="noreferrer" style={{
              width: 36, height: 36, borderRadius: '8px',
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--text)', transition: 'all 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text)'; }}
            >
              {icon}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
