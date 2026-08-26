import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Briefcase, ChevronRight } from 'lucide-react';
import SectionLabel from './SectionLabel';
import { useTranslation } from 'react-i18next';
import useMediaQuery from '../hooks/useMediaQuery';
import ExperienceDetail from './ExperienceDetail';

/**
 * Roles are data-driven so the card markup exists once. Colours use CSS colour
 * strings (including var(--accent), which stays theme-aware) and tints are
 * derived with color-mix rather than hardcoded rgba values.
 */
const JOBS = [
  {
    id: 'atmez',
    i18nKey: 'experience.job1',
    color: 'var(--accent)',
    url: 'https://atmez.ai/',
    techs: ['Flutter', 'Dart', 'REST APIs', 'Dio', 'MySQL', 'Provider', 'Agile'],
  },
  {
    id: 'zenexis',
    i18nKey: 'experience.job2',
    color: '#06b6d4',
    url: 'https://zenexistech.com/',
    techs: ['React.js', 'Vite', 'Node.js', 'Express.js', 'MongoDB', 'Bootstrap', 'Ant Design', 'Agile'],
  },
  {
    id: 'perfai',
    i18nKey: 'experience.job3',
    color: '#f59e0b',
    url: 'https://perfai.ai/',
    techs: ['AI/ML', 'Performance Testing', 'API Testing', 'Automation', 'Quality Assurance'],
  },
];

const MOBILE_PREVIEW_COUNT = 2;

export default function Experience() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const { t } = useTranslation();
  const isCompact = useMediaQuery('(max-width: 768px)');
  const [selectedJob, setSelectedJob] = useState(null);

  return (
    <section id="experience" ref={ref} style={{ padding: 'var(--space-2xl) var(--gutter)', background: 'var(--bg-secondary)' }}>
      <div style={{ maxWidth: 'var(--container)', margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}
        >
          <SectionLabel>{t('experience.label')}</SectionLabel>
          <h2 style={{ fontSize: 'var(--h2)', fontWeight: 700 }}>
            {t('experience.heading')}
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.6 }}
          style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}
        >
          {JOBS.map((job, index) => (
            <JobCard
              key={job.id}
              job={job}
              index={index}
              inView={inView}
              isCompact={isCompact}
              onOpen={() => setSelectedJob(job)}
              t={t}
            />
          ))}
        </motion.div>
      </div>

      {selectedJob && (
        <ExperienceDetail job={selectedJob} onClose={() => setSelectedJob(null)} />
      )}

      <style>{experienceStyles}</style>
    </section>
  );
}

function JobCard({ job, index, inView, isCompact, onOpen, t }) {
  const { i18nKey, color, url, techs } = job;
  const responsibilities = t(`${i18nKey}.responsibilities`, { returnObjects: true });
  const list = Array.isArray(responsibilities) ? responsibilities : [];
  const visible = isCompact ? list.slice(0, MOBILE_PREVIEW_COUNT) : list;
  const hidden = list.length - visible.length;

  // On compact screens the whole card is the tap target, so it becomes a
  // button rather than nesting an anchor inside a clickable region.
  const interactiveProps = isCompact
    ? {
        role: 'button',
        tabIndex: 0,
        onClick: onOpen,
        onKeyDown: (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onOpen();
          }
        },
        'aria-label': `${t(`${i18nKey}.position`)} — ${t('experience.viewDetails')}`,
      }
    : {};

  return (
    <div
      className={`exp-card ${isCompact ? 'exp-card-tappable' : ''}`}
      style={{ borderLeft: `3px solid ${color}` }}
      {...interactiveProps}
    >
      <div className="exp-card-row">
        <div
          className="exp-card-icon"
          style={{ background: `color-mix(in srgb, ${color} 15%, transparent)`, color }}
        >
          <Briefcase size={22} />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="exp-card-head">
            <div style={{ minWidth: 0 }}>
              <h3 className="exp-card-title">{t(`${i18nKey}.position`)}</h3>

              <div className="exp-card-company" style={{ color }}>
                {isCompact ? (
                  <span>{t(`${i18nKey}.company`)}</span>
                ) : (
                  <a
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: 'inherit', textDecoration: 'none', borderBottom: '1px dashed currentColor' }}
                  >
                    {t(`${i18nKey}.company`)}
                  </a>
                )}
              </div>

              <div className="exp-card-location">{t(`${i18nKey}.location`)}</div>
            </div>

            <span
              className="exp-card-period"
              style={{
                color,
                background: `color-mix(in srgb, ${color} 12%, transparent)`,
                borderColor: `color-mix(in srgb, ${color} 32%, transparent)`,
              }}
            >
              {t(`${i18nKey}.period`)}
            </span>
          </div>

          <ul className="exp-card-list">
            {visible.map((item, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.3 + index * 0.1 + i * 0.08 }}
              >
                <span style={{ color, marginTop: '0.2rem', flexShrink: 0 }}>▸</span>
                <span>{item}</span>
              </motion.li>
            ))}
          </ul>

          {isCompact ? (
            <span className="exp-card-more" style={{ color }}>
              {/* 'n' rather than 'count': passing `count` makes i18next look for
                  plural-suffixed keys (_one/_other), which these aren't. */}
              {hidden > 0
                ? t('experience.viewMoreCount', { n: hidden })
                : t('experience.viewDetails')}
              <ChevronRight size={14} />
            </span>
          ) : (
            <div className="exp-card-techs">
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
          )}
        </div>
      </div>
    </div>
  );
}

const experienceStyles = `
  .exp-card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: var(--space-lg);
    transition: border-color 0.2s, transform 0.2s;
  }

  /* Compact screens: the card is a tap target that opens the full detail view */
  .exp-card-tappable {
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }

  .exp-card-tappable:active {
    transform: scale(0.99);
  }

  .exp-card-tappable:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 3px;
  }

  .exp-card-row {
    display: flex;
    align-items: flex-start;
    gap: var(--space-md);
  }

  .exp-card-icon {
    width: 48px;
    height: 48px;
    border-radius: var(--radius-md);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .exp-card-head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
  }

  .exp-card-title {
    font-size: 1.15rem;
    font-weight: 700;
    color: var(--text-h);
    margin-bottom: 0.2rem;
    line-height: 1.35;
  }

  .exp-card-company {
    font-weight: 500;
    font-size: var(--text-base);
  }

  .exp-card-location {
    font-size: var(--text-sm);
    color: var(--text);
    margin-top: 0.15rem;
  }

  .exp-card-period {
    font-family: var(--mono);
    font-size: var(--text-xs);
    padding: 0.3rem var(--space-sm);
    border-radius: var(--radius-sm);
    border: 1px solid;
    white-space: nowrap;
  }

  .exp-card-list {
    list-style: none;
    margin-top: var(--space-md);
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
  }

  /* Cap the reading measure. This is the only section whose running text spans
     the full container, so without a limit lines reach ~145 characters at
     1920px and ~170 at 4K, well past the comfortable 45-75 range.
     ch units tie the cap to the current font size, so it holds at every
     breakpoint without extra media queries. The card stays full width. */
  .exp-card-list li {
    display: flex;
    gap: var(--space-sm);
    align-items: flex-start;
    color: var(--text);
    font-size: var(--text-base);
    line-height: 1.7;
    max-width: 70ch;
  }

  /* Same measure as the bullets so the chips wrap in line with the text above
     rather than stretching across the full card on wide screens. */
  .exp-card-techs {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-xs);
    margin-top: 1.5rem;
    max-width: 70ch;
  }

  .exp-card-techs span {
    border-radius: var(--radius-sm);
    padding: 0.2rem 0.6rem;
    font-size: var(--text-xs);
    font-family: var(--mono);
  }

  .exp-card-more {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    margin-top: var(--space-md);
    font-size: var(--text-sm);
    font-weight: 600;
  }

  @media (max-width: 768px) {
    .exp-card {
      padding: var(--space-md);
    }
    .exp-card-row {
      gap: 0.85rem;
    }
    .exp-card-title {
      font-size: 1.05rem;
    }
  }

  @media (max-width: 480px) {
    .exp-card-icon {
      width: 40px;
      height: 40px;
    }
    /* Let the period badge sit under the title instead of squeezing it */
    .exp-card-head {
      flex-direction: column;
    }
  }
`;
