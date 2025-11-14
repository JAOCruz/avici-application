import { fadeInBlur, slideUpReveal } from '../utils/textAnimations';
import { t } from '../utils/i18n';

const getProjects = () => [
  {
    id: 'phase-one',
    title: t('portfolio.projects.phaseOne.title'),
    description: t('portfolio.projects.phaseOne.description'),
    tags: t('portfolio.projects.phaseOne.tags', { returnObjects: true }) as string[],
    asset: '/act_1.png',
  },
  {
    id: 'phase-two',
    title: t('portfolio.projects.phaseTwo.title'),
    description: t('portfolio.projects.phaseTwo.description'),
    tags: t('portfolio.projects.phaseTwo.tags', { returnObjects: true }) as string[],
    asset: '/act_2.png',
  },
  {
    id: 'phase-three',
    title: t('portfolio.projects.phaseThree.title'),
    description: t('portfolio.projects.phaseThree.description'),
    tags: t('portfolio.projects.phaseThree.tags', { returnObjects: true }) as string[],
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
  const projects = getProjects();

  return `
    <div class="portfolio-page">
      <nav class="page-nav">
        <a href="/" class="back-button interactive" data-route="home">
          <span>←</span> ${t('common.back')}
        </a>
        <div class="page-title">${t('portfolio.title')}</div>
      </nav>

      <main class="portfolio-content">
        <section class="intro-section">
          <h1 class="page-heading">
            <span class="line">${t('portfolio.hero.line1')}</span>
            <span class="line accent">${t('portfolio.hero.line2')}</span>
          </h1>
          <p class="lead-text">
            ${t('portfolio.lead')}
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
                    <button class="project-link interactive" type="button">${t('portfolio.projects.requestPlaybook')}</button>
                  </div>
                </article>
              `
            )
            .join('')}
        </section>

        <section class="portfolio-links">
          <h2>${t('portfolio.links.title')}</h2>
          <p>${t('portfolio.links.description')}</p>
          <div class="portfolio-links-grid">
            ${projectLinks
              .map(
                (project) => `
                  <a href="${project.url}" class="portfolio-link-card interactive" target="_blank" rel="noopener noreferrer">
                    <div class="portfolio-link-meta">
                      <span class="portfolio-link-title">${project.title}</span>
                      <span class="portfolio-link-action">${t('portfolio.links.visitProject')}</span>
                    </div>
                  </a>
                `
              )
              .join('')}
          </div>
        </section>

        <section class="portfolio-cta">
          <h2>${t('portfolio.cta.title')}</h2>
          <p>${t('portfolio.cta.description')}</p>
          <button class="cta-button interactive" type="button" data-route-contact>
            ${t('portfolio.cta.button')}
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

  // Listen for language changes
  window.addEventListener('languageChanged', () => {
    // Re-render page content by forcing navigation to current route
    const router = (window as any).router;
    if (router) {
      const currentRoute = router.getCurrentRoute();
      router.navigate(currentRoute, false, true); // force re-render
    }
  });
}

