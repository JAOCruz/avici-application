import { fadeInBlur, slideUpReveal } from '../utils/textAnimations';

const projects = [
  {
    id: 'phase-one',
    title: 'Phase 01 · Strategy Blueprint',
    description: 'Foundational research, positioning, and content architecture built to anchor the rest of the product.',
    tags: ['Audience Mapping', 'Information Architecture', 'Product Brief'],
    asset: '/act_1.png',
  },
  {
    id: 'phase-two',
    title: 'Phase 02 · Experience Build',
    description: 'High-touch interface work with motion, audio, and custom components that translate the blueprint into screens.',
    tags: ['GSAP Systems', 'Custom Player', 'Design-to-Code'],
    asset: '/act_2.png',
  },
  {
    id: 'phase-three',
    title: 'Phase 03 · Launch & Scale',
    description: 'Operational tooling, analytics, and automation so the build stays fast post-launch and keeps shipping.',
    tags: ['Analytics Layer', 'Automation', 'CMS Ops'],
    asset: '/act_3.png',
  },
];

const projectLinks = [
  {
    title: 'Moreta.Fit',
    url: 'https://moreta.fit/',
  },
  {
    title: 'Maestro Molina',
    url: 'https://maestromolina.netlify.app/',
  },
  {
    title: 'Restaurante Atarazana',
    url: 'https://restauranteatarazana.com/',
  },
  {
    title: 'Canalaw Selection',
    url: 'https://cana.law/selection/',
  },
  {
    title: 'Moreta Inc Dashboard',
    url: 'https://app.netlify.com/projects/moretainc/overview',
  },
];

export default function portfolio() {
  return `
    <div class="portfolio-page">
      <nav class="page-nav">
        <a href="/" class="back-button interactive" data-route="home">
          <span>←</span> Back
        </a>
        <div class="page-title">Portfolio</div>
      </nav>

      <main class="portfolio-content">
        <section class="intro-section">
          <h1 class="page-heading">
            <span class="line">Recent work</span>
            <span class="line accent">built for traction</span>
          </h1>
          <p class="lead-text">
            Product launches, pricing experiences, and automation stacks delivered from strategy through scale for teams worldwide.
          </p>
        </section>

        <section class="portfolio-grid">
          ${projects
            .map(
              (project) => `
                <article class="project-card" data-project="${project.id}">
                  <div class="project-media">
                    <img src="${project.asset}" alt="${project.title}" loading="lazy" />
                  </div>
                  <div class="project-body">
                    <h3>${project.title}</h3>
                    <p>${project.description}</p>
                    <ul class="project-tags">
                      ${project.tags.map((tag) => `<li>${tag}</li>`).join('')}
                    </ul>
                    <button class="project-link interactive" type="button">Request Phase Playbook</button>
                  </div>
                </article>
              `
            )
            .join('')}
        </section>

        <section class="portfolio-links">
          <h2>Live Builds & Dashboards</h2>
          <p>Production sites, product dashboards, and marketing experiences currently in the wild.</p>
          <div class="portfolio-links-grid">
            ${projectLinks
              .map(
                (project) => `
                  <a href="${project.url}" class="portfolio-link-card interactive" target="_blank" rel="noopener noreferrer">
                    <div class="portfolio-link-meta">
                      <span class="portfolio-link-title">${project.title}</span>
                      <span class="portfolio-link-action">Visit project →</span>
                    </div>
                  </a>
                `
              )
              .join('')}
          </div>
        </section>

        <section class="portfolio-cta">
          <h2>Want a walkthrough?</h2>
          <p>Book a strategy call and I’ll show you the systems behind these builds—architecture, timelines, and results.</p>
          <button class="cta-button interactive" type="button" data-route-contact>
            Talk to JAOCruz →
          </button>
        </section>
      </main>
    </div>
  `;
}

export function init() {
  const lines = document.querySelectorAll('.page-heading .line');
  slideUpReveal(lines as any, 0.2);

  const lead = document.querySelector('.lead-text');
  if (lead) fadeInBlur([lead], 0.6, 0);

  const cards = document.querySelectorAll('.project-card');
  fadeInBlur(cards as any, 0.4, 0.2);

  const backButton = document.querySelector('[data-route="home"]');
  backButton?.addEventListener('click', (event) => {
    event.preventDefault();
    (window as any).router.navigate('home');
  });

  document.querySelectorAll('[data-route-contact], .project-link').forEach((button) => {
    button.addEventListener('click', () => {
      (window as any).router.navigate('contact');
      requestAnimationFrame(() => {
        document.querySelector('#contactForm')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  });

  if ((window as any).cursor) {
    (window as any).cursor.refresh();
  }
}

