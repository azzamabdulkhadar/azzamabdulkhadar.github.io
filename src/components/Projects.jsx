import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { ExternalLink, Code2, Layers } from 'lucide-react';
import SectionLabel from './SectionLabel';
import { useTranslation } from 'react-i18next';
import { projects } from '../data/projects';
import ProjectDetail from './ProjectDetail';

export default function Projects() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const { t } = useTranslation();
  const [selectedProject, setSelectedProject] = useState(null);

  return (
    <section id="projects" ref={ref} style={{ padding: 'var(--space-2xl) 2rem', background: 'var(--bg-secondary)' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}
        >
          <SectionLabel>{t('projects.label')}</SectionLabel>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 700 }}>
            {t('projects.heading')}
          </h2>
        </motion.div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
          {projects.map((project, i) => {
            const title = t(`${project.i18nKey}.title`);
            const date = t(`${project.i18nKey}.date`);
            const shortDescription = t(`${project.i18nKey}.shortDescription`);
            const highlights = t(`${project.i18nKey}.highlights`, { returnObjects: true });

            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                onClick={() => setSelectedProject(project)}
                style={{
                  background: 'var(--bg-card)', border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)', padding: 'var(--space-lg)',
                  display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: 'var(--space-lg)', alignItems: 'start',
                  transition: 'border-color 0.2s',
                  borderLeft: `3px solid ${project.color}`,
                  cursor: 'pointer',
                }}
                whileHover={{ borderColor: project.color }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-sm)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                      <span style={{ fontSize: '1.5rem' }}>{project.emoji}</span>
                      <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--text-h)' }}>{title}</h3>
                    </div>
                    <span style={{
                      fontFamily: 'var(--mono)', fontSize: 'var(--text-xs)',
                      color: project.color, background: `${project.color}18`,
                      border: `1px solid ${project.color}40`,
                      padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-sm)',
                    }}>{date}</span>
                  </div>
                  <p style={{ color: 'var(--text)', lineHeight: 1.8, fontSize: '1.05rem', marginBottom: 'var(--space-md)' }}>
                    {shortDescription}
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-xs)' }}>
                    {project.stack.slice(0, 4).map(tech => (
                      <span key={tech} style={{
                        background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-sm)', padding: '0.2rem 0.6rem',
                        fontSize: 'var(--text-sm)', fontFamily: 'var(--mono)', color: 'var(--text)',
                      }}>{tech}</span>
                    ))}
                    {project.stack.length > 4 && (
                      <span style={{
                        background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-sm)', padding: '0.2rem 0.6rem',
                        fontSize: 'var(--text-sm)', fontFamily: 'var(--mono)', color: 'var(--text)',
                      }}>+{project.stack.length - 4}</span>
                    )}
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: 'var(--space-sm)' }}>
                    <Layers size={14} color={project.color} />
                    <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-h)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {t('projects.keyHighlights')}
                    </span>
                  </div>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {Array.isArray(highlights) && highlights.slice(0, 2).map((h, idx) => (
                      <li key={idx} style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start', fontSize: '1rem', color: 'var(--text)' }}>
                        <span style={{ color: project.color, marginTop: '0.15rem', flexShrink: 0 }}>▸</span>
                        {h}
                      </li>
                    ))}
                  </ul>
                  <span style={{
                    display: 'inline-block', marginTop: '1rem',
                    fontSize: 'var(--text-sm)', color: project.color, fontWeight: 500,
                  }}>
                    {t('projects.viewMore')}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
          style={{ textAlign: 'center', marginTop: '2.5rem' }}
        >
          <a
            href="https://github.com/azzamabdulkhadar"
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)', padding: '0.75rem 1.5rem',
              color: 'var(--text-h)', fontWeight: 500, fontSize: 'var(--text-base)',
              transition: 'border-color 0.2s, transform 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            <Code2 size={18} /> {t('projects.viewAllGithub')} <ExternalLink size={14} />
          </a>
        </motion.div>
      </div>

      {/* Project Detail Modal */}
      {selectedProject && (
        <ProjectDetail
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </section>
  );
}
