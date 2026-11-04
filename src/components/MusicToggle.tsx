import { MusicIcon } from './Icons';

interface MusicToggleProps {
  enabled: boolean;
  onToggle: () => void;
}

export function MusicToggle({ enabled, onToggle }: MusicToggleProps) {
  return (
    <button
      type="button"
      className={`music-toggle${enabled ? ' is-on' : ''}`}
      onClick={onToggle}
      aria-pressed={enabled}
      aria-label={enabled ? 'Turn the music off' : 'Turn the music on'}
    >
      <span className="music-toggle__icon">
        <MusicIcon muted={!enabled} />
      </span>
      <span className="music-toggle__label">{enabled ? 'music on' : 'music off'}</span>
      <span className="music-toggle__bars" aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
    </button>
  );
}
