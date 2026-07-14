import { Code2, Link, Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer style={{
      borderTop: '1px solid var(--border)',
      padding: 'var(--space-lg)',
      textAlign: 'center',
      background: 'var(--bg)',
    }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <span style={{ fontFamily: 'var(--mono)', color: 'var(--accent)', fontWeight: 600 }}>
          &lt;Azzam /&gt;
        </span>
        <p style={{ color: 'var(--text)', fontSize: 'var(--text-sm)' }}>
          {t('footer.text')}
        </p>
        <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
          {[
            { icon: <Code2 size={18} />, href: 'https://github.com/azzamabdulkhadar', label: 'GitHub' },
            { icon: <Link size={18} />, href: 'https://linkedin.com/in/azzamabdulkhadar', label: 'LinkedIn' },
            { icon: <Mail size={18} />, href: 'mailto:azzamcse@gmail.com', label: 'Email' },
          ].map(({ icon, href, label }, i) => (
            <a key={i} href={href} target="_blank" rel="noreferrer" aria-label={label} style={{
              width: 36, height: 36, borderRadius: 'var(--radius-sm)',
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
