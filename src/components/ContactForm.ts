import { featureSelectionsToSummary, loadSelections } from '../utils/pricing';

const FORM_ENDPOINT = 'https://submit-form.com/placeholder'; // Replace with real Formspark endpoint

const getStoredSummary = () => {
  if (typeof window === 'undefined') return '';
  try {
    const stored = sessionStorage.getItem('jaocruz_pricing_summary');
    if (!stored) {
      const selections = loadSelections();
      return featureSelectionsToSummary(selections);
    }
    const parsed = JSON.parse(stored) as { summary?: string };
    return parsed.summary || '';
  } catch (error) {
    console.warn('[contact] Unable to read stored summary', error);
    const selections = loadSelections();
    return featureSelectionsToSummary(selections);
  }
};

export const contactFormMarkup = () => {
  const summary = getStoredSummary();

  return `
    <form id="contactForm" class="contact-form" action="${FORM_ENDPOINT}" method="POST">
      <div class="form-grid">
        <label class="form-field">
          <span>Name</span>
          <input type="text" name="name" required placeholder="Your name" />
        </label>
        <label class="form-field">
          <span>Email</span>
          <input type="email" name="email" required placeholder="you@email.com" />
        </label>
      </div>

      <label class="form-field">
        <span>Company / Brand (optional)</span>
        <input type="text" name="company" placeholder="Who are we building for?" />
      </label>

      <label class="form-field">
        <span>Project Description</span>
        <textarea name="projectDescription" rows="5" placeholder="Tell me about the project, goals, and timeline."></textarea>
      </label>

      <div class="form-field form-field--readonly">
        <span>Selected Features</span>
        <div class="selected-features" data-selected-features>${summary || 'Selections will show here once you configure your build.'}</div>
      </div>

      <input type="hidden" name="selectedFeatures" value="${summary.replace(/"/g, '&quot;')}" data-selected-hidden />

      <button type="submit" class="form-submit interactive">Send Message</button>
    </form>
  `;
};

export const bindContactForm = () => {
  const selectedDisplay = document.querySelector<HTMLElement>('[data-selected-features]');
  const hiddenField = document.querySelector<HTMLInputElement>('[data-selected-hidden]');

  if (!selectedDisplay || !hiddenField) return;

  const updateSummary = () => {
    const summary = getStoredSummary();
    selectedDisplay.textContent = summary || 'Selections will show here once you configure your build.';
    hiddenField.value = summary;
  };

  updateSummary();

  window.addEventListener('storage', updateSummary);
};

