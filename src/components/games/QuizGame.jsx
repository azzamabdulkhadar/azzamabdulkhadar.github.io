import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { questions, POINTS, getLevel, LEVELS } from './quizData';
import { generateQuizQuestions } from '../../services/quizGenerator';
import { CheckCircle, XCircle, Trophy, RotateCcw, Filter, Info, X, Zap, Sparkles, Star } from 'lucide-react';

const TOTAL_Q = 10;

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function QuizGame({ onPlayingChange }) {
  const [topic, setTopic] = useState('All');
  const [phase, setPhase] = useState('intro');
  const [pool, setPool] = useState([]);
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [points, setPoints] = useState(() => Number(localStorage.getItem('quizPoints') || 0));
  const [sessionPoints, setSessionPoints] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showInfo, setShowInfo] = useState(false);
  const [useAI, setUseAI] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [levelUp, setLevelUp] = useState(null);
  const [showCelebration, setShowCelebration] = useState(false);

  const level = getLevel(points);
  const nextLevel = LEVELS.find(l => l.min > points);

  // notify parent when actively in quiz
  useEffect(() => {
    onPlayingChange?.(phase === 'quiz');
  }, [phase]);

  const startQuiz = async () => {
    setLoading(true);
    setError(null);
    try {
      let quizPool;
      
      if (useAI) {
        // Generate questions from API
        let topicForAPI = topic === 'All' ? ['MERN', 'Android'] : [topic];
        let allQuestions = [];
        
        // Generate questions for each topic
        for (const t of topicForAPI) {
          const generated = await generateQuizQuestions(t, 'mixed', Math.ceil(TOTAL_Q / topicForAPI.length));
          allQuestions = [...allQuestions, ...generated];
        }
        
        quizPool = shuffle(allQuestions).slice(0, TOTAL_Q);
      } else {
        // Use static questions
        const filtered = topic === 'All' ? questions : questions.filter(q => q.topic === topic);
        const easy   = shuffle(filtered.filter(q => q.level === 'Easy')).slice(0, 3);
        const medium = shuffle(filtered.filter(q => q.level === 'Medium')).slice(0, 4);
        const hard   = shuffle(filtered.filter(q => q.level === 'Hard')).slice(0, 3);
        quizPool = shuffle([...easy, ...medium, ...hard]);
      }

      setPool(quizPool);
      setIdx(0);
      setSelected(null);
      setSessionPoints(0);
      setAnswers([]);
      setPhase('quiz');
    } catch (err) {
      setError(err.message || 'Failed to generate questions');
      setLoading(false);
    }
  };

  const handleAnswer = (i) => {
    if (selected !== null) return;
    setSelected(i);
    const q = pool[idx];
    const correct = i === q.ans;
    const earned = correct ? POINTS[q.level] : 0;
    const newPoints = points + earned;
    const oldLevel = getLevel(points);
    const newLevel = getLevel(newPoints);
    
    setPoints(newPoints);
    setSessionPoints(sp => sp + earned);
    setAnswers(a => [...a, { correct, earned, level: q.level }]);
    localStorage.setItem('quizPoints', newPoints);

    // Check if user leveled up
    if (newLevel.name !== oldLevel.name) {
      setLevelUp(newLevel);
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 4000);
    }
  };

  const next = () => {
    if (idx + 1 >= pool.length) {
      setPhase('result');
    } else {
      setIdx(i => i + 1);
      setSelected(null);
    }
  };

  const reset = () => {
    setPhase('intro');
    setSelected(null);
  };

  const resetAll = () => {
    setPoints(0);
    localStorage.setItem('quizPoints', 0);
    setPhase('intro');
  };

  if (phase === 'intro') return <Intro topic={topic} setTopic={setTopic} onStart={startQuiz} points={points} level={level} nextLevel={nextLevel} onReset={resetAll} showInfo={showInfo} setShowInfo={setShowInfo} useAI={useAI} setUseAI={setUseAI} loading={loading} error={error} />;
  if (phase === 'result') return <Result answers={answers} sessionPoints={sessionPoints} points={points} level={level} nextLevel={nextLevel} onRetry={reset} levelUp={levelUp} />;

  const q = pool[idx];
  const progress = ((idx + 1) / pool.length) * 100;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: 640, margin: '0 auto', position: 'relative' }}>

      {/* Exit Confirmation Dialog */}
      <AnimatePresence>
        {showCelebration && levelUp && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: -50 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 200,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              pointerEvents: 'none',
            }}
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 0.6 }}
              style={{
                background: `linear-gradient(135deg, ${levelUp.color}, ${levelUp.color}dd)`,
                borderRadius: 20, padding: '2rem', textAlign: 'center',
                boxShadow: `0 20px 60px ${levelUp.color}40`,
                backdropFilter: 'blur(10px)',
              }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}
              >
                🎉
              </motion.div>
              <div style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                Level Up! 🚀
              </div>
              <div style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                {levelUp.name}
              </div>
              <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.9rem' }}>
                You've earned {points} total points!
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confetti effect */}
      {showCelebration && <Confetti />}

      {/* Info panel overlay */}
      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            style={{
              position: 'absolute', inset: 0, zIndex: 10,
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 16, padding: '1.25rem',
              display: 'flex', flexDirection: 'column', gap: '0.75rem',
              overflowY: 'auto', overscrollBehavior: 'contain',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 700, color: 'var(--text-h)', fontSize: '1rem' }}>🧠 Quiz Rules</span>
              <button onClick={() => setShowInfo(false)} style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--text)', display: 'flex', alignItems: 'center',
              }}>
                <X size={18} />
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[
                ['📋 Format', '10 random questions per session from MERN or Android topics (or both).'],
                ['🎯 Answering', 'Select one option. You cannot change your answer once selected.'],
                ['✅ Correct Answer', 'The correct option is highlighted green after you answer.'],
                ['❌ Wrong Answer', 'Your wrong pick turns red, and the correct answer is revealed.'],
                ['🏆 Points', 'Easy = 10 pts · Medium = 20 pts · Hard = 30 pts. Wrong answers earn 0.'],
                ['📈 Levels', 'Points accumulate across sessions and are saved. Level up as you earn more!'],
                ['🔄 Reset', 'Use the reset button (↺) on the intro screen to clear all your points.'],
              ].map(([title, desc]) => (
                <div key={title} style={{
                  background: 'var(--bg-secondary)', borderRadius: 8,
                  padding: '0.6rem 0.75rem', border: '1px solid var(--border)',
                }}>
                  <div style={{ fontWeight: 600, fontSize: '0.8rem', color: 'var(--accent)', marginBottom: 2 }}>{title}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text)', lineHeight: 1.5 }}>{desc}</div>
                </div>
              ))}
            </div>
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '0.6rem' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text)', fontWeight: 600, marginBottom: '0.4rem' }}>🎖️ Levels</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                {LEVELS.map(l => (
                  <div key={l.name} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontFamily: 'var(--mono)', fontSize: '0.72rem', color: l.color, minWidth: 80 }}>
                      {l.min === 0 ? '0' : `${l.min}+`} pts
                    </span>
                    <span style={{ fontSize: '0.72rem', color: l.color, fontWeight: 600 }}>{l.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: 'var(--mono)', fontSize: '0.8rem', color: 'var(--text)' }}>
          Q {idx + 1} / {pool.length}
        </span>
        <span style={{
          fontFamily: 'var(--mono)', fontSize: '0.78rem',
          color: level.color, background: `${level.color}20`,
          border: `1px solid ${level.color}40`,
          padding: '2px 10px', borderRadius: '20px',
        }}>
          {level.name} · {points} pts
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{
            fontSize: '0.75rem',
            background: q.topic === 'MERN' ? 'rgba(124,58,237,0.15)' : 'rgba(6,182,212,0.15)',
            border: `1px solid ${q.topic === 'MERN' ? 'rgba(124,58,237,0.3)' : 'rgba(6,182,212,0.3)'}`,
            padding: '2px 10px', borderRadius: '20px', fontFamily: 'var(--mono)',
            color: q.topic === 'MERN' ? 'var(--accent)' : 'var(--accent-2)',
          }}>
            {q.topic} · {q.level}
          </span>
          <button
            onClick={() => setShowInfo(v => !v)}
            title="Quiz rules"
            style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: '50%', width: 28, height: 28, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--accent)', transition: 'border-color 0.2s', flexShrink: 0,
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
          >
            <Info size={14} />
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: 4, background: 'var(--border)', borderRadius: 4, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${progress}%`, background: 'var(--gradient)', transition: 'width 0.3s' }} />
      </div>

      {/* Question */}
      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: 16, padding: '1.5rem',
      }}>
        <p style={{ color: 'var(--text-h)', fontSize: '1.05rem', fontWeight: 600, lineHeight: 1.6 }}>{q.q}</p>
      </div>

      {/* Options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {q.options.map((opt, i) => {
          let bg = 'var(--bg-card)', border = 'var(--border)', color = 'var(--text-h)';
          if (selected !== null) {
            if (i === q.ans) { bg = 'rgba(34,197,94,0.15)'; border = '#22c55e'; color = '#22c55e'; }
            else if (i === selected && i !== q.ans) { bg = 'rgba(239,68,68,0.15)'; border = '#ef4444'; color = '#ef4444'; }
          } else if (selected === i) {
            bg = 'var(--accent-glow)'; border = 'var(--accent)';
          }
          return (
            <button key={i} onClick={() => handleAnswer(i)} style={{
              background: bg, border: `1px solid ${border}`, borderRadius: 10,
              padding: '0.85rem 1.25rem', cursor: selected !== null ? 'default' : 'pointer',
              color, fontFamily: 'var(--font)', fontSize: '0.95rem', textAlign: 'left',
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              transition: 'all 0.2s',
            }}>
              <span style={{
                width: 26, height: 26, borderRadius: '50%', border: `1px solid ${border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.75rem', fontFamily: 'var(--mono)', flexShrink: 0, color,
              }}>
                {String.fromCharCode(65 + i)}
              </span>
              {opt}
              {selected !== null && i === q.ans && <CheckCircle size={16} style={{ marginLeft: 'auto', color: '#22c55e' }} />}
              {selected !== null && i === selected && i !== q.ans && <XCircle size={16} style={{ marginLeft: 'auto', color: '#ef4444' }} />}
            </button>
          );
        })}
      </div>

      {/* Points feedback + next */}
      {selected !== null && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{
            fontFamily: 'var(--mono)', fontSize: '0.9rem',
            color: selected === q.ans ? '#22c55e' : '#ef4444',
          }}>
            {selected === q.ans ? `+${POINTS[q.level]} pts` : 'No points'}
          </span>
          <button onClick={next} style={{
            background: 'var(--gradient)', color: '#fff', border: 'none',
            borderRadius: 8, padding: '0.6rem 1.5rem', cursor: 'pointer',
            fontWeight: 600, fontFamily: 'var(--font)', fontSize: '0.9rem',
          }}>
            {idx + 1 >= pool.length ? 'See Results' : 'Next →'}
          </button>
        </div>
      )}
    </div>
  );
}

function Confetti() {
  const confetti = Array.from({ length: 50 }).map((_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 0.3,
    duration: 2 + Math.random() * 1,
    color: ['#fbbf24', '#60a5fa', '#34d399', '#f87171', '#a78bfa'][Math.floor(Math.random() * 5)],
  }));

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 199 }}>
      {confetti.map(c => (
        <motion.div
          key={c.id}
          initial={{ y: -10, opacity: 1, rotate: 0 }}
          animate={{ y: window.innerHeight + 10, opacity: 0, rotate: 360 }}
          transition={{ duration: c.duration, delay: c.delay, ease: 'easeIn' }}
          style={{
            position: 'absolute', left: `${c.left}%`, width: 10, height: 10,
            background: c.color, borderRadius: '50%',
          }}
        />
      ))}
    </div>
  );
}

function Intro({ topic, setTopic, onStart, points, level, nextLevel, onReset, showInfo, setShowInfo, useAI, setUseAI, loading, error }) {
  const topics = ['All', 'MERN', 'Android'];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: 560, margin: '0 auto', width: '100%', position: 'relative' }}>

      {/* Info panel overlay */}
      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            style={{
              position: 'absolute', inset: 0, zIndex: 10,
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 16, padding: '1.25rem',
              display: 'flex', flexDirection: 'column', gap: '0.75rem',
              overflowY: 'auto', overscrollBehavior: 'contain',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 700, color: 'var(--text-h)', fontSize: '1rem' }}>🧠 Quiz Rules</span>
              <button onClick={() => setShowInfo(false)} style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--text)', display: 'flex', alignItems: 'center',
              }}>
                <X size={18} />
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[
                ['📋 Format', '10 random questions per session from MERN or Android topics (or both).'],
                ['🎯 Answering', 'Select one option. You cannot change your answer once selected.'],
                ['✅ Correct Answer', 'The correct option is highlighted green after you answer.'],
                ['❌ Wrong Answer', 'Your wrong pick turns red, and the correct answer is revealed.'],
                ['🏆 Points', 'Easy = 10 pts · Medium = 20 pts · Hard = 30 pts. Wrong answers earn 0.'],
                ['📈 Levels', 'Points accumulate across sessions and are saved. Level up as you earn more!'],
                ['🔄 Reset', 'Use the reset button (↺) on the intro screen to clear all your points.'],
              ].map(([title, desc]) => (
                <div key={title} style={{
                  background: 'var(--bg-secondary)', borderRadius: 8,
                  padding: '0.6rem 0.75rem', border: '1px solid var(--border)',
                }}>
                  <div style={{ fontWeight: 600, fontSize: '0.8rem', color: 'var(--accent)', marginBottom: 2 }}>{title}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text)', lineHeight: 1.5 }}>{desc}</div>
                </div>
              ))}
            </div>
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '0.6rem' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text)', fontWeight: 600, marginBottom: '0.4rem' }}>🎖️ Levels</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                {LEVELS.map(l => (
                  <div key={l.name} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontFamily: 'var(--mono)', fontSize: '0.72rem', color: l.color, minWidth: 80 }}>
                      {l.min === 0 ? '0' : `${l.min}+`} pts
                    </span>
                    <span style={{ fontSize: '0.72rem', color: l.color, fontWeight: 600 }}>{l.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ textAlign: 'center', position: 'relative' }}>
        <button
          onClick={() => setShowInfo(v => !v)}
          title="Quiz rules"
          style={{
            position: 'absolute', top: 0, right: 0,
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: '50%', width: 28, height: 28, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--accent)', transition: 'border-color 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
        >
          <Info size={14} />
        </button>
        <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🧠</div>
        <h3 style={{ color: 'var(--text-h)', fontSize: '1.3rem', fontWeight: 700 }}>Test Your Skills</h3>
        <p style={{ color: 'var(--text)', fontSize: '0.9rem', marginTop: '0.4rem' }}>
          Answer {10} questions and earn points to level up
        </p>
      </div>

      {/* Level card */}
      <div style={{
        background: 'var(--bg-card)', border: `1px solid ${level.color}40`,
        borderRadius: 14, padding: '1.25rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem',
      }}>
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text)', marginBottom: '0.25rem' }}>Your Level</div>
          <div style={{ fontWeight: 700, fontSize: '1.1rem', color: level.color }}>{level.name}</div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: '0.8rem', color: 'var(--text)', marginTop: '0.2rem' }}>
            {points} pts {nextLevel ? `· ${nextLevel.min - points} to ${nextLevel.name}` : '· Max Level!'}
          </div>
        </div>
        <Trophy size={32} color={level.color} />
      </div>

      {/* Points to next level bar */}
      {nextLevel && (
        <div>
          <div style={{ height: 6, background: 'var(--border)', borderRadius: 4, overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${Math.min(100, ((points - level.min) / (nextLevel.min - level.min)) * 100)}%`,
              background: level.color, transition: 'width 0.5s',
            }} />
          </div>
        </div>
      )}

      {/* AI Toggle */}
      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: 12, padding: '1rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Zap size={16} color='var(--accent)' />
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-h)' }}>AI-Generated Questions</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text)', marginTop: '0.2rem' }}>
              {useAI ? 'Fresh questions every time' : 'Use static question bank'}
            </div>
          </div>
        </div>
        <button
          onClick={() => setUseAI(!useAI)}
          style={{
            width: 50, height: 28, borderRadius: 14, border: 'none',
            background: useAI ? 'var(--accent)' : 'var(--border)',
            cursor: 'pointer', transition: 'all 0.2s',
            position: 'relative',
          }}
        >
          <div style={{
            width: 24, height: 24, borderRadius: '50%', background: '#fff',
            position: 'absolute', top: 2, left: useAI ? 24 : 2,
            transition: 'left 0.2s',
          }} />
        </button>
      </div>

      {error && (
        <div style={{
          background: 'rgba(239,68,68,0.15)', border: '1px solid #ef4444',
          borderRadius: 8, padding: '0.75rem', color: '#ef4444', fontSize: '0.85rem',
        }}>
          ⚠️ {error}
        </div>
      )}

      {/* Topic filter */}
      <div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Filter size={13} /> Topic
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {topics.map(t => (
            <button key={t} onClick={() => setTopic(t)} style={{
              background: topic === t ? 'var(--accent-glow)' : 'var(--bg-card)',
              border: `1px solid ${topic === t ? 'var(--accent)' : 'var(--border)'}`,
              color: topic === t ? 'var(--accent)' : 'var(--text)',
              borderRadius: 8, padding: '0.4rem 1rem', cursor: 'pointer',
              fontFamily: 'var(--font)', fontSize: '0.85rem', transition: 'all 0.2s',
            }}>{t}</button>
          ))}
        </div>
      </div>

      {/* Points guide */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
        {[['Easy', '10 pts', '#22c55e'], ['Medium', '20 pts', '#f59e0b'], ['Hard', '30 pts', '#ef4444']].map(([d, p, c]) => (
          <div key={d} style={{
            background: 'var(--bg-card)', border: `1px solid ${c}30`,
            borderRadius: 8, padding: '0.6rem', textAlign: 'center',
          }}>
            <div style={{ fontSize: '0.75rem', color: c, fontWeight: 600 }}>{d}</div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: '0.8rem', color: 'var(--text)' }}>{p}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <button onClick={onStart} disabled={loading} style={{
          flex: 1, background: 'var(--gradient)', color: '#fff', border: 'none',
          borderRadius: 10, padding: '0.85rem', cursor: loading ? 'not-allowed' : 'pointer',
          fontWeight: 700, fontFamily: 'var(--font)', fontSize: '1rem',
          opacity: loading ? 0.6 : 1,
        }}>
          {loading ? '⏳ Generating...' : 'Start Quiz 🚀'}
        </button>
        <button onClick={onReset} title="Reset all points" style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 10, padding: '0.85rem 1rem', cursor: 'pointer',
          color: 'var(--text)', display: 'flex', alignItems: 'center',
        }}>
          <RotateCcw size={16} />
        </button>
      </div>
    </div>
  );
}

function Result({ answers, sessionPoints, points, level, nextLevel, onRetry, levelUp }) {
  const correct = answers.filter(a => a.correct).length;
  const pct = Math.round((correct / answers.length) * 100);
  
  const getResultMessage = () => {
    if (pct === 100) return { emoji: '🏆', msg: 'Perfect Score!', color: '#fbbf24' };
    if (pct >= 90) return { emoji: '⭐', msg: 'Excellent!', color: '#34d399' };
    if (pct >= 80) return { emoji: '👏', msg: 'Great Job!', color: '#60a5fa' };
    if (pct >= 70) return { emoji: '👍', msg: 'Good Work!', color: '#a78bfa' };
    if (pct >= 50) return { emoji: '💪', msg: 'Keep Practicing!', color: '#f59e0b' };
    return { emoji: '🎯', msg: 'Try Again!', color: '#f87171' };
  };

  const result = getResultMessage();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: 480, margin: '0 auto', width: '100%', textAlign: 'center' }}>
      {/* Celebration animation for perfect/excellent scores */}
      {pct >= 80 && <Confetti />}

      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 15 }}
        style={{ fontSize: '4rem' }}
      >
        {result.emoji}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 style={{ color: result.color, fontSize: '1.5rem', fontWeight: 700 }}>
          {result.msg}
        </h3>
        <p style={{ color: 'var(--text)', marginTop: '0.3rem', fontSize: '1rem' }}>
          {correct}/{answers.length} correct · {pct}%
        </p>
      </motion.div>

      {/* Achievement badges */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        style={{
          display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap',
        }}
      >
        {pct === 100 && (
          <div style={{
            background: 'rgba(251,191,36,0.15)', border: '1px solid #fbbf24',
            borderRadius: 8, padding: '0.5rem 1rem', fontSize: '0.85rem',
            color: '#fbbf24', fontWeight: 600,
          }}>
            ⭐ Perfect Score
          </div>
        )}
        {correct >= 8 && (
          <div style={{
            background: 'rgba(52,211,153,0.15)', border: '1px solid #34d399',
            borderRadius: 8, padding: '0.5rem 1rem', fontSize: '0.85rem',
            color: '#34d399', fontWeight: 600,
          }}>
            🔥 On Fire
          </div>
        )}
        {sessionPoints >= 60 && (
          <div style={{
            background: 'rgba(96,165,250,0.15)', border: '1px solid #60a5fa',
            borderRadius: 8, padding: '0.5rem 1rem', fontSize: '0.85rem',
            color: '#60a5fa', fontWeight: 600,
          }}>
            💎 High Earner
          </div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        style={{
          background: 'var(--bg-card)', border: `1px solid ${level.color}40`,
          borderRadius: 14, padding: '1.25rem',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}
      >
        <div style={{ textAlign: 'left' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text)' }}>Session earned</div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: 'spring' }}
            style={{ fontFamily: 'var(--mono)', fontSize: '1.4rem', fontWeight: 700, color: '#22c55e' }}
          >
            +{sessionPoints} pts
          </motion.div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text)' }}>Current Level</div>
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            style={{ fontWeight: 700, color: level.color, fontSize: '1.1rem' }}
          >
            {level.name}
          </motion.div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: '0.8rem', color: 'var(--text)' }}>
            {points} pts total
          </div>
        </div>
      </motion.div>

      {nextLevel && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div style={{ fontSize: '0.75rem', color: 'var(--text)', marginBottom: '0.4rem' }}>
            {nextLevel.min - points} pts to {nextLevel.name}
          </div>
          <div style={{ height: 6, background: 'var(--border)', borderRadius: 4, overflow: 'hidden' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width: `${Math.min(100, ((points - level.min) / (nextLevel.min - level.min)) * 100)}%`,
              }}
              transition={{ delay: 0.6, duration: 1 }}
              style={{
                height: '100%',
                background: level.color,
              }}
            />
          </div>
        </motion.div>
      )}

      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        onClick={onRetry}
        style={{
          background: 'var(--gradient)', color: '#fff', border: 'none',
          borderRadius: 10, padding: '0.85rem', cursor: 'pointer',
          fontWeight: 700, fontFamily: 'var(--font)', fontSize: '1rem',
        }}
      >
        Play Again
      </motion.button>
    </div>
  );
}
