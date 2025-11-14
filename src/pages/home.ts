import { gsap } from 'gsap';
import { slideUpReveal, glitchText, scaleIn } from '../utils/textAnimations';

export default function home() {
  return `
    <div class="home-page">
      <header class="home-header">
        <div class="logo">JAOCruz</div>
        <div class="tagline">CREATIVE TECHNOLOGIST · DOMINICAN REPUBLIC</div>
      </header>

      <main class="home-main">
        <div class="hero-text">
          <h1 class="hero-title">
            <span class="line">Websites built</span>
            <span class="line">for global brands</span>
            <span class="line accent">with momentum</span>
          </h1>
        </div>

        <nav class="home-nav">
          <a href="/configurator" class="nav-item interactive" data-route="configurator">
            <span class="nav-number">01</span>
            <h2 class="nav-title">Configurator</h2>
            <p class="nav-description">Interactive pricing for custom builds</p>
          </a>

          <a href="/craft" class="nav-item interactive" data-route="craft">
            <span class="nav-number">02</span>
            <h2 class="nav-title">Services</h2>
            <p class="nav-description">Stack, product features, and delivery ops</p>
          </a>

          <a href="/portfolio" class="nav-item interactive" data-route="portfolio">
            <span class="nav-number">03</span>
            <h2 class="nav-title">Portfolio</h2>
            <p class="nav-description">Recent launches and case studies</p>
          </a>

          <a href="/contact" class="nav-item interactive" data-route="contact">
            <span class="nav-number">04</span>
            <h2 class="nav-title">Contact</h2>
            <p class="nav-description">Start a project or request a walkthrough</p>
          </a>
        </nav>
      </main>

      <footer class="home-footer">
        <p>Juan Aulio Ortiz de la Cruz · Worldwide · notmeee00@gmail.com</p>
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