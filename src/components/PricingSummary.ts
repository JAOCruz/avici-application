import { gsap } from 'gsap';
import type { Feature, Selection } from '../utils/pricing';
import {
  calculateTotal,
  formatCurrency,
  getFeatureById,
  getOptionById,
  isFixedFeature,
  isOptionFeature,
} from '../utils/pricing';
import { t, translateFeature } from '../utils/i18n';

type SummaryCallbacks = {
  onRequestQuote: () => void;
};

export const pricingSummaryMarkup = (selections: Selection[]) => {
  const total = formatCurrency(calculateTotal(selections));

  return `
    <aside class="summary-card" aria-live="polite">
      <div class="summary-card__header">
        <span class="summary-card__label">${t('common.yourBuild')}</span>
        <div class="summary-card__total" data-summary-total>${total}</div>
      </div>
      <div class="summary-card__divider"></div>
      <ul class="summary-card__list" data-summary-list></ul>
      <button class="summary-card__cta interactive" type="button" data-summary-cta>
        ${t('common.getQuote')}
      </button>
    </aside>
  `;
};

const summaryItemMarkup = (feature: Feature, selection: Selection) => {
  if (isFixedFeature(feature)) {
    const translatedNameRaw = translateFeature(feature.id, 'name');
    const translatedName = (typeof translatedNameRaw === 'string' ? translatedNameRaw : null) || feature.name;
    return `
      <li data-summary-item="${feature.id}">
        <span>${translatedName}</span>
        <span>${formatCurrency(feature.price)}</span>
      </li>
    `;
  }
  if (isOptionFeature(feature)) {
    const option =
      (selection.optionId && getOptionById(feature, selection.optionId)) ||
      (feature.defaultOptionId && getOptionById(feature, feature.defaultOptionId));
    if (!option) return '';
    const translatedNameRaw = translateFeature(feature.id, 'name');
    const translatedName = (typeof translatedNameRaw === 'string' ? translatedNameRaw : null) || feature.name;
    const translatedOptionsRaw = translateFeature(feature.id, 'options');
    const translatedOptions = (translatedOptionsRaw && typeof translatedOptionsRaw === 'object' && !Array.isArray(translatedOptionsRaw))
      ? translatedOptionsRaw as Record<string, string>
      : null;
    const translatedLabel = translatedOptions?.[option.id] || option.label;
    return `
      <li data-summary-item="${feature.id}">
        <span>${translatedName} <small>${translatedLabel}</small></span>
        <span>${formatCurrency(option.price)}</span>
      </li>
    `;
  }
  return '';
};

export const renderSummaryItems = (container: HTMLElement, selections: Selection[]) => {
  const items = selections
    .map((selection) => {
      const feature = getFeatureById(selection.featureId);
      if (!feature) return '';
      return summaryItemMarkup(feature, selection);
    })
    .filter((item) => Boolean(item))
    .join('');

  container.innerHTML = items || `<li class="summary-card__empty">${t('common.selectAddons')}</li>`;
};

export const animateTotal = (element: HTMLElement, previousTotal: number, nextTotal: number) => {
  if (previousTotal === nextTotal) return;

  const state = { value: previousTotal };
  gsap.to(state, {
    value: nextTotal,
    duration: 0.6,
    ease: 'power2.out',
    onUpdate: () => {
      element.textContent = formatCurrency(Math.round(state.value));
    },
  });
};

export const bindSummary = (summaryRoot: HTMLElement, callbacks: SummaryCallbacks) => {
  const cta = summaryRoot.querySelector<HTMLButtonElement>('[data-summary-cta]');
  cta?.addEventListener('click', () => callbacks.onRequestQuote());
};

