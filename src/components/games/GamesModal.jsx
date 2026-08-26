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
    <div className="games-loading">
      <div className="games-loading-spinner" />
      <span>Loading game…</span>
    </div>
  );
}

function QuitConfirm({ message, onConfirm, onCancel, t }) {
  return (
    <motion.div
      className="games-confirm-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="games-confirm-card"
        initial={{ scale: 0.88, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.88, opacity: 0 }}
      >
        <AlertTriangle size={36} color="#f59e0b" />
        <h3>{t('games.quitTitle')}</h3>
        <p>{message}</p>
        <div className="games-confirm-actions">
          <button className="games-confirm-cancel" onClick={onCancel}>
            {t('games.keepPlaying')}
          </button>
          <button className="games-confirm-exit" onClick={onConfirm}>
            {t('games.exitGame')}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function GamesModal({ onClose }) {
  const [tab, setTab] = useState('quiz');
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

  // Lock body scroll when modal is open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

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
    { id: 'quiz', label: t('games.skillQuiz'), icon: <Brain size={18} /> },
    { id: 'dino', label: t('games.dinoRunner'), icon: <Gamepad2 size={18} /> },
    { id: 'flappy', label: t('games.flappyBird'), icon: <Bird size={18} /> },
  ];

  const hasActiveGame = isDinoRunning() || isFlappyRunning() || isQuizPlaying();
  const confirmMessage = confirm === 'close'
    ? (hasActiveGame ? t('games.quitClose') : t('games.quitCloseIdle'))
    : t('games.quitSwitch');

  return createPortal(
    <AnimatePresence>
      <motion.div
        className="games-fullscreen"
        data-theme={theme}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        dir="ltr"
      >
        {/* Header */}
        <header className="games-header">
          <nav className="games-tabs">
            {tabs.map(tabItem => (
              <button
                key={tabItem.id}
                onClick={() => requestTabChange(tabItem.id)}
                className={`games-tab ${tab === tabItem.id ? 'games-tab-active' : ''}`}
              >
                {tabItem.icon}
                <span className="games-tab-label">{tabItem.label}</span>
              </button>
            ))}
          </nav>
          <button onClick={requestClose} className="games-close-btn" aria-label="Close games">
            <X size={22} />
          </button>
        </header>

        {/* Game content */}
        <main className="games-content">
          <ErrorBoundary>
            <Suspense fallback={<GameLoadingFallback />}>
              {tab === 'dino' && <DinoGame ref={dinoRef} onRunningChange={v => { dinoRunning.current = v; }} />}
              {tab === 'flappy' && <FlappyBird ref={flappyRef} onRunningChange={v => { flappyRunning.current = v; }} />}
              {tab === 'quiz' && <QuizGame onPlayingChange={v => { quizPlaying.current = v; }} />}
            </Suspense>
          </ErrorBoundary>
        </main>

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

        <style>{gamesModalStyles}</style>
      </motion.div>
    </AnimatePresence>
  , document.body);
}

const gamesModalStyles = `
  .games-fullscreen {
    position: fixed;
    inset: 0;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    background: var(--bg);
    color: var(--text);
    font-family: var(--font);
    overflow: hidden;
    /* dvh so the games screen fits the visible area on mobile browsers */
    height: 100dvh;
  }

  /* ─── Header ─── */
  .games-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem 1.25rem;
    border-bottom: 1px solid var(--border);
    background: var(--bg-secondary);
    flex-shrink: 0;
    gap: 0.75rem;
  }

  .games-tabs {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
    align-items: center;
  }

  .games-tab {
    display: flex;
    align-items: center;
    gap: 0.45rem;
    background: transparent;
    border: 1.5px solid var(--border);
    color: var(--text);
    border-radius: var(--radius-sm);
    padding: 0.55rem 1rem;
    cursor: pointer;
    font-family: var(--font);
    font-size: 0.9rem;
    font-weight: 500;
    transition: all 0.2s ease;
    white-space: nowrap;
  }

  .games-tab:hover {
    border-color: var(--accent);
    color: var(--accent);
    background: var(--accent-glow);
  }

  .games-tab-active {
    border-color: var(--accent) !important;
    color: var(--accent) !important;
    background: var(--accent-glow) !important;
    font-weight: 600;
    box-shadow: 0 0 12px var(--accent-glow);
  }

  .games-close-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: 1.5px solid var(--border);
    border-radius: var(--radius-sm);
    color: var(--text);
    cursor: pointer;
    padding: 0.5rem;
    transition: all 0.2s ease;
    flex-shrink: 0;
  }

  .games-close-btn:hover {
    border-color: #ef4444;
    color: #ef4444;
    background: rgba(239, 68, 68, 0.08);
  }

  /* ─── Content ─── */
  .games-content {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    overscroll-behavior: contain;
    padding: 1rem 1.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
  }

  /* ─── Game canvas ───
     The canvases have a wide internal resolution (e.g. 1200x400). Scaling
     purely by width would make them only ~110px tall on a phone, which is
     unplayable. Below 760px we give them a usable height instead; the game
     logic uses fixed internal coordinates so gameplay is unaffected. */
  @media (max-width: 760px) {
    .game-canvas {
      height: 42dvh !important;
      min-height: 200px;
      max-height: 340px;
    }
  }

  @media (max-width: 760px) and (orientation: landscape) {
    .game-canvas {
      height: 60dvh !important;
      min-height: 160px;
    }
  }

  /* ─── Loading ─── */
  .games-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    padding: 4rem 1rem;
    color: var(--text);
    font-family: var(--font);
    font-size: 0.95rem;
  }

  .games-loading-spinner {
    width: 32px;
    height: 32px;
    border: 3px solid var(--border);
    border-top-color: var(--accent);
    border-radius: 50%;
    animation: games-spin 0.7s linear infinite;
  }

  @keyframes games-spin {
    to { transform: rotate(360deg); }
  }

  /* ─── Quit Confirm ─── */
  .games-confirm-overlay {
    position: fixed;
    inset: 0;
    z-index: 10000;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(6px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
  }

  .games-confirm-card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: 2rem 1.75rem;
    max-width: 380px;
    width: 100%;
    text-align: center;
    box-shadow: 0 24px 64px rgba(0, 0, 0, 0.5);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }

  .games-confirm-card h3 {
    color: var(--text-h);
    font-size: 1.15rem;
    font-weight: 700;
    margin: 0.25rem 0;
  }

  .games-confirm-card p {
    color: var(--text);
    font-size: 0.9rem;
    line-height: 1.6;
    margin-bottom: 1rem;
  }

  .games-confirm-actions {
    display: flex;
    gap: 0.75rem;
    width: 100%;
  }

  .games-confirm-cancel,
  .games-confirm-exit {
    flex: 1;
    border: none;
    border-radius: var(--radius-sm);
    padding: 0.7rem 1rem;
    cursor: pointer;
    font-family: var(--font);
    font-size: 0.9rem;
    font-weight: 600;
    transition: all 0.2s;
  }

  .games-confirm-cancel {
    background: var(--bg-secondary);
    border: 1px solid var(--border);
    color: var(--text-h);
  }

  .games-confirm-cancel:hover {
    border-color: var(--accent);
    background: var(--accent-glow);
  }

  .games-confirm-exit {
    background: #ef4444;
    color: #fff;
  }

  .games-confirm-exit:hover {
    background: #dc2626;
  }

  /* ─── Responsive ─── */

  /* Tablets */
  @media (max-width: 768px) {
    .games-header {
      padding: 0.6rem 1rem;
    }

    .games-tab {
      padding: 0.45rem 0.75rem;
      font-size: 0.82rem;
    }

    .games-content {
      padding: 1rem 0.75rem;
    }
  }

  /* Phones */
  @media (max-width: 480px) {
    .games-header {
      padding: 0.5rem 0.75rem;
      gap: 0.4rem;
    }

    .games-tabs {
      gap: 0.35rem;
    }

    .games-tab {
      padding: 0.4rem 0.6rem;
      font-size: 0.75rem;
      border-radius: 6px;
      gap: 0.3rem;
    }

    .games-tab svg {
      width: 14px;
      height: 14px;
    }

    .games-tab-label {
      max-width: 60px;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .games-close-btn {
      padding: 0.4rem;
    }

    .games-close-btn svg {
      width: 18px;
      height: 18px;
    }

    .games-content {
      padding: 0.75rem 0.5rem;
    }

    .games-confirm-card {
      padding: 1.5rem 1.25rem;
    }

    .games-confirm-card h3 {
      font-size: 1rem;
    }

    .games-confirm-card p {
      font-size: 0.85rem;
    }

    .games-confirm-actions {
      flex-direction: column;
    }
  }

  /* Very small phones */
  @media (max-width: 360px) {
    .games-tab-label {
      display: none;
    }

    .games-tab {
      padding: 0.4rem 0.55rem;
    }
  }
`;
