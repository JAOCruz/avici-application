import type { Feature, Selection, OptionFeature } from '../utils/pricing';
import { formatCurrency, isFixedFeature, isOptionFeature } from '../utils/pricing';
import { audioDemoMarkup, bindAudioDemo } from './AudioDemo';

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

  return `
    <div class="feature-card__price">
      ${selected ? `<span>${formatCurrency(selected.price)}</span>` : ''}
      <small>${selected ? selected.label : 'Select an option'}</small>
    </div>
  `;
};

const renderOptionList = (
  feature: OptionFeature,
  selectedOptionId: string | undefined,
  featureId: string
) => `
  <fieldset class="feature-card__options" data-option-group="${featureId}">
    ${feature.options
      .map(
        (option) => `
          <label class="feature-card__option">
            <input
              type="radio"
              name="feature-${featureId}"
              value="${option.id}"
              ${selectedOptionId === option.id ? 'checked' : ''}
              data-option-id="${option.id}"
            />
            <span class="option-meta">
              <span class="option-label">${option.label}</span>
              <span class="option-price">${formatCurrency(option.price)}</span>
            </span>
          </label>
        `
      )
      .join('')}
  </fieldset>
`;

const renderHighlights = (highlights?: string[]) =>
  highlights && highlights.length
    ? `<ul class="feature-card__highlights">
        ${highlights.map((item) => `<li>${item}</li>`).join('')}
      </ul>`
    : '';

export const featureCardMarkup = (
  feature: Feature,
  selection: Selection | undefined
) => {
  const isSelected = Boolean(selection);
  const selectedOptionId = selection?.optionId;
  const highlightsMarkup = renderHighlights(feature.highlights);
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
          <h3 class="feature-card__title">${feature.name}</h3>
          <p class="feature-card__description">${feature.description}</p>
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
                <span class="checkbox-label">${feature.required ? 'Included' : isSelected ? 'Remove' : 'Add to build'}</span>
              </button>`
            : `<button
                class="feature-card__toggle"
                type="button"
                aria-expanded="${isSelected}"
              >
                <span>${isSelected ? 'Selected' : 'Choose option'}</span>
                <span class="icon">${isSelected ? '-' : '+'}</span>
              </button>`
        }
        ${
          !isOptionFeature(feature) && hasDetails
            ? `<button class="feature-card__details-button interactive" type="button" aria-expanded="false">
                 <span>Details</span>
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
        label.textContent = isSelected ? 'Remove' : 'Add to build';
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
      if (text) text.textContent = isSelected ? 'Selected' : 'Choose option';
    }

    if (details) {
      details.hidden = !isSelected;
      toggleClass(details, 'open', isSelected);
    }

    if (price) {
      const selectedOption =
        (selection?.optionId && feature.options.find((option) => option.id === selection.optionId)) ||
        (feature.defaultOptionId && feature.options.find((option) => option.id === feature.defaultOptionId));
      price.innerHTML = `
        <span>${selectedOption ? formatCurrency(selectedOption.price) : ''}</span>
        <small>${selectedOption ? selectedOption.label : 'Select an option'}</small>
      `;
      const optionInputs = card.querySelectorAll<HTMLInputElement>('input[type="radio"][data-option-id]');
      optionInputs.forEach((input) => {
        input.checked = selectedOption ? input.dataset.optionId === selectedOption.id : false;
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

