import { gsap } from 'gsap';
import type { Feature, Selection } from '../utils/pricing';
import {
  FEATURES,
  calculateTotal,
  featureSelectionsToSummary,
  getFeatureById,
  getOptionById,
  isFixedFeature,
  isOptionFeature,
  loadSelections,
  saveSelections,
} from '../utils/pricing';
import { featureCardMarkup, bindFeatureCard, updateFeatureSelectionState } from '../components/FeatureCard';
import {
  pricingSummaryMarkup,
  renderSummaryItems,
  animateTotal,
  bindSummary,
} from '../components/PricingSummary';
import { decodeText, wordReveal } from '../utils/textAnimations';
import { t } from '../utils/i18n';

const ensureBaseFeature = (selections: Selection[]) => {
  if (!selections.some((selection) => selection.featureId === 'landing')) {
    selections.unshift({ featureId: 'landing' });
  }
};

const normalizeSelections = (selections: Selection[]) => {
  const sorted: Selection[] = [];
  FEATURES.forEach((feature) => {
    const existing = selections.find((selection) => selection.featureId === feature.id);
    if (existing) {
      sorted.push(existing);
    }
  });
  ensureBaseFeature(sorted);
  return sorted;
};

const persistSelectionsForContact = (selections: Selection[]) => {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(
      'jaocruz_pricing_summary',
      JSON.stringify({
        selections,
        summary: featureSelectionsToSummary(selections),
      })
    );
  } catch (error) {
    console.warn('[configurator] unable to persist quote summary', error);
  }
};

export default function configurator() {
  const initialSelections = normalizeSelections(
    typeof window !== 'undefined' ? loadSelections() : [{ featureId: 'landing' }]
  );
  const selectionMap = new Map(initialSelections.map((selection) => [selection.featureId, selection]));

  return `
    <div class="configurator-page" id="configurator">
      <nav class="page-nav">
        <a href="/" class="back-button interactive" data-route="home">
          <span>←</span> ${t('common.back')}
        </a>
        <div class="page-title">${t('configurator.title')}</div>
      </nav>

      <main class="configurator-content">
        <section class="configurator-hero">
          <h1 class="page-heading">
            <span class="line">${t('configurator.hero.line1')}</span>
            <span class="line accent">${t('configurator.hero.line2')}</span>
          </h1>
          <p class="lead-text">
            ${t('configurator.lead')}
          </p>
        </section>

        <section class="configurator-grid">
          <div class="configurator-features" data-feature-list>
            ${FEATURES.map((feature) =>
              featureCardMarkup(feature, selectionMap.get(feature.id))
            ).join('')}
          </div>
          <div class="configurator-summary" data-summary-root>
            ${pricingSummaryMarkup(initialSelections)}
          </div>
        </section>

        <section class="configurator-note">
          <h2>${t('configurator.pricing.title')}</h2>
          <p>
            ${t('configurator.pricing.description')}
          </p>
        </section>
      </main>
    </div>
  `;
}

export function init() {
  const heroLines = document.querySelectorAll('.page-heading .line');
  heroLines.forEach((line, index) => {
    setTimeout(() => decodeText(line as HTMLElement, 1.2), index * 200);
  });

  setTimeout(() => {
    const lead = document.querySelector('.lead-text') as HTMLElement | null;
    if (lead) wordReveal(lead, 0);
  }, 600);

  const featureList = document.querySelector<HTMLElement>('[data-feature-list]');
  const summaryRoot = document.querySelector<HTMLElement>('[data-summary-root]');
  const summaryList = summaryRoot?.querySelector<HTMLElement>('[data-summary-list]');
  const summaryTotal = summaryRoot?.querySelector<HTMLElement>('[data-summary-total]');

  if (!featureList || !summaryRoot || !summaryList || !summaryTotal) return;

  let selections: Selection[] = normalizeSelections(loadSelections());

  const renderSummary = (previousTotal: number) => {
    renderSummaryItems(summaryList, selections);
    animateTotal(summaryTotal, previousTotal, calculateTotal(selections));
  };

  const updateStorage = () => {
    selections = normalizeSelections(selections);
    saveSelections(selections);
    persistSelectionsForContact(selections);
  };

  // Animate cards on load
  gsap.fromTo(
    featureList.children,
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'power2.out' }
  );

  const updateStateForFeature = (feature: Feature) => {
    const card = featureList.querySelector<HTMLElement>(
      `.feature-card[data-feature-id="${feature.id}"]`
    );
    if (!card) return;
    const selection = selections.find((item) => item.featureId === feature.id);
    updateFeatureSelectionState(card, selection, getFeatureById);
  };

  FEATURES.forEach((feature) => updateStateForFeature(feature));

  const setSelection = (featureId: string, optionId?: string) => {
    const existingIndex = selections.findIndex((selection) => selection.featureId === featureId);
    if (existingIndex >= 0) {
      if (optionId === undefined) {
        selections.splice(existingIndex, 1);
      } else {
        selections[existingIndex] = { featureId, optionId };
      }
    } else {
      selections.push(optionId ? { featureId, optionId } : { featureId });
    }
    ensureBaseFeature(selections);
  };

  const toggleFixedFeature = (feature: Feature) => {
    if (!isFixedFeature(feature) || feature.required) return;
    const previousTotal = calculateTotal(selections);
    const existingIndex = selections.findIndex((selection) => selection.featureId === feature.id);
    if (existingIndex >= 0) {
      selections.splice(existingIndex, 1);
    } else {
      selections.push({ featureId: feature.id });
    }
    ensureBaseFeature(selections);
    updateStateForFeature(feature);
    updateStorage();
    renderSummary(previousTotal);
  };

  const toggleOptionFeature = (feature: Feature) => {
    if (!isOptionFeature(feature)) return;
    const previousTotal = calculateTotal(selections);
    const existing = selections.find((selection) => selection.featureId === feature.id);
    if (existing) {
      selections = selections.filter((selection) => selection.featureId !== feature.id);
    } else {
      const defaultOption =
        (feature.defaultOptionId && getOptionById(feature, feature.defaultOptionId)) ||
        feature.options[0];
      if (defaultOption) {
        selections.push({ featureId: feature.id, optionId: defaultOption.id });
      }
    }
    ensureBaseFeature(selections);
    updateStateForFeature(feature);
    updateStorage();
    renderSummary(previousTotal);
  };

  const selectOption = (feature: Feature, optionId: string) => {
    if (!isOptionFeature(feature)) return;
    const option = getOptionById(feature, optionId);
    if (!option) return;
    const previousTotal = calculateTotal(selections);
    setSelection(feature.id, optionId);
    updateStateForFeature(feature);
    updateStorage();
    renderSummary(previousTotal);
  };

  Array.from(featureList.querySelectorAll<HTMLElement>('.feature-card')).forEach((card) =>
    bindFeatureCard(card, {
      onToggleFixed: (featureId) => {
        const feature = getFeatureById(featureId);
        if (feature) toggleFixedFeature(feature);
      },
      onToggleOption: (featureId) => {
        const feature = getFeatureById(featureId);
        if (feature) toggleOptionFeature(feature);
      },
      onSelectOption: (featureId, optionId) => {
        const feature = getFeatureById(featureId);
        if (feature) selectOption(feature, optionId);
      },
    })
  );

  bindSummary(summaryRoot, {
    onRequestQuote: () => {
      persistSelectionsForContact(selections);
      (window as any).router.navigate('contact');
      requestAnimationFrame(() => {
        const contactForm = document.querySelector<HTMLFormElement>('#contactForm');
        if (contactForm) {
          contactForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    },
  });

  // Persist current selections for contact page load
  persistSelectionsForContact(selections);
  renderSummary(calculateTotal(selections));

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

