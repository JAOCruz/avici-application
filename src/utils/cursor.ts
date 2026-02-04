import { gsap } from 'gsap';

export class CustomCursor {
  private cursor: HTMLElement;
  private xSetter!: Function;
  private ySetter!: Function;
  private pos = { x: 0, y: 0 };
  private mouse = { x: 0, y: 0 };
  private speed = 0.15; // Lower = more lag/spring

  constructor() {
    this.cursor = document.querySelector('.custom-cursor') as HTMLElement;
    if (!this.cursor) return;
    this.init();
  }

  private init() {
    // Set up quickSetters for high performance
    this.xSetter = gsap.quickSetter(this.cursor, "x", "px");
    this.ySetter = gsap.quickSetter(this.cursor, "y", "px");

    // Track mouse position
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });

    // Start target animation loop
    gsap.ticker.add(() => {
      // Smooth interpolation (lerp)
      const dt = 1.0 - Math.pow(1.0 - this.speed, gsap.ticker.deltaRatio());
      
      this.pos.x += (this.mouse.x - this.pos.x) * dt;
      this.pos.y += (this.mouse.y - this.pos.y) * dt;

      this.xSetter(this.pos.x - 16); // offset by half width (32/2)
      this.ySetter(this.pos.y - 16);
    });

    // Hover effects on interactive elements
    this.setupHoverEffects();
    
    // Watch for page changes
    this.watchPageChanges();
  }

  private setupHoverEffects() {
    const interactiveElements = document.querySelectorAll('a, button, .interactive');

    interactiveElements.forEach((element) => {
      element.addEventListener('mouseenter', () => {
        this.cursor.classList.add('hover');
        gsap.to(this.cursor, { scale: 2, duration: 0.3 });
      });

      element.addEventListener('mouseleave', () => {
        this.cursor.classList.remove('hover');
        gsap.to(this.cursor, { scale: 1, duration: 0.3 });
      });
    });
  }

  private watchPageChanges() {
    const observer = new MutationObserver(() => {
      this.refresh();
    });
    
    observer.observe(document.getElementById('app')!, {
      childList: true,
      subtree: true
    });
  }

  public refresh() {
    this.setupHoverEffects();
  }
}