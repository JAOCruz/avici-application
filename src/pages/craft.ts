import { gsap } from 'gsap';
import { t } from '../utils/i18n';

export default function craft() {
  const categories = [
    {
      key: 'coreStack',
      title: t('craft.skills.coreStack.title'),
      items: t('craft.skills.coreStack.items', { returnObjects: true }) as string[]
    },
    {
      key: 'experienceLayer',
      title: t('craft.skills.experienceLayer.title'),
      items: t('craft.skills.experienceLayer.items', { returnObjects: true }) as string[]
    },
    {
      key: 'productFeatures',
      title: t('craft.skills.productFeatures.title'),
      items: t('craft.skills.productFeatures.items', { returnObjects: true }) as string[]
    },
    {
      key: 'deliveryOps',
      title: t('craft.skills.deliveryOps.title'),
      items: t('craft.skills.deliveryOps.items', { returnObjects: true }) as string[]
    }
  ];

  return `
    <div class="craft-page">
      <header class="craft-header-fixed">
        <a href="/" class="back-link interactive" data-route="home">
          <span>←</span> ${t('common.back')}
        </a>
      </header>

      <main class="craft-content">
        <div class="craft-hero">
          <h2 class="craft-title-main">${t('craft.hero.line1')}</h2>
          <h2 class="craft-title-sub">${t('craft.hero.line2')}</h2>
        </div>

        <section class="categories-grid">
          ${categories.map((cat) => `
            <div class="cat-column">
              <h3 class="cat-title">${cat.title}</h3>
              <ul class="cat-list">
                ${cat.items.map(item => `
                  <li class="cat-item">${item}</li>
                `).join('')}
              </ul>
            </div>
          `).join('')}
        </section>
      </main>

    </div>
  `;
}

export function init() {
  // Animate blurred titles
  gsap.to('.craft-title-main', {
    filter: 'blur(0px)',
    opacity: 1,
    duration: 1.2,
    ease: 'power3.out'
  });

  gsap.to('.craft-title-sub', {
    filter: 'blur(0px)',
    opacity: 1,
    duration: 1.2,
    delay: 0.2,
    ease: 'power3.out'
  });

  // Animate categories stagger
  gsap.from('.cat-column', {
    x: -30,
    opacity: 0,
    duration: 0.8,
    stagger: 0.1,
    delay: 0.5,
    ease: 'power2.out'
  });

  // Setup navigation
  const backButton = document.querySelector('[data-route="home"]');
  backButton?.addEventListener('click', (e) => {
    e.preventDefault();
    (window as any).router.navigate('home');
  });

  // Refresh cursor
  if ((window as any).cursor) {
    (window as any).cursor.refresh();
  }
}