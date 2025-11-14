import { changeLanguage, getCurrentLanguage } from '../utils/i18n';

export const languageSwitcherMarkup = () => {
  const currentLang = getCurrentLanguage();
  
  return `
    <div class="language-switcher" data-language-switcher>
      <button 
        class="language-switcher__button interactive ${currentLang === 'en' ? 'active' : ''}" 
        type="button" 
        data-lang="en"
        aria-label="Switch to English"
      >
        EN
      </button>
      <button 
        class="language-switcher__button interactive ${currentLang === 'es' ? 'active' : ''}" 
        type="button" 
        data-lang="es"
        aria-label="Switch to Spanish"
      >
        ES
      </button>
    </div>
  `;
};

export const bindLanguageSwitcher = (container: HTMLElement) => {
  const buttons = container.querySelectorAll<HTMLButtonElement>('[data-lang]');
  
  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const lang = button.dataset.lang;
      if (lang) {
        changeLanguage(lang);
        // Trigger a custom event to notify pages to re-render
        window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
        // Update active state
        buttons.forEach((btn) => {
          btn.classList.toggle('active', btn.dataset.lang === lang);
        });
      }
    });
  });
};

