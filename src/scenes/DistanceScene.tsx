import { useEffect, useRef, useState } from 'react';
import { ArrowIcon, HeartIcon, SparkleIcon } from '../components/Icons';
import { burstFrom } from '../lib/burst';
import { asset } from '../lib/asset';
import { chapterCopy, distanceNotes } from '../lib/content';
import { useCoverMarkers } from '../lib/scene-utils';

const DISTANCE_IMAGE_RATIO = 1792 / 1024;
const DISTANCE_POINTS = distanceNotes.map((note) => note.point);

interface DistanceSceneProps {
  onNext: () => void;
}

export function DistanceScene({ onNext }: DistanceSceneProps) {
  const [opened, setOpened] = useState<number[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const finalRowRef = useRef<HTMLDivElement>(null);
  const positions = useCoverMarkers(stageRef, DISTANCE_IMAGE_RATIO, DISTANCE_POINTS);
  const complete = opened.length === distanceNotes.length;
  const activeNote = distanceNotes.find((note) => note.id === activeId) ?? null;

  useEffect(() => {
    if (!complete || window.innerWidth > 980) return;
    const timer = window.setTimeout(() => {
      const row = finalRowRef.current;
      if (!row) return;
      const nav = document.querySelector('.chapter-nav');
      const limit = nav ? nav.getBoundingClientRect().top - 14 : window.innerHeight - 20;
      const overflow = row.getBoundingClientRect().bottom - limit;
      if (overflow > 0) {
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        window.scrollBy({ top: overflow, behavior: reduced ? 'auto' : 'smooth' });
      }
    }, 260);
    return () => window.clearTimeout(timer);
  }, [complete]);

  const openNote = (id: number, element: HTMLButtonElement) => {
    if (!opened.includes(id)) {
      burstFrom(element, 8);
      setOpened((current) => [...current, id]);
    }
    setActiveId(id);
  };

  return (
    <section className="scene scene--distance" aria-labelledby="distance-title">
      <div className="distance-stage" ref={stageRef}>
        <img
          className="distance-stage__image"
          src={asset('/images/scenes/04-dusk.webp')}
          alt="The boy and the girl standing on separate cloud hills at dusk, a thread of glowing hearts arcing across the sky between them."
        />
        <div className="distance-stage__veil" aria-hidden="true" />

        {positions &&
          distanceNotes.map((note) => {
            const isOpen = opened.includes(note.id);
            return (
              <button
                key={note.id}
                type="button"
                className={`heart-spot${isOpen ? ' is-open' : ''}${activeId === note.id ? ' is-active' : ''}`}
                style={{ left: `${positions[note.id - 1].x}px`, top: `${positions[note.id - 1].y}px` }}
                onClick={(event) => openNote(note.id, event.currentTarget)}
                aria-label={`Read note ${note.id}: ${note.label}`}
                aria-pressed={isOpen}
              >
                <span className="heart-spot__halo" aria-hidden="true" />
                <span className="heart-spot__core" aria-hidden="true">
                  <HeartIcon />
                </span>
                <span className="heart-spot__label" aria-hidden="true">
                  {note.short}
                </span>
              </button>
            );
          })}
      </div>

      <header className="distance-head glass">
        <span className="eyebrow">
          <span className="eyebrow__num">04</span> the distance
        </span>
        <h2 id="distance-title">{chapterCopy.distance.title}</h2>
        <p key={complete ? 'complete' : 'intro'} className="distance-head__copy">
          {complete ? chapterCopy.distance.completeTitle : chapterCopy.distance.intro}
        </p>
        <span className="distance-count" aria-live="polite">
          {opened.length} of {distanceNotes.length} little thoughts
        </span>
      </header>

      <div className="distance-panel glass" aria-live="polite">
        {activeNote ? (
          <>
            <div className="distance-panel__top">
              <span className="eyebrow eyebrow--small">
                a little thought <span className="distance-panel__sep">·</span>{' '}
                {String(activeNote.id).padStart(2, '0')}
              </span>
              <div className="distance-tabs" aria-label="Thoughts you have opened">
                {distanceNotes.map((note) => (
                  <button
                    key={note.id}
                    type="button"
                    className={`distance-tab${activeId === note.id ? ' is-active' : ''}`}
                    onClick={() => setActiveId(note.id)}
                    disabled={!opened.includes(note.id)}
                    aria-label={`Show thought ${note.id}: ${note.short}`}
                    aria-pressed={activeId === note.id}
                  >
                    {opened.includes(note.id) ? <HeartIcon /> : String(note.id).padStart(2, '0')}
                  </button>
                ))}
              </div>
            </div>
            <h3 key={activeNote.id}>{activeNote.title}</h3>
            {activeNote.copy && <p key={`copy-${activeNote.id}`}>{activeNote.copy}</p>}
            {complete ? (
              <div className="distance-final-row" ref={finalRowRef}>
                <span>{chapterCopy.distance.completeCopy}</span>
                <button type="button" className="btn btn--primary" onClick={onNext}>
                  {chapterCopy.distance.cta}
                  <ArrowIcon className="btn__icon" />
                </button>
              </div>
            ) : (
              <span className="distance-panel__hint">
                <SparkleIcon />
                {distanceNotes.length - opened.length} more along the light
              </span>
            )}
          </>
        ) : (
          <div className="distance-panel__waiting">
            <span className="distance-panel__icon">
              <SparkleIcon />
            </span>
            <div>
              <h3>Three little thoughts are waiting.</h3>
              <p>Touch the hearts along the light. They are yours.</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
