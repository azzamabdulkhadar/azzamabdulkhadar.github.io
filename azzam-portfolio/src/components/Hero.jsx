import { motion } from 'framer-motion';
import { Code2, Link, Mail, Download, ArrowDown } from 'lucide-react';
import heroImg from '../assets/hero.png';

export default function Hero() {
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: '6rem 2rem 4rem',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Background glow blobs */}
      <div style={{
        position: 'absolute', top: '20%', left: '10%',
        width: '400px', height: '400px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)',
        filter: 'blur(40px)', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '20%', right: '10%',
        width: '350px', height: '350px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)',
        filter: 'blur(40px)', pointerEvents: 'none',
      }} />

      <div style={{
        maxWidth: '1100px', width: '100%', margin: '0 auto',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: '3rem', flexWrap: 'wrap',
      }}>
        {/* Text side */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          style={{ flex: '1 1 480px' }}
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            style={{ fontFamily: 'var(--mono)', color: 'var(--accent-2)', fontSize: '0.9rem', marginBottom: '1rem' }}
          >
            👋 Hello, I'm
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: '0.75rem' }}
          >
            Azzam Abdul{' '}
            <span style={{ background: 'var(--gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Khadar
            </span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.3)',
              borderRadius: '100px', padding: '0.4rem 1rem', marginBottom: '1.5rem',
            }}
          >
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', display: 'inline-block', animation: 'pulse 2s infinite' }} />
            <span style={{ fontFamily: 'var(--mono)', fontSize: '0.85rem', color: 'var(--text-h)' }}>
              MERN Stack Developer
            </span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            style={{ fontSize: '1.05rem', color: 'var(--text)', lineHeight: 1.8, marginBottom: '2rem', maxWidth: '520px' }}
          >
            Results-driven Full Stack Developer building scalable web applications with the MERN stack.
            Passionate about clean code, responsive UIs, and real-world problem solving.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}
          >
            <button onClick={() => scrollTo('projects')} style={{
              background: 'var(--gradient)', color: '#fff', border: 'none',
              padding: '0.75rem 1.75rem', borderRadius: '8px', cursor: 'pointer',
              fontWeight: 600, fontSize: '0.95rem', fontFamily: 'var(--font)',
              transition: 'opacity 0.2s, transform 0.2s',
            }}
              onMouseEnter={e => { e.target.style.opacity = '0.85'; e.target.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.target.style.opacity = '1'; e.target.style.transform = 'translateY(0)'; }}
            >
              View Projects
            </button>
            <button onClick={() => scrollTo('contact')} style={{
              background: 'transparent', color: 'var(--text-h)',
              border: '1px solid var(--border)', padding: '0.75rem 1.75rem',
              borderRadius: '8px', cursor: 'pointer', fontWeight: 500,
              fontSize: '0.95rem', fontFamily: 'var(--font)', transition: 'border-color 0.2s, transform 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              Contact Me
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            style={{ display: 'flex', gap: '1rem' }}
          >
            {[
              { icon: <Code2 size={20} />, href: 'https://github.com/Azzam-Abdul-Khadar' },
              { icon: <Link size={20} />, href: 'https://www.linkedin.com/in/azzam-abdul-khadar-a6656729b' },
              { icon: <Mail size={20} />, href: 'mailto:azzamcse@gmail.com' },
            ].map(({ icon, href }, i) => (
              <a key={i} href={href} target="_blank" rel="noreferrer" style={{
                width: 42, height: 42, borderRadius: '10px',
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--text)', transition: 'all 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text)'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                {icon}
              </a>
            ))}
          </motion.div>
        </motion.div>

        {/* Image side */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          style={{ flex: '0 0 auto', display: 'flex', justifyContent: 'center' }}
        >
          <div style={{ position: 'relative' }}>
            <div style={{
              width: 280, height: 280, borderRadius: '50%',
              background: 'var(--gradient)', padding: '3px',
              boxShadow: '0 0 60px var(--accent-glow)',
            }}>
              <div style={{
                width: '100%', height: '100%', borderRadius: '50%',
                background: 'var(--bg-card)', overflow: 'hidden',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <img src={heroImg} alt="Azzam" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            </div>
            {/* Floating badge */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
              style={{
                position: 'absolute', bottom: 10, right: -20,
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                borderRadius: '12px', padding: '0.5rem 0.9rem',
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
              }}
            >
              <span style={{ fontSize: '1.2rem' }}>⚡</span>
              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text)', lineHeight: 1 }}>Experience</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-h)' }}>MERN Stack</div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        onClick={() => scrollTo('about')}
        style={{
          position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)',
          cursor: 'pointer', color: 'var(--text)', opacity: 0.5,
        }}
      >
        <ArrowDown size={22} />
      </motion.div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </section>
  );
}
