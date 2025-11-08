import { gsap } from 'gsap';
import { slideUpReveal, wordReveal, scaleIn } from '../utils/textAnimations';

export default function fit() {
  return `
    <div class="fit-page">
      <nav class="page-nav">
        <a href="/" class="back-button interactive" data-route="home">
          <span>←</span> Back
        </a>
        <div class="page-title">The Fit</div>
      </nav>

      <main class="fit-content">
        <section class="intro-section">
          <h1 class="page-heading">
            <span class="line">Why</span>
            <span class="line accent">Avici + Jay</span>
          </h1>
        </section>

        <section class="application-answers">
          <div class="answer-block">
            <div class="answer-number">01</div>
            <h3 class="answer-question">How can you help Avici?</h3>
            <p class="answer-text">
              I'm a creative technologist who brings ideas to life through design, 
              code, and sound. I work across Adobe Creative Suite, Ableton, and 
              front-end development to build cohesive digital experiences where 
              every element serves the vision.
            </p>
          </div>

          <div class="answer-block">
            <div class="answer-number">02</div>
            <h3 class="answer-question">Why are you the right person to help?</h3>
            <p class="answer-text">
              I think in systems—every project I touch becomes a unified experience. 
              When I rebranded Apollo Finance, I didn't just design a logo. I created 
              an astronaut identity that connected to the name, built an immersive 
              website, and composed a soundtrack sampling actual Apollo missions. 
              Everything pointed to one idea: exploration.
            </p>
            <p class="answer-text">
              That's how I approach creative work—finding the thread that ties it all together.
            </p>
          </div>

          <div class="answer-block">
            <div class="answer-number">03</div>
            <h3 class="answer-question">Why do you want to help Avici?</h3>
            <p class="answer-text">
              Avici sits at the intersection of crypto and everyday spending—it's 
              solving a real friction point. I want to help shape how that story 
              gets told visually and experientially as you grow. The product is smart; 
              the creative should match that intelligence.
            </p>
          </div>
        </section>

        <section class="cta-section">
          <h2 class="cta-heading">Let's build something remarkable</h2>
          <div class="contact-links">
            <a href="mailto:your@email.com" class="contact-link interactive">
              Email Me
            </a>
            <a href="#" class="contact-link interactive">
              View Full Portfolio
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