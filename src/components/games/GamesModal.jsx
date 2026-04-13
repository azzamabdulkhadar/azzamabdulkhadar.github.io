import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gamepad2, Brain, AlertTriangle } from 'lucide-react';
import { useTheme } from '../../ThemeContext';
import DinoGame from './DinoGame';
import QuizGame from './QuizGame';

function QuitConfirm({ message, onConfirm, onCancel }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'absolute', inset: 0, zIndex: 10,
        background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        borderRadius: 20,
      }}
    >
      <motion.div
        initial={{ scale: 0.88, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.88, opacity: 0 }}
        style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 16, padding: '2rem', maxWidth: 340, width: '90%',
          textAlign: 'center', boxShadow: '0 16px 48px rgba(0,0,0,0.4)',
        }}
      >
        <AlertTriangle size={36} color="#f59e0b" style={{ marginBottom: '0.75rem' }} />
        <h3 style={{ color: 'var(--text-h)', fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          Quit Game?
        </h3>
        <p style={{ color: 'var(--text)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
          {message}
        </p>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1, background: 'var(--bg-secondary)', border: '1px solid var(--border)',
              borderRadius: 10, padding: '0.65rem', cursor: 'pointer',
              color: 'var(--text-h)', fontFamily: 'var(--font)', fontSize: '0.9rem', fontWeight: 500,
            }}
          >
            Keep Playing
          </button>
          <button
            onClick={onConfirm}
            style={{
              flex: 1, background: '#ef4444', border: 'none',
              borderRadius: 10, padding: '0.65rem', cursor: 'pointer',
              color: '#fff', fontFamily: 'var(--font)', fontSize: '0.9rem', fontWeight: 700,
            }}
          >
            Exit Game
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function GamesModal({ onClose }) {
  const [tab, setTab] = useState('dino');
  const [confirm, setConfirm] = useState(null); // null | 'tab:{id}' | 'close'
  const { theme } = useTheme();

  const dinoRef = useRef(null);       // ref to DinoGame imperative handle
  const dinoRunning = useRef(false);  // is dino actively running
  const quizPlaying = useRef(false);  // is quiz in active question phase

  const isDinoRunning = () => tab === 'dino' && dinoRunning.current;
  const isQuizPlaying = () => tab === 'quiz' && quizPlaying.current;

  const showConfirm = (target) => {
    // pause dino if it's running
    if (isDinoRunning()) dinoRef.current?.pause();
    setConfirm(target);
  };

  const requestTabChange = (id) => {
    if (id === tab) return;
    if (isDinoRunning() || isQuizPlaying()) { showConfirm(`tab:${id}`); return; }
    setTab(id);
  };

  const requestClose = () => {
    if (isDinoRunning() || isQuizPlaying()) { showConfirm('close'); return; }
    onClose();
  };

  const handleConfirm = () => {
    // force-stop dino regardless
    dinoRef.current?.forceStop();
    dinoRunning.current = false;
    quizPlaying.current = false;

    if (confirm === 'close') { 
      // Go back to game selection screen (don't close modal)
      setConfirm(null); 
      return; 
    }
    if (confirm?.startsWith('tab:')) {
      setTab(confirm.split(':')[1]);
    }
    setConfirm(null);
  };

  const handleCancel = () => {
    setConfirm(null);
    // resume dino with 3s countdown if it was running
    if (tab === 'dino' && dinoRunning.current) {
      dinoRef.current?.resume();
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
    { id: 'dino', label: 'Dino Runner', icon: <Gamepad2 size={16} /> },
    { id: 'quiz', label: 'Skill Quiz', icon: <Brain size={16} /> },
  ];

  const confirmMessage = confirm === 'close'
    ? 'Your current game progress will be lost. You will return to the game selection screen.'
    : 'Switching games will end your current session. Are you sure?';

  return createPortal(
    <AnimatePresence>
      <motion.div
        data-theme={theme}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={requestClose}
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
          style={{
            background: 'var(--bg-secondary)', border: '1px solid var(--border)',
            borderRadius: 20, width: '100%', maxWidth: 860,
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
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {tabs.map(t => (
                <button key={t.id} onClick={() => requestTabChange(t.id)} style={{
                  display: 'flex', alignItems: 'center', gap: '0.4rem',
                  background: tab === t.id ? 'var(--accent-glow)' : 'transparent',
                  border: `1px solid ${tab === t.id ? 'var(--accent)' : 'var(--border)'}`,
                  color: tab === t.id ? 'var(--accent)' : 'var(--text)',
                  borderRadius: 8, padding: '0.4rem 0.9rem', cursor: 'pointer',
                  fontFamily: 'var(--font)', fontSize: '0.85rem', fontWeight: tab === t.id ? 600 : 400,
                  transition: 'all 0.2s',
                }}>
                  {t.icon} {t.label}
                </button>
              ))}
            </div>
            <button onClick={requestClose} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--text)', padding: 4, borderRadius: 6,
              display: 'flex', alignItems: 'center',
            }}>
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div style={{ padding: '1.5rem', overflowY: 'auto', overscrollBehavior: 'contain', flex: 1, background: 'var(--bg-secondary)' }}>
            {tab === 'dino'
              ? <DinoGame
                  ref={dinoRef}
                  onRunningChange={v => { dinoRunning.current = v; }}
                />
              : <QuizGame
                  onPlayingChange={v => { quizPlaying.current = v; }}
                />
            }
          </div>

          {/* Quit confirmation overlay */}
          <AnimatePresence>
            {confirm && (
              <QuitConfirm
                message={confirmMessage}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
              />
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  , document.body);
}
