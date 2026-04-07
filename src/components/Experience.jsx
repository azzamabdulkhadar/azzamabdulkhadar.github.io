import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Briefcase } from 'lucide-react';
import { SectionLabel } from './About';

export default function Experience() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="experience" ref={ref} style={{
      padding: '6rem 2rem',
      background: 'var(--bg-secondary)',
    }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ textAlign: 'center', marginBottom: '3rem' }}
        >
          <SectionLabel>Experience</SectionLabel>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 700 }}>
            Work{' '}
            <span style={{ background: 'var(--gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Experience
            </span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.6 }}
          style={{ maxWidth: '720px', margin: '0 auto' }}
        >
          <div style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: '20px', padding: '2rem',
            borderLeft: '3px solid var(--accent)',
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem' }}>
              <div style={{
                width: 48, height: 48, borderRadius: '12px',
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
                      Intern – Full Stack Developer
                    </h3>
                    <div style={{ color: 'var(--accent-2)', fontWeight: 500, fontSize: '0.95rem' }}>
                      Zenexis Solutions Pvt Ltd
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text)', marginTop: '0.15rem' }}>
                      Karnataka, India
                    </div>
                  </div>
                  <span style={{
                    fontFamily: 'var(--mono)', fontSize: '0.78rem',
                    color: 'var(--accent)', background: 'rgba(124,58,237,0.1)',
                    border: '1px solid rgba(124,58,237,0.3)',
                    padding: '0.3rem 0.75rem', borderRadius: '6px', whiteSpace: 'nowrap',
                  }}>
                    Feb 2025 – Jun 2025
                  </span>
                </div>

                <ul style={{ listStyle: 'none', marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {[
                    'Collaborated on two full-stack web applications focused on responsive UI and RESTful API integration.',
                    'Participated in Agile development, peer code reviews, and debugging sessions.',
                    'Gained hands-on experience using React.js, Vite.js, Bootstrap, Node.js, and MongoDB.',
                  ].map((item, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={inView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: 0.4 + i * 0.1 }}
                      style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', color: 'var(--text)', fontSize: '0.95rem', lineHeight: 1.7 }}
                    >
                      <span style={{ color: 'var(--accent)', marginTop: '0.2rem', flexShrink: 0 }}>▸</span>
                      {item}
                    </motion.li>
                  ))}
                </ul>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '1.5rem' }}>
                  {['React.js', 'Vite.js', 'Bootstrap', 'Node.js', 'MongoDB', 'Agile'].map(t => (
                    <span key={t} style={{
                      background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.25)',
                      color: 'var(--accent)', borderRadius: '6px', padding: '0.2rem 0.6rem',
                      fontSize: '0.78rem', fontFamily: 'var(--mono)',
                    }}>{t}</span>
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
