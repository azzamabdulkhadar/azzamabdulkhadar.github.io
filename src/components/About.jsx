import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Code2, Server, Database, GitBranch, Smartphone } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import SectionLabel from './SectionLabel';

export default function About() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const { t } = useTranslation();

  const stats = [
    { label: t('about.stats.projectsBuilt'), value: '10+' },
    { label: t('about.stats.apiEndpoints'), value: '50+' },
    { label: t('about.stats.fasterQueries'), value: '30%' },
    { label: t('about.stats.responsiveUI'), value: '100+' },
  ];

  const highlights = [
    { icon: <Code2 size={20} />, title: t('about.highlights.frontend'), desc: t('about.highlights.frontendDesc') },
    { icon: <Server size={20} />, title: t('about.highlights.backend'), desc: t('about.highlights.backendDesc') },
    { icon: <Database size={20} />, title: t('about.highlights.database'), desc: t('about.highlights.databaseDesc') },
    { icon: <Smartphone size={20} />, title: t('about.highlights.mobileDev'), desc: t('about.highlights.mobileDevDesc') },
    { icon: <GitBranch size={20} />, title: t('about.highlights.versionControl'), desc: t('about.highlights.versionControlDesc') },
  ];

  return (
    <section id="about" ref={ref} style={{ padding: 'var(--space-2xl) 2rem', background: 'var(--bg-secondary)' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
      >
        <SectionLabel>{t('about.label')}</SectionLabel>
        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 700, marginBottom: 'var(--space-xl)' }}>
          {t('about.heading')}
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-xl)', alignItems: 'start' }}>
          <div>
            <p style={{ color: 'var(--text)', lineHeight: 1.9, marginBottom: 'var(--space-md)', fontSize: '1rem' }}>
              {t('about.para1')}
            </p>
            <p style={{ color: 'var(--text)', lineHeight: 1.9, marginBottom: 'var(--space-md)', fontSize: '1rem' }}>
              {t('about.para2_prefix')}<span style={{ color: 'var(--accent-2)', fontWeight: 500 }}>{t('about.para2_company')}</span>{t('about.para2_suffix')}
            </p>
            <p style={{ color: 'var(--text)', lineHeight: 1.9, fontSize: '1rem' }}>
              {t('about.para3_prefix')}<span style={{ color: 'var(--accent-2)', fontWeight: 500 }}>{t('about.para3_company')}</span>{t('about.para3_suffix')}
            </p>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: 'var(--space-lg)' }}>
              {stats.map(({ label, value }) => (
                <div key={label} style={{
                  background: 'var(--bg-card)', border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)', padding: '1rem',
                }}>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, background: 'var(--gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    {value}
                  </div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text)', marginTop: '0.2rem' }}>{label}</div>
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
                  borderRadius: 'var(--radius-md)', padding: 'var(--space-md)',
                  display: 'flex', gap: '1rem', alignItems: 'flex-start',
                  transition: 'border-color 0.2s',
                  cursor: 'default',
                }}
                whileHover={{ borderColor: 'var(--accent)', transition: { duration: 0.2 } }}
              >
                <div style={{
                  width: 40, height: 40, borderRadius: 'var(--radius-sm)',
                  background: 'rgba(124,58,237,0.15)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', color: 'var(--accent)',
                  flexShrink: 0,
                }}>
                  {icon}
                </div>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--text-h)', marginBottom: '0.25rem' }}>{title}</div>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text)' }}>{desc}</div>
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

