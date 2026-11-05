import { useEffect, useRef, useState } from 'react';
import { burstAt } from '../lib/burst';
import { flowerNotes, chapterCopy } from '../lib/content';
import { ArrowIcon, HeartIcon, SparkleIcon } from '../components/Icons';

interface FlowersSceneProps {
  onNext: () => void;
}

export function FlowersScene({ onNext }: FlowersSceneProps) {
  const [revealed, setRevealed] = useState(0);
  const bouquetRef = useRef<HTMLButtonElement>(null);
  const closingRef = useRef<HTMLDivElement>(null);
  const complete = revealed >= flowerNotes.length;

  useEffect(() => {
    if (!complete || window.innerWidth <= 900) return;
    const timer = window.setTimeout(() => {
      const closing = closingRef.current;
      if (!closing) return;
      const nav = document.querySelector('.chapter-nav');
      const limit = nav ? nav.getBoundingClientRect().top - 16 : window.innerHeight - 24;
      const overflow = closing.getBoundingClientRect().bottom - limit;
      if (overflow > 0) {
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        window.scrollBy({ top: overflow, behavior: reduced ? 'auto' : 'smooth' });
      }
    }, 280);
    return () => window.clearTimeout(timer);
  }, [complete]);

  const pickFlower = () => {
    if (complete) return;
    const button = bouquetRef.current;
    if (button) {
      const rect = button.getBoundingClientRect();
      burstAt(rect.left + rect.width / 2, rect.top + rect.height / 2, 7);
    }
    setRevealed((value) => value + 1);
  };

  return (
    <section className="scene scene--flowers" aria-labelledby="flowers-title">
      <div className="scene-wash scene-wash--flowers" aria-hidden="true" />
      <div className="flowers-layout">
        <figure className="flowers-visual">
          <div className="flowers-frame">
            <div className="flowers-image-wrap">
              <img
                src="/images/scenes/02-flowers.webp"
                alt="The boy in his cream heart sweater, blushing as he holds out a bouquet of blush-pink roses."
              />
            </div>
            <button
              ref={bouquetRef}
              type="button"
              className={`bouquet-button${complete ? ' is-complete' : ''}`}
              onClick={pickFlower}
              disabled={complete}
              aria-label={
                complete
                  ? 'All four flower notes have been opened'
                  : `Reveal flower note ${revealed + 1} of ${flowerNotes.length}`
              }
            >
              <span className="bouquet-button__halo" aria-hidden="true" />
              <span className="bouquet-button__label">
                {complete
                  ? 'all four, opened'
                  : revealed === 0
                    ? chapterCopy.flowers.hint
                    : `${revealed} of ${flowerNotes.length}, opened`}
              </span>
            </button>
            <span className="flowers-tape flowers-tape--left" aria-hidden="true" />
            <span className="flowers-tape flowers-tape--right" aria-hidden="true" />
          </div>
          <figcaption className="flowers-caption">
            <span>picked for you</span>
            <em>with all the softest reasons</em>
          </figcaption>
        </figure>

        <div className="flowers-panel">
          <header className="chapter-head">
            <span className="eyebrow">
              <span className="eyebrow__num">02</span> the flowers
            </span>
            <h2 id="flowers-title">
              These are
              <br />
              <em>for you.</em>
            </h2>
            <p className="lede">{chapterCopy.flowers.intro}</p>
          </header>

          <div className={`flower-notes${complete ? ' is-complete' : ''}`} aria-live="polite">
            {revealed === 0 && (
              <div className="flower-notes__empty">
                <SparkleIcon />
                <span>{chapterCopy.flowers.hint}, one at a time.</span>
              </div>
            )}
            {flowerNotes.slice(0, revealed).map((note) => (
              <article className="flower-note" key={note.id}>
                <span className="flower-note__num">{String(note.id).padStart(2, '0')}</span>
                <div>
                  <h3>{note.lead}</h3>
                  <p>{note.text}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="flowers-footer">
            <div className="flowers-progress" aria-hidden="true">
              {flowerNotes.map((note) => (
                <span key={note.id} className={`petal-pip${revealed >= note.id ? ' is-filled' : ''}`} />
              ))}
              <span className="flowers-count">
                {revealed} / {flowerNotes.length}
              </span>
            </div>

            {complete ? (
              <div className="flowers-closing" ref={closingRef}>
                <p>{chapterCopy.flowers.closing}</p>
                <button type="button" className="btn btn--primary" onClick={onNext}>
                  There is somewhere I want to show you
                  <ArrowIcon className="btn__icon" />
                </button>
              </div>
            ) : (
              <p className="flowers-whisper">
                <HeartIcon /> each flower holds something I mean
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
