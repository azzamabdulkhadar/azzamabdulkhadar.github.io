import { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, X } from 'lucide-react';
import { useTheme } from '../../ThemeContext';

const W = 800, H = 300;
const GROUND = 240;
const DINO_X = 80;
const GRAVITY = 0.6;
const JUMP_V = -13;

const MILESTONES = [
  { score: 300,  emoji: '⚡', label: 'Speed Demon!',    sub: 'You hit 300 — birds incoming!',        color: '#38bdf8' },
  { score: 600,  emoji: '🐦', label: 'Bird Dodger!',    sub: 'Reached 600 — things get HARD!',       color: '#f59e0b' },
  { score: 800,  emoji: '🔥', label: 'On Fire!',        sub: '800 points — INSANE mode unlocked!',   color: '#ef4444' },
  { score: 1000, emoji: '😱', label: 'Nightmare!',      sub: '1000 pts — you\'re a legend!',         color: '#c026d3' },
  { score: 1200, emoji: '💀', label: 'Welcome to Hell!', sub: '1200 pts — pure chaos ahead!',        color: '#ff0000' },
];

// ── Characters ──────────────────────────────────────────────────────────────
const CHARACTERS = [
  {
    id: 'dino', label: 'Dino', emoji: '🦕',
    color: '#7c3aed', w: 44, h: 52,
    draw(ctx, x, y, dead, legFrame, color, eyeLight) {
      ctx.fillStyle = color;
      ctx.fillRect(x + 4, y, 36, 38);          // body
      ctx.fillRect(x + 14, y - 18, 26, 20);    // head
      ctx.fillRect(x, y + 10, 10, 8);           // tail
      // legs
      const l1 = legFrame < 10 ? 0 : 8, l2 = legFrame < 10 ? 8 : 0;
      ctx.fillRect(x + 10, y + 38, 10, 14 + l1);
      ctx.fillRect(x + 24, y + 38, 10, 14 + l2);
      // eye
      ctx.fillStyle = eyeLight ? '#333' : '#fff';
      ctx.fillRect(x + 30, y - 14, 6, 6);
      ctx.fillStyle = eyeLight ? '#fff' : '#000';
      ctx.fillRect(x + 32, y - 13, 3, 3);
      if (dead) { ctx.fillStyle = '#ef4444'; ctx.fillRect(x + 24, y - 6, 10, 3); }
    },
  },
  {
    id: 'dragon', label: 'Dragon', emoji: '🐉',
    color: '#ef4444', w: 50, h: 50,
    draw(ctx, x, y, dead, legFrame, color, eyeLight) {
      ctx.fillStyle = color;
      ctx.fillRect(x + 6, y + 4, 38, 34);      // body
      ctx.fillRect(x + 20, y - 16, 24, 22);    // head
      // spikes on back
      ctx.fillStyle = '#fbbf24';
      for (let i = 0; i < 4; i++) ctx.fillRect(x + 8 + i * 9, y, 5, 8 - i);
      ctx.fillStyle = color;
      // wings
      ctx.fillRect(x - 4, y + 6, 12, 18);
      ctx.fillRect(x + 42, y + 6, 10, 14);
      // tail
      ctx.fillRect(x, y + 24, 8, 8);
      ctx.fillRect(x - 6, y + 30, 8, 6);
      // legs
      const l1 = legFrame < 10 ? 0 : 6, l2 = legFrame < 10 ? 6 : 0;
      ctx.fillRect(x + 12, y + 38, 10, 12 + l1);
      ctx.fillRect(x + 28, y + 38, 10, 12 + l2);
      // eye
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(x + 34, y - 12, 6, 6);
      ctx.fillStyle = '#000';
      ctx.fillRect(x + 36, y - 11, 3, 3);
      if (dead) { ctx.fillStyle = '#fff'; ctx.fillRect(x + 28, y - 4, 10, 3); }
    },
  },
  {
    id: 'bunny', label: 'Bunny', emoji: '🐰',
    color: '#ec4899', w: 40, h: 54,
    draw(ctx, x, y, dead, legFrame, color, eyeLight) {
      ctx.fillStyle = color;
      // ears
      ctx.fillRect(x + 8, y - 22, 8, 22);
      ctx.fillRect(x + 22, y - 22, 8, 22);
      ctx.fillStyle = '#fda4af';
      ctx.fillRect(x + 10, y - 20, 4, 16);
      ctx.fillRect(x + 24, y - 20, 4, 16);
      // body
      ctx.fillStyle = color;
      ctx.fillRect(x + 2, y, 36, 36);
      // head
      ctx.fillRect(x + 4, y - 4, 32, 20);
      // tail
      ctx.fillStyle = '#fff';
      ctx.fillRect(x + 32, y + 20, 10, 10);
      // legs
      ctx.fillStyle = color;
      const l1 = legFrame < 10 ? 0 : 8, l2 = legFrame < 10 ? 8 : 0;
      ctx.fillRect(x + 6, y + 36, 12, 14 + l1);
      ctx.fillRect(x + 22, y + 36, 12, 14 + l2);
      // eye
      ctx.fillStyle = eyeLight ? '#333' : '#fff';
      ctx.fillRect(x + 10, y - 2, 5, 5);
      ctx.fillRect(x + 24, y - 2, 5, 5);
      ctx.fillStyle = '#000';
      ctx.fillRect(x + 11, y - 1, 3, 3);
      ctx.fillRect(x + 25, y - 1, 3, 3);
      // nose
      ctx.fillStyle = '#fda4af';
      ctx.fillRect(x + 17, y + 6, 6, 4);
      if (dead) { ctx.fillStyle = '#ef4444'; ctx.fillRect(x + 12, y + 12, 16, 3); }
    },
  },
];

// ── Obstacles ────────────────────────────────────────────────────────────────
function randomCactus(x, score) {
  const types = [{ w: 20, h: 40 }, { w: 30, h: 55 }, { w: 50, h: 40 }];
  // double cactus after score 1000
  if (score >= 1000 && Math.random() < 0.35) {
    const t = types[Math.floor(Math.random() * types.length)];
    const t2 = types[Math.floor(Math.random() * types.length)];
    return [
      { x, y: GROUND - t.h, w: t.w, h: t.h, type: 'cactus' },
      { x: x + t.w + 18, y: GROUND - t2.h, w: t2.w, h: t2.h, type: 'cactus' },
    ];
  }
  const t = types[Math.floor(Math.random() * types.length)];
  return [{ x, y: GROUND - t.h, w: t.w, h: t.h, type: 'cactus' }];
}

function randomBird(x) {
  const yOpts = [GROUND - 100, GROUND - 130, GROUND - 80];
  const y = yOpts[Math.floor(Math.random() * yOpts.length)];
  return { x, y, w: 46, h: 22, type: 'bird', wingUp: true, wingTimer: 0 };
}

function cssVar(el, name) {
  return getComputedStyle(el).getPropertyValue(name).trim();
}

// ── Difficulty tiers ─────────────────────────────────────────────────────────
function getDifficulty(score) {
  if (score >= 1200) return { label: '💀 HELL',      color: '#ff0000', baseSpeed: 16, minGap: 28, maxGap: 38, birds: true,  birdChance: 0.55, doubleBird: true  };
  if (score >= 800)  return { label: '😱 NIGHTMARE', color: '#c026d3', baseSpeed: 13, minGap: 33, maxGap: 45, birds: true,  birdChance: 0.45, doubleBird: false };
  if (score >= 1000) return { label: '🔥 INSANE',    color: '#ef4444', baseSpeed: 11, minGap: 38, maxGap: 52, birds: true,  birdChance: 0.38, doubleBird: false };
  if (score >= 600)  return { label: 'HARD',          color: '#f59e0b', baseSpeed: 8,  minGap: 50, maxGap: 65, birds: true,  birdChance: 0.28, doubleBird: false };
  if (score >= 300)  return { label: 'FAST',          color: '#38bdf8', baseSpeed: 7,  minGap: 55, maxGap: 75, birds: false, birdChance: 0,    doubleBird: false };
  return               { label: 'NORMAL',             color: '#22c55e', baseSpeed: 5,  minGap: 60, maxGap: 90, birds: false, birdChance: 0,    doubleBird: false };
}

export default forwardRef(function DinoGame({ onRunningChange }, ref) {
  const { theme } = useTheme();
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);
  const [charIdx, setCharIdx] = useState(0);
  const charIdxRef = useRef(0);
  const pausedRef = useRef(false);
  const startingRef = useRef(false); // true while a start/resume countdown is running
  const [countdown, setCountdown] = useState(null);
  const [countdownMode, setCountdownMode] = useState('start'); // 'start' | 'resume'
  const [toast, setToast] = useState(null);       // current milestone toast
  const [showInfo, setShowInfo] = useState(false); // rules panel
  const reachedRef = useRef(new Set());            // milestones already shown
  const toastTimerRef = useRef(null);

  const charH = CHARACTERS[charIdx].h;
  const state = useRef({
    running: false, over: false, started: false,
    dinoY: GROUND - charH, dinoVY: 0, onGround: true,
    obstacles: [], score: 0, speed: 5, frame: 0,
    nextObstacle: 90, legFrame: 0,
  });
  const [display, setDisplay] = useState({ score: 0, over: false, started: false, diff: 'NORMAL' });
  const rafRef = useRef(null);
  const countdownRef = useRef(null);

  // expose pause/resume to parent via ref
  useImperativeHandle(ref, () => ({
    pause() {
      pausedRef.current = true;
    },
    resume() {
      // 3-second countdown then unpause
      setCountdownMode('resume');
      startingRef.current = true;
      let count = 3;
      setCountdown(count);
      countdownRef.current = setInterval(() => {
        count--;
        if (count <= 0) {
          clearInterval(countdownRef.current);
          setCountdown(null);
          startingRef.current = false;
          pausedRef.current = false;
        } else {
          setCountdown(count);
        }
      }, 1000);
    },
    isRunning() {
      return state.current.running;
    },
    forceStop() {
      clearInterval(countdownRef.current);
      setCountdown(null);
      startingRef.current = false;
      pausedRef.current = false;
      state.current.running = false;
      onRunningChange?.(false);
    },
  }));

  const jump = () => {
    const s = state.current;
    if (s.onGround && s.running) { s.dinoVY = JUMP_V; s.onGround = false; }
  };

  const start = () => {
    if (startingRef.current) return; // ignore taps/keys while a countdown is running
    clearInterval(countdownRef.current);
    clearTimeout(toastTimerRef.current);
    setToast(null);
    pausedRef.current = false;
    reachedRef.current = new Set();
    const ch = CHARACTERS[charIdxRef.current];
    // reset state but keep running: false until countdown finishes
    Object.assign(state.current, {
      running: false, over: false, started: true,
      dinoY: GROUND - ch.h, dinoVY: 0, onGround: true,
      obstacles: [], score: 0, speed: 5, frame: 0, nextObstacle: 90, legFrame: 0,
    });
    setDisplay({ score: 0, over: false, started: true, diff: 'NORMAL' });
    onRunningChange?.(false);

    setCountdownMode('start');
    startingRef.current = true;
    let count = 3;
    setCountdown(count);
    countdownRef.current = setInterval(() => {
      count--;
      if (count <= 0) {
        clearInterval(countdownRef.current);
        setCountdown(null);
        startingRef.current = false;
        state.current.running = true;
        onRunningChange?.(true);
      } else {
        setCountdown(count);
      }
    }, 1000);
  };

  const selectChar = (i) => {
    if (state.current.running) return;
    charIdxRef.current = i;
    setCharIdx(i);
    state.current.dinoY = GROUND - CHARACTERS[i].h;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    const ctx = canvas.getContext('2d');

    const onKey = (e) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        const s = state.current;
        if (!s.running && !s.over) start();
        else if (s.over) return; // button only
        else jump();
      }
    };
    window.addEventListener('keydown', onKey);

    const getColors = () => ({
      bg: cssVar(wrap, '--bg'), border: cssVar(wrap, '--border'),
      textH: cssVar(wrap, '--text-h'), accent: cssVar(wrap, '--accent'),
      accent2: cssVar(wrap, '--accent-2'),
    });

    const drawBird = (b, colors) => {
      ctx.fillStyle = theme === 'light' ? '#7c3aed' : '#a78bfa';
      // body
      ctx.fillRect(b.x + 8, b.y + 6, 30, 12);
      // beak
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(b.x + 38, b.y + 10, 8, 5);
      // eye
      ctx.fillStyle = '#fff';
      ctx.fillRect(b.x + 32, b.y + 7, 5, 5);
      ctx.fillStyle = '#000';
      ctx.fillRect(b.x + 33, b.y + 8, 3, 3);
      // wings
      ctx.fillStyle = theme === 'light' ? '#6d28d9' : '#c4b5fd';
      if (b.wingUp) {
        ctx.fillRect(b.x + 10, b.y - 8, 20, 10);
        ctx.fillRect(b.x + 20, b.y + 16, 16, 8);
      } else {
        ctx.fillRect(b.x + 10, b.y + 16, 20, 10);
        ctx.fillRect(b.x + 20, b.y - 4, 16, 8);
      }
    };

    const drawCactus = (c) => {
      ctx.fillStyle = theme === 'light' ? '#15803d' : '#22c55e';
      ctx.fillRect(c.x, c.y, c.w, c.h);
      ctx.fillRect(c.x - 8, c.y + 10, 8, c.h * 0.4);
      ctx.fillRect(c.x + c.w, c.y + 15, 8, c.h * 0.35);
    };

    const loop = () => {
      const s = state.current;
      const ch = CHARACTERS[charIdxRef.current];
      const colors = getColors();
      const eyeLight = theme === 'light';
      ctx.clearRect(0, 0, W, H);

      // background
      ctx.fillStyle = colors.bg || '#0a0a0f';
      ctx.fillRect(0, 0, W, H);

      // ground
      ctx.fillStyle = colors.border;
      ctx.fillRect(0, GROUND, W, 3);

      if (!s.running && !s.over && !s.started) {
        ctx.fillStyle = colors.textH;
        ctx.font = 'bold 20px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Press SPACE or tap to start', W / 2, H / 2);
        ch.draw(ctx, DINO_X, GROUND - ch.h, false, 0, ch.color, eyeLight);
        rafRef.current = requestAnimationFrame(loop);
        return;
      }

      if (s.running && !pausedRef.current) {
        s.frame++;
        s.legFrame = (s.legFrame + 1) % 20;
        s.score += 0.1;

        const diff = getDifficulty(Math.floor(s.score));
        s.speed = diff.baseSpeed + Math.floor(s.score / 100) * 0.3;

        // milestone check
        const sc = Math.floor(s.score);
        for (const m of MILESTONES) {
          if (sc >= m.score && !reachedRef.current.has(m.score)) {
            reachedRef.current.add(m.score);
            clearTimeout(toastTimerRef.current);
            setToast(m);
            toastTimerRef.current = setTimeout(() => setToast(null), 3500);
          }
        }

        // physics
        s.dinoVY += GRAVITY;
        s.dinoY += s.dinoVY;
        if (s.dinoY >= GROUND - ch.h) { s.dinoY = GROUND - ch.h; s.dinoVY = 0; s.onGround = true; }

        // spawn obstacles
        s.nextObstacle--;
        if (s.nextObstacle <= 0) {
          const score = Math.floor(s.score);
          const d = getDifficulty(score);
          if (d.birds && Math.random() < d.birdChance) {
            s.obstacles.push(randomBird(W + 20));
            // HELL: sometimes spawn two birds at different heights
            if (d.doubleBird && Math.random() < 0.4) {
              s.obstacles.push(randomBird(W + 80));
            }
          } else {
            randomCactus(W + 20, score).forEach(c => s.obstacles.push(c));
          }
          s.nextObstacle = d.minGap + Math.floor(Math.random() * (d.maxGap - d.minGap));
        }

        // move & animate birds
        for (const ob of s.obstacles) {
          ob.x -= s.speed;
          if (ob.type === 'bird') {
            ob.wingTimer++;
            if (ob.wingTimer % 14 === 0) ob.wingUp = !ob.wingUp;
          }
        }

        // collision
        const db = { x: DINO_X + 8, y: s.dinoY + 4, w: ch.w - 14, h: ch.h - 8 };
        for (const ob of s.obstacles) {
          const hit = db.x < ob.x + ob.w && db.x + db.w > ob.x &&
                      db.y < ob.y + ob.h && db.y + db.h > ob.y;
          if (hit) {
            s.running = false; s.over = true;
            onRunningChange?.(false);
            setDisplay({ score: Math.floor(s.score), over: true, started: true, diff: getDifficulty(Math.floor(s.score)).label });
          }
        }
        s.obstacles = s.obstacles.filter(o => o.x + o.w > 0);

        const diff2 = getDifficulty(Math.floor(s.score));
        setDisplay(d => ({ ...d, score: Math.floor(s.score), diff: diff2.label }));
      }

      // draw obstacles
      for (const ob of s.obstacles) {
        if (ob.type === 'bird') drawBird(ob, colors);
        else drawCactus(ob);
      }

      // draw character
      ch.draw(ctx, DINO_X, s.dinoY, s.over, s.legFrame, ch.color, eyeLight);

      // difficulty badge (top-right of canvas)
      if (s.running || s.over) {
        const diff = getDifficulty(Math.floor(s.score));
        ctx.font = 'bold 12px Inter, sans-serif';
        ctx.textAlign = 'right';
        ctx.fillStyle = diff.color;
        ctx.fillText(diff.label, W - 12, 20);
      }

      if (s.over) {
        ctx.fillStyle = theme === 'light' ? 'rgba(255,255,255,0.75)' : 'rgba(0,0,0,0.6)';
        ctx.fillRect(W / 2 - 180, H / 2 - 52, 360, 56);
        ctx.fillStyle = colors.textH;
        ctx.font = 'bold 26px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', W / 2, H / 2 - 26);
        ctx.font = '15px Inter, sans-serif';
        ctx.fillStyle = theme === 'light' ? '#555566' : colors.textH;
        ctx.fillText(`Score: ${Math.floor(s.score)}`, W / 2, H / 2 - 4);
      }

      // paused overlay
      if (pausedRef.current && s.running) {
        ctx.fillStyle = theme === 'light' ? 'rgba(255,255,255,0.82)' : 'rgba(0,0,0,0.72)';
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = colors.textH;
        ctx.font = 'bold 32px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('⏸ PAUSED', W / 2, H / 2 - 8);
        ctx.font = '14px Inter, sans-serif';
        ctx.fillStyle = theme === 'light' ? '#555566' : '#94a3b8';
        ctx.fillText('Game paused — close the dialog to resume', W / 2, H / 2 + 22);
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(rafRef.current); clearInterval(countdownRef.current); clearTimeout(toastTimerRef.current); window.removeEventListener('keydown', onKey); };
  }, [theme]);

  const diff = getDifficulty(display.score);

  return (
    <div ref={wrapRef} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.85rem' }}>

      {/* Character selector */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', alignSelf: 'flex-start' }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--text)', fontFamily: 'var(--mono)' }}>Character:</span>
        {CHARACTERS.map((c, i) => (
          <button
            key={c.id}
            onClick={() => selectChar(i)}
            title={c.label}
            style={{
              background: charIdx === i ? 'var(--accent-glow)' : 'var(--bg-card)',
              border: `2px solid ${charIdx === i ? c.color : 'var(--border)'}`,
              borderRadius: 10, padding: '4px 10px', cursor: state.current.running ? 'not-allowed' : 'pointer',
              fontSize: '1.2rem', transition: 'all 0.2s',
              opacity: state.current.running ? 0.5 : 1,
            }}
          >
            {c.emoji}
            <span style={{ fontSize: '0.7rem', display: 'block', color: charIdx === i ? c.color : 'var(--text)', fontFamily: 'var(--font)', marginTop: 1 }}>
              {c.label}
            </span>
          </button>
        ))}
      </div>

      {/* Score + difficulty row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', maxWidth: W, alignItems: 'center' }}>
        <span style={{ fontFamily: 'var(--mono)', color: 'var(--accent)', fontSize: '0.9rem' }}>
          {CHARACTERS[charIdx].emoji} {CHARACTERS[charIdx].label} Runner
        </span>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          {display.started && (
            <span style={{
              fontFamily: 'var(--mono)', fontSize: '0.72rem', fontWeight: 700,
              color: diff.color, background: `${diff.color}20`,
              border: `1px solid ${diff.color}50`,
              padding: '2px 8px', borderRadius: 20,
            }}>
              {diff.label}
            </span>
          )}
          <span style={{ fontFamily: 'var(--mono)', color: 'var(--text-h)', fontSize: '0.9rem' }}>
            Score: {display.score}
          </span>
          <button
            onClick={() => setShowInfo(v => !v)}
            title="How to play"
            style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: '50%', width: 28, height: 28, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--accent)', transition: 'border-color 0.2s',
              flexShrink: 0,
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
          >
            <Info size={14} />
          </button>
        </div>
      </div>

      <div style={{ position: 'relative', maxWidth: '100%', width: '100%' }}>
        <canvas
          ref={canvasRef}
          width={W} height={H}
          onClick={() => {
            const s = state.current;
            if (!s.running && !s.over) start();
            else if (s.over) return; // button only
            else jump();
          }}
          style={{
            borderRadius: '12px', border: '1px solid var(--border)',
            cursor: 'pointer', maxWidth: '100%', display: 'block',
            background: 'var(--bg)',
          }}
        />

        {/* Milestone toast — top right */}
        <AnimatePresence>
          {toast && (
            <motion.div
              key={toast.score}
              initial={{ opacity: 0, x: 60, scale: 0.85 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 60, scale: 0.85 }}
              transition={{ type: 'spring', stiffness: 320, damping: 24 }}
              style={{
                position: 'absolute', top: 12, right: 12,
                background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(8px)',
                border: `1px solid ${toast.color}60`,
                borderRadius: 12, padding: '10px 14px',
                display: 'flex', alignItems: 'center', gap: '10px',
                boxShadow: `0 0 20px ${toast.color}40`,
                pointerEvents: 'none', maxWidth: 240,
              }}
            >
              <span style={{ fontSize: '1.8rem', lineHeight: 1 }}>{toast.emoji}</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.85rem', color: toast.color, fontFamily: 'var(--font)' }}>
                  {toast.label}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#cbd5e1', marginTop: 2, fontFamily: 'var(--font)' }}>
                  {toast.sub}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Info / rules panel */}
        <AnimatePresence>
          {showInfo && (
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              style={{
                position: 'absolute', inset: 0, borderRadius: '12px',
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                padding: '1.25rem', overflowY: 'auto', overscrollBehavior: 'contain',
                display: 'flex', flexDirection: 'column', gap: '0.75rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, color: 'var(--text-h)', fontSize: '1rem' }}>🎮 How to Play</span>
                <button onClick={() => setShowInfo(false)} style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--text)', display: 'flex', alignItems: 'center',
                }}>
                  <X size={18} />
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {[
                  ['⌨️ Controls', 'Press SPACE or ↑ to jump. Tap the canvas on mobile.'],
                  ['🌵 Obstacles', 'Avoid cacti on the ground. After 600 pts, birds fly at different heights — duck under or jump over them.'],
                  ['🏃 Speed', 'The game speeds up every 100 points. Stay sharp!'],
                  ['🎭 Characters', 'Pick Dino, Dragon, or Bunny before starting. Can\'t switch mid-game.'],
                  ['⏸ Pause', 'Switching tabs or closing shows a quit dialog and pauses the game.'],
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
                <div style={{ fontSize: '0.75rem', color: 'var(--text)', fontWeight: 600, marginBottom: '0.4rem' }}>🏆 Milestones</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                  {MILESTONES.map(m => (
                    <div key={m.score} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.9rem' }}>{m.emoji}</span>
                      <span style={{ fontFamily: 'var(--mono)', fontSize: '0.72rem', color: m.color, minWidth: 36 }}>{m.score}</span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text)' }}>{m.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Countdown overlay */}
        {countdown !== null && (
          <div style={{
            position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', borderRadius: '12px',
            background: 'rgba(0,0,0,0.45)', pointerEvents: 'none',
          }}>
            <div style={{
              fontSize: '5rem', fontWeight: 900, lineHeight: 1, fontFamily: 'var(--mono)',
              color: countdown === 1 ? '#ef4444' : countdown === 2 ? '#f59e0b' : '#22c55e',
              textShadow: '0 0 30px currentColor',
            }}>
              {countdown}
            </div>
            <div style={{ color: '#fff', fontSize: '0.9rem', marginTop: '0.5rem', fontFamily: 'var(--font)' }}>
              {countdownMode === 'resume' ? 'Resuming...' : 'Starting...'}
            </div>
          </div>
        )}

        {/* Game over replay button */}
        <AnimatePresence>
          {display.over && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: 'spring', stiffness: 300, damping: 22, delay: 0.15 }}
              style={{
                position: 'absolute', inset: 0, display: 'flex',
                flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                borderRadius: '12px', pointerEvents: 'none',
                paddingTop: '48px',
              }}
            >
              <button
                onClick={start}
                style={{
                  pointerEvents: 'all',
                  background: 'var(--gradient)',
                  border: 'none', borderRadius: 12,
                  padding: '0.6rem 1.8rem',
                  color: '#fff', fontFamily: 'var(--font)',
                  fontSize: '1rem', fontWeight: 700,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
                }}
              >
                🔄 Play Again
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Difficulty legend */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        {[
          { label: 'Normal',      score: '0',     color: '#22c55e' },
          { label: 'Fast',        score: '300+',  color: '#38bdf8' },
          { label: 'Hard 🐦',    score: '600+',  color: '#f59e0b' },
          { label: 'Insane 🔥',  score: '800+',  color: '#ef4444' },
          { label: 'Nightmare 😱', score: '1000+', color: '#c026d3' },
          { label: 'Hell 💀',    score: '1200+', color: '#ff0000' },
        ].map(d => (
          <span key={d.label} style={{
            fontSize: '0.7rem', fontFamily: 'var(--mono)',
            color: d.color, background: `${d.color}15`,
            border: `1px solid ${d.color}40`,
            padding: '2px 8px', borderRadius: 20,
          }}>
            {d.label} {d.score}
          </span>
        ))}
      </div>

      <p style={{ color: 'var(--text)', fontSize: '0.8rem' }}>
        Press{' '}
        <kbd style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '4px', padding: '1px 6px', fontFamily: 'var(--mono)', color: 'var(--text-h)' }}>
          SPACE
        </kbd>{' '}
        or tap to jump · Can't change character while running
      </p>
    </div>
  );
}
)

