import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { ExternalLink, Code2, Layers } from 'lucide-react';
import { SectionLabel } from './About';

const projects = [
  {
    title: 'TaskHive',
    date: 'Jun 2025',
    description:
      'A full-featured MERN web application with RESTful APIs for user management, note-taking, lead tracking, and event scheduling. Integrated secure file upload using Multer and optimized database operations with Mongoose.',
    highlights: [
      '15+ backend API endpoints developed & tested',
      '30% faster response times via optimized queries',
      '100% responsive UI with Ant Design',
      'CORS configured for secure multi-origin access',
    ],
    stack: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Ant Design', 'Multer', 'Mongoose'],
    color: '#7c3aed',
    emoji: '🐝',
  },
  {
    title: 'BloodHub',
    date: 'Apr – May 2025',
    description:
      'A full-stack MERN application to automate and streamline blood donation coordination between donors, recipients, and administrators with real-time request handling.',
    highlights: [
      'Reduced manual coordination time by 30%',
      'Scaled to handle 100+ donation requests',
      'Real-time RESTful API integration',
      'Role-based access for donors, recipients, admins',
    ],
    stack: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'REST APIs'],
    color: '#ef4444',
    emoji: '🩸',
  },
  {
    title: 'Hotel Booking Management System',
    date: 'Nov – Dec 2024',
    description:
      'A system to automate hotel booking processes including reservations, guest check-out, and dynamic room pricing based on guest demand.',
    highlights: [
      'Supports 100+ bookings',
      'Dynamic room pricing engine',
      'Automated reservation & check-out flow',
      'Full-stack with PHP + MySQL backend',
    ],
    stack: ['JavaScript', 'HTML', 'CSS', 'PHP', 'MySQL'],
    color: '#06b6d4',
    emoji: '🏨',
  },
];

export default function Projects() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="projects" ref={ref} style={{ padding: '6rem 2rem' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ textAlign: 'center', marginBottom: '3rem' }}
        >
          <SectionLabel>Projects</SectionLabel>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 700 }}>
            Things I've{' '}
            <span style={{ background: 'var(--gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Built
            </span>
          </h2>
        </motion.div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {projects.map(({ title, date, description, highlights, stack, color, emoji }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              style={{
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                borderRadius: '20px', padding: '2rem',
                display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '2rem', alignItems: 'start',
                transition: 'border-color 0.2s',
                borderLeft: `3px solid ${color}`,
              }}
              whileHover={{ borderColor: color }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontSize: '1.5rem' }}>{emoji}</span>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-h)' }}>{title}</h3>
                  </div>
                  <span style={{
                    fontFamily: 'var(--mono)', fontSize: '0.75rem',
                    color: color, background: `${color}18`,
                    border: `1px solid ${color}40`,
                    padding: '0.2rem 0.6rem', borderRadius: '6px',
                  }}>{date}</span>
                </div>
                <p style={{ color: 'var(--text)', lineHeight: 1.8, fontSize: '0.95rem', marginBottom: '1.25rem' }}>
                  {description}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {stack.map(t => (
                    <span key={t} style={{
                      background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)',
                      borderRadius: '6px', padding: '0.2rem 0.6rem',
                      fontSize: '0.78rem', fontFamily: 'var(--mono)', color: 'var(--text)',
                    }}>{t}</span>
                  ))}
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <Layers size={14} color={color} />
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-h)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Key Highlights
                  </span>
                </div>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {highlights.map(h => (
                    <li key={h} style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start', fontSize: '0.9rem', color: 'var(--text)' }}>
                      <span style={{ color: color, marginTop: '0.15rem', flexShrink: 0 }}>▸</span>
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
          style={{ textAlign: 'center', marginTop: '2.5rem' }}
        >
          <a
            href="https://github.com/Azzam-Abdul-Khadar"
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: '10px', padding: '0.75rem 1.5rem',
              color: 'var(--text-h)', fontWeight: 500, fontSize: '0.9rem',
              transition: 'border-color 0.2s, transform 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            <Code2 size={18} /> View All on GitHub <ExternalLink size={14} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
