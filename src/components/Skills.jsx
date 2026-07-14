import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import SectionLabel from './SectionLabel';
import { useTranslation } from 'react-i18next';

export default function Skills() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const { t } = useTranslation();

  const skillGroups = [
    { categoryKey: 'programmingLanguages', color: '#f59e0b', skills: ['JavaScript', 'TypeScript', 'Dart', 'Java', 'Python'] },
    { categoryKey: 'frontend', color: '#7c3aed', skills: ['React.js', 'Next.js', 'Vite', 'HTML', 'CSS', 'Tailwind CSS', 'Bootstrap', 'React Bootstrap', 'Ant Design'] },
    { categoryKey: 'backendDatabase', color: '#06b6d4', skills: ['Node.js', 'Express.js', 'Flask', 'RESTful APIs', 'Redis', 'MongoDB', 'PostgreSQL', 'SQL'] },
    { categoryKey: 'mobileDevelopment', color: '#10b981', skills: ['Flutter', 'Android Development (Material UI)'] },
    { categoryKey: 'versionControl', color: '#ef4444', skills: ['Git', 'GitHub', 'GitLab', 'Bitbucket'] },
    { categoryKey: 'developmentTools', color: '#8b5cf6', skills: ['VS Code', 'Android Studio', 'Postman'] },
    { categoryKey: 'deployment', color: '#ec4899', skills: ['Vercel', 'Render', 'Coolify', 'Google Play Console', 'App Store Connect'] },
    { categoryKey: 'architecture', color: '#3b82f6', skills: ['System Design', 'Scalable Architecture', 'Agile/Scrum'] },
  ];

  return (
    <section id="skills" ref={ref} style={{ padding: 'var(--space-2xl) 2rem', background: 'var(--bg-secondary)' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}
        >
          <SectionLabel>{t('skills.label')}</SectionLabel>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 700 }}>
            {t('skills.heading')}
          </h2>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {skillGroups.map(({ categoryKey, color, skills }, gi) => (
            <motion.div
              key={categoryKey}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: gi * 0.1, duration: 0.5 }}
              style={{
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)', padding: '1.5rem',
                transition: 'border-color 0.2s, transform 0.2s',
              }}
              whileHover={{ y: -4, borderColor: color }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-md)' }}>
                <div style={{
                  width: 10, height: 10, borderRadius: '50%',
                  background: color, boxShadow: `0 0 10px ${color}`,
                }} />
                <span style={{ fontWeight: 600, color: 'var(--text-h)', fontSize: 'var(--text-base)' }}>
                  {t(`skills.categories.${categoryKey}`)}
                </span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {skills.map(skill => (
                  <span key={skill} style={{
                    background: `${color}18`,
                    border: `1px solid ${color}40`,
                    color: color,
                    borderRadius: 'var(--radius-sm)', padding: '0.3rem var(--space-sm)',
                    fontSize: 'var(--text-sm)', fontFamily: 'var(--mono)',
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
