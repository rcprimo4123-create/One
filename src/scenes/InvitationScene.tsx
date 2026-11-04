import { useRef } from 'react';
import { burstFrom } from '../lib/burst';
import { ArrowIcon, FlourishIcon, HeartIcon, SparkleIcon } from '../components/Icons';

interface InvitationSceneProps {
  entered: boolean;
  onEnter: () => void;
  onContinue: () => void;
}

export function InvitationScene({ entered, onEnter, onContinue }: InvitationSceneProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handle = () => {
    if (buttonRef.current) burstFrom(buttonRef.current, 11);
    if (entered) onContinue();
    else onEnter();
  };

  return (
    <section className="scene scene--invitation" aria-labelledby="invitation-title">
      <div className="invite-art" aria-hidden="true">
        <img
          className={`invite-art__image${entered ? ' is-hidden' : ''}`}
          src="/images/scenes/01-peek.webp"
          alt=""
          fetchPriority="high"
        />
        <img
          className={`invite-art__image invite-art__image--wave${entered ? ' is-visible' : ''}`}
          src="/images/scenes/01-wave.webp"
          alt=""
        />
        <div className="invite-art__wash" />
        <div className="invite-art__note">
          <span>for you —</span>
          <em>with a slightly nervous heart</em>
        </div>
      </div>

      <div className="invite-content">
        <div key={entered ? 'entered' : 'welcome'} className="invite-copy">
          {!entered ? (
            <>
              <span className="eyebrow">
                <SparkleIcon /> for you · five little chapters
              </span>
              <h1 id="invitation-title">
                A little world,
                <br />
                <em>just for you.</em>
              </h1>
              <p className="lede">
                I could not fit everything into a message. So I built you somewhere to walk through instead.
              </p>
              <div className="invite-actions">
                <button ref={buttonRef} type="button" className="btn btn--primary" onClick={handle}>
                  Open the first page
                  <ArrowIcon className="btn__icon" />
                </button>
                <span className="invite-hint">take your time · there is no rush</span>
              </div>
            </>
          ) : (
            <>
              <span className="eyebrow">
                <span className="eyebrow__num">01</span> the invitation
              </span>
              <h1 id="invitation-title">
                Hi.
                <br />
                <em>I am glad you are here.</em>
              </h1>
              <div className="invite-letter-lines">
                <p>I have rewritten this part about six times.</p>
                <p>
                  So I will say it simply: there is something I have wanted to tell you, and I wanted it to feel
                  like a place, not a paragraph.
                </p>
              </div>
              <div className="invite-actions">
                <button ref={buttonRef} type="button" className="btn btn--primary" onClick={handle}>
                  Come inside
                  <ArrowIcon className="btn__icon" />
                </button>
                <span className="invite-hint">
                  <HeartIcon className="invite-hint__heart" /> five chapters, all yours
                </span>
              </div>
            </>
          )}
        </div>

        <div className="invite-seal" aria-hidden="true">
          <FlourishIcon />
          <span>a small world</span>
        </div>
      </div>
    </section>
  );
}
