import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Mail, Phone, Code2, Link, Send, MapPin } from 'lucide-react';
import { SectionLabel } from './About';

export default function Contact() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Opens default mail client with pre-filled content
    const subject = encodeURIComponent(`Portfolio Contact from ${form.name}`);
    const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\nMessage:\n${form.message}`);
    window.location.href = `mailto:azzamcse@gmail.com?subject=${subject}&body=${body}`;
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  const contacts = [
    { icon: <Mail size={18} />, label: 'Email', value: 'azzamcse@gmail.com', href: 'mailto:azzamcse@gmail.com' },
    { icon: <Phone size={18} />, label: 'Phone', value: '+91-7349701430', href: 'tel:+917349701430' },
    { icon: <MapPin size={18} />, label: 'Location', value: 'Karnataka, India', href: null },
    { icon: <Code2 size={18} />, label: 'GitHub', value: 'Azzam-Abdul-Khadar', href: 'https://github.com/Azzam-Abdul-Khadar' },
    { icon: <Link size={18} />, label: 'LinkedIn', value: 'azzam-abdul-khadar', href: 'https://www.linkedin.com/in/azzam-abdul-khadar-a6656729b' },
  ];

  const inputStyle = {
    width: '100%', background: 'var(--bg)', border: '1px solid var(--border)',
    borderRadius: '10px', padding: '0.85rem 1rem', color: 'var(--text-h)',
    fontFamily: 'var(--font)', fontSize: '0.95rem', outline: 'none',
    transition: 'border-color 0.2s', boxSizing: 'border-box',
  };

  return (
    <section id="contact" ref={ref} style={{
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
          <SectionLabel>Contact</SectionLabel>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 700 }}>
            Let's{' '}
            <span style={{ background: 'var(--gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Connect
            </span>
          </h2>
          <p style={{ color: 'var(--text)', marginTop: '0.75rem', maxWidth: '480px', margin: '0.75rem auto 0' }}>
            Open to new opportunities, collaborations, or just a good tech conversation.
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          {/* Contact info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {contacts.map(({ icon, label, value, href }) => (
                <div key={label} style={{
                  background: 'var(--bg-card)', border: '1px solid var(--border)',
                  borderRadius: '12px', padding: '1rem 1.25rem',
                  display: 'flex', alignItems: 'center', gap: '1rem',
                  transition: 'border-color 0.2s',
                }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                >
                  <div style={{
                    width: 38, height: 38, borderRadius: '10px',
                    background: 'rgba(124,58,237,0.15)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--accent)', flexShrink: 0,
                  }}>
                    {icon}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text)', marginBottom: '0.1rem' }}>{label}</div>
                    {href ? (
                      <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer"
                        style={{ color: 'var(--text-h)', fontSize: '0.9rem', fontWeight: 500, transition: 'color 0.2s' }}
                        onMouseEnter={e => e.target.style.color = 'var(--accent)'}
                        onMouseLeave={e => e.target.style.color = 'var(--text-h)'}
                      >{value}</a>
                    ) : (
                      <span style={{ color: 'var(--text-h)', fontSize: '0.9rem', fontWeight: 500 }}>{value}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Contact form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <form onSubmit={handleSubmit} style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: '20px', padding: '2rem',
              display: 'flex', flexDirection: 'column', gap: '1rem',
            }}>
              <input
                type="text" placeholder="Your Name" required
                value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
              <input
                type="email" placeholder="Your Email" required
                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
              <textarea
                placeholder="Your Message" required rows={5}
                value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                style={{ ...inputStyle, resize: 'vertical', minHeight: '120px' }}
                onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
              <button type="submit" style={{
                background: sent ? '#10b981' : 'var(--gradient)',
                color: '#fff', border: 'none', borderRadius: '10px',
                padding: '0.85rem', cursor: 'pointer', fontWeight: 600,
                fontSize: '0.95rem', fontFamily: 'var(--font)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                transition: 'opacity 0.2s, transform 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.opacity = '0.85'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                {sent ? '✓ Opening mail client...' : <><Send size={16} /> Send Message</>}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
