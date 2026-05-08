import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Rocket, ChevronRight, ChevronLeft, Send, CheckCircle, AlertCircle, Briefcase, FileText, DollarSign, User } from 'lucide-react';
import { SectionLabel } from './About';
import { useTranslation } from 'react-i18next';
import emailjs from '@emailjs/browser';

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

const initialForm = {
  projectType: '',
  projectTitle: '',
  projectOverview: '',
  coreFeatures: '',
  platform: [],
  designStatus: '',
  budgetRange: '',
  timeline: '',
  referenceLinks: '',
  fullName: '',
  email: '',
  phone: '',
  additionalNotes: '',
};

export default function StartProject() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const { t } = useTranslation();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tried, setTried] = useState([false, false, false]); // tracks if user tried to proceed per step

  useEffect(() => { emailjs.init(EMAILJS_PUBLIC_KEY); }, []);

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const togglePlatform = (val) => {
    setForm(prev => ({
      ...prev,
      platform: prev.platform.includes(val)
        ? prev.platform.filter(p => p !== val)
        : [...prev.platform, val],
    }));
  };

  const steps = [
    { icon: <Briefcase size={16} />, label: t('startProject.steps.project') },
    { icon: <DollarSign size={16} />, label: t('startProject.steps.budget') },
    { icon: <User size={16} />, label: t('startProject.steps.contact') },
  ];

  // Validation per field
  const isValid = (field) => {
    switch (field) {
      case 'projectType': return !!form.projectType;
      case 'projectTitle': return !!form.projectTitle.trim();
      case 'projectOverview': return !!form.projectOverview.trim();
      case 'coreFeatures': return !!form.coreFeatures.trim();
      case 'platform': return form.platform.length > 0;
      case 'designStatus': return !!form.designStatus;
      case 'budgetRange': return !!form.budgetRange;
      case 'timeline': return !!form.timeline;
      case 'referenceLinks': return !!form.referenceLinks.trim();
      case 'fullName': return !!form.fullName.trim();
      case 'email': return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email);
      case 'phone': return !!form.phone.trim();
      case 'additionalNotes': return !!form.additionalNotes.trim();
      default: return true;
    }
  };

  // Fields required per step (all fields are required now)
  const stepFields = [
    ['projectType', 'projectTitle', 'projectOverview', 'coreFeatures', 'platform', 'designStatus'],
    ['budgetRange', 'timeline', 'referenceLinks'],
    ['fullName', 'email', 'phone', 'additionalNotes'],
  ];

  const canNext = () => stepFields[step].every(f => isValid(f));

  // Show error for a field: only after user tried to proceed on that step
  const showError = (field) => tried[step] && !isValid(field);

  const errorBorder = '1px solid #ef4444';
  const normalBorder = '1px solid var(--border)';

  const getInputStyle = (field) => ({
    ...inputStyleBase,
    border: showError(field) ? errorBorder : normalBorder,
  });

  const getChipGroupStyle = (field) => showError(field)
    ? { display: 'flex', flexWrap: 'wrap', gap: '0.5rem', padding: '0.5rem', borderRadius: '10px', border: errorBorder }
    : { display: 'flex', flexWrap: 'wrap', gap: '0.5rem' };

  const handleNext = () => {
    setTried(prev => { const n = [...prev]; n[step] = true; return n; });
    if (canNext()) setStep(s => s + 1);
  };

  const handleSubmit = async () => {
    setTried(prev => { const n = [...prev]; n[step] = true; return n; });
    if (!canNext()) return;
    setLoading(true);
    setStatus('loading');

    const message = [
      `--- PROJECT INQUIRY ---`,
      `Project Type: ${form.projectType}`,
      `Title: ${form.projectTitle}`,
      `Overview: ${form.projectOverview}`,
      `Core Features: ${form.coreFeatures}`,
      `Platform: ${form.platform.join(', ')}`,
      `Design Status: ${form.designStatus}`,
      `Budget: ${form.budgetRange}`,
      `Timeline: ${form.timeline}`,
      `References: ${form.referenceLinks}`,
      `Phone/WhatsApp: ${form.phone}`,
      `Notes: ${form.additionalNotes}`,
    ].join('\n');

    try {
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        to_email: 'azzamcse@gmail.com',
        from_name: form.fullName,
        from_email: form.email,
        message,
        reply_to: form.email,
      });
      setForm(initialForm);
      setStep(0);
      setTried([false, false, false]);
      setStatus('success');
      setTimeout(() => setStatus(null), 5000);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus(null), 5000);
    } finally {
      setLoading(false);
    }
  };

  const inputStyleBase = {
    width: '100%', background: 'var(--bg)', border: normalBorder,
    borderRadius: '10px', padding: '0.85rem 1rem', color: 'var(--text-h)',
    fontFamily: 'var(--font)', fontSize: '0.92rem', outline: 'none',
    transition: 'border-color 0.2s', boxSizing: 'border-box',
  };

  const labelStyle = {
    fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-h)',
    marginBottom: '0.4rem', display: 'block',
  };

  const errorLabelStyle = {
    ...labelStyle, color: '#ef4444',
  };

  const chipStyle = (active) => ({
    padding: '0.5rem 1rem', borderRadius: '10px', cursor: 'pointer',
    border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
    background: active ? 'rgba(124,58,237,0.15)' : 'var(--bg)',
    color: active ? 'var(--accent)' : 'var(--text)',
    fontSize: '0.85rem', fontFamily: 'var(--font)', fontWeight: 500,
    transition: 'all 0.2s',
  });

  const renderStep = () => {
    if (step === 0) return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div>
          <label style={showError('projectType') ? errorLabelStyle : labelStyle}>{t('startProject.fields.projectType')} *</label>
          <div style={getChipGroupStyle('projectType')}>
            {['Web Application', 'Mobile Application', 'Full-Stack (Web + Mobile)', 'Landing Page / Portfolio', 'API / Backend Service', 'Other'].map(type => (
              <button key={type} type="button" onClick={() => update('projectType', type)} style={chipStyle(form.projectType === type)}>
                {type}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label style={showError('projectTitle') ? errorLabelStyle : labelStyle}>{t('startProject.fields.projectTitle')} *</label>
          <input dir="auto" type="text" value={form.projectTitle} onChange={e => update('projectTitle', e.target.value)}
            placeholder={t('startProject.placeholders.projectTitle')} style={getInputStyle('projectTitle')}
            onFocus={e => { if (!showError('projectTitle')) e.target.style.borderColor = 'var(--accent)'; }}
            onBlur={e => { if (!showError('projectTitle')) e.target.style.borderColor = 'var(--border)'; }} />
        </div>
        <div>
          <label style={showError('projectOverview') ? errorLabelStyle : labelStyle}>{t('startProject.fields.projectOverview')} *</label>
          <textarea dir="auto" value={form.projectOverview} onChange={e => update('projectOverview', e.target.value)}
            placeholder={t('startProject.placeholders.projectOverview')} rows={3}
            style={{ ...getInputStyle('projectOverview'), resize: 'none', minHeight: '90px' }}
            onFocus={e => { if (!showError('projectOverview')) e.target.style.borderColor = 'var(--accent)'; }}
            onBlur={e => { if (!showError('projectOverview')) e.target.style.borderColor = 'var(--border)'; }} />
        </div>
        <div>
          <label style={showError('coreFeatures') ? errorLabelStyle : labelStyle}>{t('startProject.fields.coreFeatures')} *</label>
          <textarea dir="auto" value={form.coreFeatures} onChange={e => update('coreFeatures', e.target.value)}
            placeholder={t('startProject.placeholders.coreFeatures')} rows={3}
            style={{ ...getInputStyle('coreFeatures'), resize: 'none', minHeight: '80px' }}
            onFocus={e => { if (!showError('coreFeatures')) e.target.style.borderColor = 'var(--accent)'; }}
            onBlur={e => { if (!showError('coreFeatures')) e.target.style.borderColor = 'var(--border)'; }} />
        </div>
        <div>
          <label style={showError('platform') ? errorLabelStyle : labelStyle}>{t('startProject.fields.platform')} *</label>
          <div style={getChipGroupStyle('platform')}>
            {['Web', 'iOS', 'Android', 'Cross-Platform'].map(p => (
              <button key={p} type="button" onClick={() => togglePlatform(p)} style={chipStyle(form.platform.includes(p))}>
                {p}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label style={showError('designStatus') ? errorLabelStyle : labelStyle}>{t('startProject.fields.designStatus')} *</label>
          <div style={getChipGroupStyle('designStatus')}>
            {['No design yet', 'Have wireframes', 'Have full design (Figma/XD)', 'Need design help'].map(d => (
              <button key={d} type="button" onClick={() => update('designStatus', d)} style={chipStyle(form.designStatus === d)}>
                {d}
              </button>
            ))}
          </div>
        </div>
      </div>
    );

    if (step === 1) return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div>
          <label style={showError('budgetRange') ? errorLabelStyle : labelStyle}>{t('startProject.fields.budgetRange')} *</label>
          <div style={getChipGroupStyle('budgetRange')}>
            {['< ₹10,000', '₹10,000 – ₹25,000', '₹25,000 – ₹50,000', '₹50,000 – ₹1,00,000', '₹1,00,000+', 'Flexible / Discuss'].map(b => (
              <button key={b} type="button" onClick={() => update('budgetRange', b)} style={chipStyle(form.budgetRange === b)}>
                {b}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label style={showError('timeline') ? errorLabelStyle : labelStyle}>{t('startProject.fields.timeline')} *</label>
          <div style={getChipGroupStyle('timeline')}>
            {['< 2 weeks', '2 – 4 weeks', '1 – 2 months', '2 – 3 months', '3+ months', 'Flexible'].map(tl => (
              <button key={tl} type="button" onClick={() => update('timeline', tl)} style={chipStyle(form.timeline === tl)}>
                {tl}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label style={showError('referenceLinks') ? errorLabelStyle : labelStyle}>{t('startProject.fields.referenceLinks')} *</label>
          <textarea dir="auto" value={form.referenceLinks} onChange={e => update('referenceLinks', e.target.value)}
            placeholder={t('startProject.placeholders.referenceLinks')} rows={2}
            style={{ ...getInputStyle('referenceLinks'), resize: 'none', minHeight: '70px' }}
            onFocus={e => { if (!showError('referenceLinks')) e.target.style.borderColor = 'var(--accent)'; }}
            onBlur={e => { if (!showError('referenceLinks')) e.target.style.borderColor = 'var(--border)'; }} />
        </div>
      </div>
    );

    if (step === 2) return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div>
          <label style={showError('fullName') ? errorLabelStyle : labelStyle}>{t('startProject.fields.fullName')} *</label>
          <input dir="auto" type="text" value={form.fullName} onChange={e => update('fullName', e.target.value)}
            placeholder={t('startProject.placeholders.fullName')} style={getInputStyle('fullName')}
            onFocus={e => { if (!showError('fullName')) e.target.style.borderColor = 'var(--accent)'; }}
            onBlur={e => { if (!showError('fullName')) e.target.style.borderColor = 'var(--border)'; }} />
        </div>
        <div>
          <label style={showError('email') ? errorLabelStyle : labelStyle}>{t('startProject.fields.email')} *</label>
          <input dir="ltr" type="email" value={form.email} onChange={e => update('email', e.target.value)}
            placeholder={t('startProject.placeholders.email')} style={getInputStyle('email')}
            pattern="[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}"
            onFocus={e => { if (!showError('email')) e.target.style.borderColor = 'var(--accent)'; }}
            onBlur={e => { if (!showError('email')) e.target.style.borderColor = 'var(--border)'; }} />
        </div>
        <div>
          <label style={showError('phone') ? errorLabelStyle : labelStyle}>{t('startProject.fields.phone')} *</label>
          <input dir="ltr" type="tel" value={form.phone} onChange={e => update('phone', e.target.value.replace(/[^0-9+\- ]/g, ''))}
            placeholder={t('startProject.placeholders.phone')} style={getInputStyle('phone')}
            inputMode="numeric"
            onFocus={e => { if (!showError('phone')) e.target.style.borderColor = 'var(--accent)'; }}
            onBlur={e => { if (!showError('phone')) e.target.style.borderColor = 'var(--border)'; }} />
        </div>
        <div>
          <label style={showError('additionalNotes') ? errorLabelStyle : labelStyle}>{t('startProject.fields.additionalNotes')} *</label>
          <textarea dir="auto" value={form.additionalNotes} onChange={e => update('additionalNotes', e.target.value)}
            placeholder={t('startProject.placeholders.additionalNotes')} rows={3}
            style={{ ...getInputStyle('additionalNotes'), resize: 'none', minHeight: '80px' }}
            onFocus={e => { if (!showError('additionalNotes')) e.target.style.borderColor = 'var(--accent)'; }}
            onBlur={e => { if (!showError('additionalNotes')) e.target.style.borderColor = 'var(--border)'; }} />
        </div>
      </div>
    );
  };

  return (
    <section id="start-project" ref={ref} style={{ padding: '6rem 2rem', background: 'var(--bg)' }}>
      <div style={{ maxWidth: '750px', margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ textAlign: 'center', marginBottom: '2.5rem' }}
        >
          <SectionLabel>{t('startProject.label')}</SectionLabel>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 700, marginBottom: '0.75rem' }}>
            {t('startProject.heading')}
          </h2>
          <p style={{ color: 'var(--text)', fontSize: '1rem', lineHeight: 1.7, maxWidth: '550px', margin: '0 auto' }}>
            {t('startProject.subtitle')}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.6 }}
          style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: '20px', padding: '2rem', position: 'relative',
          }}
        >
          {/* Step indicator */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
            {steps.map((s, i) => (
              <button key={i} onClick={() => { if (i < step) setStep(i); else handleNext(); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.4rem',
                  padding: '0.5rem 1rem', borderRadius: '10px', cursor: 'pointer',
                  border: `1px solid ${i === step ? 'var(--accent)' : 'var(--border)'}`,
                  background: i === step ? 'rgba(124,58,237,0.15)' : i < step ? 'rgba(16,185,129,0.1)' : 'var(--bg)',
                  color: i === step ? 'var(--accent)' : i < step ? '#10b981' : 'var(--text)',
                  fontSize: '0.8rem', fontWeight: 600, fontFamily: 'var(--font)',
                  transition: 'all 0.2s',
                }}
              >
                {i < step ? <CheckCircle size={14} /> : s.icon}
                <span className="step-label">{s.label}</span>
              </button>
            ))}
          </div>

          {/* Status messages */}
          {status === 'success' && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              style={{
                background: 'rgba(16,185,129,0.15)', border: '1px solid #10b981',
                borderRadius: '10px', padding: '1rem', marginBottom: '1.5rem',
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                color: '#10b981', fontSize: '0.9rem', fontWeight: 500,
              }}>
              <CheckCircle size={18} />
              <span>{t('startProject.successMessage')}</span>
            </motion.div>
          )}
          {status === 'error' && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              style={{
                background: 'rgba(239,68,68,0.15)', border: '1px solid #ef4444',
                borderRadius: '10px', padding: '1rem', marginBottom: '1.5rem',
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                color: '#ef4444', fontSize: '0.9rem', fontWeight: 500,
              }}>
              <AlertCircle size={18} />
              <span>{t('startProject.errorMessage')}</span>
            </motion.div>
          )}

          {/* Form content */}
          {renderStep()}

          {/* Navigation buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem', gap: '1rem' }}>
            {step > 0 ? (
              <button type="button" onClick={() => setStep(s => s - 1)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.4rem',
                  padding: '0.75rem 1.5rem', borderRadius: '10px', cursor: 'pointer',
                  border: '1px solid var(--border)', background: 'var(--bg)',
                  color: 'var(--text-h)', fontSize: '0.9rem', fontWeight: 500,
                  fontFamily: 'var(--font)', transition: 'border-color 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
              >
                <ChevronLeft size={16} /> {t('startProject.back')}
              </button>
            ) : <div />}

            {step < 2 ? (
              <button type="button" onClick={handleNext}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.4rem',
                  padding: '0.75rem 1.5rem', borderRadius: '10px', cursor: 'pointer',
                  border: 'none', background: 'var(--gradient)',
                  color: '#fff', fontSize: '0.9rem', fontWeight: 600,
                  fontFamily: 'var(--font)', transition: 'opacity 0.2s, transform 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.opacity = '0.85'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                {t('startProject.next')} <ChevronRight size={16} />
              </button>
            ) : (
              <button type="button" onClick={handleSubmit} disabled={loading}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0.75rem 1.5rem', borderRadius: '10px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  border: 'none', background: 'var(--gradient)',
                  color: '#fff', fontSize: '0.9rem', fontWeight: 600,
                  fontFamily: 'var(--font)', transition: 'opacity 0.2s, transform 0.2s',
                  opacity: loading ? 0.7 : 1,
                }}
                onMouseEnter={e => { if (!loading) { e.currentTarget.style.opacity = '0.85'; e.currentTarget.style.transform = 'translateY(-2px)'; } }}
                onMouseLeave={e => { if (!loading) { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)'; } }}
              >
                {loading ? (
                  <><motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>⏳</motion.span> {t('startProject.submitting')}</>
                ) : (
                  <><Send size={16} /> {t('startProject.submit')}</>
                )}
              </button>
            )}
          </div>
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 600px) {
          .step-label { display: none; }
        }
      `}</style>
    </section>
  );
}
