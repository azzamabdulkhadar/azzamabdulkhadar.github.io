import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Mail, Phone, Code2, Link, Send, MapPin, CheckCircle, AlertCircle } from 'lucide-react';
import { SectionLabel } from './About';
import { useTranslation } from 'react-i18next';
import emailjs from '@emailjs/browser';

// Initialize EmailJS (you'll need to add your public key)
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

export default function Contact() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState(null); // null | 'loading' | 'success' | 'error'
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState(false);

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);

  // Initialize EmailJS once
  useEffect(() => {
    emailjs.init(EMAILJS_PUBLIC_KEY);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValidEmail(form.email)) {
      setEmailError(true);
      return;
    }
    setEmailError(false);
    setLoading(true);
    setStatus('loading');

    try {
      // Send email using EmailJS
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          to_email: 'azzamcse@gmail.com',
          from_name: form.name,
          from_email: form.email,
          message: form.message,
          reply_to: form.email,
        }
      );

      // Clear form and show success
      setForm({ name: '', email: '', message: '' });
      setStatus('success');

      // Hide success message after 4 seconds
      setTimeout(() => setStatus(null), 4000);
    } catch (error) {
      console.error('Error sending message:', error);
      setStatus('error');
      setTimeout(() => setStatus(null), 4000);
    } finally {
      setLoading(false);
    }
  };

  const contacts = [
    { icon: <Mail size={18} />, label: t('contact.email'), value: 'azzamcse@gmail.com', href: 'mailto:azzamcse@gmail.com' },
    { icon: <Phone size={18} />, label: t('contact.phone'), value: '+91-7349701430', href: 'tel:+917349701430' },
    { icon: <MapPin size={18} />, label: t('contact.location'), value: 'Hyderabad, Telangana', href: null },
    { icon: <Code2 size={18} />, label: t('contact.github'), value: 'Azzam-Abdul-Khadar', href: 'https://github.com/Azzam-Abdul-Khadar' },
    { icon: <Link size={18} />, label: t('contact.linkedin'), value: 'azzam-abdul-khadar', href: 'https://linkedin.com/in/azzam-abdul-khadar' },
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
          <SectionLabel>{t('contact.label')}</SectionLabel>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 700 }}>
            {t('contact.heading')}
          </h2>
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
                      <a dir="ltr" href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer"
                        style={{ color: 'var(--text-h)', fontSize: '0.9rem', fontWeight: 500, transition: 'color 0.2s', display: 'inline-block' }}
                        onMouseEnter={e => e.target.style.color = 'var(--accent)'}
                        onMouseLeave={e => e.target.style.color = 'var(--text-h)'}
                      >{value}</a>
                    ) : (
                      <span dir="ltr" style={{ color: 'var(--text-h)', fontSize: '0.9rem', fontWeight: 500, display: 'inline-block' }}>{value}</span>
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
              position: 'relative',
            }}>
              {/* Success Message */}
              {status === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  style={{
                    background: 'rgba(16,185,129,0.15)', border: '1px solid #10b981',
                    borderRadius: '10px', padding: '1rem',
                    display: 'flex', alignItems: 'center', gap: '0.75rem',
                    color: '#10b981', fontSize: '0.9rem', fontWeight: 500,
                  }}
                >
                  <CheckCircle size={18} />
                  <span>{t('contact.successMessage')}</span>
                </motion.div>
              )}

              {/* Error Message */}
              {status === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  style={{
                    background: 'rgba(239,68,68,0.15)', border: '1px solid #ef4444',
                    borderRadius: '10px', padding: '1rem',
                    display: 'flex', alignItems: 'center', gap: '0.75rem',
                    color: '#ef4444', fontSize: '0.9rem', fontWeight: 500,
                  }}
                >
                  <AlertCircle size={18} />
                  <span>{t('contact.errorMessage')}</span>
                </motion.div>
              )}

              <input
                type="text" placeholder={t('contact.formName')} required
                value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
                disabled={loading}
              />
              <input
                type="email" placeholder={t('contact.formEmail')} required
                value={form.email} onChange={e => { setForm({ ...form, email: e.target.value }); if (isValidEmail(e.target.value)) setEmailError(false); }}
                style={{ ...inputStyle, border: emailError ? '1px solid #ef4444' : inputStyle.border }}
                onFocus={e => { if (!emailError) e.target.style.borderColor = 'var(--accent)'; }}
                onBlur={e => { if (!emailError) e.target.style.borderColor = 'var(--border)'; }}
                disabled={loading}
              />
              <textarea
                dir="auto"
                placeholder={t('contact.formMessage')} required rows={5}
                value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                style={{ ...inputStyle, resize: 'none', minHeight: '120px' }}
                onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
                disabled={loading}
              />
              <button type="submit" disabled={loading} style={{
                background: status === 'success' ? '#10b981' : 'var(--gradient)',
                color: '#fff', border: 'none', borderRadius: '10px',
                padding: '0.85rem', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 600,
                fontSize: '0.95rem', fontFamily: 'var(--font)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                transition: 'opacity 0.2s, transform 0.2s',
                opacity: loading ? 0.7 : 1,
              }}
                onMouseEnter={e => { if (!loading) { e.currentTarget.style.opacity = '0.85'; e.currentTarget.style.transform = 'translateY(-2px)'; } }}
                onMouseLeave={e => { if (!loading) { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)'; } }}
              >
                {loading ? (
                  <>
                    <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>⏳</motion.span>
                    {t('contact.sending')}
                  </>
                ) : status === 'success' ? (
                  <>
                    <CheckCircle size={16} />
                    {t('contact.messageSent')}
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    {t('contact.sendMessage')}
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
