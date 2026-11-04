import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import type { Memory } from '../lib/content';
import { CloseIcon, HeartIcon, SparkleIcon } from './Icons';

interface MemoryModalProps {
  memory: Memory;
  onClose: () => void;
}

export function MemoryModal({ memory, onClose }: MemoryModalProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const focusTimer = window.setTimeout(() => closeRef.current?.focus(), 80);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== 'Tab') return;

      const focusable = cardRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable || focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus({ preventScroll: true });
    };
  }, [onClose]);

  return createPortal(
    <div
      className="modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={cardRef}
        className="memory-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={`memory-title-${memory.id}`}
      >
        <button ref={closeRef} type="button" className="memory-modal__close" onClick={onClose} aria-label="Close this memory">
          <CloseIcon />
        </button>

        <figure className="memory-modal__photo">
          <div className="memory-modal__image-wrap">
            <img src={memory.image} alt={memory.alt} />
          </div>
          <figcaption>{memory.caption}</figcaption>
        </figure>

        <div className="memory-modal__body">
          <span className="eyebrow eyebrow--small">
            <SparkleIcon /> a found memory
          </span>
          <h3 id={`memory-title-${memory.id}`}>{memory.title}</h3>
          <p>{memory.copy}</p>
          <div className="memory-modal__footer">
            <span className="memory-modal__kept">kept, always</span>
            <button type="button" className="btn btn--soft" onClick={onClose}>
              Keep this one
              <HeartIcon className="btn__icon" />
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
