import { useEffect, useRef, useState, type FormEvent } from 'react';
import { ArrowIcon, HeartIcon, SparkleIcon } from '../components/Icons';
import { burstFrom } from '../lib/burst';
import { chapterCopy, letter, sealReplyCopy } from '../lib/content';

interface LetterSceneProps {
  onFinish: () => void;
  onReplySaved: (reply: string) => void;
  startOpened?: boolean;
}

const STORAGE_KEY = 'little-world-reply';

function storedReply() {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? '';
  } catch {
    return '';
  }
}

export function LetterScene({ onFinish, onReplySaved, startOpened = false }: LetterSceneProps) {
  const [opened, setOpened] = useState(startOpened);
  const [reply, setReply] = useState(storedReply);
  const [sealed, setSealed] = useState(false);
  const [error, setError] = useState('');
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'error'>('idle');
  const sealRef = useRef<HTMLButtonElement>(null);
  const paperRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const confirmationRef = useRef<HTMLHeadingElement>(null);
  const copyTimer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimer.current !== null) window.clearTimeout(copyTimer.current);
    };
  }, []);

  useEffect(() => {
    if (!opened) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const timer = window.setTimeout(() => {
      headingRef.current?.focus({ preventScroll: true });
      if (window.innerWidth <= 900) {
        paperRef.current?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
      }
    }, 260);
    return () => window.clearTimeout(timer);
  }, [opened]);

  const openLetter = () => {
    if (sealRef.current) burstFrom(sealRef.current, 13);
    setOpened(true);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const submitter = event.currentTarget;
    const trimmed = reply.trim();
    if (!trimmed) {
      setError('Even a single word is enough. I promise.');
      return;
    }
    try {
      localStorage.setItem(STORAGE_KEY, trimmed);
    } catch {
      /* Saving is a convenience; the words still exist in the page. */
    }
    setError('');
    setSealed(true);
    onReplySaved(trimmed);
    burstFrom(submitter, 10);
    window.setTimeout(() => {
      confirmationRef.current?.focus({ preventScroll: true });
      confirmationRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 160);
  };

  const copyReply = async () => {
    try {
      await navigator.clipboard.writeText(reply.trim());
      setCopyState('copied');
    } catch {
      setCopyState('error');
    }
    if (copyTimer.current !== null) window.clearTimeout(copyTimer.current);
    copyTimer.current = window.setTimeout(() => setCopyState('idle'), 4000);
  };

  return (
    <section className="scene scene--letter" aria-labelledby="letter-title">
      <div className="scene-wash scene-wash--letter" aria-hidden="true" />
      <div className="letter-layout">
        <figure className="letter-visual">
          <div className="letter-portrait">
            <img
              src="/images/scenes/05-envelope.webp"
              alt="The boy in his cream heart sweater, holding a cream envelope sealed with a pink heart toward the viewer."
            />
            <span className="letter-portrait__corner letter-portrait__corner--left" aria-hidden="true" />
            <span className="letter-portrait__corner letter-portrait__corner--right" aria-hidden="true" />
          </div>
          <figcaption>
            <span>one last thing</span>
            <em>held in both hands</em>
          </figcaption>
          <div className="letter-visual__stamp" aria-hidden="true">
            <SparkleIcon />
            <span>sealed with a heart</span>
          </div>
        </figure>

        <div className="letter-content">
          <header className="chapter-head">
            <span className="eyebrow">
              <span className="eyebrow__num">05</span> the letter
            </span>
            <h2 id="letter-title">{chapterCopy.letter.title}</h2>
            <p className="lede">{chapterCopy.letter.intro}</p>
          </header>

          {!opened ? (
            <button
              ref={sealRef}
              type="button"
              className="envelope"
              onClick={openLetter}
              aria-label="Break the wax seal and open the letter"
            >
              <span className="envelope__back" aria-hidden="true" />
              <span className="envelope__paper" aria-hidden="true">
                <span className="envelope__paper-line" />
                <span className="envelope__paper-line envelope__paper-line--short" />
                <span className="envelope__paper-line" />
              </span>
              <span className="envelope__body" aria-hidden="true">
                <span className="envelope__address">to you, with everything</span>
              </span>
              <span className="envelope__flap" aria-hidden="true" />
              <span className="envelope__seal" aria-hidden="true">
                <HeartIcon />
              </span>
              <span className="envelope__hint">
                {chapterCopy.letter.sealed}
                <ArrowIcon />
              </span>
            </button>
          ) : (
            <div className="letter-opened">
              <article className="letter-paper" ref={paperRef}>
                <header className="letter-paper__head">
                  <span className="letter-paper__mark">
                    for you <HeartIcon />
                  </span>
                  <span className="letter-paper__date">tonight, and always</span>
                </header>
                <h3 ref={headingRef} tabIndex={-1} className="sr-only">
                  The letter
                </h3>
                <p className="letter-paper__salutation">{letter.salutation}</p>
                {letter.paragraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 24)}>{paragraph}</p>
                ))}
                <p className="letter-paper__signature">
                  {letter.signature},
                  <br />
                  <em>Christian</em>
                </p>
                <span className="letter-paper__flower" aria-hidden="true" />
              </article>

              <div className="reply-zone">
                {!sealed ? (
                  <form className="reply-form" onSubmit={handleSubmit} noValidate>
                    <h3>Write back, if you would like.</h3>
                    <p>{sealReplyCopy.intro}</p>
                    <label className="sr-only" htmlFor="reply">
                      Your reply
                    </label>
                    <textarea
                      id="reply"
                      name="reply"
                      rows={4}
                      maxLength={1200}
                      value={reply}
                      placeholder={sealReplyCopy.placeholder}
                      onChange={(event) => {
                        setReply(event.target.value);
                        if (error) setError('');
                      }}
                      aria-describedby={error ? 'reply-error' : undefined}
                    />
                    <div className="reply-form__meta">
                      <span>{reply.length} / 1200</span>
                      <span className="reply-form__note">it stays on this little page</span>
                    </div>
                    {error && (
                      <p id="reply-error" className="form-error" role="alert">
                        {error}
                      </p>
                    )}
                    <div className="reply-form__actions">
                      <button type="submit" className="btn btn--primary">
                        Seal my reply
                        <HeartIcon className="btn__icon" />
                      </button>
                      <button type="button" className="text-link" onClick={onFinish}>
                        or turn the last page
                        <ArrowIcon />
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="reply-confirmation">
                    <span className="reply-confirmation__seal" aria-hidden="true">
                      <HeartIcon />
                    </span>
                    <h3 ref={confirmationRef} tabIndex={-1}>
                      Sealed.
                    </h3>
                    <p>{sealReplyCopy.saved}</p>
                    <blockquote>{reply.trim()}</blockquote>
                    <div className="reply-confirmation__actions">
                      <button type="button" className="btn btn--soft" onClick={copyReply}>
                        {copyState === 'copied' ? 'Copied' : 'Copy my reply'}
                      </button>
                      <button type="button" className="btn btn--primary" onClick={onFinish}>
                        Turn the last page
                        <ArrowIcon className="btn__icon" />
                      </button>
                    </div>
                    <p className="reply-confirmation__status" role="status">
                      {copyState === 'copied' && sealReplyCopy.copySuccess}
                      {copyState === 'error' && sealReplyCopy.copyError}
                    </p>
                    <button type="button" className="text-link text-link--center" onClick={() => setSealed(false)}>
                      Edit my reply
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
