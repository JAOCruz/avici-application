import { contactFormMarkup, bindContactForm } from '../components/ContactForm';
import { slideUpReveal, wordReveal } from '../utils/textAnimations';
import { t } from '../utils/i18n';

export default function contact() {
  const servicesItems = (t('contact.services.items', { returnObjects: true }) as string[]).map(item => `<li>${item}</li>`).join('');

  return `
    <div class="contact-page" id="contact">
      <nav class="page-nav">
        <a href="/" class="back-button interactive" data-route="home">
          <span>←</span> ${t('common.back')}
        </a>
        <div class="page-title">${t('contact.title')}</div>
      </nav>

      <main class="contact-content">
        <section class="intro-section">
          <h1 class="page-heading">
            <span class="line">${t('contact.hero.line1')}</span>
            <span class="line accent">${t('contact.hero.line2')}</span>
          </h1>
          <p class="lead-text">
            ${t('contact.lead')}
          </p>
        </section>

        <section class="contact-columns">
          <div class="contact-info">
            <div class="contact-block">
              <h2>${t('contact.directLine.title')}</h2>
              <a href="tel:+18098802016" class="contact-link interactive">809-880-2016</a>
              <a href="mailto:notmeee00@gmail.com" class="contact-link interactive">notmeee00@gmail.com</a>
            </div>
            <div class="contact-block">
              <h2>${t('contact.services.title')}</h2>
              <ul>
                ${servicesItems}
              </ul>
              <button class="contact-secondary interactive" type="button" data-route-process>
                ${t('contact.services.button')}
              </button>
            </div>
            <div class="contact-block">
              <h2>${t('contact.location.title')}</h2>
              <p>${t('contact.location.value')}</p>
            </div>
          </div>

          <div class="contact-form-wrapper">
            ${contactFormMarkup()}
          </div>
        </section>
      </main>
    </div>
  `;
}

export function init() {
  const lines = document.querySelectorAll('.page-heading .line');
  slideUpReveal(lines as any, 0.15);

  const lead = document.querySelector('.lead-text') as HTMLElement | null;
  if (lead) wordReveal(lead, 0.3);

  const backButton = document.querySelector('[data-route="home"]');
  backButton?.addEventListener('click', (event) => {
    event.preventDefault();
    (window as any).router.navigate('home');
  });

  const processButton = document.querySelector('[data-route-process]');
  processButton?.addEventListener('click', () => {
    (window as any).router.navigate('fit');
  });

  bindContactForm();

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

