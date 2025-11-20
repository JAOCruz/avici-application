import { gsap } from 'gsap';
import { slideUpReveal, glitchText, scaleIn } from '../utils/textAnimations';
import { t } from '../utils/i18n';

export default function home() {
  return `
    <div class="home-page">
      <header class="home-header">
        <div class="logo">${t('home.logo')}</div>
        <div class="tagline">${t('home.tagline')}</div>
      </header>

      <main class="home-main">
        <div class="hero-text">
          <h1 class="hero-title">
            <span class="line">${t('home.hero.line1')}</span>
            <span class="line">${t('home.hero.line2')}</span>
            <span class="line accent">${t('home.hero.line3')}</span>
          </h1>
        </div>

        <nav class="home-nav">
          <a href="/craft" class="nav-item nav-item-video interactive" data-route="craft">
            <video 
              class="nav-video" 
              loop 
              muted 
              playsinline
              disablePictureInPicture
              preload="auto"
            >
              <source src="/services1.webm" type="video/webm">
            </video>
            <div class="video-overlay">
              <span class="nav-number">${t('home.nav.services.number')}</span>
              <h2 class="nav-title">${t('home.nav.services.title')}</h2>
              <p class="nav-description">${t('home.nav.services.description')}</p>
            </div>
          </a>

          <a href="/portfolio" class="nav-item nav-item-video interactive" data-route="portfolio">
            <video 
              class="nav-video" 
              loop 
              muted 
              playsinline
              disablePictureInPicture
              preload="auto"
            >
              <source src="/aesthetic1.webm" type="video/webm">
            </video>
            <div class="video-overlay">
              <span class="nav-number">${t('home.nav.portfolio.number')}</span>
              <h2 class="nav-title">${t('home.nav.portfolio.title')}</h2>
              <p class="nav-description">${t('home.nav.portfolio.description')}</p>
            </div>
          </a>

          <a href="/contact" class="nav-item nav-item-video interactive" data-route="contact">
            <video 
              class="nav-video" 
              loop 
              muted 
              playsinline
              disablePictureInPicture
              preload="auto"
            >
              <source src="/telephone1.webm" type="video/webm">
            </video>
            <div class="video-overlay">
              <span class="nav-number">${t('home.nav.contact.number')}</span>
              <h2 class="nav-title">${t('home.nav.contact.title')}</h2>
              <p class="nav-description">${t('home.nav.contact.description')}</p>
            </div>
          </a>

        </nav>
      </main>

      <footer class="home-footer">
        <p>${t('home.footer')}</p>
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
  const linkItems = document.querySelectorAll('.nav-item[data-route]');
  linkItems.forEach((item) => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const route = (item as HTMLElement).dataset.route as any;
      (window as any).router.navigate(route);
    });
  });

  // Video hover play/pause - for first 3 boxes
  const hoverVideos = document.querySelectorAll('.nav-item-video:not(.nav-item-autoplay)');
  hoverVideos.forEach((item) => {
    const video = item.querySelector('.nav-video') as HTMLVideoElement;
    const title = item.querySelector('.nav-title');
    
    if (!video) return;

    item.addEventListener('mouseenter', () => {
      video.play();
      
      if (title) {
        gsap.to(title, {
          x: 20,
          duration: 0.3,
          ease: 'power2.out',
        });
      }
    });

    item.addEventListener('mouseleave', () => {
      video.pause();
      video.currentTime = 0;
      
      if (title) {
        gsap.to(title, {
          x: 0,
          duration: 0.3,
          ease: 'power2.out',
        });
      }
    });
  });

  // 4th box - always playing with hover effect
  const autoplayItem = document.querySelector('.nav-item-autoplay');
  if (autoplayItem) {
    const video = autoplayItem.querySelector('.nav-video') as HTMLVideoElement;
    const title = autoplayItem.querySelector('.nav-title');
    
    if (video) {
      video.play().catch(() => {
        // Autoplay was prevented
      });
    }

    if (title) {
      autoplayItem.addEventListener('mouseenter', () => {
        gsap.to(title, {
          x: 20,
          duration: 0.3,
          ease: 'power2.out',
        });
      });

      autoplayItem.addEventListener('mouseleave', () => {
        gsap.to(title, {
          x: 0,
          duration: 0.3,
          ease: 'power2.out',
        });
      });
    }
  }

  // Listen for language changes
  window.addEventListener('languageChanged', () => {
    const router = (window as any).router;
    if (router) {
      const currentRoute = router.getCurrentRoute();
      router.navigate(currentRoute, false, true);
    }
  });
}