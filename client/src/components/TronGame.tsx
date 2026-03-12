import { useRef, useEffect, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ── Types ────────────────────────────────────────────────
type Direction = 'up' | 'down' | 'left' | 'right';

interface Point {
  x: number;
  y: number;
}

interface Bike {
  x: number;
  y: number;
  dir: Direction;
  trail: Point[];
  color: string;
  glow: string;
  alive: boolean;
}

// ── Constants ────────────────────────────────────────────
const CELL = 8;
const BASE_SPEED = 80; // ms per tick at start
const MIN_SPEED = 40; // fastest tick
const SPEED_RAMP = 0.5; // ms reduction per second survived
const AI_SPAWN_INTERVAL = 8000;
const MAX_AI = 4;

const AI_COLORS = [
  { color: '#a855f7', glow: 'rgba(168, 85, 247, 0.6)' },
  { color: '#ec4899', glow: 'rgba(236, 72, 153, 0.6)' },
  { color: '#fbbf24', glow: 'rgba(251, 191, 36, 0.6)' },
  { color: '#4ade80', glow: 'rgba(74, 222, 128, 0.6)' },
];

const OPPOSITE: Record<Direction, Direction> = {
  up: 'down',
  down: 'up',
  left: 'right',
  right: 'left',
};

// ── Helpers ──────────────────────────────────────────────
function move(p: Point, dir: Direction): Point {
  switch (dir) {
    case 'up': return { x: p.x, y: p.y - CELL };
    case 'down': return { x: p.x, y: p.y + CELL };
    case 'left': return { x: p.x - CELL, y: p.y };
    case 'right': return { x: p.x + CELL, y: p.y };
  }
}

function hitsWall(p: Point, w: number, h: number): boolean {
  return p.x < 0 || p.y < 0 || p.x >= w || p.y >= h;
}

function hitsTrail(p: Point, allTrails: Point[][]): boolean {
  for (const trail of allTrails) {
    for (const t of trail) {
      if (t.x === p.x && t.y === p.y) return true;
    }
  }
  return false;
}

function randomEdgeSpawn(w: number, h: number, allTrails: Point[][]): { pos: Point; dir: Direction } | null {
  const gridW = Math.floor(w / CELL);
  const gridH = Math.floor(h / CELL);
  const margin = 4;

  // Try random positions along edges
  for (let attempt = 0; attempt < 50; attempt++) {
    const side = Math.floor(Math.random() * 4);
    let x: number, y: number;
    let dir: Direction;

    switch (side) {
      case 0: // top
        x = (margin + Math.floor(Math.random() * (gridW - margin * 2))) * CELL;
        y = margin * CELL;
        dir = 'down';
        break;
      case 1: // bottom
        x = (margin + Math.floor(Math.random() * (gridW - margin * 2))) * CELL;
        y = (gridH - margin) * CELL;
        dir = 'up';
        break;
      case 2: // left
        x = margin * CELL;
        y = (margin + Math.floor(Math.random() * (gridH - margin * 2))) * CELL;
        dir = 'right';
        break;
      default: // right
        x = (gridW - margin) * CELL;
        y = (margin + Math.floor(Math.random() * (gridH - margin * 2))) * CELL;
        dir = 'left';
        break;
    }

    const pos = { x, y };
    if (!hitsTrail(pos, allTrails)) {
      return { pos, dir };
    }
  }
  return null;
}

function aiDecide(bike: Bike, w: number, h: number, allTrails: Point[][]): Direction {
  const dirs: Direction[] = ['up', 'down', 'left', 'right'];
  const valid = dirs.filter((d) => {
    if (d === OPPOSITE[bike.dir]) return false;
    const next = move({ x: bike.x, y: bike.y }, d);
    return !hitsWall(next, w, h) && !hitsTrail(next, allTrails);
  });

  if (valid.length === 0) return bike.dir; // doomed

  // Prefer current direction if safe, otherwise pick direction with most open space
  if (valid.includes(bike.dir)) {
    // 70% chance to keep going straight
    if (Math.random() < 0.7) return bike.dir;
  }

  // Score each direction by how far we can go
  let bestDir = valid[0];
  let bestDist = 0;
  for (const d of valid) {
    let dist = 0;
    let p = { x: bike.x, y: bike.y };
    for (let i = 0; i < 20; i++) {
      p = move(p, d);
      if (hitsWall(p, w, h) || hitsTrail(p, allTrails)) break;
      dist++;
    }
    if (dist > bestDist) {
      bestDist = dist;
      bestDir = d;
    }
  }

  return bestDir;
}

// ── Component ────────────────────────────────────────────
export default function TronGame({ onDone }: { onDone: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [countdown, setCountdown] = useState(3);
  const gameRef = useRef<{
    player: Bike;
    ais: Bike[];
    running: boolean;
    startTime: number;
    nextDir: Direction;
    width: number;
    height: number;
  } | null>(null);
  const tickRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scoreIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const aiSpawnRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Touch support
  const touchStartRef = useRef<Point | null>(null);

  const initGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const w = canvas.width;
    const h = canvas.height;
    const cx = Math.floor(w / 2 / CELL) * CELL;
    const cy = Math.floor(h / 2 / CELL) * CELL;

    gameRef.current = {
      player: {
        x: cx,
        y: cy,
        dir: 'right',
        trail: [{ x: cx, y: cy }],
        color: '#00d4ff',
        glow: 'rgba(0, 212, 255, 0.6)',
        alive: true,
      },
      ais: [],
      running: true,
      startTime: Date.now(),
      nextDir: 'right',
      width: w,
      height: h,
    };
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const game = gameRef.current;
    if (!canvas || !game) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width: w, height: h } = game;

    // Background
    ctx.fillStyle = '#030014';
    ctx.fillRect(0, 0, w, h);

    // Subtle grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
    ctx.lineWidth = 0.5;
    for (let x = 0; x < w; x += CELL) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += CELL) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Draw all bikes
    const allBikes = [game.player, ...game.ais];
    for (const bike of allBikes) {
      if (bike.trail.length < 2) continue;

      // Glow layer
      ctx.shadowColor = bike.glow;
      ctx.shadowBlur = 12;
      ctx.strokeStyle = bike.color;
      ctx.lineWidth = CELL - 2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(bike.trail[0].x + CELL / 2, bike.trail[0].y + CELL / 2);
      for (let i = 1; i < bike.trail.length; i++) {
        ctx.lineTo(bike.trail[i].x + CELL / 2, bike.trail[i].y + CELL / 2);
      }
      ctx.stroke();

      // Bright head
      if (bike.alive) {
        const head = bike.trail[bike.trail.length - 1];
        ctx.shadowBlur = 20;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(head.x + 1, head.y + 1, CELL - 2, CELL - 2);
      }

      ctx.shadowBlur = 0;
    }

    // Trail fade: make older parts dimmer
    for (const bike of allBikes) {
      const len = bike.trail.length;
      if (len < 10) continue;
      const fadeCount = Math.min(8, len - 2);
      for (let i = 0; i < fadeCount; i++) {
        const t = bike.trail[i];
        const alpha = 0.6 * (1 - i / fadeCount);
        ctx.fillStyle = `rgba(3, 0, 20, ${alpha})`;
        ctx.fillRect(t.x, t.y, CELL, CELL);
      }
    }
  }, []);

  const tick = useCallback(() => {
    const game = gameRef.current;
    if (!game || !game.running) return;

    const { player, ais, width: w, height: h } = game;

    // Collect all trails for collision
    const allTrails = [player.trail, ...ais.map((a) => a.trail)];

    // Update player direction
    if (game.nextDir !== OPPOSITE[player.dir]) {
      player.dir = game.nextDir;
    }

    // Move player
    const playerNext = move({ x: player.x, y: player.y }, player.dir);
    if (hitsWall(playerNext, w, h) || hitsTrail(playerNext, allTrails)) {
      player.alive = false;
      game.running = false;
      setGameOver(true);
      draw();
      return;
    }
    player.x = playerNext.x;
    player.y = playerNext.y;
    player.trail.push({ ...playerNext });

    // Move AI bikes
    for (const ai of ais) {
      if (!ai.alive) continue;
      ai.dir = aiDecide(ai, w, h, allTrails);
      const aiNext = move({ x: ai.x, y: ai.y }, ai.dir);
      if (hitsWall(aiNext, w, h) || hitsTrail(aiNext, [player.trail, ...ais.map((a) => a.trail)])) {
        ai.alive = false;
        continue;
      }
      ai.x = aiNext.x;
      ai.y = aiNext.y;
      ai.trail.push({ ...aiNext });
    }

    draw();

    // Schedule next tick (gradually faster)
    const elapsed = (Date.now() - game.startTime) / 1000;
    const speed = Math.max(MIN_SPEED, BASE_SPEED - elapsed * SPEED_RAMP);
    tickRef.current = setTimeout(tick, speed);
  }, [draw]);

  const startGame = useCallback(() => {
    setGameOver(false);
    setScore(0);
    setCountdown(3);
    initGame();

    // Countdown
    let count = 3;
    const countdownTimer = setInterval(() => {
      count--;
      setCountdown(count);
      if (count <= 0) {
        clearInterval(countdownTimer);
        draw();
        tickRef.current = setTimeout(tick, BASE_SPEED);

        // Score timer
        scoreIntervalRef.current = setInterval(() => {
          if (gameRef.current?.running) {
            setScore(Math.floor((Date.now() - (gameRef.current?.startTime || Date.now())) / 1000));
          }
        }, 100);

        // AI spawn timer
        aiSpawnRef.current = setInterval(() => {
          const game = gameRef.current;
          if (!game || !game.running) return;
          if (game.ais.length >= MAX_AI) return;

          const allTrails = [game.player.trail, ...game.ais.map((a) => a.trail)];
          const spawn = randomEdgeSpawn(game.width, game.height, allTrails);
          if (!spawn) return;

          const colorIdx = game.ais.length % AI_COLORS.length;
          game.ais.push({
            x: spawn.pos.x,
            y: spawn.pos.y,
            dir: spawn.dir,
            trail: [{ ...spawn.pos }],
            ...AI_COLORS[colorIdx],
            alive: true,
          });
        }, AI_SPAWN_INTERVAL);
      }
    }, 1000);
  }, [initGame, draw, tick]);

  // Setup canvas and start
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = Math.floor(w / CELL) * CELL;
    canvas.height = Math.floor(h / CELL) * CELL;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

    startGame();

    return () => {
      if (gameRef.current) gameRef.current.running = false;
      if (tickRef.current) clearTimeout(tickRef.current);
      if (scoreIntervalRef.current) clearInterval(scoreIntervalRef.current);
      if (aiSpawnRef.current) clearInterval(aiSpawnRef.current);
    };
  }, [startGame]);

  // Keyboard controls
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (gameRef.current) gameRef.current.running = false;
        onDone();
        return;
      }

      if (gameOver && e.key === 'Enter') {
        if (tickRef.current) clearTimeout(tickRef.current);
        if (scoreIntervalRef.current) clearInterval(scoreIntervalRef.current);
        if (aiSpawnRef.current) clearInterval(aiSpawnRef.current);
        startGame();
        return;
      }

      const dirMap: Record<string, Direction> = {
        ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right',
        w: 'up', s: 'down', a: 'left', d: 'right',
        W: 'up', S: 'down', A: 'left', D: 'right',
      };

      const dir = dirMap[e.key];
      if (dir && gameRef.current) {
        e.preventDefault();
        gameRef.current.nextDir = dir;
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [gameOver, onDone, startGame]);

  // Touch controls
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStartRef.current || !gameRef.current) return;
      const dx = e.changedTouches[0].clientX - touchStartRef.current.x;
      const dy = e.changedTouches[0].clientY - touchStartRef.current.y;
      const absDx = Math.abs(dx);
      const absDy = Math.abs(dy);

      if (Math.max(absDx, absDy) < 20) return; // too small

      if (absDx > absDy) {
        gameRef.current.nextDir = dx > 0 ? 'right' : 'left';
      } else {
        gameRef.current.nextDir = dy > 0 ? 'down' : 'up';
      }
      touchStartRef.current = null;
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: '#030014',
      }}
    >
      <canvas ref={canvasRef} style={{ display: 'block' }} />

      {/* Score HUD */}
      <div
        style={{
          position: 'fixed',
          top: 16,
          right: 20,
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '0.875rem',
          color: '#00d4ff',
          textShadow: '0 0 10px rgba(0, 212, 255, 0.5)',
          zIndex: 10000,
        }}
      >
        SCORE: {score}s
      </div>

      {/* Controls hint */}
      <div
        style={{
          position: 'fixed',
          top: 16,
          left: 20,
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '0.625rem',
          color: 'rgba(255, 255, 255, 0.2)',
          zIndex: 10000,
        }}
      >
        arrows/wasd · esc to quit
      </div>

      {/* Countdown */}
      <AnimatePresence>
        {countdown > 0 && (
          <motion.div
            key={countdown}
            initial={{ opacity: 0, scale: 2 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.4 }}
            style={{
              position: 'fixed',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '6rem',
              fontWeight: 700,
              color: '#00d4ff',
              textShadow: '0 0 40px rgba(0, 212, 255, 0.8), 0 0 80px rgba(0, 212, 255, 0.4)',
              zIndex: 10001,
              pointerEvents: 'none',
            }}
          >
            {countdown}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Game Over */}
      <AnimatePresence>
        {gameOver && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(3, 0, 20, 0.85)',
              fontFamily: "'JetBrains Mono', monospace",
              zIndex: 10001,
            }}
          >
            <motion.div
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              style={{
                fontSize: '3rem',
                fontWeight: 800,
                color: '#ff4444',
                textShadow: '0 0 30px rgba(255, 68, 68, 0.6)',
                marginBottom: '1rem',
              }}
            >
              DEREZZ
            </motion.div>
            <div style={{ fontSize: '1.25rem', color: '#00d4ff', marginBottom: '0.5rem' }}>
              Survived: {score}s
            </div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', marginBottom: '2rem' }}>
              {score < 10 && 'The grid claims another program...'}
              {score >= 10 && score < 30 && 'Not bad for a user.'}
              {score >= 30 && score < 60 && 'You fight for the users.'}
              {score >= 60 && 'I fight for the users! — Tron'}
            </div>
            <div style={{ display: 'flex', gap: '2rem', fontSize: '0.75rem' }}>
              <motion.span
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ color: '#4ade80' }}
              >
                [Enter] retry
              </motion.span>
              <span style={{ color: '#6b7280' }}>[Esc] exit</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
