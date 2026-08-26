import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef, useState } from 'react';
import { Award, ExternalLink, X, ChevronLeft, ChevronRight } from 'lucide-react';
import SectionLabel from './SectionLabel';

import bTech from '../assets/certificates/bTech.jpeg';
import courseMERN from '../assets/certificates/course_MERN.jpeg';
import genAIBootcamp from '../assets/certificates/genAI_bootcamp.jpeg';
import internPerfAI from '../assets/certificates/intern_perfAI.jpeg';
import internZS from '../assets/certificates/intern_ZS.jpeg';
import javaWeb from '../assets/certificates/java_web.jpeg';
import oracleBadge from '../assets/certificates/oracleC/oracle/Oracle Cloud Infrastructure 2025 Certified AI Foundations Associate_files/OCI25AICFAV1.png';

const certificates = [
  {
    title: 'Oracle Cloud AI Foundations Associate',
    issuer: 'Oracle',
    date: '2025',
    image: oracleBadge,
    link: 'https://catalog-education.oracle.com/pls/certview/sharebadge?id=297275E483F0709516F12E6FFA3EF5CF2068AD48096176EF613FAF2C7B4394E1',
    category: 'certification',
    color: '#f80000',
  },
  {
    title: 'MERN Stack Development',
    issuer: 'Course Completion',
    date: '2025',
    image: courseMERN,
    link: 'https://www.mindluster.com',
    category: 'course',
    color: '#10b981',
  },
  {
    title: 'PerfAI Internship',
    issuer: 'PerfAI, Inc.',
    date: '2025',
    image: internPerfAI,
    link: 'https://www.perfai.ai',
    category: 'internship',
    color: '#06b6d4',
  },
  {
    title: 'Generative AI Bootcamp',
    issuer: 'GenAI 101 with Pieces',
    date: '2025',
    image: genAIBootcamp,
    category: 'course',
    color: '#8b5cf6',
  },
  {
    title: 'Java Web Development',
    issuer: 'Course Certificate',
    date: '2025',
    image: javaWeb,
    category: 'course',
    color: '#f59e0b',
  },
  // {
  //   title: 'ZS Associates Internship',
  //   issuer: 'ZS Associates',
  //   date: '2025',
  //   image: internZS,
  //   link: 'https://www.zs.com',
  //   category: 'internship',
  //   color: '#3b82f6',
  // },
  {
    title: 'B.Tech Computer Science',
    issuer: 'VTU',
    date: '2025',
    image: bTech,
    category: 'degree',
    color: '#7c3aed',
  },
];

const categories = ['all', 'certification', 'course', 'internship', 'degree'];

const categoryLabels = {
  all: 'All',
  certification: 'Certifications',
  course: 'Courses',
  internship: 'Internships',
  degree: 'Degrees',
};

export default function Certificates() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedCert, setSelectedCert] = useState(null);

  const filtered = activeFilter === 'all'
    ? certificates
    : certificates.filter(c => c.category === activeFilter);

  const handlePrev = () => {
    const idx = certificates.findIndex(c => c.title === selectedCert.title);
    const prevIdx = (idx - 1 + certificates.length) % certificates.length;
    setSelectedCert(certificates[prevIdx]);
  };

  const handleNext = () => {
    const idx = certificates.findIndex(c => c.title === selectedCert.title);
    const nextIdx = (idx + 1) % certificates.length;
    setSelectedCert(certificates[nextIdx]);
  };

  return (
    <section id="certificates" ref={ref} style={{ padding: 'var(--space-2xl) var(--gutter)', background: 'var(--bg)' }}>
      <div style={{ maxWidth: 'var(--container)', margin: '0 auto' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.7 }}
          style={{ textAlign: 'center', marginBottom: 'var(--space-lg)' }}
        >
          <SectionLabel>Certificates</SectionLabel>
          <h2 style={{ fontSize: 'var(--h2)', fontWeight: 700, marginBottom: '0.75rem' }}>
            Achievements & Credentials
          </h2>
          <p style={{ color: 'var(--text)', fontSize: 'var(--text-base)', maxWidth: '34rem', margin: '0 auto', lineHeight: 1.6 }}>
            Professional certifications, courses, and recognitions that validate my skills and expertise.
          </p>
        </motion.div>

        {/* Filter tabs */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={inView ? { opacity: 1, y: 0 } : undefined}
          transition={{ delay: 0.2, duration: 0.5 }}
          style={{
            display: 'flex', justifyContent: 'center', flexWrap: 'wrap',
            gap: '0.5rem', marginBottom: 'var(--space-xl)',
          }}
        >
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              style={{
                background: activeFilter === cat ? 'var(--accent)' : 'transparent',
                color: activeFilter === cat ? '#fff' : 'var(--text)',
                border: `1px solid ${activeFilter === cat ? 'var(--accent)' : 'var(--border)'}`,
                borderRadius: '20px',
                padding: '0.45rem 1rem',
                fontSize: 'var(--text-sm)',
                fontFamily: 'var(--font)',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.25s ease',
              }}
            >
              {categoryLabels[cat]}
            </button>
          ))}
        </motion.div>

        {/* Certificate grid */}
        <motion.div
          layout
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))',
            gap: 'var(--space-md)',
          }}
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((cert, i) => (
              <motion.div
                key={cert.title}
                layout
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -10 }}
                transition={{ duration: 0.35, delay: i * 0.05 }}
                onClick={() => cert.image && setSelectedCert(cert)}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  cursor: cert.image ? 'pointer' : 'default',
                  transition: 'border-color 0.3s, box-shadow 0.3s, transform 0.3s',
                }}
                whileHover={{
                  y: -4,
                  borderColor: cert.color,
                  boxShadow: `0 8px 30px ${cert.color}20`,
                }}
              >
                {/* Image preview */}
                {cert.image ? (
                  <div style={{
                    width: '100%', height: '160px', overflow: 'hidden',
                    background: 'var(--bg-secondary)',
                    position: 'relative',
                  }}>
                    <img
                      src={cert.image}
                      alt={cert.title}
                      loading="lazy"
                      style={{
                        width: '100%', height: '100%', objectFit: 'cover',
                        transition: 'transform 0.4s ease',
                      }}
                      onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                      onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                    />
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: 'linear-gradient(to top, var(--bg-card) 0%, transparent 50%)',
                      pointerEvents: 'none',
                    }} />
                  </div>
                ) : (
                  <div style={{
                    width: '100%', height: '160px',
                    background: `linear-gradient(135deg, ${cert.color}15, ${cert.color}05)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    position: 'relative',
                  }}>
                    <Award size={48} color={cert.color} strokeWidth={1.2} style={{ opacity: 0.6 }} />
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: 'linear-gradient(to top, var(--bg-card) 0%, transparent 60%)',
                      pointerEvents: 'none',
                    }} />
                  </div>
                )}

                {/* Content */}
                <div style={{ padding: '1.2rem 1.4rem 1.4rem' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
                    <div>
                      <h3 style={{
                        fontSize: 'var(--text-base)', fontWeight: 600,
                        color: 'var(--text-h)', marginBottom: '0.3rem', lineHeight: 1.3,
                      }}>
                        {cert.title}
                      </h3>
                      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text)', margin: 0 }}>
                        {cert.issuer}
                      </p>
                    </div>
                    {cert.link && (
                      <a
                        href={cert.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={e => e.stopPropagation()}
                        style={{
                          color: cert.color, flexShrink: 0, padding: '4px',
                          borderRadius: '6px', transition: 'background 0.2s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = `${cert.color}15`}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <ExternalLink size={16} />
                      </a>
                    )}
                  </div>

                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '0.6rem',
                    marginTop: '0.8rem',
                  }}>
                    <span style={{
                      fontSize: '0.7rem', fontWeight: 600,
                      textTransform: 'uppercase', letterSpacing: '0.5px',
                      color: cert.color, background: `${cert.color}12`,
                      border: `1px solid ${cert.color}30`,
                      padding: '0.2rem 0.55rem', borderRadius: '4px',
                    }}>
                      {cert.category}
                    </span>
                    <span style={{
                      fontSize: 'var(--text-xs)', color: 'var(--text)',
                      fontFamily: 'var(--mono)',
                    }}>
                      {cert.date}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Lightbox modal */}
      <AnimatePresence>
        {selectedCert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setSelectedCert(null)}
            style={{
              position: 'fixed', inset: 0, zIndex: 2000,
              background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: 'clamp(0.75rem, 4vw, 2rem)',
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={e => e.stopPropagation()}
              style={{
                position: 'relative', maxWidth: '50rem', width: '100%',
                maxHeight: '92dvh', overflowY: 'auto',
                borderRadius: 'var(--radius-lg)', overflowX: 'hidden',
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
              }}
            >
              {/* Close button */}
              <button
                onClick={() => setSelectedCert(null)}
                style={{
                  position: 'absolute', top: '12px', right: '12px', zIndex: 10,
                  background: 'rgba(0,0,0,0.6)', border: 'none',
                  borderRadius: '50%', width: '36px', height: '36px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: '#fff', transition: 'background 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.8)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.6)'}
              >
                <X size={18} />
              </button>

              {/* Navigation arrows */}
              <button
                onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                style={{
                  position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
                  zIndex: 10, background: 'rgba(0,0,0,0.6)', border: 'none',
                  borderRadius: '50%', width: '40px', height: '40px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: '#fff', transition: 'background 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.8)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.6)'}
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); handleNext(); }}
                style={{
                  position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                  zIndex: 10, background: 'rgba(0,0,0,0.6)', border: 'none',
                  borderRadius: '50%', width: '40px', height: '40px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: '#fff', transition: 'background 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.8)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.6)'}
              >
                <ChevronRight size={20} />
              </button>

              {/* Image */}
              {selectedCert.image && (
                <img
                  src={selectedCert.image}
                  alt={selectedCert.title}
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                />
              )}

              {/* Info bar */}
              <div style={{
                padding: '1rem 1.5rem',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                borderTop: '1px solid var(--border)',
              }}>
                <div>
                  <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--text-h)', margin: 0 }}>
                    {selectedCert.title}
                  </h3>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text)', margin: '0.2rem 0 0' }}>
                    {selectedCert.issuer} • {selectedCert.date}
                  </p>
                </div>
                {selectedCert.link && (
                  <a
                    href={selectedCert.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: selectedCert.color, fontSize: 'var(--text-sm)',
                      fontWeight: 500, display: 'flex', alignItems: 'center', gap: '4px',
                      textDecoration: 'none',
                    }}
                  >
                    Verify <ExternalLink size={14} />
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}
