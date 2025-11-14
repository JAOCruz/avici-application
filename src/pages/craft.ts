import { scrambleReveal, charByChar, fadeInBlur } from '../utils/textAnimations';
import { t } from '../utils/i18n';

export default function craft() {
  const coreStackItems = (t('craft.skills.coreStack.items', { returnObjects: true }) as string[]).map(item => `<li>${item}</li>`).join('');
  const experienceItems = (t('craft.skills.experienceLayer.items', { returnObjects: true }) as string[]).map(item => `<li>${item}</li>`).join('');
  const productItems = (t('craft.skills.productFeatures.items', { returnObjects: true }) as string[]).map(item => `<li>${item}</li>`).join('');
  const deliveryItems = (t('craft.skills.deliveryOps.items', { returnObjects: true }) as string[]).map(item => `<li>${item}</li>`).join('');

  return `
    <div class="craft-page">
      <nav class="page-nav">
        <a href="/" class="back-button interactive" data-route="home">
          <span>←</span> ${t('common.back')}
        </a>
        <div class="page-title">${t('craft.title')}</div>
      </nav>

      <main class="craft-content">
        <section class="intro-section">
          <h1 class="page-heading">
            <span class="line">${t('craft.hero.line1')}</span>
            <span class="line accent">${t('craft.hero.line2')}</span>
          </h1>
        </section>

        <section class="skills-grid">
          <div class="skill-category">
            <h3 class="category-title">${t('craft.skills.coreStack.title')}</h3>
            <ul class="skill-list">
              ${coreStackItems}
            </ul>
          </div>

          <div class="skill-category">
            <h3 class="category-title">${t('craft.skills.experienceLayer.title')}</h3>
            <ul class="skill-list">
              ${experienceItems}
            </ul>
          </div>

          <div class="skill-category">
            <h3 class="category-title">${t('craft.skills.productFeatures.title')}</h3>
            <ul class="skill-list">
              ${productItems}
            </ul>
          </div>

          <div class="skill-category">
            <h3 class="category-title">${t('craft.skills.deliveryOps.title')}</h3>
            <ul class="skill-list">
              ${deliveryItems}
            </ul>
          </div>
        </section>

        <section class="process-section">
          <h2>${t('craft.process.title')}</h2>
          <p class="process-text">
            ${t('craft.process.description')}
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