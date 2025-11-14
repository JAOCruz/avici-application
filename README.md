# JAOCruz Web Pricing Configurator

An interactive experience for Juan Aulio Ortiz de la Cruz (JAOCruz)—a creative technologist and full-stack web engineer based in the Dominican Republic. The site highlights service capabilities, transparent pricing, and contact pathways for custom website builds.

## 🎯 Concept

Three core entry points guide visitors through the offering:
1. **Configurator** – Interactive pricing journey and service overview  
2. **Services** – Technical stack, motion systems, and delivery ops  
3. **Process** – How partnerships work, timelines, and direct contact details

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
src/
├── pages/          # Page components (home, vision, craft, fit)
├── styles/         # CSS modules
├── utils/          # Utilities (cursor, router)
├── components/     # Reusable components (future)
└── main.ts         # Application entry point
```

## ✨ Features
- **Interactive Pricing Story** – Three-act walkthrough of strategy, experience, and launch  
- **Custom Cursor** – Zero-lag white cursor with adaptive hover states  
- **GSAP Motion** – Decode animations, scroll reveals, and micro-interactions  
- **Responsive Layout** – Optimized for desktop, tablet, and mobile  
- **TypeScript-first** – Strict typing across pages, utils, and animations  
- **Modern Stack** – Vite + GSAP + Vanilla TypeScript

## 🎨 Customization

### Update Content

1. **Hero & Navigation** – Update `src/pages/home.ts`
2. **Configurator Story** – Edit `src/pages/vision.ts`
3. **Services & Stack** – Adjust `src/pages/craft.ts`
4. **Process & Contact** – Update `src/pages/fit.ts`
5. **Global Styles** – Modify tokens in `src/styles/global.css`

### Styling

- **Colors** - Edit CSS custom properties in `src/styles/global.css`
- **Fonts** - Change Google Fonts in `index.html`
- **Animations** - Adjust GSAP timings in page `init()` functions

## 🔧 Tech Stack

- **Vite** - Lightning-fast build tool
- **TypeScript** - Type safety
- **GSAP** - Professional-grade animations
- **CSS Custom Properties** - Maintainable theming

## 📝 Next Steps

1. Wire the interactive pricing state machine in `src/utils/pricing.ts`
2. Connect the configurator selections to a contact form (Formspark)
3. Add real project imagery and deploy-ready assets
4. Enhance summary card with live totals and animated counters
5. Implement authentication/payment add-ons as needed

## 🎭 Typography Personality

- **Home** - Bold, sans-serif, modern
- **Configurator** - Display serif accents, confident
- **Services** - Monospace hints, technical
- **Process** - Clean, professional, approachable

## 🌐 Deployment

Deploy to:
- **Vercel** - `vercel --prod`
- **Netlify** - Drag and drop `dist` folder
- **GitHub Pages** - Push `dist` to `gh-pages` branch

## 📦 Build Output

```bash
npm run build
# Output in /dist folder ready for deployment
```

## 💡 Philosophy

The experience mirrors JAOCruz's approach to client work: purposeful strategy, expressive motion, and transparent pricing backed by a robust engineering stack.

---

Built with precision for JAOCruz.com
