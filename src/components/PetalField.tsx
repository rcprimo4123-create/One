import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../lib/scene-utils';

interface Petal {
  x: number;
  y: number;
  size: number;
  speed: number;
  drift: number;
  phase: number;
  rotation: number;
  spin: number;
  alpha: number;
  kind: 'heart' | 'petal' | 'dot';
  color: string;
}

const COLORS = ['232, 169, 181', '201, 164, 198', '216, 180, 118', '243, 205, 190'];

function drawHeart(context: CanvasRenderingContext2D, size: number) {
  context.beginPath();
  context.moveTo(0, size * 0.28);
  context.bezierCurveTo(0, -size * 0.22, -size * 0.8, -size * 0.1, -size * 0.8, size * 0.32);
  context.bezierCurveTo(-size * 0.8, size * 0.82, 0, size * 1.1, 0, size * 1.42);
  context.bezierCurveTo(0, size * 1.1, size * 0.8, size * 0.82, size * 0.8, size * 0.32);
  context.bezierCurveTo(size * 0.8, -size * 0.1, 0, -size * 0.22, 0, size * 0.28);
  context.fill();
}

export function PetalField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    let width = 0;
    let height = 0;
    let particles: Petal[] = [];
    let frame = 0;
    let previous = performance.now();

    const makeParticles = () => {
      const count = reducedMotion ? 12 : Math.min(32, Math.max(16, Math.round(width / 52)));
      particles = Array.from({ length: count }, () => {
        const kindRoll = Math.random();
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          size: 5 + Math.random() * 9,
          speed: 5 + Math.random() * 11,
          drift: 8 + Math.random() * 20,
          phase: Math.random() * Math.PI * 2,
          rotation: Math.random() * Math.PI * 2,
          spin: (Math.random() - 0.5) * 0.22,
          alpha: 0.16 + Math.random() * 0.25,
          kind: kindRoll > 0.74 ? 'heart' : kindRoll > 0.22 ? 'petal' : 'dot',
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
        };
      });
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      makeParticles();
    };

    const render = (now: number) => {
      const delta = Math.min((now - previous) / 1000, 0.05);
      previous = now;
      context.clearRect(0, 0, width, height);

      for (const particle of particles) {
        if (!reducedMotion) {
          particle.y -= particle.speed * delta;
          particle.phase += delta * 0.5;
          particle.x += Math.sin(particle.phase) * particle.drift * delta;
          particle.rotation += particle.spin * delta;
          if (particle.y < -30) {
            particle.y = height + 20;
            particle.x = Math.random() * width;
          }
          if (particle.x < -30) particle.x = width + 20;
          if (particle.x > width + 30) particle.x = -20;
        }

        context.save();
        context.translate(particle.x, particle.y);
        context.rotate(particle.rotation);
        context.globalAlpha = particle.alpha;
        context.fillStyle = `rgb(${particle.color})`;

        if (particle.kind === 'heart') {
          drawHeart(context, particle.size * 0.8);
        } else if (particle.kind === 'petal') {
          context.beginPath();
          context.ellipse(0, 0, particle.size * 0.9, particle.size * 0.42, 0, 0, Math.PI * 2);
          context.fill();
        } else {
          context.beginPath();
          context.arc(0, 0, particle.size * 0.2, 0, Math.PI * 2);
          context.fill();
        }
        context.restore();
      }

      if (!reducedMotion) frame = requestAnimationFrame(render);
    };

    resize();
    window.addEventListener('resize', resize);
    frame = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(frame);
    };
  }, [reducedMotion]);

  return <canvas ref={canvasRef} className="petal-field" aria-hidden="true" />;
}
