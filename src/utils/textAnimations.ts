import { gsap } from 'gsap';

/**
 * Text Animation Utilities
 * Different animation styles for different content types
 */

// Character set for decoding effect
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*';

/**
 * Decoding animation - hacker/glitch style
 * Good for: Technical content, code-related sections
 */
export function decodeText(element: HTMLElement, duration = 2) {
  const originalText = element.textContent || '';
  const length = originalText.length;
  let frame = 0;
  const frameDuration = duration * 1000 / (length * 10);

  element.textContent = originalText
    .split('')
    .map(() => CHARS[Math.floor(Math.random() * CHARS.length)])
    .join('');

  const interval = setInterval(() => {
    const percent = frame / (length * 10);
    const revealedChars = Math.floor(percent * length);

    element.textContent = originalText
      .split('')
      .map((char, i) => {
        if (i < revealedChars) return originalText[i];
        return CHARS[Math.floor(Math.random() * CHARS.length)];
      })
      .join('');

    frame++;
    if (frame >= length * 10) {
      clearInterval(interval);
      element.textContent = originalText;
    }
  }, frameDuration);
}

/**
 * Glitch animation - cyberpunk style
 * Good for: Emphasis, call-to-action buttons
 */
export function glitchText(element: HTMLElement) {
  const originalText = element.textContent || '';
  const glitchChars = '!<>-_\\/[]{}—=+*^?#________';
  
  let isGlitching = false;
  
  element.addEventListener('mouseenter', () => {
    if (isGlitching) return;
    isGlitching = true;
    
    let iterations = 0;
    const interval = setInterval(() => {
      element.textContent = originalText
        .split('')
        .map((char, index) => {
          if (index < iterations) return originalText[index];
          return glitchChars[Math.floor(Math.random() * glitchChars.length)];
        })
        .join('');
      
      iterations += 1/3;
      
      if (iterations >= originalText.length) {
        clearInterval(interval);
        element.textContent = originalText;
        isGlitching = false;
      }
    }, 30);
  });
}

/**
 * Scramble reveal - lottery machine style
 * Good for: Navigation items, important headings
 */
export function scrambleReveal(element: HTMLElement, delay = 0) {
  const originalText = element.textContent || '';
  const chars = originalText.split('');
  
  gsap.fromTo(
    chars.map((_, i) => ({ char: CHARS[Math.floor(Math.random() * CHARS.length)] })),
    {
      duration: 0.8,
      delay: delay,
      onUpdate: function() {
        const progress = this.progress();
        element.textContent = chars
          .map((char, i) => {
            if (progress > i / chars.length) return char;
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join('');
      },
      onComplete: () => {
        element.textContent = originalText;
      }
    },
    {}
  );
}

/**
 * Character-by-character reveal
 * Good for: Body text, descriptions
 */
export function charByChar(element: HTMLElement, delay = 0) {
  const text = element.textContent || '';
  element.innerHTML = text
    .split('')
    .map((char) => `<span class="char" style="opacity: 0">${char === ' ' ? '&nbsp;' : char}</span>`)
    .join('');

  gsap.to(element.querySelectorAll('.char'), {
    opacity: 1,
    duration: 0.02,
    stagger: 0.03,
    delay: delay,
    ease: 'none',
  });
}

/**
 * Slide up reveal with fade
 * Good for: Titles, hero text
 */
export function slideUpReveal(elements: NodeListOf<Element> | Element[], staggerDelay = 0.15) {
  gsap.fromTo(
    elements,
    {
      y: 100,
      opacity: 0,
    },
    {
      y: 0,
      opacity: 1,
      duration: 1,
      stagger: staggerDelay,
      ease: 'power3.out',
    }
  );
}

/**
 * Split and reveal - word by word
 * Good for: Subtitles, taglines
 */
export function wordReveal(element: HTMLElement, delay = 0) {
  const text = element.textContent || '';
  const words = text.split(' ');
  
  element.innerHTML = words
    .map((word) => `<span class="word" style="display: inline-block; opacity: 0">${word}&nbsp;</span>`)
    .join('');

  gsap.to(element.querySelectorAll('.word'), {
    opacity: 1,
    y: 0,
    duration: 0.6,
    stagger: 0.08,
    delay: delay,
    ease: 'power2.out',
    onStart: function() {
      gsap.set(this.targets(), { y: 20 });
    }
  });
}

/**
 * Typewriter effect
 * Good for: Code snippets, technical content
 */
export function typewriter(element: HTMLElement, speed = 50) {
  const text = element.textContent || '';
  element.textContent = '';
  
  let i = 0;
  const interval = setInterval(() => {
    element.textContent += text[i];
    i++;
    if (i >= text.length) clearInterval(interval);
  }, speed);
}

/**
 * Fade in with blur
 * Good for: Images, media content
 */
export function fadeInBlur(elements: NodeListOf<Element> | Element[], delay = 0, stagger = 0.2) {
  gsap.fromTo(
    elements,
    {
      opacity: 0,
      filter: 'blur(10px)',
    },
    {
      opacity: 1,
      filter: 'blur(0px)',
      duration: 1,
      delay: delay,
      stagger: stagger,
      ease: 'power2.out',
    }
  );
}

/**
 * Scale in animation
 * Good for: Cards, buttons
 */
export function scaleIn(elements: NodeListOf<Element> | Element[], delay = 0, stagger = 0.1) {
  gsap.fromTo(
    elements,
    {
      scale: 0.8,
      opacity: 0,
    },
    {
      scale: 1,
      opacity: 1,
      duration: 0.6,
      delay: delay,
      stagger: stagger,
      ease: 'back.out(1.4)',
    }
  );
}