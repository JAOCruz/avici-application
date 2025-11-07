# Avici Application Portfolio

A custom interactive landing page built specifically for the Avici.money job application. This showcases a creative technologist's approach to building cohesive digital experiences.

## 🎯 Concept

Three distinct paths from the homepage, each with unique typography and interaction styles:
1. **The Vision** - Creative work & portfolio
2. **The Craft** - Technical capabilities
3. **The Fit** - Why Avici + Jay makes sense

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

- **Custom Cursor** - Smooth, interactive cursor with hover effects
- **Page Transitions** - GSAP-powered smooth page transitions
- **Responsive Design** - Mobile-friendly layout
- **TypeScript** - Type-safe code
- **Modern Stack** - Vite + GSAP + Vanilla TS

## 🎨 Customization

### Update Content

1. **Personal Info** - Edit `src/pages/fit.ts` for application answers
2. **Projects** - Edit `src/pages/vision.ts` to add portfolio items
3. **Skills** - Edit `src/pages/craft.ts` to update capabilities
4. **Contact** - Update email/links in `src/pages/fit.ts`

### Styling

- **Colors** - Edit CSS custom properties in `src/styles/global.css`
- **Fonts** - Change Google Fonts in `index.html`
- **Animations** - Adjust GSAP timings in page `init()` functions

## 🔧 Tech Stack

- **Vite** - Lightning-fast build tool
- **TypeScript** - Type safety
- **GSAP** - Professional-grade animations
- **Locomotive Scroll** - Smooth scrolling (optional)
- **CSS Custom Properties** - Maintainable theming

## 📝 Next Steps

1. Add real portfolio images to `/public` folder
2. Link actual project URLs in vision page
3. Add your real email/contact info
4. Consider adding:
   - Real portfolio images
   - Video embeds for projects
   - SoundCloud/audio players for music
   - Case study pages
   - About section with photos

## 🎭 Typography Personality

- **Home** - Bold, sans-serif, modern
- **Vision** - Display serif accents, elegant
- **Craft** - Monospace code hints, technical
- **Fit** - Clean, professional, confident

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

This landing page demonstrates the exact capability being proposed: creating cohesive, interactive brand experiences where design, code, and storytelling converge into one unified vision.

---

Built with ❤️ for Avici.money
# avici-application
