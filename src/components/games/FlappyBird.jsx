import { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, X } from 'lucide-react';
import { useTheme } from '../../ThemeContext';

const W = 760, H = 320;
const GRAVITY = 0.22;
const JUMP_V = -6.5;
const PIPE_W = 58;
const BIRD_R = 16;
const GROUND_H = 50;

const LEVELS = [
  { name: 'Simple',   minScore: 0,  pipeSpeed: 2.8, pipeGap: 175, spawnRate: 110, color: '#22c55e' },
  { name: 'Medium',   minScore: 8,  pipeSpeed: 3.6, pipeGap: 155, spawnRate: 100, color: '#f59e0b' },
  { name: 'Advanced', minScore: 18, pipeSpeed: 4.6, pipeGap: 135, spawnRate: 90,  color: '#ef4444' },
  { name: 'Insane',   minScore: 30, pipeSpeed: 5.8, pipeGap: 118, spawnRate: 80,  color: '#c026d3' },
  { name: 'Hell',     minScore: 45, pipeSpeed: 7.2, pipeGap: 100, spawnRate: 70,  color: '#ff0000' },
];

function getLevel(score) {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (score >= LEVELS[i].minScore) return LEVELS[i];
  }
  return LEVELS[0];
}

const BIRDS = [
  { id: 'classic', emoji: '🐦', label: 'Classic', color: '#fbbf24', wing: '#f59e0b' },
  { id: 'purple',  emoji: '🦜', label: 'Parrot',  color: '#a78bfa', wing: '#7c3aed' },
  { id: 'fire',    emoji: '🔥', label: 'Phoenix', color: '#ef4444', wing: '#f97316' },
];

const MILESTONES = [
  { score: 8,  emoji: '⚡', label: 'Speeding Up!',   color: '#f59e0b' },
  { score: 18, emoji: '🔥', label: 'Advanced Mode!', color: '#ef4444' },
  { score: 30, emoji: '😱', label: 'Insane Mode!',   color: '#c026d3' },
  { score: 45, emoji: '💀', label: 'HELL MODE!',     color: '#ff0000' },
];
function cssVar(el, name) {
  return getComputedStyle(el).getPropertyValue(name).trim();
}

function drawBird(ctx, x, y, angle, wingUp, birdIdx, dead) {
  const b = BIRDS[birdIdx];
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  // body
  ctx.fillStyle = b.color;
  ctx.beginPath();
  ctx.ellipse(0, 0, BIRD_R, BIRD_R - 3, 0, 0, Math.PI * 2);
  ctx.fill();
  // wing
  ctx.fillStyle = b.wing;
  ctx.beginPath();
  if (wingUp) {
    ctx.ellipse(-2, -8, 10, 5, -0.4, 0, Math.PI * 2);
  } else {
    ctx.ellipse(-2, 6, 10, 5, 0.4, 0, Math.PI * 2);
  }
  ctx.fill();
  // beak
  ctx.fillStyle = '#fbbf24';
  ctx.beginPath();
  ctx.moveTo(BIRD_R - 2, -3);
  ctx.lineTo(BIRD_R + 8, 0);
  ctx.lineTo(BIRD_R - 2, 3);
  ctx.closePath();
  ctx.fill();
  // eye
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(6, -5, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = dead ? '#ef4444' : '#1e1b4b';
  ctx.beginPath();
  ctx.arc(7, -5, 3, 0, Math.PI * 2);
  ctx.fill();
  if (dead) {
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(3, -9); ctx.lineTo(9, -3);
    ctx.moveTo(9, -9); ctx.lineTo(3, -3);
    ctx.stroke();
  }
  ctx.restore();
}

function drawPipe(ctx, x, topH, gap, pipeColor, capColor) {
  const r = 6;
  // top pipe
  ctx.fillStyle = pipeColor;
  ctx.fillRect(x + 4, 0, PIPE_W - 8, topH - 12);
  // top cap
  ctx.fillStyle = capColor;
  ctx.beginPath();
  ctx.roundRect(x, topH - 14, PIPE_W, 14, [0, 0, r, r]);
  ctx.fill();
  // bottom pipe
  const botY = topH + gap;
  ctx.fillStyle = pipeColor;
  ctx.fillRect(x + 4, botY + 12, PIPE_W - 8, H - GROUND_H - botY - 12);
  // bottom cap
  ctx.fillStyle = capColor;
  ctx.beginPath();
  ctx.roundRect(x, botY, PIPE_W, 14, [r, r, 0, 0]);
  ctx.fill();
}

function drawBackground(ctx, theme, scrollX) {
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  if (theme === 'light') {
    grad.addColorStop(0, '#dbeafe');
    grad.addColorStop(1, '#eff6ff');
  } else {
    grad.addColorStop(0, '#0a0a1a');
    grad.addColorStop(1, '#0f0f2e');
  }
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);
  // stars (dark mode)
  if (theme !== 'light') {
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    const stars = [[40,20],[120,55],[200,15],[300,40],[380,10],[500,60],[600,25],[700,50],[60,90],[160,80],[260,100],[450,30],[650,70]];
    for (const [sx, sy] of stars) {
      ctx.beginPath();
      ctx.arc((sx - scrollX * 0.1) % W, sy, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  // clouds
  ctx.fillStyle = theme === 'light' ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.06)';
  const clouds = [[80,35],[250,25],[430,45],[620,30],[760,20]];
  for (const [cx, cy] of clouds) {
    const ox = ((cx - scrollX * 0.3) % (W + 120) + W + 120) % (W + 120) - 60;
    ctx.beginPath();
    ctx.arc(ox, cy, 20, 0, Math.PI * 2);
    ctx.arc(ox + 18, cy - 7, 14, 0, Math.PI * 2);
    ctx.arc(ox + 34, cy, 16, 0, Math.PI * 2);
    ctx.fill();
  }
  // ground
  ctx.fillStyle = theme === 'light' ? '#86efac' : '#14532d';
  ctx.fillRect(0, H - GROUND_H, W, GROUND_H);
  ctx.fillStyle = theme === 'light' ? '#4ade80' : '#166534';
  ctx.fillRect(0, H - GROUND_H, W, 7);
  // ground stripes
  ctx.fillStyle = theme === 'light' ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.04)';
  for (let i = 0; i < 12; i++) {
    const gx = ((i * 70 - scrollX * 2) % (W + 70) + W + 70) % (W + 70) - 35;
    ctx.fillRect(gx, H - GROUND_H + 7, 40, GROUND_H - 7);
  }
}
export default forwardRef(function FlappyBird({ onRunningChange }, ref) {
  const { theme } = useTheme();
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);
  const [birdIdx, setBirdIdx] = useState(0);
  const birdIdxRef = useRef(0);
  const pausedRef = useRef(false);
  const [countdown, setCountdown] = useState(null);
  const [toast, setToast] = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  const reachedRef = useRef(new Set());
  const toastTimerRef = useRef(null);
  const countdownRef = useRef(null);
  const rafRef = useRef(null);

  const state = useRef({
    running: false, over: false, started: false,
    birdY: 0, birdVY: 0, birdAngle: 0, wingUp: true, wingTimer: 0,
    pipes: [], score: 0, frame: 0, nextPipe: 80, scrollX: 0,
  });

  const [display, setDisplay] = useState({ score: 0, over: false, started: false });

  const initState = () => ({
    running: false, over: false, started: false,
    birdY: H / 2 - 20, birdVY: 0, birdAngle: 0, wingUp: true, wingTimer: 0,
    pipes: [], score: 0, frame: 0, nextPipe: 80, scrollX: 0,
  });

  useImperativeHandle(ref, () => ({
    pause() { pausedRef.current = true; },
    resume() {
      let count = 3;
      setCountdown(count);
      countdownRef.current = setInterval(() => {
        count--;
        if (count <= 0) {
          clearInterval(countdownRef.current);
          setCountdown(null);
          pausedRef.current = false;
        } else setCountdown(count);
      }, 1000);
    },
    isRunning() { return state.current.running; },
    forceStop() {
      clearInterval(countdownRef.current);
      setCountdown(null);
      pausedRef.current = false;
      state.current.running = false;
      onRunningChange?.(false);
    },
  }));

  const flap = () => {
    const s = state.current;
    if (s.running && !s.over) {
      s.birdVY = JUMP_V;
    }
  };

  const start = () => {
    clearInterval(countdownRef.current);
    clearTimeout(toastTimerRef.current);
    setToast(null);
    pausedRef.current = false;
    reachedRef.current = new Set();
    // reset state but keep running: false until countdown finishes
    Object.assign(state.current, initState(), { started: true, birdY: H / 2 - 20 });
    setDisplay({ score: 0, over: false, started: true });
    onRunningChange?.(false);

    let count = 3;
    setCountdown(count);
    countdownRef.current = setInterval(() => {
      count--;
      if (count <= 0) {
        clearInterval(countdownRef.current);
        setCountdown(null);
        state.current.running = true;
        onRunningChange?.(true);
      } else {
        setCountdown(count);
      }
    }, 1000);
  };

  const selectBird = (i) => {
    if (state.current.running) return;
    birdIdxRef.current = i;
    setBirdIdx(i);
  };
  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    const ctx = canvas.getContext('2d');
    Object.assign(state.current, initState(), { birdY: H / 2 - 20 });

    const onKey = (e) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        const s = state.current;
        if (!s.started) { start(); return; }
        if (s.over) return; // button only
        flap();
      }
    };
    window.addEventListener('keydown', onKey);

    const getColors = () => ({
      accent: cssVar(wrap, '--accent'),
      accent2: cssVar(wrap, '--accent-2'),
      textH: cssVar(wrap, '--text-h'),
      border: cssVar(wrap, '--border'),
      pipe: theme === 'light' ? '#16a34a' : '#22c55e',
      pipeCap: theme === 'light' ? '#15803d' : '#16a34a',
    });

    const loop = () => {
      const s = state.current;
      const colors = getColors();
      ctx.clearRect(0, 0, W, H);

      drawBackground(ctx, theme, s.scrollX);

      if (!s.started) {
        // idle bird bob
        const bobY = H / 2 - 20 + Math.sin(Date.now() / 400) * 8;
        drawBird(ctx, 100, bobY, 0, Math.sin(Date.now() / 200) > 0, birdIdxRef.current, false);
        // title
        ctx.fillStyle = theme === 'light' ? '#1e1b4b' : '#e2e8f0';
        ctx.font = 'bold 28px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Flappy Bird', W / 2, H / 2 - 20);
        ctx.font = '15px Inter, sans-serif';
        ctx.fillStyle = theme === 'light' ? '#6b7280' : '#94a3b8';
        ctx.fillText('Tap or press SPACE to begin', W / 2, H / 2 + 10);
        rafRef.current = requestAnimationFrame(loop);
        return;
      }

      if (s.running && !pausedRef.current) {
        s.frame++;
        s.scrollX += getLevel(s.score).pipeSpeed;
        s.wingTimer++;
        if (s.wingTimer % 8 === 0) s.wingUp = !s.wingUp;

        // physics
        s.birdVY += GRAVITY;
        if (s.birdVY > 5) s.birdVY = 5; // terminal velocity cap
        s.birdY += s.birdVY;
        s.birdAngle = Math.min(Math.PI / 3, Math.max(-Math.PI / 4, s.birdVY * 0.06));

        // milestone check
        for (const m of MILESTONES) {
          if (s.score >= m.score && !reachedRef.current.has(m.score)) {
            reachedRef.current.add(m.score);
            clearTimeout(toastTimerRef.current);
            setToast(m);
            toastTimerRef.current = setTimeout(() => setToast(null), 3000);
          }
        }

        // spawn pipes
        s.nextPipe--;
        if (s.nextPipe <= 0) {
          const lv = getLevel(s.score);
          const minTop = 40;
          const maxTop = H - GROUND_H - lv.pipeGap - 40;
          const topH = minTop + Math.random() * (maxTop - minTop);
          s.pipes.push({ x: W + 10, topH, gap: lv.pipeGap, passed: false });
          s.nextPipe = lv.spawnRate;
        }

        // move pipes
        const spd = getLevel(s.score).pipeSpeed;
        for (const p of s.pipes) {
          p.x -= spd;
          if (!p.passed && p.x + PIPE_W < 100 - BIRD_R) {
            p.passed = true;
            s.score++;
            setDisplay(d => ({ ...d, score: s.score }));
          }
        }
        s.pipes = s.pipes.filter(p => p.x + PIPE_W > 0);

        // collision - ground/ceiling
        if (s.birdY + BIRD_R >= H - GROUND_H || s.birdY - BIRD_R <= 0) {
          s.running = false; s.over = true;
          onRunningChange?.(false);
          setDisplay(d => ({ ...d, over: true }));
        }

        // collision - pipes
        for (const p of s.pipes) {
          const bx = 100, by = s.birdY;
          const inX = bx + BIRD_R - 4 > p.x && bx - BIRD_R + 4 < p.x + PIPE_W;
          const inTopPipe = by - BIRD_R + 4 < p.topH;
          const inBotPipe = by + BIRD_R - 4 > p.topH + p.gap;
          if (inX && (inTopPipe || inBotPipe)) {
            s.running = false; s.over = true;
            onRunningChange?.(false);
            setDisplay(d => ({ ...d, over: true }));
          }
        }
      }
      // draw pipes
      for (const p of s.pipes) {
        drawPipe(ctx, p.x, p.topH, p.gap, colors.pipe, colors.pipeCap);
      }

      // draw bird
      drawBird(ctx, 100, s.birdY, s.birdAngle, s.wingUp, birdIdxRef.current, s.over);

      // level badge only (no score on canvas)
      if (s.started) {
        const lv = getLevel(s.score);
        ctx.font = 'bold 11px Inter, sans-serif';
        ctx.fillStyle = lv.color;
        ctx.textAlign = 'right';
        ctx.fillText(lv.name.toUpperCase(), W - 12, 22);
      }

      // game over overlay
      if (s.over) {
        ctx.fillStyle = 'rgba(0,0,0,0.55)';
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 28px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', W / 2, H / 2 - 40);
        ctx.font = 'bold 26px Inter, sans-serif';
        ctx.fillStyle = '#fbbf24';
        ctx.fillText(s.score, W / 2, H / 2 - 8);
      }

      // paused overlay
      if (pausedRef.current && s.running) {
        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 28px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('⏸ PAUSED', W / 2, H / 2);
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(rafRef.current);
      clearInterval(countdownRef.current);
      clearTimeout(toastTimerRef.current);
      window.removeEventListener('keydown', onKey);
    };
  }, [theme]);
  const lv = getLevel(display.score);

  return (
    <div ref={wrapRef} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.85rem' }}>
      {/* Bird selector */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', alignSelf: 'flex-start' }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--text)', fontFamily: 'var(--mono)' }}>Bird:</span>
        {BIRDS.map((b, i) => (
          <button key={b.id} onClick={() => selectBird(i)} title={b.label} style={{
            background: birdIdx === i ? 'var(--accent-glow)' : 'var(--bg-card)',
            border: `2px solid ${birdIdx === i ? b.color : 'var(--border)'}`,
            borderRadius: 10, padding: '4px 10px',
            cursor: state.current.running ? 'not-allowed' : 'pointer',
            fontSize: '1.2rem', transition: 'all 0.2s',
            opacity: state.current.running ? 0.5 : 1,
          }}>
            {b.emoji}
            <span style={{ fontSize: '0.7rem', display: 'block', color: birdIdx === i ? b.color : 'var(--text)', fontFamily: 'var(--font)', marginTop: 1 }}>
              {b.label}
            </span>
          </button>
        ))}
      </div>

      {/* Score + level row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', maxWidth: W, alignItems: 'center' }}>
        <span style={{ fontFamily: 'var(--mono)', color: 'var(--accent)', fontSize: '0.9rem' }}>
          {BIRDS[birdIdx].emoji} Flappy Bird
        </span>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          {display.started && (
            <span style={{
              fontFamily: 'var(--mono)', fontSize: '0.72rem', fontWeight: 700,
              color: lv.color, background: `${lv.color}20`,
              border: `1px solid ${lv.color}50`,
              padding: '2px 8px', borderRadius: 20,
            }}>
              {lv.name}
            </span>
          )}
          <span style={{ fontFamily: 'var(--mono)', color: 'var(--text-h)', fontSize: '0.9rem' }}>
            Score: {display.score}
          </span>
          <button onClick={() => setShowInfo(v => !v)} title='How to play' style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: '50%', width: 28, height: 28, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--accent)', transition: 'border-color 0.2s', flexShrink: 0,
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
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
            if (!s.started) { start(); return; }
            if (s.over) return; // button only
            flap();
          }}
          style={{
            borderRadius: '12px', border: '1px solid var(--border)',
            cursor: 'pointer', maxWidth: '100%', display: 'block',
            margin: '0 auto',
          }}
        />

        {/* Milestone toast */}
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
                pointerEvents: 'none', maxWidth: 220,
              }}
            >
              <span style={{ fontSize: '1.8rem', lineHeight: 1 }}>{toast.emoji}</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.85rem', color: toast.color, fontFamily: 'var(--font)' }}>
                  {toast.label}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#cbd5e1', marginTop: 2, fontFamily: 'var(--font)' }}>
                  Score: {toast.score}+
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Info panel */}
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
                <span style={{ fontWeight: 700, color: 'var(--text-h)', fontSize: '1rem' }}>?? How to Play</span>
                <button onClick={() => setShowInfo(false)} style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--text)', display: 'flex', alignItems: 'center',
                }}><X size={18} /></button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {[
                  ['?? Controls', 'Press SPACE or ? to flap. Tap the canvas on mobile.'],
                  ['?? Pipes', 'Fly through the gaps between pipes. Do not touch them!'],
                  ['?? Difficulty', 'Speed and gap size change as your score increases.'],
                  ['?? Birds', 'Pick Classic, Parrot, or Phoenix before starting.'],
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
                <div style={{ fontSize: '0.75rem', color: 'var(--text)', fontWeight: 600, marginBottom: '0.4rem' }}>?? Levels</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                  {LEVELS.map(l => (
                    <div key={l.name} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontFamily: 'var(--mono)', fontSize: '0.72rem', color: l.color, minWidth: 36 }}>{l.minScore}+</span>
                      <span style={{ fontSize: '0.72rem', color: l.color, fontWeight: 600 }}>{l.name}</span>
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
            }}>{countdown}</div>
            <div style={{ color: '#fff', fontSize: '0.9rem', marginTop: '0.5rem' }}>
              {display.over ? 'Get ready...' : 'Resuming...'}
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
                paddingTop: '60px',
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
        {LEVELS.map(l => (
          <span key={l.name} style={{
            fontSize: '0.7rem', fontFamily: 'var(--mono)',
            color: l.color, background: `${l.color}15`,
            border: `1px solid ${l.color}40`,
            padding: '2px 8px', borderRadius: 20,
          }}>
            {l.name} {l.minScore}+
          </span>
        ))}
      </div>

      <p style={{ color: 'var(--text)', fontSize: '0.8rem' }}>
        Press{' '}
        <kbd style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '4px', padding: '1px 6px', fontFamily: 'var(--mono)', color: 'var(--text-h)' }}>SPACE</kbd>
        {' '}or tap to flap � Can't change bird while flying
      </p>
    </div>
  );
})