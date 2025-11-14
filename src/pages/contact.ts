import { contactFormMarkup, bindContactForm } from '../components/ContactForm';
import { slideUpReveal, wordReveal } from '../utils/textAnimations';

export default function contact() {
  return `
    <div class="contact-page" id="contact">
      <nav class="page-nav">
        <a href="/" class="back-button interactive" data-route="home">
          <span>←</span> Back
        </a>
        <div class="page-title">Contact</div>
      </nav>

      <main class="contact-content">
        <section class="intro-section">
          <h1 class="page-heading">
            <span class="line">Let’s launch</span>
            <span class="line accent">your next build</span>
          </h1>
          <p class="lead-text">
            Share the vision, pick the features, and I’ll send a roadmap within 24 hours—timelines, deliverables, and launch support built in.
          </p>
        </section>

        <section class="contact-columns">
          <div class="contact-info">
            <div class="contact-block">
              <h2>Direct Line</h2>
              <a href="tel:+18098802016" class="contact-link interactive">809-880-2016</a>
              <a href="mailto:notmeee00@gmail.com" class="contact-link interactive">notmeee00@gmail.com</a>
            </div>
            <div class="contact-block">
              <h2>Services</h2>
              <ul>
                <li>Custom web applications</li>
                <li>Interactive pricing experiences</li>
                <li>Payment, auth, CMS integrations</li>
                <li>Launch analytics & automation</li>
              </ul>
              <button class="contact-secondary interactive" type="button" data-route-process>
                See full process
              </button>
            </div>
            <div class="contact-block">
              <h2>Location</h2>
              <p>Santo Domingo, Dominican Republic</p>
            </div>
          </div>

          <div class="contact-form-wrapper">
            ${contactFormMarkup()}
          </div>
        </section>
      </main>
    </div>
  `;
}

export function init() {
  const lines = document.querySelectorAll('.page-heading .line');
  slideUpReveal(lines as any, 0.15);

  const lead = document.querySelector('.lead-text') as HTMLElement | null;
  if (lead) wordReveal(lead, 0.3);

  const backButton = document.querySelector('[data-route="home"]');
  backButton?.addEventListener('click', (event) => {
    event.preventDefault();
    (window as any).router.navigate('home');
  });

  const processButton = document.querySelector('[data-route-process]');
  processButton?.addEventListener('click', () => {
    (window as any).router.navigate('fit');
  });

  bindContactForm();

  if ((window as any).cursor) {
    (window as any).cursor.refresh();
  }
}

