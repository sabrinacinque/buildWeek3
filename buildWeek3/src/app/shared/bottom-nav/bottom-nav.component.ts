// bottom-nav.component.ts - VERSIONE AGGIORNATA
import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../auth/auth-service.service';

@Component({
  selector: 'app-bottom-nav',
  templateUrl: './bottom-nav.component.html',
  styleUrls: ['./bottom-nav.component.scss']
})
export class BottomNavComponent implements OnInit {
  isLogged: boolean = false;
  showMenuDropdown: boolean = false;

  constructor(
    private router: Router,
    private AuthService: AuthService
  ) {}

  ngOnInit() {
    // Sottoscrivi ai cambiamenti di autenticazione
    this.AuthService.logged$.subscribe(
      (isLogged) => (this.isLogged = isLogged)
    );

    // Chiudi dropdown su ogni navigazione
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.closeMenuDropdown();
      }
    });
  }

  navigateTo(route: string) {
    this.closeMenuDropdown(); // Chiudi PRIMA della navigazione
    setTimeout(() => {
      this.router.navigate([route]);
    }, 150); // Piccolo delay per animazione
  }

  getCurrentRoute(): string {
    return this.router.url;
  }

  isActiveRoute(route: string): boolean {
    if (route === '') {
      return this.getCurrentRoute() === '/';
    }
    return this.getCurrentRoute().includes(route);
  }

  toggleMenuDropdown() {
    this.showMenuDropdown = !this.showMenuDropdown;
  }

  closeMenuDropdown() {
    this.showMenuDropdown = false;
  }

  // Chiudi dropdown quando si clicca fuori
  onBackdropClick() {
    this.closeMenuDropdown();
  }

  // METODO LOGOUT - NUOVO!
  logout() {
    this.closeMenuDropdown(); // Chiudi dropdown se aperto
    this.AuthService.logout();
    this.router.navigate(['']); // Vai alla home dopo logout
  }

  showCartBadge(): boolean {
    // TODO: Implementa logica per mostrare badge carrello
    // Esempio: return this.cartService.getItemsCount() > 0;
    return false; // Per ora false, poi aggiungi la logica del carrello
  }

  getCartItemsCount(): number {
    // TODO: Implementa conteggio items carrello
    // Esempio: return this.cartService.getItemsCount();
    return 0; // Per ora 0, poi aggiungi la logica del carrello
  }
}
