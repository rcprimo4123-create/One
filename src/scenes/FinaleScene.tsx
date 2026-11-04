import { useEffect } from 'react';
import { ArrowIcon, HeartIcon, SparkleIcon } from '../components/Icons';
import { burstAt } from '../lib/burst';

interface FinaleSceneProps {
  hasReply: boolean;
  onReadLetter: () => void;
  onRestart: () => void;
}

export function FinaleScene({ hasReply, onReadLetter, onRestart }: FinaleSceneProps) {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;
    const timer = window.setTimeout(() => {
      burstAt(window.innerWidth / 2, window.innerHeight * 0.2, 14);
    }, 650);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <section className="scene scene--finale" aria-labelledby="finale-title">
      <div className="finale-art" aria-hidden="true">
        <img src="/images/scenes/04-together.webp" alt="" />
        <div className="finale-art__veil" />
      </div>

      <div className="finale-content">
        <div className="finale-card">
          <span className="eyebrow">
            <SparkleIcon /> the last page
          </span>
          <h1 id="finale-title">
            And if this is only
            <br />
            the beginning…
          </h1>
          <p className="finale-big">
            I am glad <em>it is you.</em>
          </p>
          <p className="finale-body">
            Thank you for walking through my little world. Leave the light on in here. I will be right beside
            you.
          </p>

          {hasReply && (
            <p className="finale-reply-note">
              <HeartIcon /> your reply is tucked safely inside this page
            </p>
          )}

          <div className="finale-actions">
            <button type="button" className="btn btn--primary" onClick={onReadLetter}>
              Read the letter again
              <ArrowIcon className="btn__icon" />
            </button>
            <button type="button" className="text-link" onClick={onRestart}>
              begin again
            </button>
          </div>

          <p className="finale-ps">No ending. Just a see-you-soon.</p>
        </div>
        <p className="finale-signoff">
          <span>made with warmth</span>
          <HeartIcon />
          <span>for you</span>
        </p>
      </div>

      <span className="finale-heart finale-heart--one" aria-hidden="true">
        <HeartIcon />
      </span>
      <span className="finale-heart finale-heart--two" aria-hidden="true">
        <HeartIcon />
      </span>
      <span className="finale-heart finale-heart--three" aria-hidden="true">
        <HeartIcon />
      </span>
    </section>
  );
}
