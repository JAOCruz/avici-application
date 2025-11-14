import { gsap } from 'gsap';
import { slideUpReveal, wordReveal, scaleIn } from '../utils/textAnimations';

export default function fit() {
  return `
    <div class="fit-page">
      <nav class="page-nav">
        <a href="/" class="back-button interactive" data-route="home">
          <span>←</span> Back
        </a>
        <div class="page-title">Process</div>
      </nav>

      <main class="fit-content">
        <section class="intro-section">
          <h1 class="page-heading">
            <span class="line">Why</span>
            <span class="line accent">JAOCruz</span>
          </h1>
        </section>

        <section class="application-answers">
          <div class="answer-block">
            <div class="answer-number">01</div>
            <h3 class="answer-question">What problem do you solve?</h3>
            <p class="answer-text">
              I help Dominican brands launch premium websites that feel bespoke and convert. 
              From TypeScript architecture to GSAP motion and payment flows, I design and build 
              the entire experience so everything tells one confident story.
            </p>
          </div>

          <div class="answer-block">
            <div class="answer-number">02</div>
            <h3 class="answer-question">What makes your builds different?</h3>
            <p class="answer-text">
              Clarity and transparency. We scope features together using the interactive pricing configurator, 
              then I deliver modular systems: performant, accessible, and easy to evolve. Animations, CMS, payments, 
              automations—everything is engineered to ship fast and scale with your team.
            </p>
            <p class="answer-text">
              It's not just code. It's strategy, storytelling, and ongoing optimization packaged in one build partner.
            </p>
          </div>

          <div class="answer-block">
            <div class="answer-number">03</div>
            <h3 class="answer-question">How do we get started?</h3>
            <p class="answer-text">
              Start with the configurator—choose the feature set that fits your roadmap, then send the quote. 
              I reply within 24 hours to book a discovery call. Launch timelines typically run 2–4 weeks once 
              we sign off on scope.
            </p>
          </div>
        </section>

        <section class="cta-section">
          <h2 class="cta-heading">Let's build your next product</h2>
          <div class="contact-links">
            <a href="mailto:notmeee00@gmail.com" class="contact-link interactive">
              Email Me
            </a>
            <a href="tel:+18098802016" class="contact-link interactive">
              Call 809-880-2016
            </a>
            <a href="#configurator" class="contact-link interactive">
              Open Configurator
            </a>
          </div>
        </section>
      </main>
    </div>
  `;
}

export function init() {
  // Slide up reveal for main heading
  const lines = document.querySelectorAll('.page-heading .line');
  slideUpReveal(lines as any, 0.2);

  // Stagger answer blocks
  const answerBlocks = document.querySelectorAll('.answer-block');
  gsap.fromTo(
    answerBlocks,
    { x: -50, opacity: 0 },
    {
      x: 0,
      opacity: 1,
      duration: 0.8,
      stagger: 0.2,
      delay: 0.6,
      ease: 'power3.out',
    }
  );

  // Word reveal for CTA
  setTimeout(() => {
    const ctaHeading = document.querySelector('.cta-heading') as HTMLElement;
    if (ctaHeading) wordReveal(ctaHeading, 0);
  }, 2000);

  // Scale in buttons
  setTimeout(() => {
    const contactLinks = document.querySelectorAll('.contact-link');
    scaleIn(contactLinks as any, 0, 0.1);
  }, 2500);

  const backButton = document.querySelector('[data-route="home"]');
  backButton?.addEventListener('click', (e) => {
    e.preventDefault();
    (window as any).router.navigate('home');
  });

  // Refresh cursor for new elements
  if ((window as any).cursor) {
    (window as any).cursor.refresh();
  }
}