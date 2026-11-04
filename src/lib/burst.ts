const HEART_SVG =
  '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 21s-7.6-4.8-9.7-9.2C.8 8.5 2.5 4.9 6.1 4.9c2 0 3.6 1 4.6 2.5L12 9l1.3-1.6c1-1.5 2.6-2.5 4.6-2.5 3.6 0 5.3 3.6 3.8 6.9C19.6 16.2 12 21 12 21Z"/></svg>';

const COLORS = ['#d98f9c', '#e8b4b8', '#c9a4c6', '#d8b476'];

export function burstAt(x: number, y: number, amount = 9) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let layer = document.getElementById('burst-layer');
  if (!layer) {
    layer = document.createElement('div');
    layer.id = 'burst-layer';
    layer.className = 'burst-layer';
    layer.setAttribute('aria-hidden', 'true');
    document.body.appendChild(layer);
  }

  for (let index = 0; index < amount; index += 1) {
    const heart = document.createElement('span');
    heart.className = 'burst-heart';
    heart.innerHTML = HEART_SVG;
    const angle = (Math.PI * 2 * index) / amount + Math.random() * 0.5;
    const distance = 42 + Math.random() * 88;
    heart.style.left = `${x}px`;
    heart.style.top = `${y}px`;
    heart.style.setProperty('--dx', `${Math.cos(angle) * distance}px`);
    heart.style.setProperty('--dy', `${Math.sin(angle) * distance - 26}px`);
    heart.style.setProperty('--rot', `${(Math.random() - 0.5) * 90}deg`);
    heart.style.setProperty('--size', `${8 + Math.random() * 10}px`);
    heart.style.setProperty('--color', COLORS[index % COLORS.length]);
    heart.style.animationDelay = `${Math.random() * 80}ms`;
    heart.addEventListener('animationend', () => heart.remove(), { once: true });
    layer.appendChild(heart);
  }
}

export function burstFrom(element: Element, amount = 9) {
  const rect = element.getBoundingClientRect();
  burstAt(rect.left + rect.width / 2, rect.top + rect.height / 2, amount);
}
