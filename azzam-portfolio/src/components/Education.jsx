import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { GraduationCap } from 'lucide-react';
import { SectionLabel } from './About';

const education = [
  {
    degree: 'Bachelor of Technology in Computer Science',
    institution: 'Visvesvaraya Technological University (VTU)',
    location: 'Belagavi, Karnataka',
    period: 'Sep 2021 – Jun 2025',
    icon: '🎓',
    color: '#7c3aed',
  },
  {
    degree: 'Pre-University Course (Science Stream)',
    institution: 'Department of Pre-University Education',
    location: 'Karnataka',
    period: 'Jul 2019 – Jul 2021',
    icon: '📚',
    color: '#06b6d4',
  },
];

export default function Education() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="education" ref={ref} style={{ padding: '6rem 2rem' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ textAlign: 'center', marginBottom: '3rem' }}
        >
          <SectionLabel>Education</SectionLabel>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 700 }}>
            Academic{' '}
            <span style={{ background: 'var(--gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Background
            </span>
          </h2>
        </motion.div>

        <div style={{ maxWidth: '720px', margin: '0 auto', position: 'relative' }}>
          {/* Timeline line */}
          <div style={{
            position: 'absolute', left: 23, top: 0, bottom: 0,
            width: 2, background: 'linear-gradient(to bottom, var(--accent), var(--accent-2))',
            opacity: 0.3,
          }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {education.map(({ degree, institution, location, period, icon, color }, i) => (
              <motion.div
                key={degree}
                initial={{ opacity: 0, x: -30 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: i * 0.2, duration: 0.6 }}
                style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}
              >
                {/* Timeline dot */}
                <div style={{
                  width: 48, height: 48, borderRadius: '50%',
                  background: `${color}20`, border: `2px solid ${color}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.2rem', flexShrink: 0, zIndex: 1,
                  background: 'var(--bg)',
                }}>
                  {icon}
                </div>

                <div style={{
                  flex: 1, background: 'var(--bg-card)', border: '1px solid var(--border)',
                  borderRadius: '16px', padding: '1.5rem',
                  borderLeft: `3px solid ${color}`,
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-h)' }}>{degree}</h3>
                    <span style={{
                      fontFamily: 'var(--mono)', fontSize: '0.75rem',
                      color: color, background: `${color}18`,
                      border: `1px solid ${color}40`,
                      padding: '0.2rem 0.6rem', borderRadius: '6px', whiteSpace: 'nowrap',
                    }}>{period}</span>
                  </div>
                  <div style={{ color: color, fontWeight: 500, fontSize: '0.9rem' }}>{institution}</div>
                  <div style={{ color: 'var(--text)', fontSize: '0.82rem', marginTop: '0.2rem' }}>{location}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
