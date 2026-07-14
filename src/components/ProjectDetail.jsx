import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, CheckCircle2, ExternalLink } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function ProjectDetail({ project, onClose }) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const images = project?.images || [];
  const { t } = useTranslation();
  const timerRef = useRef(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const isMobileApp = project?.type === 'mobile';

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setDirection(1);
      setCurrent(c => (c + 1) % images.length);
    }, 5000);
  }, [images.length]);

  const next = useCallback(() => {
    setDirection(1);
    setCurrent(c => (c + 1) % images.length);
    resetTimer();
  }, [images.length, resetTimer]);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent(c => (c - 1 + images.length) % images.length);
    resetTimer();
  }, [images.length, resetTimer]);

  const goTo = useCallback((index) => {
    setDirection(index > current ? 1 : -1);
    setCurrent(index);
    resetTimer();
  }, [current, resetTimer]);

  // Touch handlers for swipe
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) next();
      else prev();
    }
  };

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

  // Reset state when project changes
  useEffect(() => {
    setCurrent(0);
    setDirection(0);
  }, [project?.id]);

  if (!project) return null;

  const slideVariants = {
    enter: (dir) => ({
      x: dir > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir) => ({
      x: dir > 0 ? '-100%' : '100%',
      opacity: 0,
    }),
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="project-detail-overlay"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 30 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          onClick={e => e.stopPropagation()}
          className={`project-detail-modal ${isMobileApp ? 'mobile-project' : 'web-project'}`}
        >
          {/* Close button */}
          <button onClick={onClose} aria-label="Close" className="modal-close-btn">
            <X size={18} />
          </button>

          {/* Left: Carousel */}
          <div
            className={`carousel-container ${isMobileApp ? 'carousel-mobile' : 'carousel-web'}`}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className="carousel-track">
              <AnimatePresence initial={false} custom={direction} mode="popLayout">
                <motion.img
                  key={current}
                  src={images[current]}
                  alt={`${t(`${project.i18nKey}.title`)} screenshot ${current + 1}`}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                  className={`carousel-image ${isMobileApp ? 'carousel-image-mobile' : 'carousel-image-web'}`}
                  draggable={false}
                />
              </AnimatePresence>
            </div>

            {/* Carousel controls */}
            {images.length > 1 && (
              <>
                <button onClick={prev} aria-label="Previous image" className="carousel-btn carousel-btn-prev">
                  <ChevronLeft size={20} />
                </button>
                <button onClick={next} aria-label="Next image" className="carousel-btn carousel-btn-next">
                  <ChevronRight size={20} />
                </button>
              </>
            )}

            {/* Dots / indicators */}
            {images.length > 1 && (
              <div className="carousel-dots">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    aria-label={`Go to image ${i + 1}`}
                    className={`carousel-dot ${i === current ? 'active' : ''}`}
                  />
                ))}
              </div>
            )}

            {/* Image counter */}
            <div className="carousel-counter">
              {current + 1} / {images.length}
            </div>
          </div>

          {/* Right: Project info */}
          <div className="project-info-panel">
            <div className="project-info-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '1.8rem' }}>{project.emoji}</span>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-h)' }}>
                  {t(`${project.i18nKey}.title`)}
                </h2>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <span className="project-type-badge" style={{ background: isMobileApp ? 'rgba(16,185,129,0.1)' : 'rgba(59,130,246,0.1)', color: isMobileApp ? '#10b981' : '#3b82f6', borderColor: isMobileApp ? 'rgba(16,185,129,0.3)' : 'rgba(59,130,246,0.3)' }}>
                  {isMobileApp ? '📱 Mobile' : '🌐 Web'}
                </span>
                <span className="project-date-badge">
                  {t(`${project.i18nKey}.date`)}
                </span>
              </div>
            </div>

            <p style={{
              color: 'var(--text)', lineHeight: 1.8, fontSize: '0.92rem',
              marginBottom: '1.5rem',
            }}>
              {t(`${project.i18nKey}.description`)}
            </p>

            {/* Highlights */}
            <h3 className="section-heading">{t('projects.keyHighlights')}</h3>
            <ul className="highlights-list">
              {(t(`${project.i18nKey}.highlights`, { returnObjects: true }) || []).map((h, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.08 }}
                  className="highlight-item"
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
                  <h3 className="section-heading">{t('projects.coreFeatures')}</h3>
                  <ul className="features-list">
                    {coreFeatures.map((f, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: 15 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + i * 0.06 }}
                        className="feature-item"
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
            <h3 className="section-heading">{t('projects.technologiesUsed')}</h3>
            <div className="tech-stack-tags">
              {project.stack.map(tech => (
                <span key={tech} className="tech-tag">{tech}</span>
              ))}
            </div>

            {/* GitHub link */}
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noreferrer"
                onClick={e => e.stopPropagation()}
                className="github-link"
              >
                View on GitHub <ExternalLink size={14} />
              </a>
            )}
          </div>
        </motion.div>
      </motion.div>

      <style>{`
        .project-detail-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: rgba(0,0,0,0.7);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
        }

        .project-detail-modal {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 20px;
          max-width: 1100px;
          width: 100%;
          height: 82vh;
          max-height: 82vh;
          overflow: hidden;
          display: grid;
          grid-template-columns: 1fr 1fr;
          position: relative;
        }

        .modal-close-btn {
          position: absolute;
          top: 1rem;
          right: 1rem;
          z-index: 10;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text);
          cursor: pointer;
          transition: all 0.2s;
        }
        .modal-close-btn:hover {
          border-color: var(--accent);
          color: var(--accent);
        }

        /* Carousel container */
        .carousel-container {
          position: relative;
          background: var(--bg-secondary);
          border-radius: 20px 0 0 20px;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .carousel-track {
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Web project images: landscape, fill the container fully */
        .carousel-image-web {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: contain;
          padding: 0;
          background: #1a1a2e;
        }

        /* Mobile app images: portrait phone mockup style */
        .carousel-image-mobile {
          position: absolute;
          height: 85%;
          max-width: 55%;
          object-fit: contain;
          border-radius: 16px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }

        /* Mobile carousel has centered dark bg */
        .carousel-mobile {
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
        }

        .carousel-web {
          background: #1a1a2e;
        }

        /* Carousel buttons */
        .carousel-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 38px;
          height: 38px;
          border-radius: 50%;
          border: none;
          background: rgba(0,0,0,0.5);
          color: #fff;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          z-index: 3;
          backdrop-filter: blur(4px);
        }
        .carousel-btn:hover {
          background: rgba(0,0,0,0.8);
          transform: translateY(-50%) scale(1.1);
        }
        .carousel-btn-prev { left: 0.75rem; }
        .carousel-btn-next { right: 0.75rem; }

        /* Dots */
        .carousel-dots {
          position: absolute;
          bottom: 1rem;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 0.4rem;
          z-index: 3;
          background: rgba(0,0,0,0.4);
          padding: 0.4rem 0.6rem;
          border-radius: 20px;
          backdrop-filter: blur(4px);
        }
        .carousel-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          border: none;
          cursor: pointer;
          background: rgba(255,255,255,0.4);
          transition: all 0.3s;
        }
        .carousel-dot.active {
          background: var(--accent);
          width: 22px;
          border-radius: 10px;
        }

        /* Counter */
        .carousel-counter {
          position: absolute;
          top: 1rem;
          left: 1rem;
          font-size: 0.75rem;
          font-family: var(--mono);
          color: rgba(255,255,255,0.8);
          background: rgba(0,0,0,0.4);
          padding: 0.25rem 0.6rem;
          border-radius: 6px;
          backdrop-filter: blur(4px);
          z-index: 3;
        }

        /* Project info panel */
        .project-info-panel {
          padding: 2.5rem 2rem;
          overflow-y: auto;
          max-height: 82vh;
        }
        .project-info-panel::-webkit-scrollbar { width: 6px; }
        .project-info-panel::-webkit-scrollbar-track { background: transparent; }
        .project-info-panel::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }
        .project-info-panel::-webkit-scrollbar-thumb:hover { background: var(--accent); }

        .project-info-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.5rem;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .project-type-badge {
          font-family: var(--mono);
          font-size: 0.72rem;
          padding: 0.2rem 0.6rem;
          border-radius: 6px;
          border: 1px solid;
          white-space: nowrap;
        }

        .project-date-badge {
          font-family: var(--mono);
          font-size: 0.72rem;
          color: var(--accent);
          background: rgba(124,58,237,0.1);
          border: 1px solid rgba(124,58,237,0.3);
          padding: 0.2rem 0.6rem;
          border-radius: 6px;
          white-space: nowrap;
        }

        .section-heading {
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--text-h);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 0.75rem;
        }

        .highlights-list, .features-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          margin-bottom: 1.75rem;
        }

        .highlight-item, .feature-item {
          display: flex;
          gap: 0.6rem;
          align-items: flex-start;
          font-size: 0.88rem;
          color: var(--text);
          line-height: 1.6;
        }

        .tech-stack-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
        }

        .tech-tag {
          background: rgba(124,58,237,0.1);
          border: 1px solid rgba(124,58,237,0.25);
          color: var(--accent);
          border-radius: 8px;
          padding: 0.3rem 0.75rem;
          font-size: 0.78rem;
          font-family: var(--mono);
          font-weight: 500;
        }

        .github-link {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: 1.5rem;
          padding: 0.6rem 1.2rem;
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 10px;
          color: var(--text-h);
          font-size: 0.85rem;
          font-weight: 500;
          text-decoration: none;
          transition: border-color 0.2s, transform 0.2s;
        }
        .github-link:hover {
          border-color: var(--accent);
          transform: translateY(-2px);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .project-detail-modal {
            grid-template-columns: 1fr !important;
            height: 92vh !important;
            max-height: 92vh !important;
          }
          .carousel-container {
            border-radius: 20px 20px 0 0 !important;
            min-height: 280px !important;
            max-height: 280px !important;
          }
          .carousel-image-mobile {
            height: 75%;
            max-width: 40%;
          }
          .project-info-panel {
            max-height: calc(92vh - 280px) !important;
            padding: 1.5rem 1.25rem;
          }
          .project-info-header {
            flex-direction: column;
            align-items: flex-start;
          }
        }

        @media (max-width: 480px) {
          .project-detail-overlay {
            padding: 0.5rem;
          }
          .carousel-container {
            min-height: 220px !important;
            max-height: 220px !important;
          }
          .carousel-image-mobile {
            height: 70%;
            max-width: 35%;
          }
          .project-info-panel {
            max-height: calc(92vh - 220px) !important;
          }
        }
      `}</style>
    </AnimatePresence>
  );
}
