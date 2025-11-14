import type { Feature, Selection, OptionFeature } from '../utils/pricing';
import { formatCurrency, isFixedFeature, isOptionFeature } from '../utils/pricing';
import { audioDemoMarkup, bindAudioDemo } from './AudioDemo';
import { t, translateFeature } from '../utils/i18n';

const toggleClass = (element: Element, className: string, force?: boolean) => {
  if (force === undefined) {
    element.classList.toggle(className);
  } else if (force) {
    element.classList.add(className);
  } else {
    element.classList.remove(className);
  }
};

const renderFixedPrice = (price: number) => `
  <div class="feature-card__price">
    <span>${formatCurrency(price)}</span>
  </div>
`;

const renderOptionPricing = (feature: OptionFeature, selectedOptionId?: string) => {
  const selected =
    (selectedOptionId && feature.options.find((option) => option.id === selectedOptionId)) ||
    (feature.defaultOptionId && feature.options.find((option) => option.id === feature.defaultOptionId));

  let optionLabel = selected ? selected.label : '';
  if (selected) {
    const translatedOptions = translateFeature(feature.id, 'options');
    if (translatedOptions && typeof translatedOptions === 'object' && !Array.isArray(translatedOptions)) {
      const translated = (translatedOptions as Record<string, string>)[selected.id];
      if (translated) optionLabel = translated;
    }
  }

  return `
    <div class="feature-card__price">
      ${selected ? `<span>${formatCurrency(selected.price)}</span>` : ''}
      <small>${selected ? optionLabel : t('common.selectAnOption')}</small>
    </div>
  `;
};

const renderOptionList = (
  feature: OptionFeature,
  selectedOptionId: string | undefined,
  featureId: string
) => {
  const translatedOptionsRaw = translateFeature(featureId, 'options');
  const translatedOptions = (translatedOptionsRaw && typeof translatedOptionsRaw === 'object' && !Array.isArray(translatedOptionsRaw))
    ? translatedOptionsRaw as Record<string, string>
    : null;
  
  return `
  <fieldset class="feature-card__options" data-option-group="${featureId}">
    ${feature.options
      .map(
        (option) => {
          const translatedLabel = translatedOptions?.[option.id] || option.label;
          return `
          <label class="feature-card__option">
            <input
              type="radio"
              name="feature-${featureId}"
              value="${option.id}"
              ${selectedOptionId === option.id ? 'checked' : ''}
              data-option-id="${option.id}"
            />
            <span class="option-meta">
              <span class="option-label">${translatedLabel}</span>
              <span class="option-price">${formatCurrency(option.price)}</span>
            </span>
          </label>
        `;
        }
      )
      .join('')}
  </fieldset>
`;
};

const renderHighlights = (featureId: string, highlights?: string[]) => {
  if (!highlights || !highlights.length) return '';
  const translatedHighlights = translateFeature(featureId, 'highlights');
  // Ensure we have an array - translateFeature might return a string if translation doesn't exist
  const items = Array.isArray(translatedHighlights) && translatedHighlights.length > 0 
    ? translatedHighlights 
    : highlights;
  return `<ul class="feature-card__highlights">
        ${items.map((item) => `<li>${item}</li>`).join('')}
      </ul>`;
};

export const featureCardMarkup = (
  feature: Feature,
  selection: Selection | undefined
) => {
  const isSelected = Boolean(selection);
  const selectedOptionId = selection?.optionId;
  const translatedName = translateFeature(feature.id, 'name');
  const translatedDescription = translateFeature(feature.id, 'description');
  const name = (typeof translatedName === 'string' ? translatedName : null) || feature.name;
  const description = (typeof translatedDescription === 'string' ? translatedDescription : null) || feature.description;
  const highlightsMarkup = renderHighlights(feature.id, feature.highlights);
  const demoMarkup =
    feature.demo === 'audio' ? `<div class="feature-card__demo">${audioDemoMarkup(feature.id)}</div>` : '';
  const optionMarkup = isOptionFeature(feature)
    ? renderOptionList(feature, selectedOptionId, feature.id)
    : '';
  const detailContent = `${highlightsMarkup}${optionMarkup}${demoMarkup}`;
  const hasDetails = Boolean(detailContent.trim());
  const detailsInitiallyHidden = !isOptionFeature(feature);

  return `
    <article
      class="feature-card ${isSelected ? 'selected' : ''} ${isOptionFeature(feature) ? 'feature-card--options' : ''}"
      data-feature-id="${feature.id}"
      ${isFixedFeature(feature) && feature.required ? 'data-required="true"' : ''}
    >
      <div class="feature-card__top">
        <div>
          <h3 class="feature-card__title">${name}</h3>
          <p class="feature-card__description">${description}</p>
        </div>
        ${
          isFixedFeature(feature)
            ? renderFixedPrice(feature.price)
            : renderOptionPricing(feature, selectedOptionId)
        }
      </div>

      <div class="feature-card__controls">
        ${
          isFixedFeature(feature)
            ? `<button
                class="feature-card__checkbox"
                type="button"
                role="checkbox"
                aria-checked="${isSelected}"
                ${feature.required ? 'disabled' : ''}
              >
                <span class="checkbox-box" aria-hidden="true">
                  <svg class="checkbox-icon" viewBox="0 0 14 10">
                    <path d="M1 5L5 9L13 1" />
                  </svg>
                </span>
                <span class="checkbox-label">${feature.required ? t('common.included') : isSelected ? t('common.remove') : t('common.addToBuild')}</span>
              </button>`
            : `<button
                class="feature-card__toggle"
                type="button"
                aria-expanded="${isSelected}"
              >
                <span>${isSelected ? t('common.selected') : t('common.chooseOption')}</span>
                <span class="icon">${isSelected ? '-' : '+'}</span>
              </button>`
        }
        ${
          !isOptionFeature(feature) && hasDetails
            ? `<button class="feature-card__details-button interactive" type="button" aria-expanded="false">
                 <span>${t('common.details')}</span>
                 <span class="icon">+</span>
               </button>`
            : ''
        }
      </div>

      ${
        hasDetails
          ? `<div class="feature-card__details ${!detailsInitiallyHidden ? 'open' : ''}" ${
              detailsInitiallyHidden ? 'hidden' : ''
            }>${detailContent}</div>`
          : ''
      }
    </article>
  `;
};

export const updateFeatureSelectionState = (
  card: HTMLElement,
  selection: Selection | undefined,
  getFeature: (id: string) => Feature | undefined
) => {
  const isSelected = Boolean(selection);
  toggleClass(card, 'selected', isSelected);

  const featureId = card.dataset.featureId!;
  const feature = getFeature(featureId);

  if (!feature) return;

  if (isFixedFeature(feature)) {
    const checkbox = card.querySelector<HTMLButtonElement>('.feature-card__checkbox');
    if (checkbox) {
      checkbox.setAttribute('aria-checked', String(isSelected));
      const label = checkbox.querySelector<HTMLElement>('.checkbox-label');
      if (label && !checkbox.disabled) {
        label.textContent = isSelected ? t<string>('common.remove') : t<string>('common.addToBuild');
      }
    }
  } else if (isOptionFeature(feature)) {
    const toggle = card.querySelector<HTMLButtonElement>('.feature-card__toggle');
    const details = card.querySelector<HTMLElement>('.feature-card__details');
    const price = card.querySelector<HTMLElement>('.feature-card__price');

    if (toggle) {
      toggle.setAttribute('aria-expanded', String(isSelected));
      const icon = toggle.querySelector('.icon');
      if (icon) icon.textContent = isSelected ? '-' : '+';
      const text = toggle.querySelector('span');
      if (text) text.textContent = isSelected ? t<string>('common.selected') : t<string>('common.chooseOption');
    }

    if (details) {
      details.hidden = !isSelected;
      toggleClass(details, 'open', isSelected);
    }

    if (price) {
      const selectedOption =
        (selection?.optionId && feature.options.find((option) => option.id === selection.optionId)) ||
        (feature.defaultOptionId && feature.options.find((option) => option.id === feature.defaultOptionId));
      const translatedOptionsRaw = translateFeature(feature.id, 'options');
      const translatedOptions = (translatedOptionsRaw && typeof translatedOptionsRaw === 'object' && !Array.isArray(translatedOptionsRaw))
        ? translatedOptionsRaw as Record<string, string>
        : null;
      const translatedLabel = selectedOption 
        ? (translatedOptions?.[selectedOption.id] || selectedOption.label) 
        : '';
      price.innerHTML = `
        <span>${selectedOption ? formatCurrency(selectedOption.price) : ''}</span>
        <small>${selectedOption ? translatedLabel : t('common.selectAnOption')}</small>
      `;
      const optionInputs = card.querySelectorAll<HTMLInputElement>('input[type="radio"][data-option-id]');
      optionInputs.forEach((input) => {
        input.checked = selectedOption ? input.dataset.optionId === selectedOption.id : false;
        // Update label text
        const labelSpan = input.closest('label')?.querySelector('.option-label');
        if (labelSpan) {
          const option = feature.options.find(opt => opt.id === input.dataset.optionId);
          if (option) {
            labelSpan.textContent = translatedOptions?.[option.id] || option.label;
          }
        }
      });
    }
    details?.querySelectorAll<HTMLElement>('[data-audio-demo-root]').forEach((demoRoot) => {
      bindAudioDemo(demoRoot);
    });
  }
};

export const bindFeatureCard = (
  card: HTMLElement,
  callbacks: {
    onToggleFixed: (featureId: string) => void;
    onToggleOption: (featureId: string) => void;
    onSelectOption: (featureId: string, optionId: string) => void;
  }
) => {
  const featureId = card.dataset.featureId!;
  const checkbox = card.querySelector<HTMLButtonElement>('.feature-card__checkbox');
  const toggle = card.querySelector<HTMLButtonElement>('.feature-card__toggle');
  const options = card.querySelectorAll<HTMLInputElement>('input[type="radio"][data-option-id]');
  const detailToggle = card.querySelector<HTMLButtonElement>('.feature-card__details-button');
  const details = card.querySelector<HTMLElement>('.feature-card__details');
  const bindDemos = () => {
    details?.querySelectorAll<HTMLElement>('[data-audio-demo-root]').forEach((demoRoot) => {
      bindAudioDemo(demoRoot);
    });
  };

  if (details) {
    bindDemos();
  }

  if (checkbox) {
    const isRequired = card.dataset.required === 'true';
    const handleToggle = () => {
      if (!isRequired) callbacks.onToggleFixed(featureId);
    };

    checkbox.addEventListener('click', (event) => {
      event.stopPropagation();
      handleToggle();
    });

    checkbox.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleToggle();
      }
    });
  }

  if (toggle) {
    toggle.addEventListener('click', (event) => {
      event.stopPropagation();
      callbacks.onToggleOption(featureId);
    });
  }

  options.forEach((input) => {
    input.addEventListener('change', (event) => {
      const selectedOptionId = (event.target as HTMLInputElement).dataset.optionId;
      if (selectedOptionId) {
        callbacks.onSelectOption(featureId, selectedOptionId);
      }
    });
  });

  if (detailToggle && details) {
    const setDetailsOpen = (open: boolean) => {
      detailToggle.setAttribute('aria-expanded', String(open));
      const icon = detailToggle.querySelector('.icon');
      if (icon) icon.textContent = open ? '-' : '+';
      details.hidden = !open;
      toggleClass(details, 'open', open);
      if (open) {
        bindDemos();
      }
    };

    detailToggle.addEventListener('click', () => {
      const expanded = detailToggle.getAttribute('aria-expanded') === 'true';
      setDetailsOpen(!expanded);
    });
  }
};

