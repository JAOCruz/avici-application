import { featureSelectionsToSummary, loadSelections } from '../utils/pricing';
import { t } from '../utils/i18n';

const FORM_ENDPOINT = 'https://submit-form.com/placeholder'; // Replace with real Formspark endpoint

const getStoredSummary = () => {
  if (typeof window === 'undefined') return '';
  try {
    // Always regenerate from selections to ensure current language is used
    const selections = loadSelections();
    return featureSelectionsToSummary(selections);
  } catch (error) {
    console.warn('[contact] Unable to read selections', error);
    return '';
  }
};

export const contactFormMarkup = () => {
  const summary = getStoredSummary();

  return `
    <form id="contactForm" class="contact-form" action="${FORM_ENDPOINT}" method="POST">
      <div class="form-grid">
        <label class="form-field">
          <span>${t('contact.form.name')}</span>
          <input type="text" name="name" required placeholder="${t('contact.form.name')}" />
        </label>
        <label class="form-field">
          <span>${t('contact.form.email')}</span>
          <input type="email" name="email" required placeholder="you@email.com" />
        </label>
      </div>

      <label class="form-field">
        <span>${t('contact.form.company')}</span>
        <input type="text" name="company" placeholder="${t('contact.form.companyPlaceholder')}" />
      </label>

      <label class="form-field">
        <span>${t('contact.form.projectDescription')}</span>
        <textarea name="projectDescription" rows="5" placeholder="${t('contact.form.projectDescriptionPlaceholder')}"></textarea>
      </label>

      <div class="form-field form-field--readonly">
        <span>${t('contact.form.selectedFeatures')}</span>
        <div class="selected-features" data-selected-features>${summary || t('contact.form.selectedFeaturesPlaceholder')}</div>
      </div>

      <input type="hidden" name="selectedFeatures" value="${summary.replace(/"/g, '&quot;')}" data-selected-hidden />

      <button type="submit" class="form-submit interactive">${t('contact.form.sendMessage')}</button>
    </form>
  `;
};

export const bindContactForm = () => {
  const selectedDisplay = document.querySelector<HTMLElement>('[data-selected-features]');
  const hiddenField = document.querySelector<HTMLInputElement>('[data-selected-hidden]');

  if (!selectedDisplay || !hiddenField) return;

  const updateSummary = () => {
    const summary = getStoredSummary();
    selectedDisplay.textContent = summary || t('contact.form.selectedFeaturesPlaceholder');
    // Escape quotes for HTML attribute
    hiddenField.value = summary.replace(/"/g, '&quot;');
  };

  updateSummary();

  // Update when storage changes (from configurator)
  window.addEventListener('storage', updateSummary);
  
  // Update when language changes
  window.addEventListener('languageChanged', updateSummary);
};

