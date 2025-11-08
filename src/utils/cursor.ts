import { gsap } from 'gsap';

export class CustomCursor {
  private cursor: HTMLElement;

  constructor() {
    this.cursor = document.querySelector('.custom-cursor') as HTMLElement;
    this.init();
  }

  private init() {
    // Direct cursor tracking - ZERO lag
    document.addEventListener('mousemove', (e) => {
      gsap.set(this.cursor, {
        x: e.clientX,
        y: e.clientY,
        xPercent: -50,
        yPercent: -50,
      });
    });

    // Hover effects on interactive elements
    this.setupHoverEffects();
    
    // Watch for page changes to update cursor color
    this.watchPageChanges();
  }

  private setupHoverEffects() {
    const interactiveElements = document.querySelectorAll('a, button, .interactive');

    interactiveElements.forEach((element) => {
      element.addEventListener('mouseenter', () => {
        this.cursor.classList.add('hover');
      });

      element.addEventListener('mouseleave', () => {
        this.cursor.classList.remove('hover');
      });
    });
  }

  private watchPageChanges() {
    // Check current page and update cursor
    const updateCursorColor = () => {
      const isVisionPage = document.querySelector('.vision-page') !== null;
      
      if (isVisionPage) {
        this.cursor.classList.add('dark-cursor');
      } else {
        this.cursor.classList.remove('dark-cursor');
      }
    };
    
    // Initial check
    updateCursorColor();
    
    // Watch for DOM changes (page navigation)
    const observer = new MutationObserver(updateCursorColor);
    observer.observe(document.getElementById('app')!, {
      childList: true,
      subtree: true
    });
  }

  // Public method to refresh hover effects when DOM changes
  public refresh() {
    this.setupHoverEffects();
  }
}