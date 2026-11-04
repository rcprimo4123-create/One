import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

export function HeartIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false" {...props}>
      <path
        d="M12 20.4s-7.1-4.4-9-8.5C1.2 8.4 2.8 5 6.2 5c1.9 0 3.4.95 4.3 2.35L12 9.2l1.5-1.85C14.4 5.95 15.9 5 17.8 5c3.4 0 5 3.4 3.2 6.9-1.9 4.1-9 8.5-9 8.5Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SparkleIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false" {...props}>
      <path
        d="M12 2.5c.55 5.2 2.3 7 7.5 7.5-5.2.55-7 2.3-7.5 7.5-.55-5.2-2.3-7-7.5-7.5 5.2-.55 7-2.3 7.5-7.5Z"
        fill="currentColor"
      />
      <path d="M19 15.5c.22 2.1.9 2.8 3 3-2.1.22-2.78.9-3 3-.22-2.1-.9-2.78-3-3 2.1-.22 2.78-.9 3-3Z" fill="currentColor" opacity=".55" />
    </svg>
  );
}

export function ArrowIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false" {...props}>
      <path d="M4 12h15M13.5 6.5 19 12l-5.5 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function FlourishIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 120 16" fill="none" aria-hidden="true" focusable="false" {...props}>
      <path d="M2 8h34M84 8h34" stroke="currentColor" strokeWidth=".8" strokeLinecap="round" opacity=".5" />
      <path
        d="M60 2.6c.4 3.4 1.4 4.5 4.8 5.1-3.4.6-4.4 1.7-4.8 5.1-.4-3.4-1.4-4.5-4.8-5.1 3.4-.6 4.4-1.7 4.8-5.1Z"
        fill="currentColor"
        opacity=".8"
      />
      <circle cx="49" cy="8" r="1.1" fill="currentColor" opacity=".45" />
      <circle cx="71" cy="8" r="1.1" fill="currentColor" opacity=".45" />
    </svg>
  );
}

export function EnvelopeIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false" {...props}>
      <rect x="2.5" y="5" width="19" height="14" rx="2.2" stroke="currentColor" strokeWidth="1.3" />
      <path d="m3.5 6.5 8.5 6.7 8.5-6.7" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  );
}

export function FlowerIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false" {...props}>
      <path
        d="M12 9.2c1.4-1.1 3.4-1 4.4.4 1 1.4.7 3.3-.7 4.3 1 1.4.7 3.3-.7 4.3-1.3.9-3.1.6-4.1-.6-1 1.2-2.8 1.5-4.1.6-1.4-1-1.7-2.9-.7-4.3-1.4-1-1.7-2.9-.7-4.3 1-1.4 3-1.5 4.4-.4Z"
        fill="currentColor"
        opacity=".32"
      />
      <circle cx="12" cy="12.8" r="2.2" fill="currentColor" />
      <path d="M12 15v6" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
      <path d="M12 18.6c-1.7 0-2.7-1-3-2.4 1.7 0 2.7 1 3 2.4Zm0-2.8c1.5 0 2.5-.9 2.8-2.2-1.6 0-2.6.9-2.8 2.2Z" fill="currentColor" opacity=".55" />
    </svg>
  );
}

export function MusicIcon({ muted = false, ...props }: IconProps & { muted?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false" {...props}>
      <path d="M9.5 17.2V6.4l8-1.6v10.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      <ellipse cx="7.1" cy="17.6" rx="2.5" ry="2.1" stroke="currentColor" strokeWidth="1.3" />
      <ellipse cx="15.1" cy="15.6" rx="2.5" ry="2.1" stroke="currentColor" strokeWidth="1.3" />
      {muted && <path d="M3 3l18 18" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />}
    </svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false" {...props}>
      <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
