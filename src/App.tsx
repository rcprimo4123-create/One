import { useCallback, useEffect, useRef, useState } from 'react';
import { ChapterNav } from './components/ChapterNav';
import { HeartIcon } from './components/Icons';
import { MusicToggle } from './components/MusicToggle';
import { PetalField } from './components/PetalField';
import { InvitationScene } from './scenes/InvitationScene';
import { FlowersScene } from './scenes/FlowersScene';
import { WorldScene } from './scenes/WorldScene';
import { DistanceScene } from './scenes/DistanceScene';
import { LetterScene } from './scenes/LetterScene';
import { FinaleScene } from './scenes/FinaleScene';
import { chapters, type Stage } from './lib/content';
import { asset } from './lib/asset';
import { musicPreference, startMusic, stopMusic } from './lib/music';
import { useReducedMotion } from './lib/scene-utils';

const PRELOAD = [
  '/images/scenes/01-wave.webp',
  '/images/scenes/02-flowers.webp',
  '/images/scenes/03-world.webp',
  '/images/scenes/03-call.webp',
  '/images/scenes/03-movie.webp',
  '/images/scenes/03-future.webp',
  '/images/scenes/04-dusk.webp',
  '/images/scenes/04-together.webp',
  '/images/scenes/05-envelope.webp',
].map(asset);

const STAGE_LABELS: Record<Stage, string> = {
  invitation: 'Chapter one, the invitation',
  flowers: 'Chapter two, the flowers',
  world: 'Chapter three, our little world',
  distance: 'Chapter four, the distance',
  letter: 'Chapter five, the letter',
  finale: 'The last page',
};

function App() {
  const [stage, setStage] = useState<Stage>('invitation');
  const [visited, setVisited] = useState<Set<Stage>>(() => new Set<Stage>(['invitation']));
  const [leaving, setLeaving] = useState(false);
  const [invitationEntered, setInvitationEntered] = useState(false);
  const [openLetterOnArrival, setOpenLetterOnArrival] = useState(false);
  const [musicEnabled, setMusicEnabled] = useState(false);
  const [hasReply, setHasReply] = useState(() => {
    try {
      return Boolean(localStorage.getItem('little-world-reply'));
    } catch {
      return false;
    }
  });

  const transitionTimer = useRef<number | null>(null);
  const busy = useRef(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      PRELOAD.forEach((source) => {
        const image = new Image();
        image.src = source;
      });
    }, 900);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    return () => {
      if (transitionTimer.current !== null) window.clearTimeout(transitionTimer.current);
    };
  }, []);

  const goTo = useCallback(
    (next: Stage) => {
      if (next === stage || busy.current) return;
      busy.current = true;
      setLeaving(true);
      transitionTimer.current = window.setTimeout(
        () => {
          setStage(next);
          setVisited((current) => {
            const updated = new Set(current);
            updated.add(next);
            return updated;
          });
          window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
          setLeaving(false);
          busy.current = false;
        },
        reducedMotion ? 0 : 420,
      );
    },
    [stage, reducedMotion],
  );

  const enterInvitation = () => {
    setInvitationEntered(true);
    if (!musicEnabled && musicPreference() === 'on') {
      void startMusic().then((started) => setMusicEnabled(started));
    }
  };

  const toggleMusic = async () => {
    if (musicEnabled) {
      stopMusic();
      setMusicEnabled(false);
      return;
    }
    const started = await startMusic();
    setMusicEnabled(started);
  };

  const goToLetter = () => {
    setOpenLetterOnArrival(false);
    goTo('letter');
  };

  const readLetterAgain = () => {
    setOpenLetterOnArrival(true);
    goTo('letter');
  };

  const restart = () => {
    setInvitationEntered(false);
    setOpenLetterOnArrival(false);
    setVisited(new Set<Stage>(['invitation']));
    goTo('invitation');
  };

  const currentLabel =
    stage === 'finale' ? STAGE_LABELS.finale : chapters.find((chapter) => chapter.id === stage)?.label ?? '';

  return (
    <div className={`app app--${stage}${leaving ? ' is-leaving' : ''}`}>
      <a className="skip-link" href="#story">
        Skip into the story
      </a>

      <PetalField />

      <header className="topbar">
        <button
          type="button"
          className="brand"
          onClick={() => goTo('invitation')}
          aria-label="Return to the first page"
        >
          <span className="brand__mark">
            <HeartIcon />
          </span>
          <span className="brand__text">
            <span>a little world</span>
            <em>for you</em>
          </span>
        </button>
        <MusicToggle enabled={musicEnabled} onToggle={() => void toggleMusic()} />
      </header>

      <p className="sr-only" role="status" aria-live="polite">
        {`Now showing: ${STAGE_LABELS[stage]}.`}
      </p>

      <main id="story" className="story" tabIndex={-1}>
        <div key={stage} className="scene-swap">
          {stage === 'invitation' && (
            <InvitationScene
              entered={invitationEntered}
              onEnter={enterInvitation}
              onContinue={() => goTo('flowers')}
            />
          )}
          {stage === 'flowers' && <FlowersScene onNext={() => goTo('world')} />}
          {stage === 'world' && <WorldScene onNext={() => goTo('distance')} />}
          {stage === 'distance' && <DistanceScene onNext={goToLetter} />}
          {stage === 'letter' && (
            <LetterScene
              startOpened={openLetterOnArrival}
              onReplySaved={() => setHasReply(true)}
              onFinish={() => goTo('finale')}
            />
          )}
          {stage === 'finale' && (
            <FinaleScene hasReply={hasReply} onReadLetter={readLetterAgain} onRestart={restart} />
          )}
        </div>
      </main>

      <ChapterNav
        stage={stage}
        visited={visited}
        visible={stage !== 'invitation'}
        onNavigate={(next) => {
          if (next === 'letter') setOpenLetterOnArrival(false);
          goTo(next);
        }}
      />

      <p className="corner-signature" aria-hidden="true">
        {currentLabel && (
          <>
            <span>{currentLabel}</span>
          </>
        )}
      </p>
    </div>
  );
}

export default App;
