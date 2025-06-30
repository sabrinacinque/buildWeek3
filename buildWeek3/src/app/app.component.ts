import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from './auth/auth-service.service';
import { ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'buildWeek3';

  constructor(
    private router: Router,
    private authService: AuthService,
    private viewportScroller: ViewportScroller
  ) {}

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event) => {
      const navigationEnd = event as NavigationEnd;
      
      // 🔧 SCROLL POTENZIATO: Metodi multipli per garantire funzionamento
      this.performScrollToTop();
      
      // Auto logout logic
      this.handleAutoLogout(navigationEnd.url);
      
      console.log('📜 Navigazione completata:', navigationEnd.url);
    });
  }

  // 🔧 NUOVO: Metodo dedicato per scroll con fallback multipli
  private performScrollToTop(): void {
    // Metodo 1: ViewportScroller (Angular recommended)
    this.viewportScroller.scrollToPosition([0, 0]);
    
    // Metodo 2: window.scrollTo immediato
    window.scrollTo(0, 0);
    
    // Metodo 3: Fallback con timeout per elementi lazy
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0; // Firefox/Chrome
      document.body.scrollTop = 0; // Safari/older browsers
    }, 10);
    
    // Metodo 4: Fallback aggiuntivo per SPA problematiche
    setTimeout(() => {
      if (window.pageYOffset > 0 || document.documentElement.scrollTop > 0) {
        console.log('📜 Scroll fallback attivato');
        window.scrollTo({ top: 0, behavior: 'instant' });
        
        // Force scroll su tutti i possibili elementi
        const scrollableElements = document.querySelectorAll('body, html, .main-content, .container');
        scrollableElements.forEach(el => {
          (el as HTMLElement).scrollTop = 0;
        });
      }
    }, 50);
    
    console.log('📜 Scroll to top eseguito con metodi multipli');
  }

  // 🔧 NUOVO: Gestisce il logout automatico
  private handleAutoLogout(url: string): void {
    const isAuthenticated = this.authService.isAuthenticated();
    
    if (!isAuthenticated) {
      console.log('👤 Utente non loggato - nessun logout necessario');
      return;
    }

    // Route che richiedono logout automatico (passaggio da admin a cliente)
    const clientRoutes = [
      '/',              // Homepage
      '/menu-choice',   // Scelta menu
      '/menu',          // Menu (tutte le sottopagine)
      '/reviews'        // Reviews pubbliche
    ];

    const shouldLogout = clientRoutes.some(route => {
      return url === route || url.startsWith(route + '/');
    });

    if (shouldLogout) {
      console.log(`🔄 Auto logout: Admin -> Cliente su route: ${url}`);
      this.authService.logoutSilent();
      console.log('✅ Modalità cliente attivata');
    } else {
      console.log(`🔐 Route protetta: ${url} - mantengo login admin`);
    }
  }

  // 🔧 POTENZIATO: Metodo per verificare se siamo in una pagina cliente
  isMenuChoicePage(): boolean {
    const url = this.router.url;
    return url === '/' || url === '/menu-choice' || url.includes('/auth');
  }

  // 🔧 NUOVO: Metodo per verificare se siamo in una pagina menu
  isMenuPage(): boolean {
    return this.router.url.includes('/menu/');
  }

  // 🔧 NUOVO: Metodo per debugging scroll
  debugScrollPosition(): void {
    console.log('🐛 Scroll Debug Info:', {
      windowPageYOffset: window.pageYOffset,
      documentElementScrollTop: document.documentElement.scrollTop,
      bodyScrollTop: document.body.scrollTop,
      currentRoute: this.router.url
    });
  }

  // 🔧 NUOVO: Forza scroll manuale (utile per debug)
  forceScrollToTop(): void {
    console.log('🔧 Force scroll triggered manually');
    this.performScrollToTop();
  }
}