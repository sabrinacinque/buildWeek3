import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from './auth/auth-service.service'; // 🔧 AGGIUNTO

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'buildWeek3';

  constructor(
    private router: Router,
    private authService: AuthService // 🔧 AGGIUNTO
  ) {}

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event) => {
      // 🔧 SISTEMATO: Cast esplicito dopo il filter
      const navigationEnd = event as NavigationEnd;

      // Scroll to top
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);

      // 🔧 NUOVO: Auto logout logic
      this.handleAutoLogout(navigationEnd.url);
    });
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

  // Metodo per verificare se siamo in una pagina cliente
  isMenuChoicePage(): boolean {
    const url = this.router.url;
    return url === '/' || url === '/menu-choice' || url.includes('/auth');
  }
}
