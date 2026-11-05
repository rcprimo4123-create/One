import { useCallback, useEffect, useRef, useState } from 'react';
import { MemoryModal } from '../components/MemoryModal';
import { HeartIcon, SparkleIcon } from '../components/Icons';
import { burstFrom } from '../lib/burst';
import { asset } from '../lib/asset';
import { chapterCopy, memories, type Memory } from '../lib/content';
import { useCoverMarkers } from '../lib/scene-utils';

const WORLD_IMAGE_RATIO = 1792 / 1024;
const MEMORY_POINTS = memories.map((memory) => memory.point);

interface WorldSceneProps {
  onNext: () => void;
}

export function WorldScene({ onNext }: WorldSceneProps) {
  const [found, setFound] = useState<string[]>([]);
  const [activeMemory, setActiveMemory] = useState<Memory | null>(null);
  const [hinting, setHinting] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const hintTimer = useRef<number | null>(null);
  const positions = useCoverMarkers(stageRef, WORLD_IMAGE_RATIO, MEMORY_POINTS);
  const complete = found.length === memories.length;

  useEffect(() => {
    return () => {
      if (hintTimer.current !== null) window.clearTimeout(hintTimer.current);
    };
  }, []);

  const showHint = () => {
    setHinting(true);
    if (hintTimer.current !== null) window.clearTimeout(hintTimer.current);
    hintTimer.current = window.setTimeout(() => setHinting(false), 3200);
  };

  const openMemory = (memory: Memory, element: HTMLButtonElement) => {
    burstFrom(element, 7);
    setFound((current) => (current.includes(memory.id) ? current : [...current, memory.id]));
    setActiveMemory(memory);
  };

  const closeMemory = useCallback(() => setActiveMemory(null), []);

  return (
    <section className="scene scene--world" aria-labelledby="world-title">
      <div className="world-stage" ref={stageRef}>
        <img
          className="world-stage__image"
          src={asset('/images/scenes/03-world.webp')}
          alt="A pastel fantasy game world with the boy and girl as small adventurers, a quest board, treasure chest, glowing heart crystal, star and friendly blob creatures."
        />
        <div className="world-stage__veil" aria-hidden="true" />

        {positions &&
          memories.map((memory, index) => {
            const isFound = found.includes(memory.id);
            return (
              <button
                key={memory.id}
                type="button"
                className={`hotspot${isFound ? ' is-found' : ''}${hinting ? ' is-hinting' : ''}`}
                style={{
                  left: `${positions[index].x}px`,
                  top: `${positions[index].y}px`,
                  animationDelay: `${index * 700}ms`,
                }}
                onClick={(event) => openMemory(memory, event.currentTarget)}
                aria-label={`${isFound ? 'Revisit' : 'Open'} memory: ${memory.label}`}
              >
                <span className="hotspot__halo" aria-hidden="true" />
                <span className="hotspot__core" aria-hidden="true">
                  <HeartIcon />
                </span>
                <span className="hotspot__label" aria-hidden="true">
                  {memory.label}
                </span>
              </button>
            );
          })}
      </div>

      <div className="world-hud">
        <header className="world-title glass">
          <span className="eyebrow">
            <span className="eyebrow__num">03</span> our little world
          </span>
          <h2 id="world-title">{chapterCopy.world.title}</h2>
          <p>{chapterCopy.world.intro}</p>
        </header>

        <div className="world-progress glass">
          <div className="world-progress__top">
            <span className="world-progress__label">
              {found.length} / {memories.length} {chapterCopy.world.progress}
            </span>
            <button
              type="button"
              className="world-progress__hint"
              onClick={showHint}
              aria-label="Highlight all memory locations"
            >
              <SparkleIcon />
              {hinting ? chapterCopy.world.hinting : chapterCopy.world.hint}
            </button>
          </div>
          <div className="world-progress__pips" aria-hidden="true">
            {memories.map((memory) => (
              <span key={memory.id} className={`world-pip${found.includes(memory.id) ? ' is-found' : ''}`}>
                <HeartIcon />
              </span>
            ))}
          </div>
          <p className="world-progress__note">{chapterCopy.world.intro}</p>
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        {found.length} of {memories.length} memories found.
      </p>

      <div className="world-tray" role="group" aria-label="Memories hidden in this world">
        {memories.map((memory, index) => (
          <button
            key={memory.id}
            type="button"
            className={`world-tray__item${found.includes(memory.id) ? ' is-found' : ''}`}
            onClick={(event) => openMemory(memory, event.currentTarget)}
          >
            <span className="world-tray__top">
              <span className="world-tray__num">{String(index + 1).padStart(2, '0')}</span>
              <span className="world-tray__state" aria-hidden="true">
                {found.includes(memory.id) ? <HeartIcon /> : <SparkleIcon />}
              </span>
            </span>
            <span className="world-tray__label">{memory.label}</span>
            <span className="world-tray__action">{found.includes(memory.id) ? 'revisit' : 'open'}</span>
          </button>
        ))}
      </div>

      {complete && (
        <div className="world-complete" role="status">
          <span className="eyebrow eyebrow--small">
            <SparkleIcon /> every little piece
          </span>
          <h3>{chapterCopy.world.completeTitle}</h3>
          <p>{chapterCopy.world.completeCopy}</p>
          <button type="button" className="btn btn--primary" onClick={onNext}>
            {chapterCopy.world.cta}
          </button>
        </div>
      )}

      {activeMemory && <MemoryModal memory={activeMemory} onClose={closeMemory} />}
    </section>
  );
}
