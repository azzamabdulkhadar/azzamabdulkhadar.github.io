import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Code2, Server, Database, GitBranch } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { getTranslation } from '../translations';

const stats = [
  { label: 'Projects Built', value: '3+' },
  { label: 'API Endpoints', value: '15+' },
  { label: 'Faster Queries', value: '30%' },
  { label: 'Responsive UI', value: '100%' },
];

const highlights = [
  { icon: <Code2 size={20} />, title: 'Frontend', desc: 'React.js, Vite, Ant Design, Bootstrap, HTML/CSS' },
  { icon: <Server size={20} />, title: 'Backend', desc: 'Node.js, Express.js, RESTful APIs' },
  { icon: <Database size={20} />, title: 'Database', desc: 'MongoDB, Mongoose, optimized queries' },
  { icon: <GitBranch size={20} />, title: 'Version Control', desc: 'Git, GitHub, GitLab, Bitbucket' },
];

export default function About() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const { language } = useLanguage();

  return (
    <section id="about" ref={ref} style={{ padding: '6rem 2rem', background: 'var(--bg-secondary)' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
      >
        <SectionLabel>{getTranslation(language, 'aboutTitle')}</SectionLabel>
        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 700, marginBottom: '3rem' }}>
          {getTranslation(language, 'aboutDescription')}
        <SectionLabel>About Me</SectionLabel>
        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 700, marginBottom: '3rem' }}>
          Turning ideas into{' '}
          <span style={{ background: 'var(--gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            real products
          </span>
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '3rem', alignItems: 'start' }}>
          <div>
            <p style={{ color: 'var(--text)', lineHeight: 1.9, marginBottom: '1.25rem', fontSize: '1rem' }}>
              I'm a Full Stack Developer from Karnataka, India, with a B.Tech in Computer Science from VTU.
              My journey started with curiosity about how the web works and evolved into building complete,
              production-ready applications.
            </p>
            <p style={{ color: 'var(--text)', lineHeight: 1.9, marginBottom: '1.25rem', fontSize: '1rem' }}>
              During my internship at <span style={{ color: 'var(--accent-2)', fontWeight: 500 }}>Zenexis Solutions Pvt Ltd</span>,
              I collaborated on two full-stack web applications, sharpening my skills in responsive UI design,
              RESTful API integration, and Agile development workflows.
            </p>
            <p style={{ color: 'var(--text)', lineHeight: 1.9, fontSize: '1rem' }}>
              I thrive on solving real-world problems — from automating blood donation coordination to
              building task management systems with optimized backend performance.
            </p>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '2rem' }}>
              {stats.map(({ label, value }) => (
                <div key={label} style={{
                  background: 'var(--bg-card)', border: '1px solid var(--border)',
                  borderRadius: '12px', padding: '1rem',
                }}>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, background: 'var(--gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    {value}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text)', marginTop: '0.2rem' }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {highlights.map(({ icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, x: 30 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
                style={{
                  background: 'var(--bg-card)', border: '1px solid var(--border)',
                  borderRadius: '12px', padding: '1.25rem',
                  display: 'flex', gap: '1rem', alignItems: 'flex-start',
                  transition: 'border-color 0.2s',
                  cursor: 'default',
                }}
                whileHover={{ borderColor: 'var(--accent)', transition: { duration: 0.2 } }}
              >
                <div style={{
                  width: 40, height: 40, borderRadius: '10px',
                  background: 'rgba(124,58,237,0.15)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', color: 'var(--accent)',
                  flexShrink: 0,
                }}>
                  {icon}
                </div>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--text-h)', marginBottom: '0.25rem' }}>{title}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text)' }}>{desc}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
      </div>
    </section>
  );
}

export function SectionLabel({ children }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
      fontFamily: 'var(--mono)', fontSize: '0.8rem', color: 'var(--accent)',
      marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em',
    }}>
      <span style={{ width: 20, height: 1, background: 'var(--accent)', display: 'inline-block' }} />
      {children}
      <span style={{ width: 20, height: 1, background: 'var(--accent)', display: 'inline-block' }} />
    </div>
  );
}
