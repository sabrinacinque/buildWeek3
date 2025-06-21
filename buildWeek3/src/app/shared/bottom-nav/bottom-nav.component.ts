// bottom-nav.component.ts
import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../auth/auth-service.service'; // Adatta il path

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
    // Usa lo stesso sistema auth della navbar-small
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

  showCartBadge(): boolean {
    // Implementa logica per mostrare badge carrello
    return false; // Per ora false, poi aggiungi la logica del carrello
  }

  getCartItemsCount(): number {
    // Implementa conteggio items carrello
    return 0; // Per ora 0, poi aggiungi la logica del carrello
  }
}
