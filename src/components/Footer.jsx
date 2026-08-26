import { Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { GitHubIcon, LinkedInIcon } from './icons/BrandIcons';

const SOCIALS = [
  { id: 'github', icon: <GitHubIcon size={18} />, href: 'https://github.com/azzamabdulkhadar', label: 'GitHub' },
  { id: 'linkedin', icon: <LinkedInIcon size={18} />, href: 'https://linkedin.com/in/azzamabdulkhadar', label: 'LinkedIn' },
  { id: 'email', icon: <Mail size={18} />, href: 'mailto:azzamcse@gmail.com', label: 'Email' },
];

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="site-footer">
      <div className="footer-inner">
        {/* Top row: brand on the left, links on the right */}
        <div className="footer-top">
          <a href="#" className="footer-brand" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
            <img src="/azzamIcon.png" alt="" className="footer-logo" />
            <span className="footer-brand-text">
              <span className="footer-brand-name">Azzam</span>
              {/* Initials on very narrow screens so the brand and links stay on
                  one row. Full text stays in the accessibility tree. */}
              <span className="footer-brand-sub">
                <span className="footer-brand-sub-full">Abdul Khadar</span>
                <span className="footer-brand-sub-short" aria-hidden="true">AK</span>
              </span>
            </span>
          </a>

          <nav className="footer-socials" aria-label="Social links">
            {SOCIALS.map(({ id, icon, href, label }) => (
              <a
                key={id}
                href={href}
                target={href.startsWith('mailto:') ? undefined : '_blank'}
                rel="noreferrer"
                aria-label={label}
                title={label}
              >
                {icon}
              </a>
            ))}
          </nav>
        </div>

        {/* Centred copyright below */}
        <div className="footer-bottom">
          <p>{t('footer.text')}</p>
        </div>
      </div>

      <style>{footerStyles}</style>
    </footer>
  );
}

const footerStyles = `
  .site-footer {
    border-top: 1px solid var(--border);
    padding: var(--space-lg) var(--gutter);
    background: var(--bg);
  }

  .footer-inner {
    max-width: var(--container);
    margin: 0 auto;
  }

  /* nowrap keeps the brand on the left and links on the right at every width;
     the tightening steps below prevent overflow instead of allowing a wrap. */
  .footer-top {
    display: flex;
    align-items: center;
    justify-content: space-around;
    gap: 1rem;
    flex-wrap: nowrap;
  }

  /* ─── Brand ─── */
  .footer-brand {
    display: flex;
    align-items: center;
    gap: 10px;
    text-decoration: none;
    min-width: 0;
  }

  .footer-logo {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    flex-shrink: 0;
  }

  .footer-brand-text {
    display: flex;
    flex-direction: column;
    line-height: 1.2;
  }

  .footer-brand-name {
    font-family: 'Space Grotesk', sans-serif;
    font-weight: 700;
    font-size: 1rem;
    color: var(--text-h);
    letter-spacing: -0.3px;
    transition: color 0.2s;
    white-space: nowrap;
  }

  .footer-brand:hover .footer-brand-name {
    color: var(--accent);
  }

  .footer-brand-sub {
    font-size: 0.68rem;
    font-weight: 500;
    color: var(--text);
    opacity: 0.8;
    white-space: nowrap;
  }

  /* ─── Social links ─── */
  .footer-socials {
    display: flex;
    gap: var(--space-sm);
    flex-shrink: 0;
  }

  .footer-socials a {
    width: 36px;
    height: 36px;
    border-radius: var(--radius-sm);
    background: var(--bg-card);
    border: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text);
    transition: color 0.2s, border-color 0.2s, transform 0.2s;
  }

  .footer-socials a:hover {
    color: var(--accent);
    border-color: var(--accent);
    transform: translateY(-2px);
  }

  /* ─── Copyright ─── */
  .footer-bottom {
    margin-top: var(--space-md);
    padding-top: var(--space-md);
    border-top: 1px solid var(--border);
    text-align: center;
  }

  .footer-bottom p {
    color: var(--text);
    font-size: var(--text-sm);
  }

  .footer-brand-sub-short {
    display: none;
    letter-spacing: 0.08em;
    font-weight: 600;
  }

  /* The brand and links stay on one row at every width. These steps tighten
     spacing so they never wrap or overflow on small phones. */
  @media (max-width: 420px) {
    .footer-logo {
      width: 28px;
      height: 28px;
    }
    .footer-brand-name {
      font-size: 0.95rem;
    }
    .footer-socials {
      gap: 0.4rem;
    }
    .footer-socials a {
      width: 34px;
      height: 34px;
    }
  }

  /* Below this the full surname no longer fits alongside three buttons, so
     swap in initials. Visually hidden full text keeps screen readers correct. */
  @media (max-width: 360px) {
    .footer-brand-sub-full {
      position: absolute;
      width: 1px;
      height: 1px;
      margin: -1px;
      padding: 0;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }
    .footer-brand-sub-short {
      display: inline;
    }
    .footer-socials a {
      width: 32px;
      height: 32px;
    }
  }
`;
