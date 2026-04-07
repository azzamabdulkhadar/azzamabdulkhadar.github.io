import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { questions, POINTS, getLevel, LEVELS } from './quizData';
import { CheckCircle, XCircle, Trophy, RotateCcw, Filter, Info, X } from 'lucide-react';

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

  const level = getLevel(points);
  const nextLevel = LEVELS.find(l => l.min > points);

  // notify parent when actively in quiz
  useEffect(() => {
    onPlayingChange?.(phase === 'quiz');
  }, [phase]);

  const startQuiz = () => {
    const filtered = topic === 'All' ? questions : questions.filter(q => q.topic === topic);
    // Pick a balanced mix: ~3 Easy, ~4 Medium, ~3 Hard — shuffled within each tier
    const easy   = shuffle(filtered.filter(q => q.level === 'Easy')).slice(0, 3);
    const medium = shuffle(filtered.filter(q => q.level === 'Medium')).slice(0, 4);
    const hard   = shuffle(filtered.filter(q => q.level === 'Hard')).slice(0, 3);
    setPool(shuffle([...easy, ...medium, ...hard]));
    setIdx(0);
    setSelected(null);
    setSessionPoints(0);
    setAnswers([]);
    setPhase('quiz');
  };

  const handleAnswer = (i) => {
    if (selected !== null) return;
    setSelected(i);
    const q = pool[idx];
    const correct = i === q.ans;
    const earned = correct ? POINTS[q.level] : 0;
    const newPoints = points + earned;
    setPoints(newPoints);
    setSessionPoints(sp => sp + earned);
    setAnswers(a => [...a, { correct, earned, level: q.level }]);
    localStorage.setItem('quizPoints', newPoints);
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

  if (phase === 'intro') return <Intro topic={topic} setTopic={setTopic} onStart={startQuiz} points={points} level={level} nextLevel={nextLevel} onReset={resetAll} showInfo={showInfo} setShowInfo={setShowInfo} />;
  if (phase === 'result') return <Result answers={answers} sessionPoints={sessionPoints} points={points} level={level} nextLevel={nextLevel} onRetry={reset} />;

  const q = pool[idx];
  const progress = ((idx + 1) / pool.length) * 100;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: 640, margin: '0 auto', position: 'relative' }}>

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

function Intro({ topic, setTopic, onStart, points, level, nextLevel, onReset, showInfo, setShowInfo }) {
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
        <button onClick={onStart} style={{
          flex: 1, background: 'var(--gradient)', color: '#fff', border: 'none',
          borderRadius: 10, padding: '0.85rem', cursor: 'pointer',
          fontWeight: 700, fontFamily: 'var(--font)', fontSize: '1rem',
        }}>
          Start Quiz 🚀
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

function Result({ answers, sessionPoints, points, level, nextLevel, onRetry }) {
  const correct = answers.filter(a => a.correct).length;
  const pct = Math.round((correct / answers.length) * 100);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: 480, margin: '0 auto', width: '100%', textAlign: 'center' }}>
      <div style={{ fontSize: '3rem' }}>{pct >= 80 ? '🏆' : pct >= 50 ? '👍' : '💪'}</div>
      <div>
        <h3 style={{ color: 'var(--text-h)', fontSize: '1.3rem', fontWeight: 700 }}>Quiz Complete!</h3>
        <p style={{ color: 'var(--text)', marginTop: '0.3rem' }}>{correct}/{answers.length} correct · {pct}%</p>
      </div>

      <div style={{
        background: 'var(--bg-card)', border: `1px solid ${level.color}40`,
        borderRadius: 14, padding: '1.25rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ textAlign: 'left' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text)' }}>Session earned</div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: '1.4rem', fontWeight: 700, color: '#22c55e' }}>+{sessionPoints} pts</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text)' }}>Current Level</div>
          <div style={{ fontWeight: 700, color: level.color }}>{level.name}</div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: '0.8rem', color: 'var(--text)' }}>{points} pts total</div>
        </div>
      </div>

      {nextLevel && (
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text)', marginBottom: '0.4rem' }}>
            {nextLevel.min - points} pts to {nextLevel.name}
          </div>
          <div style={{ height: 6, background: 'var(--border)', borderRadius: 4, overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${Math.min(100, ((points - level.min) / (nextLevel.min - level.min)) * 100)}%`,
              background: level.color,
            }} />
          </div>
        </div>
      )}

      <button onClick={onRetry} style={{
        background: 'var(--gradient)', color: '#fff', border: 'none',
        borderRadius: 10, padding: '0.85rem', cursor: 'pointer',
        fontWeight: 700, fontFamily: 'var(--font)', fontSize: '1rem',
      }}>
        Play Again
      </button>
    </div>
  );
}
