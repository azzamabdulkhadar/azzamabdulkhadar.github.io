import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, CheckCircle2, ExternalLink } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function ProjectDetail({ project, onClose }) {
  const [current, setCurrent] = useState(0);
  const images = project?.images || [];
  const { t } = useTranslation();
  const timerRef = useRef(null);
  const directionRef = useRef(1); // 1 = forward (right), -1 = backward (left)

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      directionRef.current = 1;
      setCurrent(c => (c + 1) % images.length);
    }, 4000);
  }, [images.length]);

  const next = useCallback(() => {
    directionRef.current = 1;
    setCurrent(c => (c + 1) % images.length);
    resetTimer();
  }, [images.length, resetTimer]);

  const prev = useCallback(() => {
    directionRef.current = -1;
    setCurrent(c => (c - 1 + images.length) % images.length);
    resetTimer();
  }, [images.length, resetTimer]);

  // Keyboard navigation & body scroll lock
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose, next, prev]);

  // Auto-advance carousel
  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [resetTimer]);

  if (!project) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '2rem',
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 30 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          onClick={e => e.stopPropagation()}
          style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: '20px', maxWidth: '1050px', width: '100%',
            height: '80vh', maxHeight: '80vh', overflow: 'hidden',
            display: 'grid', gridTemplateColumns: '1fr 1fr',
            position: 'relative',
          }}
          className="project-detail-modal"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              position: 'absolute', top: '1rem', right: '1rem', zIndex: 10,
              width: 36, height: 36, borderRadius: '50%',
              background: 'var(--bg-secondary)', border: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--text)', cursor: 'pointer', transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text)'; }}
          >
            <X size={18} />
          </button>

          {/* Left: Carousel */}
          <div style={{
            position: 'relative', background: 'var(--bg-secondary)',
            borderRadius: '20px 0 0 20px', overflow: 'hidden',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            minHeight: '400px',
          }}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.img
                key={current}
                src={images[current]}
                alt={`${t(`${project.i18nKey}.title`)} screenshot ${current + 1}`}
                initial={{ opacity: 0, x: directionRef.current * -300 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: directionRef.current * 300 }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
                style={{
                  width: '100%', height: '100%', objectFit: 'contain',
                  position: 'absolute', inset: 0,
                  padding: '0.5rem',
                  background: 'var(--bg-secondary)',
                }}
              />
            </AnimatePresence>

            {/* Carousel controls */}
            {images.length > 1 && (
              <>
                <button onClick={prev} aria-label="Previous image" style={{
                  position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)',
                  width: 36, height: 36, borderRadius: '50%', border: 'none',
                  background: 'rgba(0,0,0,0.5)', color: '#fff', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'background 0.2s', zIndex: 2,
                }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.75)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.5)'}
                >
                  <ChevronLeft size={20} />
                </button>
                <button onClick={next} aria-label="Next image" style={{
                  position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)',
                  width: 36, height: 36, borderRadius: '50%', border: 'none',
                  background: 'rgba(0,0,0,0.5)', color: '#fff', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'background 0.2s', zIndex: 2,
                }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.75)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.5)'}
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}

            {/* Dots */}
            <div style={{
              position: 'absolute', bottom: '1rem', left: '50%', transform: 'translateX(-50%)',
              display: 'flex', gap: '0.4rem', zIndex: 2,
            }}>
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  aria-label={`Go to image ${i + 1}`}
                  style={{
                    width: i === current ? 24 : 8, height: 8,
                    borderRadius: '100px', border: 'none', cursor: 'pointer',
                    background: i === current ? 'var(--accent)' : 'rgba(255,255,255,0.5)',
                    transition: 'all 0.3s',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Right: Project info */}
          <div style={{ padding: '2.5rem 2rem', overflowY: 'auto', maxHeight: '80vh' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '1.8rem' }}>{project.emoji}</span>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-h)' }}>
                  {t(`${project.i18nKey}.title`)}
                </h2>
              </div>
              <span style={{
                fontFamily: 'var(--mono)', fontSize: '0.75rem',
                color: 'var(--accent)', background: 'rgba(124,58,237,0.1)',
                border: '1px solid rgba(124,58,237,0.3)',
                padding: '0.2rem 0.6rem', borderRadius: '6px',
                whiteSpace: 'nowrap', flexShrink: 0,
              }}>
                {t(`${project.i18nKey}.date`)}
              </span>
            </div>

            <p style={{
              color: 'var(--text)', lineHeight: 1.8, fontSize: '0.92rem',
              marginBottom: '1.5rem',
            }}>
              {t(`${project.i18nKey}.description`)}
            </p>

            {/* Highlights */}
            <h3 style={{
              fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-h)',
              textTransform: 'uppercase', letterSpacing: '0.08em',
              marginBottom: '0.75rem',
            }}>
              {t('projects.keyHighlights')}
            </h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.75rem' }}>
              {(t(`${project.i18nKey}.highlights`, { returnObjects: true }) || []).map((h, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.08 }}
                  style={{
                    display: 'flex', gap: '0.6rem', alignItems: 'flex-start',
                    fontSize: '0.88rem', color: 'var(--text)', lineHeight: 1.6,
                  }}
                >
                  <CheckCircle2 size={15} style={{ color: 'var(--accent)', marginTop: '0.2rem', flexShrink: 0 }} />
                  {h}
                </motion.li>
              ))}
            </ul>

            {/* Core Features */}
            {(() => {
              const coreFeatures = t(`${project.i18nKey}.coreFeatures`, { returnObjects: true });
              return Array.isArray(coreFeatures) && coreFeatures.length > 0 ? (
                <>
                  <h3 style={{
                    fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-h)',
                    textTransform: 'uppercase', letterSpacing: '0.08em',
                    marginBottom: '0.75rem',
                  }}>
                    {t('projects.coreFeatures')}
                  </h3>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.75rem' }}>
                    {coreFeatures.map((f, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: 15 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + i * 0.06 }}
                        style={{
                          display: 'flex', gap: '0.6rem', alignItems: 'flex-start',
                          fontSize: '0.86rem', color: 'var(--text)', lineHeight: 1.6,
                        }}
                      >
                        <span style={{ color: project.color, marginTop: '0.1rem', flexShrink: 0 }}>●</span>
                        {f}
                      </motion.li>
                    ))}
                  </ul>
                </>
              ) : null;
            })()}

            {/* Tech stack */}
            <h3 style={{
              fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-h)',
              textTransform: 'uppercase', letterSpacing: '0.08em',
              marginBottom: '0.75rem',
            }}>
              {t('projects.technologiesUsed')}
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {project.stack.map(tech => (
                <span key={tech} style={{
                  background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.25)',
                  color: 'var(--accent)', borderRadius: '8px', padding: '0.3rem 0.75rem',
                  fontSize: '0.78rem', fontFamily: 'var(--mono)', fontWeight: 500,
                }}>
                  {tech}
                </span>
              ))}
            </div>

            {/* GitHub link */}
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noreferrer"
                onClick={e => e.stopPropagation()}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                  marginTop: '1.5rem', padding: '0.6rem 1.2rem',
                  background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                  borderRadius: '10px', color: 'var(--text-h)',
                  fontSize: '0.85rem', fontWeight: 500,
                  textDecoration: 'none', transition: 'border-color 0.2s, transform 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                View on GitHub <ExternalLink size={14} />
              </a>
            )}
          </div>
        </motion.div>
      </motion.div>

      {/* Responsive: stack vertically on small screens */}
      <style>{`
        .project-detail-modal > div:last-child::-webkit-scrollbar {
          width: 6px;
        }
        .project-detail-modal > div:last-child::-webkit-scrollbar-track {
          background: transparent;
        }
        .project-detail-modal > div:last-child::-webkit-scrollbar-thumb {
          background: var(--border);
          border-radius: 3px;
        }
        .project-detail-modal > div:last-child::-webkit-scrollbar-thumb:hover {
          background: var(--accent);
        }
        @media (max-width: 768px) {
          .project-detail-modal {
            grid-template-columns: 1fr !important;
            height: 90vh !important;
            max-height: 90vh !important;
          }
          .project-detail-modal > div:first-child {
            border-radius: 20px 20px 0 0 !important;
            min-height: 250px !important;
            max-height: 250px !important;
          }
          .project-detail-modal > div:last-child {
            max-height: calc(90vh - 250px) !important;
          }
        }
      `}</style>
    </AnimatePresence>
  );
}
