import { gsap } from 'gsap';
import { slideUpReveal, glitchText, scaleIn } from '../utils/textAnimations';

export default function home() {
  return `
    <div class="home-page">
      <header class="home-header">
        <div class="logo">JAY</div>
        <div class="tagline">CREATIVE TECHNOLOGIST</div>
      </header>

      <main class="home-main">
        <div class="hero-text">
          <h1 class="hero-title">
            <span class="line">Building</span>
            <span class="line">experiences that</span>
            <span class="line accent">make sense</span>
          </h1>
        </div>

        <nav class="home-nav">
          <a href="/vision" class="nav-item interactive" data-route="vision">
            <span class="nav-number">01</span>
            <h2 class="nav-title">The Vision</h2>
            <p class="nav-description">Creative work & portfolio</p>
          </a>

          <a href="/craft" class="nav-item interactive" data-route="craft">
            <span class="nav-number">02</span>
            <h2 class="nav-title">The Craft</h2>
            <p class="nav-description">Technical capabilities</p>
          </a>

          <a href="/fit" class="nav-item interactive" data-route="fit">
            <span class="nav-number">03</span>
            <h2 class="nav-title">The Fit</h2>
            <p class="nav-description">Why Avici + Jay</p>
          </a>
        </nav>
      </main>

      <footer class="home-footer">
        <p>Application for Avici.money — Nov 2025</p>
      </footer>
    </div>
  `;
}

export function init() {
  // Animate hero text with slide up
  const lines = document.querySelectorAll('.hero-title .line');
  slideUpReveal(lines as any, 0.2);

  // Scale in nav items
  const navItems = document.querySelectorAll('.nav-item');
  scaleIn(navItems as any, 0.8, 0.15);

  // Add glitch effect to nav titles on hover
  document.querySelectorAll('.nav-title').forEach((title) => {
    glitchText(title as HTMLElement);
  });

  // Setup navigation
  navItems.forEach((item) => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const route = (item as HTMLElement).dataset.route as any;
      (window as any).router.navigate(route);
    });
  });

  // Hover effects on nav items
  navItems.forEach((item) => {
    const title = item.querySelector('.nav-title');

    item.addEventListener('mouseenter', () => {
      gsap.to(title, {
        x: 20,
        duration: 0.3,
        ease: 'power2.out',
      });
    });

    item.addEventListener('mouseleave', () => {
      gsap.to(title, {
        x: 0,
        duration: 0.3,
        ease: 'power2.out',
      });
    });
  });
}