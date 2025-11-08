import { gsap } from 'gsap';
import { scrambleReveal, charByChar, fadeInBlur } from '../utils/textAnimations';

export default function craft() {
  return `
    <div class="craft-page">
      <nav class="page-nav">
        <a href="/" class="back-button interactive" data-route="home">
          <span>←</span> Back
        </a>
        <div class="page-title">The Craft</div>
      </nav>

      <main class="craft-content">
        <section class="intro-section">
          <h1 class="page-heading">
            <span class="line">Full-stack</span>
            <span class="line accent">creative</span>
          </h1>
        </section>

        <section class="skills-grid">
          <div class="skill-category">
            <h3 class="category-title">Visual Design</h3>
            <ul class="skill-list">
              <li>Adobe Illustrator</li>
              <li>Photoshop</li>
              <li>Brand Identity</li>
              <li>UI/UX Design</li>
            </ul>
          </div>

          <div class="skill-category">
            <h3 class="category-title">Motion & Video</h3>
            <ul class="skill-list">
              <li>Premiere Pro</li>
              <li>After Effects</li>
              <li>Motion Graphics</li>
              <li>Video Editing</li>
            </ul>
          </div>

          <div class="skill-category">
            <h3 class="category-title">Sound Design</h3>
            <ul class="skill-list">
              <li>Ableton Live</li>
              <li>Music Production</li>
              <li>Sound for Web</li>
              <li>Spatial Audio</li>
            </ul>
          </div>

          <div class="skill-category">
            <h3 class="category-title">Development</h3>
            <ul class="skill-list">
              <li>TypeScript / JavaScript</li>
              <li>React / Vue</li>
              <li>GSAP / Three.js</li>
              <li>Interactive Experiences</li>
            </ul>
          </div>
        </section>

        <section class="process-section">
          <h2>How I Work</h2>
          <p class="process-text">
            I start with the concept—what's the core idea? Then I build everything 
            around that thread: the visual language, the interactions, the sound, 
            the code. Every element serves the vision.
          </p>
        </section>
      </main>
    </div>
  `;
}

export function init() {
  // Scramble reveal for main heading
  const lines = document.querySelectorAll('.page-heading .line');
  lines.forEach((line, i) => {
    setTimeout(() => {
      scrambleReveal(line as HTMLElement, 0);
    }, i * 200);
  });

  // Fade in skill categories
  const categories = document.querySelectorAll('.skill-category');
  fadeInBlur(categories as any, 0.6, 0.15);

  // Character by character for process text
  setTimeout(() => {
    const processText = document.querySelector('.process-text') as HTMLElement;
    if (processText) charByChar(processText, 0);
  }, 1800);

  const backButton = document.querySelector('[data-route="home"]');
  backButton?.addEventListener('click', (e) => {
    e.preventDefault();
    (window as any).router.navigate('home');
  });

  // Refresh cursor for new elements
  if ((window as any).cursor) {
    (window as any).cursor.refresh();
  }
}