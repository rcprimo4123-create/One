import { useEffect, useState, type RefObject } from 'react';

export interface Point {
  x: number;
  y: number;
}

/**
 * Maps normalized coordinates on an `object-fit: cover` image back to pixels
 * inside its container, so interactive markers stay on their artwork.
 */
export function useCoverMarkers(
  containerRef: RefObject<HTMLElement | null>,
  imageRatio: number,
  points: Point[],
  objectPosition: Point = { x: 0.5, y: 0.5 },
) {
  const [positions, setPositions] = useState<Point[] | null>(null);
  const { x: posX, y: posY } = objectPosition;

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    let frame = 0;

    const measure = () => {
      const width = element.clientWidth;
      const height = element.clientHeight;
      if (!width || !height) return;

      const renderedWidth = Math.max(width, height * imageRatio);
      const renderedHeight = Math.max(height, width / imageRatio);
      const offsetX = (width - renderedWidth) * posX;
      const offsetY = (height - renderedHeight) * posY;

      setPositions(
        points.map((point) => ({
          x: offsetX + point.x * renderedWidth,
          y: offsetY + point.y * renderedHeight,
        })),
      );
    };

    measure();
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    });
    observer.observe(element);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [containerRef, imageRatio, points, posX, posY]);

  return positions;
}

export function useReducedMotion() {
  const [reduced, setReduced] = useState(() =>
    typeof window === 'undefined'
      ? false
      : window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(query.matches);
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  return reduced;
}
