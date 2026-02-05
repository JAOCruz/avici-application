import { gsap } from 'gsap';
import { t } from '../utils/i18n';

export default function home() {
  const getTags = (key: string) => {
    const tags = t(key, { returnObjects: true });
    return Array.isArray(tags) ? tags : [];
  };

  return `
    <div class="home-page">
      <header class="home-header">
        <div class="logo-container">
          <div class="logo-box">
            <h1 class="logo">${t('home.logo')}</h1>
          </div>
          <div class="tagline-box">
            <p class="tagline">${t('home.tagline')}</p>
          </div>
        </div>
        <nav class="header-nav">
          <a href="/portfolio" class="nav-link interactive" data-route="portfolio">${t('home.nav.digital.title')}</a>
          <a href="/craft" class="nav-link interactive" data-route="craft">${t('home.nav.systems.title')}</a>
          <a href="/contact" class="nav-link interactive" data-route="contact">${t('home.nav.contact.title')}</a>
        </nav>
      </header>

      <main class="home-main">
        <div class="hero-section">
          <h2 class="hero-title">
            <span class="line">${t('home.hero.line1')}</span>
            <span class="line accent">${t('home.hero.line2')}</span>
          </h2>
          <p class="hero-subtext">${t('home.hero.subtext')}</p>
        </div>

        <div class="split-nav">
          <!-- Digital path -->
          <a href="/portfolio" class="split-card digital interactive" data-route="portfolio">
            <div class="card-content">
              <div class="tag-row">
                ${getTags('home.digitalCard.tags').map(tag => `<span class="tech-tag">${tag}</span>`).join('')}
              </div>
              <h3 class="card-title">${t('home.digitalCard.title')}</h3>
              <p class="card-copy">${t('home.digitalCard.copy')}</p>
            </div>
            <div class="card-bg">
               <div class="systems-grid-pattern"></div>
               <video class="card-video" loop muted playsinline preload="auto">
                <source src="cubes.webm" type="video/webm">
              </video>
            </div>
          </a>

          <!-- Systems path -->
          <a href="/craft" class="split-card systems interactive" data-route="craft">
            <div class="card-content">
              <div class="tag-row">
                ${getTags('home.systemsCard.tags').map(tag => `<span class="tech-tag">${tag}</span>`).join('')}
              </div>
              <h3 class="card-title">${t('home.systemsCard.title')}</h3>
              <p class="card-copy">${t('home.systemsCard.copy')}</p>
            </div>
            <div class="card-bg">
               <div class="systems-grid-pattern"></div>
               <video class="card-video" loop muted playsinline preload="auto">
                <source src="/fabricshort.webm" type="video/webm">
              </video>
            </div>
          </a>

          <!-- Contact path -->
          <a href="/contact" class="split-card contact interactive" data-route="contact">
            <div class="card-content">
              <div class="tag-row">
                ${getTags('home.contactCard.tags').map(tag => `<span class="tech-tag">${tag}</span>`).join('')}
              </div>
              <h3 class="card-title">${t('home.contactCard.title')}</h3>
              <p class="card-copy">${t('home.contactCard.copy')}</p>
            </div>
            <div class="card-bg">
               <video class="card-video" loop muted playsinline preload="auto">
                <source src="/handshake.webm" type="video/webm">
              </video>
            </div>
          </a>
        </div>
      </main>

      <footer class="home-footer-new">
        <div class="footer-left">
           <span class="footer-brand">${t('home.footer')}</span>
        </div>
      </footer>
    </div>
  `;
}

export function init() {
  // Animate hero
  gsap.from('.hero-title .line', {
    y: 50,
    opacity: 0,
    duration: 0.8,
    stagger: 0.1,
    ease: 'power3.out'
  });
  
  gsap.from('.hero-subtext', {
    y: 20,
    opacity: 0,
    duration: 0.8,
    delay: 0.4,
    ease: 'power3.out'
  });

  // Split cards animation
  gsap.fromTo('.split-card', 
    { y: 30, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 1,
      stagger: 0.15,
      delay: 0.6,
      ease: 'power3.out',
      clearProps: 'opacity,transform' // Ensure inline styles are cleaned up after animation
    }
  );

  // Video and Hover handling
  const cards = document.querySelectorAll('.split-card');
  cards.forEach(card => {
    const video = card.querySelector('video') as HTMLVideoElement;
    
    // Attempt auto-play for all grid videos (muted)
    if (video) {
      video.play().catch(() => {
        // Fallback for browsers that block autoplay
        const playOnInteraction = () => {
          video.play().catch(() => {});
          document.removeEventListener('click', playOnInteraction);
        };
        document.addEventListener('click', playOnInteraction);
      });
    }
    
    card.addEventListener('mouseenter', () => {
      gsap.to(card, { y: -10, duration: 0.6, ease: 'power2.out' });
      if (video) {
        video.play().catch(() => {});
        gsap.to(video, { opacity: 1, duration: 0.6 });
      }
    });
    
    card.addEventListener('mouseleave', () => {
      gsap.to(card, { y: 0, duration: 0.6, ease: 'power2.out' });
      if (video) {
        gsap.to(video, { opacity: 0.6, duration: 0.6 });
      }
    });

    card.addEventListener('click', (e) => {
      e.preventDefault();
      const route = (card as HTMLElement).dataset.route as any;
      if (route) (window as any).router.navigate(route);
    });
  });

  // Nav links
  document.querySelectorAll('.header-nav .nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const route = (link as HTMLElement).dataset.route as any;
      if (route) (window as any).router.navigate(route);
    });
  });
}