import { scrambleReveal, charByChar, fadeInBlur } from '../utils/textAnimations';

export default function craft() {
  return `
    <div class="craft-page">
      <nav class="page-nav">
        <a href="/" class="back-button interactive" data-route="home">
          <span>←</span> Back
        </a>
        <div class="page-title">Services</div>
      </nav>

      <main class="craft-content">
        <section class="intro-section">
          <h1 class="page-heading">
            <span class="line">Full-stack</span>
            <span class="line accent">web engineer</span>
          </h1>
        </section>

        <section class="skills-grid">
          <div class="skill-category">
            <h3 class="category-title">Core Stack</h3>
            <ul class="skill-list">
              <li>TypeScript-first architecture</li>
              <li>Vite, Astro, Next.js</li>
              <li>React / Vue component systems</li>
              <li>Node, Express, Supabase</li>
            </ul>
          </div>

          <div class="skill-category">
            <h3 class="category-title">Experience Layer</h3>
            <ul class="skill-list">
              <li>GSAP motion choreography</li>
              <li>Scroll-triggered storytelling</li>
              <li>3D & WebGL moments</li>
              <li>Micro-interactions with intent</li>
            </ul>
          </div>

          <div class="skill-category">
            <h3 class="category-title">Product Features</h3>
            <ul class="skill-list">
              <li>Pricing configurators</li>
              <li>Dynamic content management</li>
              <li>Payment integrations</li>
              <li>User accounts & gating</li>
            </ul>
          </div>

          <div class="skill-category">
            <h3 class="category-title">Delivery Ops</h3>
            <ul class="skill-list">
              <li>Performance & accessibility budgets</li>
              <li>Automated analytics + events</li>
              <li>Internationalization workflows</li>
              <li>Technical documentation & handoff</li>
            </ul>
          </div>
        </section>

        <section class="process-section">
          <h2>How I Work</h2>
          <p class="process-text">
            Every build starts with clarity: business goals, user journeys, and measurable outcomes. 
            From there I engineer the system—architecture, design language, motion, and integrations—so every detail 
            pushes the project forward and is ready to scale once we launch.
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