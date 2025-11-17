import { t as i18nT, translateFeature as i18nTranslateFeature } from './i18n';

type DemoType = 'audio';

export type FixedFeature = {
  kind: 'fixed';
  id: string;
  name: string;
  price: number;
  description: string;
  required?: boolean;
  highlights?: string[];
  demo?: DemoType;
};

export type OptionFeatureOption = {
  id: string;
  label: string;
  price: number;
};

export type OptionFeature = {
  kind: 'options';
  id: string;
  name: string;
  description: string;
  options: OptionFeatureOption[];
  defaultOptionId?: string;
  highlights?: string[];
  demo?: DemoType;
};

export type Feature = FixedFeature | OptionFeature;

export type Selection = {
  featureId: string;
  optionId?: string;
};

const STORAGE_KEY = 'jaocruz_pricing_selections_v2';

export const FEATURES: Feature[] = [
  {
    kind: 'fixed',
    id: 'landing',
    name: 'Landing Page',
    price: Math.round(1500 * 0.8), // 20% reduction
    description: 'Single scrolling page, up to 5 sections',
    required: true,
  },
  {
    kind: 'fixed',
    id: 'animations',
    name: 'Advanced Animations',
    price: Math.round(400 * 0.8), // 20% reduction
    description: 'Custom cursor, scroll effects, GSAP integration',
    highlights: [
      'Scene-based storytelling with GSAP',
      'Micro-interactions for conversion cues',
      'Performance budgets baked in',
    ],
  },
  {
    kind: 'fixed',
    id: 'contact-form',
    name: 'Contact Form',
    price: Math.round(150 * 0.8), // 20% reduction
    description: 'Spam protection, email notifications',
  },
  {
    kind: 'fixed',
    id: 'audio-systems',
    name: 'Audio / Media Systems',
    price: Math.round(450 * 0.8), // 20% reduction
    description: 'Custom audio player with playlists, analytics hooks, and mini-player integration',
    highlights: [
      'Modular player components with playlists',
      'Mini-player handoff + stateful resume',
      'Analytics ready (completion, skips, volume)',
    ],
    demo: 'audio',
  },
  {
    kind: 'options',
    id: 'multipage',
    name: 'Multi-Page Website',
    description: 'Pick the size of the experience',
    options: [
      { id: 'multi-3-5', label: '3-5 pages', price: Math.round(2000 * 0.8) }, // 20% reduction
      { id: 'multi-6-10', label: '6-10 pages', price: Math.round(3500 * 0.8) }, // 20% reduction
      { id: 'multi-11-15', label: '11-15 pages', price: Math.round(5000 * 0.8) }, // 20% reduction
    ],
    defaultOptionId: 'multi-3-5',
  },
  {
    kind: 'options',
    id: 'ecommerce',
    name: 'E-commerce Store',
    description: 'Choose catalog size',
    options: [
      { id: 'commerce-0-50', label: 'Up to 50 products', price: Math.round(3000 * 0.8) }, // 20% reduction
      { id: 'commerce-51-200', label: '51-200 products', price: Math.round(5000 * 0.8) }, // 20% reduction
      { id: 'commerce-201-500', label: '201-500 products', price: Math.round(8000 * 0.8) }, // 20% reduction
    ],
    defaultOptionId: 'commerce-0-50',
  },
  {
    kind: 'options',
    id: 'database',
    name: 'Backend & Database',
    description: 'Data model & API complexity',
    options: [
      { id: 'db-simple', label: 'Simple (1-2 tables)', price: Math.round(2000 * 0.8) }, // 20% reduction
      { id: 'db-medium', label: 'Medium (3-5 tables, basic API)', price: Math.round(3500 * 0.8) }, // 20% reduction
      { id: 'db-complex', label: 'Complex (6+ tables, full API)', price: Math.round(6000 * 0.8) }, // 20% reduction
    ],
    defaultOptionId: 'db-simple',
  },
  {
    kind: 'options',
    id: 'cms',
    name: 'Content Management',
    description: 'Decide how your team edits content',
    options: [
      { id: 'cms-basic', label: 'Basic editor (text/images)', price: Math.round(800 * 0.8) }, // 20% reduction
      { id: 'cms-full', label: 'Full CMS (Strapi/Payload)', price: Math.round(2000 * 0.8) }, // 20% reduction
    ],
    defaultOptionId: 'cms-basic',
  },
];

export const isFixedFeature = (feature: Feature): feature is FixedFeature =>
  feature.kind === 'fixed';

export const isOptionFeature = (feature: Feature): feature is OptionFeature =>
  feature.kind === 'options';

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);

export const getFeatureById = (id: string) => FEATURES.find((feature) => feature.id === id);

export const getOptionById = (feature: OptionFeature, optionId: string) =>
  feature.options.find((option) => option.id === optionId);

export const calculateSelectionPrice = (selection: Selection) => {
  const feature = getFeatureById(selection.featureId);
  if (!feature) return 0;
  if (isFixedFeature(feature)) return feature.price;
  const option = selection.optionId
    ? getOptionById(feature, selection.optionId)
    : feature.defaultOptionId
    ? getOptionById(feature, feature.defaultOptionId)
    : undefined;
  return option ? option.price : 0;
};

const sortSelectionsByFeature = (selections: Selection[]) => {
  const sorted: Selection[] = [];
  FEATURES.forEach((feature) => {
    const existing = selections.find((selection) => selection.featureId === feature.id);
    if (existing) sorted.push(existing);
  });
  return sorted;
};

export const loadSelections = (): Selection[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [{ featureId: 'landing' }];
    const parsed = JSON.parse(stored) as Selection[];
    const valid = parsed.filter((selection) => getFeatureById(selection.featureId));
    if (!valid.some((selection) => selection.featureId === 'landing')) {
      valid.push({ featureId: 'landing' });
    }
    return sortSelectionsByFeature(valid);
  } catch (error) {
    console.warn('[pricing] failed to read selections from storage', error);
    return [{ featureId: 'landing' }];
  }
};

export const saveSelections = (selections: Selection[]) => {
  try {
    const ensured = selections.some((selection) => selection.featureId === 'landing')
      ? selections
      : [...selections, { featureId: 'landing' }];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sortSelectionsByFeature(ensured)));
  } catch (error) {
    console.warn('[pricing] failed to persist selections', error);
  }
};

export const calculateTotal = (selections: Selection[]) =>
  selections.reduce((total, selection) => total + calculateSelectionPrice(selection), 0);

export const featureSelectionsToSummary = (selections: Selection[]) => {
  const items = selections
    .map((selection) => {
      const feature = getFeatureById(selection.featureId);
      if (!feature) return null;
      try {
        const translatedNameRaw = i18nTranslateFeature(feature.id, 'name');
        const name = (typeof translatedNameRaw === 'string' ? translatedNameRaw : null) || feature.name;
        
        if (isFixedFeature(feature)) {
          return `${name} (${formatCurrency(feature.price)})`;
        }
        const option =
          (selection.optionId && getOptionById(feature, selection.optionId)) ||
          (feature.defaultOptionId && getOptionById(feature, feature.defaultOptionId));
        if (!option) return name;
        const translatedOptionsRaw = i18nTranslateFeature(feature.id, 'options');
        const translatedOptions = (translatedOptionsRaw && typeof translatedOptionsRaw === 'object' && !Array.isArray(translatedOptionsRaw))
          ? translatedOptionsRaw as Record<string, string>
          : null;
        const optionLabel = translatedOptions?.[option.id] || option.label;
        return `${name} (${optionLabel}) (${formatCurrency(option.price)})`;
      } catch {
        // Fallback to original names if translation fails
        const name = feature.name;
        if (isFixedFeature(feature)) {
          return `${name} (${formatCurrency(feature.price)})`;
        }
        const option =
          (selection.optionId && getOptionById(feature, selection.optionId)) ||
          (feature.defaultOptionId && getOptionById(feature, feature.defaultOptionId));
        if (!option) return name;
        return `${name} (${option.label}) (${formatCurrency(option.price)})`;
      }
    })
    .filter(Boolean)
    .join(', ');

  const total = formatCurrency(calculateTotal(selections));
  try {
    const totalLabel = i18nT('common.total');
    return `${items} | ${totalLabel}: ${total}`;
  } catch {
    return `${items} | Total: ${total}`;
  }
};

