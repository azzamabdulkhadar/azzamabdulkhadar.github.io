import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { SectionLabel } from './About';
import { useLanguage } from '../LanguageContext';
import { getTranslation } from '../translations';

const skillGroups = [
  {
    category: 'Frontend',
    color: '#7c3aed',
    skills: ['React.js', 'Vite.js', 'HTML5', 'CSS3', 'Ant Design', 'Bootstrap'],
  },
  {
    category: 'Backend',
    color: '#06b6d4',
    skills: ['Node.js', 'Express.js', 'RESTful APIs', 'Multer', 'CORS', 'Mongoose'],
  },
  {
    category: 'Database',
    color: '#10b981',
    skills: ['MongoDB'],
  },
  {
    category: 'Languages',
    color: '#f59e0b',
    skills: ['JavaScript', 'Java', 'PHP'],
  },
  {
    category: 'Version Control',
    color: '#ef4444',
    skills: ['Git', 'GitHub', 'GitLab', 'Bitbucket'],
  },
  {
    category: 'Tools & IDEs',
    color: '#8b5cf6',
    skills: ['Postman', 'VS Code', 'MySQL'],
  },
];

export default function Skills() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const { language } = useLanguage();

  return (
    <section id="skills" ref={ref} style={{
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
          <SectionLabel>{getTranslation(language, 'skillsTitle')}</SectionLabel>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 700 }}>
            {getTranslation(language, 'skillsDescription')}
          </h2>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {skillGroups.map(({ category, color, skills }, gi) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: gi * 0.1, duration: 0.5 }}
              style={{
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                borderRadius: '16px', padding: '1.5rem',
                transition: 'border-color 0.2s, transform 0.2s',
              }}
              whileHover={{ y: -4, borderColor: color }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <div style={{
                  width: 10, height: 10, borderRadius: '50%',
                  background: color, boxShadow: `0 0 10px ${color}`,
                }} />
                <span style={{ fontWeight: 600, color: 'var(--text-h)', fontSize: '0.95rem' }}>{category}</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {skills.map(skill => (
                  <span key={skill} style={{
                    background: `${color}18`,
                    border: `1px solid ${color}40`,
                    color: color,
                    borderRadius: '6px', padding: '0.3rem 0.75rem',
                    fontSize: '0.82rem', fontFamily: 'var(--mono)',
                    fontWeight: 500,
                  }}>
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
