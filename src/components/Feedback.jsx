import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Star, Send, CheckCircle, AlertCircle } from 'lucide-react';
import SectionLabel from './SectionLabel';
import { useTranslation } from 'react-i18next';
import emailjs from '@emailjs/browser';

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;

export default function Feedback() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const { t } = useTranslation();

  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [status, setStatus] = useState(null); // null | 'loading' | 'success' | 'error'

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) return;

    setStatus('loading');

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          to_email: 'azzamcse@gmail.com',
          from_name: 'Portfolio Feedback',
          from_email: 'feedback@portfolio.com',
          message: `⭐ Rating: ${rating}/5\n\n💬 Comment: ${comment || '(No comment provided)'}`,
          reply_to: 'noreply@portfolio.com',
        }
      );

      setStatus('success');
      setRating(0);
      setComment('');
      setTimeout(() => setStatus(null), 5000);
    } catch (err) {
      console.error('Feedback error:', err);
      setStatus('error');
      setTimeout(() => setStatus(null), 4000);
    }
  };

  const ratingLabels = [
    t('feedback.rating1'),
    t('feedback.rating2'),
    t('feedback.rating3'),
    t('feedback.rating4'),
    t('feedback.rating5'),
  ];

  const activeRating = hover || rating;

  return (
    <section id="feedback" ref={ref} style={{ padding: 'var(--space-2xl) 2rem', background: 'var(--bg)' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ textAlign: 'center', marginBottom: 'var(--space-lg)' }}
        >
          <SectionLabel>{t('feedback.label')}</SectionLabel>
          <h2 style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)', fontWeight: 700, marginBottom: '0.5rem' }}>
            {t('feedback.heading')}
          </h2>
          <p style={{ color: 'var(--text)', fontSize: 'var(--text-base)', lineHeight: 1.6 }}>
            {t('feedback.subtitle')}
          </p>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.6 }}
          style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)', padding: 'var(--space-lg)',
            display: 'flex', flexDirection: 'column', gap: 'var(--space-md)',
          }}
        >
          {/* Star rating */}
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text)', marginBottom: 'var(--space-sm)' }}>
              {t('feedback.rateQuestion')}
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-xs)', marginBottom: '0.5rem' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    padding: '0.25rem', transition: 'transform 0.15s',
                    transform: (hover || rating) >= star ? 'scale(1.15)' : 'scale(1)',
                  }}
                >
                  <Star
                    size={32}
                    fill={activeRating >= star ? '#fbbf24' : 'none'}
                    color={activeRating >= star ? '#fbbf24' : 'var(--border)'}
                    strokeWidth={1.5}
                  />
                </button>
              ))}
            </div>
            {activeRating > 0 && (
              <motion.p
                key={activeRating}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  fontSize: 'var(--text-xs)', color: '#fbbf24',
                  fontWeight: 500, fontFamily: 'var(--font)',
                }}
              >
                {ratingLabels[activeRating - 1]}
              </motion.p>
            )}
          </div>

          {/* Comment */}
          <div>
            <label style={{ fontSize: 'var(--text-sm)', color: 'var(--text)', display: 'block', marginBottom: 'var(--space-xs)' }}>
              {t('feedback.commentLabel')}
            </label>
            <textarea
              dir="auto"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={t('feedback.commentPlaceholder')}
              rows={3}
              style={{
                width: '100%', background: 'var(--bg)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)', padding: '0.85rem 1rem', color: 'var(--text-h)',
                fontFamily: 'var(--font)', fontSize: 'var(--text-base)', outline: 'none',
                transition: 'border-color 0.2s', resize: 'none', minHeight: '80px',
                boxSizing: 'border-box',
              }}
              onFocus={e => e.target.style.borderColor = 'var(--accent)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
              disabled={status === 'loading'}
            />
          </div>

          {/* Status messages */}
          {status === 'success' && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                background: 'rgba(16,185,129,0.15)', border: '1px solid #10b981',
                borderRadius: 'var(--radius-sm)', padding: '0.85rem',
                display: 'flex', alignItems: 'center', gap: '0.6rem',
                color: '#10b981', fontSize: 'var(--text-sm)', fontWeight: 500,
              }}
            >
              <CheckCircle size={18} />
              {t('feedback.successMessage')}
            </motion.div>
          )}

          {status === 'error' && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                background: 'rgba(239,68,68,0.15)', border: '1px solid #ef4444',
                borderRadius: 'var(--radius-sm)', padding: '0.85rem',
                display: 'flex', alignItems: 'center', gap: '0.6rem',
                color: '#ef4444', fontSize: 'var(--text-sm)', fontWeight: 500,
              }}
            >
              <AlertCircle size={18} />
              {t('feedback.errorMessage')}
            </motion.div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={rating === 0 || status === 'loading'}
            style={{
              background: rating === 0 ? 'var(--border)' : 'var(--gradient)',
              color: '#fff', border: 'none', borderRadius: 'var(--radius-sm)',
              padding: '0.8rem', cursor: rating === 0 || status === 'loading' ? 'not-allowed' : 'pointer',
              fontWeight: 600, fontSize: 'var(--text-base)', fontFamily: 'var(--font)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
              transition: 'opacity 0.2s, transform 0.2s',
              opacity: status === 'loading' ? 0.7 : 1,
            }}
            onMouseEnter={e => { if (rating > 0 && status !== 'loading') { e.currentTarget.style.opacity = '0.85'; e.currentTarget.style.transform = 'translateY(-2px)'; } }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            {status === 'loading' ? (
              <>
                <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>⏳</motion.span>
                {t('feedback.submitting')}
              </>
            ) : (
              <>
                <Send size={16} />
                {t('feedback.submit')}
              </>
            )}
          </button>
        </motion.form>
      </div>
    </section>
  );
}
