import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Briefcase } from 'lucide-react';
import SectionLabel from './SectionLabel';
import { useTranslation } from 'react-i18next';

export default function Experience() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const { t } = useTranslation();

  const job1Responsibilities = t('experience.job1.responsibilities', { returnObjects: true });
  const job2Responsibilities = t('experience.job2.responsibilities', { returnObjects: true });

  return (
    <section id="experience" ref={ref} style={{ padding: 'var(--space-2xl) 2rem', background: 'var(--bg-secondary)' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}
        >
          <SectionLabel>{t('experience.label')}</SectionLabel>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 700 }}>
            {t('experience.heading')}
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.6 }}
          style={{ maxWidth: '720px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}
        >
          {/* Atmez AI Solutions */}
          <div style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)', padding: 'var(--space-lg)',
            borderLeft: '3px solid var(--accent)',
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-md)' }}>
              <div style={{
                width: 48, height: 48, borderRadius: 'var(--radius-md)',
                background: 'rgba(124,58,237,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--accent)', flexShrink: 0,
              }}>
                <Briefcase size={22} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-h)', marginBottom: '0.2rem' }}>
                      {t('experience.job1.position')}
                    </h3>
                    <div style={{ color: 'var(--accent-2)', fontWeight: 500, fontSize: 'var(--text-base)' }}>
                      {t('experience.job1.company')}
                    </div>
                    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text)', marginTop: '0.15rem' }}>
                      {t('experience.job1.location')}
                    </div>
                  </div>
                  <span style={{
                    fontFamily: 'var(--mono)', fontSize: 'var(--text-xs)',
                    color: 'var(--accent)', background: 'rgba(124,58,237,0.1)',
                    border: '1px solid rgba(124,58,237,0.3)',
                    padding: '0.3rem var(--space-sm)', borderRadius: 'var(--radius-sm)', whiteSpace: 'nowrap',
                  }}>
                    {t('experience.job1.period')}
                  </span>
                </div>

                <ul style={{ listStyle: 'none', marginTop: 'var(--space-md)', display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                  {Array.isArray(job1Responsibilities) && job1Responsibilities.map((item, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={inView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: 0.4 + i * 0.1 }}
                      style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'flex-start', color: 'var(--text)', fontSize: 'var(--text-base)', lineHeight: 1.7 }}
                    >
                      <span style={{ color: 'var(--accent)', marginTop: '0.2rem', flexShrink: 0 }}>▸</span>
                      {item}
                    </motion.li>
                  ))}
                </ul>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-xs)', marginTop: '1.5rem' }}>
                  {['Flutter', 'Dart', 'REST APIs', 'Dio', 'MySQL', 'Provider', 'Agile'].map(tech => (
                    <span key={tech} style={{
                      background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.25)',
                      color: 'var(--accent)', borderRadius: 'var(--radius-sm)', padding: '0.2rem 0.6rem',
                      fontSize: 'var(--text-xs)', fontFamily: 'var(--mono)',
                    }}>{tech}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Zenexis Solutions */}
          <div style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)', padding: 'var(--space-lg)',
            borderLeft: '3px solid #06b6d4',
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-md)' }}>
              <div style={{
                width: 48, height: 48, borderRadius: 'var(--radius-md)',
                background: 'rgba(6,182,212,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#06b6d4', flexShrink: 0,
              }}>
                <Briefcase size={22} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-h)', marginBottom: '0.2rem' }}>
                      {t('experience.job2.position')}
                    </h3>
                    <div style={{ color: '#06b6d4', fontWeight: 500, fontSize: 'var(--text-base)' }}>
                      {t('experience.job2.company')}
                    </div>
                    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text)', marginTop: '0.15rem' }}>
                      {t('experience.job2.location')}
                    </div>
                  </div>
                  <span style={{
                    fontFamily: 'var(--mono)', fontSize: 'var(--text-xs)',
                    color: '#06b6d4', background: 'rgba(6,182,212,0.1)',
                    border: '1px solid rgba(6,182,212,0.3)',
                    padding: '0.3rem var(--space-sm)', borderRadius: 'var(--radius-sm)', whiteSpace: 'nowrap',
                  }}>
                    {t('experience.job2.period')}
                  </span>
                </div>

                <ul style={{ listStyle: 'none', marginTop: 'var(--space-md)', display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                  {Array.isArray(job2Responsibilities) && job2Responsibilities.map((item, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={inView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: 0.4 + i * 0.1 }}
                      style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'flex-start', color: 'var(--text)', fontSize: 'var(--text-base)', lineHeight: 1.7 }}
                    >
                      <span style={{ color: '#06b6d4', marginTop: '0.2rem', flexShrink: 0 }}>▸</span>
                      {item}
                    </motion.li>
                  ))}
                </ul>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-xs)', marginTop: '1.5rem' }}>
                  {['React.js', 'Vite', 'Node.js', 'Express.js', 'MongoDB', 'Bootstrap', 'Ant Design', 'Agile'].map(tech => (
                    <span key={tech} style={{
                      background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.25)',
                      color: '#06b6d4', borderRadius: 'var(--radius-sm)', padding: '0.2rem 0.6rem',
                      fontSize: 'var(--text-xs)', fontFamily: 'var(--mono)',
                    }}>{tech}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
