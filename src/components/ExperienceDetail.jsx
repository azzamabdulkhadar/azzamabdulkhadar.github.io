import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import { X, Briefcase, ExternalLink } from 'lucide-react';
import { useTranslation } from 'react-i18next';

/**
 * Full detail view for a single role. Opened by tapping an Experience card on
 * small screens, where showing every responsibility inline made the cards
 * extremely tall and hard to scan.
 */
export default function ExperienceDetail({ job, onClose }) {
  const { t } = useTranslation();

  // Escape to close + lock background scroll while open
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  if (!job) return null;

  const { i18nKey, color, url, techs } = job;
  const responsibilities = t(`${i18nKey}.responsibilities`, { returnObjects: true });

  return (
    <AnimatePresence>
      <motion.div
        className="exp-detail-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="exp-detail-panel"
          role="dialog"
          aria-modal="true"
          aria-labelledby="exp-detail-title"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
          onClick={(e) => e.stopPropagation()}
          style={{ borderTop: `3px solid ${color}` }}
        >
          <button className="exp-detail-close" onClick={onClose} aria-label="Close details">
            <X size={20} />
          </button>

          <div className="exp-detail-body">
            {/* Header */}
            <div className="exp-detail-head">
              <div
                className="exp-detail-icon"
                style={{
                  background: `color-mix(in srgb, ${color} 15%, transparent)`,
                  color,
                }}
              >
                <Briefcase size={22} />
              </div>
              <div style={{ minWidth: 0 }}>
                <h3 id="exp-detail-title" className="exp-detail-title">
                  {t(`${i18nKey}.position`)}
                </h3>
                <a
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className="exp-detail-company"
                  style={{ color }}
                >
                  {t(`${i18nKey}.company`)}
                  <ExternalLink size={13} />
                </a>
                <div className="exp-detail-location">{t(`${i18nKey}.location`)}</div>
              </div>
            </div>

            <span
              className="exp-detail-period"
              style={{
                color,
                background: `color-mix(in srgb, ${color} 12%, transparent)`,
                borderColor: `color-mix(in srgb, ${color} 32%, transparent)`,
              }}
            >
              {t(`${i18nKey}.period`)}
            </span>

            {/* Responsibilities */}
            <div className="exp-detail-section-label">
              {t('experience.responsibilitiesLabel')}
            </div>
            <ul className="exp-detail-list">
              {Array.isArray(responsibilities) && responsibilities.map((item, i) => (
                <li key={i}>
                  <span style={{ color, flexShrink: 0 }}>▸</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            {/* Tech stack */}
            <div className="exp-detail-section-label">
              {t('experience.techLabel')}
            </div>
            <div className="exp-detail-techs">
              {techs.map((tech) => (
                <span
                  key={tech}
                  style={{
                    color,
                    background: `color-mix(in srgb, ${color} 10%, transparent)`,
                    border: `1px solid color-mix(in srgb, ${color} 25%, transparent)`,
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        <style>{expDetailStyles}</style>
      </motion.div>
    </AnimatePresence>
  );
}

const expDetailStyles = `
  .exp-detail-overlay {
    position: fixed;
    inset: 0;
    z-index: 1500;
    background: rgba(0, 0, 0, 0.65);
    backdrop-filter: blur(6px);
    display: flex;
    align-items: flex-end;
    justify-content: center;
  }

  /* Bottom sheet on phones: thumb-reachable and a familiar mobile pattern */
  .exp-detail-panel {
    position: relative;
    width: 100%;
    max-width: 34rem;
    max-height: 88dvh;
    overflow-y: auto;
    overscroll-behavior: contain;
    -webkit-overflow-scrolling: touch;
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg) var(--radius-lg) 0 0;
    box-shadow: 0 -12px 48px rgba(0, 0, 0, 0.4);
  }

  .exp-detail-close {
    position: sticky;
    top: 0;
    float: right;
    margin: 0.75rem 0.75rem 0 0;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: var(--bg-secondary);
    border: 1px solid var(--border);
    color: var(--text);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2;
    transition: color 0.2s, border-color 0.2s;
  }

  .exp-detail-close:hover {
    color: var(--accent);
    border-color: var(--accent);
  }

  .exp-detail-body {
    padding: 1.25rem clamp(1rem, 4vw, 1.5rem) 2rem;
  }

  .exp-detail-head {
    display: flex;
    align-items: flex-start;
    gap: 0.85rem;
    margin-bottom: 0.85rem;
  }

  .exp-detail-icon {
    width: 48px;
    height: 48px;
    border-radius: var(--radius-md);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .exp-detail-title {
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--text-h);
    margin-bottom: 0.25rem;
    line-height: 1.3;
  }

  .exp-detail-company {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    font-weight: 500;
    font-size: var(--text-base);
    text-decoration: none;
    border-bottom: 1px dashed currentColor;
  }

  .exp-detail-location {
    font-size: var(--text-sm);
    color: var(--text);
    margin-top: 0.3rem;
  }

  .exp-detail-period {
    display: inline-block;
    font-family: var(--mono);
    font-size: var(--text-xs);
    padding: 0.3rem 0.7rem;
    border-radius: var(--radius-sm);
    border: 1px solid;
    white-space: nowrap;
  }

  .exp-detail-section-label {
    font-size: var(--text-xs);
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--text-h);
    margin: 1.5rem 0 0.6rem;
  }

  .exp-detail-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 0.7rem;
  }

  .exp-detail-list li {
    display: flex;
    gap: 0.6rem;
    align-items: flex-start;
    color: var(--text);
    font-size: var(--text-base);
    line-height: 1.7;
  }

  .exp-detail-techs {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
  }

  .exp-detail-techs span {
    border-radius: var(--radius-sm);
    padding: 0.25rem 0.6rem;
    font-size: var(--text-xs);
    font-family: var(--mono);
  }

  /* Centre it as a regular dialog once there's room for one */
  @media (min-width: 600px) {
    .exp-detail-overlay {
      align-items: center;
      padding: 1.5rem;
    }
    .exp-detail-panel {
      border-radius: var(--radius-lg);
      max-height: 85dvh;
      box-shadow: 0 24px 64px rgba(0, 0, 0, 0.45);
    }
  }
`;
