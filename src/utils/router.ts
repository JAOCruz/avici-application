import { gsap } from 'gsap';

export type Route = 'home' | 'vision' | 'craft' | 'fit';

export class Router {
  private currentRoute: Route = 'home';
  private app: HTMLElement;

  constructor(appElement: HTMLElement) {
    this.app = appElement;
    this.init();
  }

  private init() {
    // Handle browser back/forward
    window.addEventListener('popstate', (e) => {
      const route = (e.state?.route as Route) || 'home';
      this.navigate(route, false);
    });
  }

  public navigate(route: Route, pushState = true) {
    const isInitialLoad = this.app.innerHTML === '';
    
    if (route === this.currentRoute && !isInitialLoad) return;

    // Push to history
    if (pushState) {
      window.history.pushState({ route }, '', `/${route === 'home' ? '' : route}`);
    }

    // Skip fade out on initial load
    if (isInitialLoad) {
      this.currentRoute = route;
      this.loadPage(route);
      return;
    }

    // Fade out current content
    gsap.to(this.app, {
      opacity: 0,
      duration: 0.3,
      onComplete: () => {
        this.currentRoute = route;
        this.loadPage(route);
      },
    });
  }

  private loadPage(route: Route) {
    // Import the page dynamically
    import(`../pages/${route}.ts`).then((module) => {
      const pageContent = module.default();
      this.app.innerHTML = pageContent;

      // Fade in new content
      gsap.fromTo(
        this.app,
        { opacity: 0 },
        { opacity: 1, duration: 0.5 }
      );

      // Initialize page-specific interactions
      if (module.init) {
        module.init();
      }
    });
  }

  public getCurrentRoute(): Route {
    return this.currentRoute;
  }
}
