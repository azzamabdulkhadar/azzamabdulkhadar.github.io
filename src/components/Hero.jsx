import { motion } from 'framer-motion';
import { Mail, Download, ArrowDown } from 'lucide-react';
import { GitHubIcon, LinkedInIcon } from './icons/BrandIcons';
import heroImg from '../assets/profile.png';
import { useTranslation } from 'react-i18next';

export default function Hero() {
  const { t } = useTranslation();
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section className="hero-section" style={{
      display: 'flex', alignItems: 'center',
      justifyContent: 'center',
      position: 'relative', overflow: 'hidden',
      background: 'var(--bg-secondary)',
    }}>
      {/* Background glow blobs */}
      <div style={{
        position: 'absolute', top: '20%', left: '10%',
        width: '400px', height: '400px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)',
        filter: 'blur(40px)', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '20%', right: '10%',
        width: '350px', height: '350px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)',
        filter: 'blur(40px)', pointerEvents: 'none',
      }} />

      <div className="hero-inner" style={{
        maxWidth: 'var(--container)', width: '100%', margin: '0 auto',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 'var(--space-xl)', flexWrap: 'wrap',
      }}>
        {/* Text side */}
        <motion.div
          className="hero-text"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          style={{ flex: '1 1 26rem', minWidth: 0 }}
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            style={{ fontFamily: 'var(--mono)', color: 'var(--accent-2)', fontSize: 'var(--text-base)', marginBottom: '1rem' }}
          >
            👋 {t('hero.greeting')}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            style={{ fontSize: 'clamp(2.2rem, 5.5vw, 3.6rem)', fontWeight: 800, lineHeight: 1.12, marginBottom: 'var(--space-sm)' }}
          >
            Azzam Abdul{' '}
            <span style={{ background: 'var(--gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Khadar
            </span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="hero-status"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.3)',
              borderRadius: '100px', padding: 'var(--space-xs) 1rem', marginBottom: '1.5rem',
            }}
          >
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', display: 'inline-block', animation: 'pulse 2s infinite' }} />
            <span style={{ fontFamily: 'var(--mono)', fontSize: 'var(--text-sm)', color: 'var(--text-h)' }}>
              {t('hero.subtitle')}
            </span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="hero-description"
            style={{ fontSize: 'var(--text-base)', color: 'var(--text)', lineHeight: 1.7, marginBottom: '1rem', maxWidth: '33rem' }}
          >
            {t('hero.description')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65 }}
            className="hero-tech"
            style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-xs)', marginBottom: 'var(--space-sm)' }}
          >
            {['MongoDB', 'Express', 'React', 'Node.js', 'Flutter', 'MySQL'].map(tech => (
              <span key={tech} style={{
                background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.25)',
                color: 'var(--accent)', borderRadius: 'var(--radius-sm)', padding: '0.2rem 0.6rem',
                fontSize: 'var(--text-xs)', fontFamily: 'var(--mono)', fontWeight: 500,
              }}>{tech}</span>
            ))}
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            style={{ fontSize: 'var(--text-sm)', color: 'var(--accent-2)', fontFamily: 'var(--mono)', marginBottom: '1.5rem' }}
          >
            {t('hero.performanceNote')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75 }}
            className="hero-actions"
            style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap', marginBottom: 'var(--space-lg)' }}
          >
            <button onClick={() => scrollTo('projects')} style={{
              background: 'var(--gradient)', color: '#fff', border: 'none',
              padding: '0.65rem 1.4rem', borderRadius: 'var(--radius-sm)', cursor: 'pointer',
              fontWeight: 600, fontSize: 'var(--text-sm)', fontFamily: 'var(--font)',
              transition: 'opacity 0.2s, transform 0.2s',
            }}
              onMouseEnter={e => { e.target.style.opacity = '0.85'; e.target.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.target.style.opacity = '1'; e.target.style.transform = 'translateY(0)'; }}
            >
              {t('hero.viewProjects')}
            </button>
            <a href="/azzamResume/Azzam_Resume.pdf" download="Azzam_Resume.pdf" style={{
              display: 'inline-flex', alignItems: 'center', gap: 'var(--space-xs)',
              background: 'transparent', color: 'var(--text-h)',
              border: '1px solid var(--border)', padding: '0.65rem 1.4rem',
              borderRadius: 'var(--radius-sm)', fontWeight: 500, textDecoration: 'none',
              fontSize: 'var(--text-sm)', fontFamily: 'var(--font)', transition: 'border-color 0.2s, transform 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <Download size={15} /> {t('hero.downloadResume')}
            </a>
            <button onClick={() => scrollTo('contact')} style={{
              background: 'transparent', color: 'var(--text-h)',
              border: '1px solid var(--border)', padding: '0.65rem 1.4rem',
              borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontWeight: 500,
              fontSize: 'var(--text-sm)', fontFamily: 'var(--font)', transition: 'border-color 0.2s, transform 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              {t('hero.contactMe')}
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="hero-socials"
            style={{ display: 'flex', gap: '1rem' }}
          >
            {[
              { icon: <GitHubIcon size={20} />, href: 'https://github.com/azzamabdulkhadar', label: 'GitHub' },
              { icon: <LinkedInIcon size={20} />, href: 'https://linkedin.com/in/azzamabdulkhadar', label: 'LinkedIn' },
              { icon: <Mail size={20} />, href: 'mailto:azzamcse@gmail.com', label: 'Email' },
            ].map(({ icon, href, label }, i) => (
              <a key={i} href={href} target="_blank" rel="noreferrer" aria-label={label} style={{
                width: 42, height: 42, borderRadius: 'var(--radius-sm)',
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--text)', transition: 'all 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text)'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                {icon}
              </a>
            ))}
          </motion.div>
        </motion.div>

        {/* Image side */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="hero-image"
          style={{ flex: '0 0 auto', display: 'flex', justifyContent: 'center' }}
        >
          <div style={{ position: 'relative' }}>
            <div style={{
              /* Lower bound keeps it visible on phones, upper bound is in rem
                 so it grows with the root font-size scaling on large displays */
              width: 'clamp(11rem, 46vw, 20rem)', height: 'clamp(11rem, 46vw, 20rem)',
              borderRadius: '50%',
              background: 'var(--gradient)', padding: '3px',
              boxShadow: '0 0 60px var(--accent-glow)',
            }}>
              <div style={{
                width: '100%', height: '100%', borderRadius: '50%',
                background: 'var(--bg-card)', overflow: 'hidden',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <img src={heroImg} alt="Azzam Abdul Khadar, full stack developer" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            </div>
            {/* Floating badge */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
              className="hero-badge"
              style={{
                position: 'absolute',
                bottom: 'clamp(6px, 1.5vw, 12px)',
                right: 'clamp(-14px, -2vw, 0px)',
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                /* One clamped font-size drives the whole badge. Padding, gap and
                   the child text are all in em, so the badge scales as a single
                   unit with the viewport instead of each value drifting apart
                   from the avatar, which scales via clamp(11rem, 46vw, 20rem). */
                fontSize: 'clamp(10px, 2.1vw, 1rem)',
                padding: '0.5em 0.85em',
                display: 'flex', alignItems: 'center', gap: '0.5em',
                boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                whiteSpace: 'nowrap',
              }}
            >
              <span style={{ fontSize: '1.3em', lineHeight: 1 }}>⚡</span>
              <div>
                <div className="hero-badge-label" style={{ fontSize: '0.78em', color: 'var(--text)', lineHeight: 1.1 }}>{t('hero.experienceLabel')}</div>
                <div style={{ fontSize: '0.95em', fontWeight: 700, color: 'var(--text-h)', lineHeight: 1.2 }}>{t('hero.experienceBadge')}</div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        onClick={() => scrollTo('about')}
        style={{
          position: 'absolute', bottom: 'var(--space-lg)', left: '50%', transform: 'translateX(-50%)',
          cursor: 'pointer', color: 'var(--text)', opacity: 0.5,
        }}
      >
        <ArrowDown size={22} />
      </motion.div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        /* The hero is sized by its padding rather than a forced 100vh.
           Centring short content inside a full-viewport box was what created
           the large dead gap under the buttons.

           The top value is its own clamp rather than --space-2xl: that token is
           tuned for the larger gaps between sections, and reusing it here left
           roughly 66px of dead space under the navbar. The fixed navbar is
           about 82px tall (12px outer + 10px inner padding around a 38px logo),
           so ~112px leaves a deliberate ~30px breathing gap below it. */
        .hero-section {
          padding: clamp(7rem, 7.5vw, 8.5rem) var(--gutter) var(--space-2xl);
        }

        /* Stack and centre the hero on tablets and phones */
        @media (max-width: 860px) {
          .hero-inner {
            flex-direction: column;
            text-align: center;
          }
          .hero-text {
            flex: 1 1 auto !important;
            order: 2;
          }
          .hero-image {
            order: 1;
          }
          .hero-description {
            margin-left: auto;
            margin-right: auto;
          }
          .hero-actions,
          .hero-socials,
          .hero-tech,
          .hero-status {
            justify-content: center;
          }
        }

        /* On the narrowest screens the secondary "Experience" label scales down
           to around 8px, which isn't legible. Drop it and keep the stack name,
           which carries the actual meaning. */
        @media (max-width: 380px) {
          .hero-badge-label {
            display: none;
          }
        }

        /* Full-width stacked buttons on small phones */
        @media (max-width: 420px) {
          .hero-actions {
            flex-direction: column;
            align-items: stretch;
          }
          .hero-actions > button,
          .hero-actions > a {
            width: 100%;
            justify-content: center;
          }
        }

        /* Large displays: widen the gap between the two columns so the extra
           container width is shared instead of stretching the text column. */
        @media (min-width: 1500px) {
          .hero-inner {
            gap: calc(var(--space-xl) * 1.6);
          }
        }

        /* Social icon buttons are px-sized boxes, so scale them in step with
           the root font-size bump applied on large displays. */
        @media (min-width: 1800px) {
          .hero-socials a {
            width: 3rem !important;
            height: 3rem !important;
          }
        }
      `}</style>
    </section>
  );
}
