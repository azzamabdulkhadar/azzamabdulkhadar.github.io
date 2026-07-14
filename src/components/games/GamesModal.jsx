import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gamepad2, Brain, AlertTriangle, Bird } from 'lucide-react';
import { useTheme } from '../../ThemeContext';
import { useTranslation } from 'react-i18next';
import ErrorBoundary from './ErrorBoundary';

const DinoGame = lazy(() => import('./DinoGame'));
const QuizGame = lazy(() => import('./QuizGame'));
const FlappyBird = lazy(() => import('./FlappyBird'));

function GameLoadingFallback() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '3rem 1rem', color: 'var(--text)', fontFamily: 'var(--font)',
    }}>
      Loading game…
    </div>
  );
}

function QuitConfirm({ message, onConfirm, onCancel, t }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'absolute', inset: 0, zIndex: 10,
        background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        borderRadius: 'var(--radius-lg)',
      }}
    >
      <motion.div
        initial={{ scale: 0.88, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.88, opacity: 0 }}
        style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)', padding: '2rem', maxWidth: 340, width: '90%',
          textAlign: 'center', boxShadow: '0 16px 48px rgba(0,0,0,0.4)',
        }}
      >
        <AlertTriangle size={36} color="#f59e0b" style={{ marginBottom: '0.75rem' }} />
        <h3 style={{ color: 'var(--text-h)', fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          {t('games.quitTitle')}
        </h3>
        <p style={{ color: 'var(--text)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
          {message}
        </p>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1, background: 'var(--bg-secondary)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)', padding: '0.65rem', cursor: 'pointer',
              color: 'var(--text-h)', fontFamily: 'var(--font)', fontSize: '0.9rem', fontWeight: 500,
            }}
          >
            {t('games.keepPlaying')}
          </button>
          <button
            onClick={onConfirm}
            style={{
              flex: 1, background: '#ef4444', border: 'none',
              borderRadius: 'var(--radius-sm)', padding: '0.65rem', cursor: 'pointer',
              color: '#fff', fontFamily: 'var(--font)', fontSize: '0.9rem', fontWeight: 700,
            }}
          >
            {t('games.exitGame')}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function GamesModal({ onClose }) {
  const [tab, setTab] = useState('dino');
  const [confirm, setConfirm] = useState(null);
  const { theme } = useTheme();
  const { t } = useTranslation();

  const dinoRef = useRef(null);
  const flappyRef = useRef(null);
  const dinoRunning = useRef(false);
  const flappyRunning = useRef(false);
  const quizPlaying = useRef(false);

  const isDinoRunning = () => tab === 'dino' && dinoRunning.current;
  const isFlappyRunning = () => tab === 'flappy' && flappyRunning.current;
  const isQuizPlaying = () => tab === 'quiz' && quizPlaying.current;

  const showConfirm = (target) => {
    if (isDinoRunning()) dinoRef.current?.pause();
    if (isFlappyRunning()) flappyRef.current?.pause();
    setConfirm(target);
  };

  const requestTabChange = (id) => {
    if (id === tab) return;
    if (isDinoRunning() || isFlappyRunning() || isQuizPlaying()) { showConfirm(`tab:${id}`); return; }
    setTab(id);
  };

  const requestClose = () => {
    // Confirm (and pause) only when a game is actively in progress; otherwise close.
    if (isDinoRunning() || isFlappyRunning() || isQuizPlaying()) { showConfirm('close'); return; }
    onClose();
  };

  const handleConfirm = () => {
    dinoRef.current?.forceStop();
    flappyRef.current?.forceStop();
    dinoRunning.current = false;
    flappyRunning.current = false;
    quizPlaying.current = false;

    if (confirm === 'close') {
      setConfirm(null);
      onClose();
      return;
    }
    if (confirm?.startsWith('tab:')) {
      setTab(confirm.split(':')[1]);
    }
    setConfirm(null);
  };

  const handleCancel = () => {
    setConfirm(null);
    if (tab === 'dino' && dinoRunning.current) {
      dinoRef.current?.resume();
    }
    if (tab === 'flappy' && flappyRunning.current) {
      flappyRef.current?.resume();
    }
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        if (confirm) { handleCancel(); return; }
        requestClose();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [confirm, tab]);

  const tabs = [
    { id: 'dino', label: t('games.dinoRunner'), icon: <Gamepad2 size={16} /> },
    { id: 'flappy', label: t('games.flappyBird'), icon: <Bird size={16} /> },
    { id: 'quiz', label: t('games.skillQuiz'), icon: <Brain size={16} /> },
  ];

  const hasActiveGame = isDinoRunning() || isFlappyRunning() || isQuizPlaying();
  const confirmMessage = confirm === 'close'
    ? (hasActiveGame ? t('games.quitClose') : t('games.quitCloseIdle'))
    : t('games.quitSwitch');

  return createPortal(
    <AnimatePresence>
      <motion.div
        data-theme={theme}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed', inset: 0, zIndex: 200,
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '1rem',
        }}
      >
        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          onClick={e => e.stopPropagation()}
          dir="ltr"
          style={{
            background: 'var(--bg-secondary)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)', width: '100%', maxWidth: 860,
            maxHeight: '90vh', overflow: 'hidden',
            display: 'flex', flexDirection: 'column',
            boxShadow: '0 24px 80px rgba(0,0,0,0.4)',
            position: 'relative',
          }}
        >
          {/* Modal header */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)',
            background: 'var(--bg-secondary)',
          }}>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {tabs.map(tabItem => (
                <button key={tabItem.id} onClick={() => requestTabChange(tabItem.id)} style={{
                  display: 'flex', alignItems: 'center', gap: '0.4rem',
                  background: tab === tabItem.id ? 'var(--accent-glow)' : 'transparent',
                  border: `1px solid ${tab === tabItem.id ? 'var(--accent)' : 'var(--border)'}`,
                  color: tab === tabItem.id ? 'var(--accent)' : 'var(--text)',
                  borderRadius: 'var(--radius-sm)', padding: '0.4rem 0.9rem', cursor: 'pointer',
                  fontFamily: 'var(--font)', fontSize: '0.85rem', fontWeight: tab === tabItem.id ? 600 : 400,
                  transition: 'all 0.2s', whiteSpace: 'nowrap',
                }}>
                  {tabItem.icon} {tabItem.label}
                </button>
              ))}
            </div>
            <button onClick={requestClose} aria-label="Close games" style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--text)', padding: 4, borderRadius: 6,
              display: 'flex', alignItems: 'center',
            }}>
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div style={{ padding: '1.5rem', overflowY: 'auto', overscrollBehavior: 'contain', flex: 1, background: 'var(--bg-secondary)' }}>
            <ErrorBoundary>
              <Suspense fallback={<GameLoadingFallback />}>
                {tab === 'dino' && <DinoGame ref={dinoRef} onRunningChange={v => { dinoRunning.current = v; }} />}
                {tab === 'flappy' && <FlappyBird ref={flappyRef} onRunningChange={v => { flappyRunning.current = v; }} />}
                {tab === 'quiz' && <QuizGame onPlayingChange={v => { quizPlaying.current = v; }} />}
              </Suspense>
            </ErrorBoundary>
          </div>

          {/* Quit confirmation overlay */}
          <AnimatePresence>
            {confirm && (
              <QuitConfirm
                message={confirmMessage}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
                t={t}
              />
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  , document.body);
}
