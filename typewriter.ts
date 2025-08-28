import { gsap } from 'gsap';
import TextPlugin from 'gsap/TextPlugin';

gsap.registerPlugin(TextPlugin);

export function runTypewriter() {
  const el = document.querySelector('#typewriter');
  if (!el) return;
  const finalText = el.getAttribute('data-text') || '';
  gsap.set(el, { text: '' });
  gsap.to(el, { duration: finalText.length * 0.05, text: finalText, ease: 'none' });
}

export function enableCardHovers() {
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mouseenter', () => gsap.to(card, { y: -6, scale: 1.02, duration: 0.25 }));
    card.addEventListener('mouseleave', () => gsap.to(card, { y: 0, scale: 1, duration: 0.25 }));
  });
}
