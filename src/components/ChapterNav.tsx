import { chapters, type Chapter, type Stage } from '../lib/content';

interface ChapterNavProps {
  stage: Stage;
  visited: Set<Stage>;
  onNavigate: (stage: Stage) => void;
  visible: boolean;
}

export function ChapterNav({ stage, visited, onNavigate, visible }: ChapterNavProps) {
  if (!visible) return null;

  const handleSelect = (chapter: Chapter) => {
    if (visited.has(chapter.id) || chapter.id === stage) onNavigate(chapter.id);
  };

  return (
    <nav className="chapter-nav" aria-label="Chapters">
      <span className="chapter-nav__thread" aria-hidden="true" />
      {chapters.map((chapter) => {
        const isCurrent = stage === chapter.id;
        const isVisited = visited.has(chapter.id);
        return (
          <button
            key={chapter.id}
            type="button"
            className={`chapter-nav__item${isCurrent ? ' is-current' : ''}${isVisited ? ' is-visited' : ''}`}
            onClick={() => handleSelect(chapter)}
            disabled={!isVisited && !isCurrent}
            aria-current={isCurrent ? 'step' : undefined}
            aria-label={`Chapter ${chapter.number}: ${chapter.label}${isVisited || isCurrent ? '' : ' (not yet visited)'}`}
          >
            <span className="chapter-nav__num">{chapter.number}</span>
            <span className="chapter-nav__label">{chapter.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
