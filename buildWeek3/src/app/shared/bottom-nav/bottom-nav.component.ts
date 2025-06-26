// bottom-nav.component.ts - CON LOGICA TAVOLO
import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../auth/auth-service.service';
import { TavoloService, TavoloState } from '../../tavolo-service.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-bottom-nav',
  templateUrl: './bottom-nav.component.html',
  styleUrls: ['./bottom-nav.component.scss']
})
export class BottomNavComponent implements OnInit {
  isLogged: boolean = false;
  showMenuDropdown: boolean = false;

  // 🆕 NUOVO: Observable dello stato tavolo
  tavoloState$: Observable<TavoloState>;

  constructor(
    private router: Router,
    private AuthService: AuthService,
    public tavoloService: TavoloService // 🆕 NUOVO: Inietta TavoloService
  ) {
    // Inizializza l'observable dello stato tavolo
    this.tavoloState$ = this.tavoloService.getTavoloState();
  }

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
    this.closeMenuDropdown();
    setTimeout(() => {
      this.router.navigate([route]);
    }, 150);
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

  onBackdropClick() {
    this.closeMenuDropdown();
  }

  logout() {
    this.closeMenuDropdown();
    this.AuthService.logout();
    this.router.navigate(['']);
  }

  // ===== 🆕 METODI TAVOLO =====

  /**
   * Verifica se il tavolo è attivo
   */
  isTavoloAttivo(): boolean {
    return this.tavoloService.isTavoloAttivo();
  }

  /**
   * Verifica se il conto è stato richiesto
   */
  isContoRichiesto(): boolean {
    return this.tavoloService.isContoRichiesto();
  }

  /**
   * Ottieni il numero di ordini
   */
  getNumeroOrdini(): number {
    return this.tavoloService.getNumeroOrdini();
  }

  /**
   * Ottieni il totale complessivo
   */
  getTotaleComplessivo(): number {
    return this.tavoloService.getTotaleComplessivo();
  }

  /**
   * Richiedi il conto
   */
  richiediConto(): void {
    this.tavoloService.richiediConto();
    console.log('🧾 Conto richiesto dalla bottom nav');

    // Opzionale: Naviga allo storico ordini per vedere il riepilogo
    this.navigateTo('/storico-ordini');
  }

  /**
   * Reset del tavolo per il prossimo cliente
   */
  resetTavolo(): void {
    // Conferma prima del reset
    const conferma = confirm('Nuovo tavolo? Tutti i dati attuali verranno cancellati.');

    if (conferma) {
      this.tavoloService.resetTavolo();
      this.router.navigate(['/']); // Torna alla scelta menu
      console.log('🔄 Tavolo resettato dalla bottom nav');
    }
  }

  // ===== METODI CARRELLO (per compatibilità futura) =====

  showCartBadge(): boolean {
    // TODO: Implementa logica per mostrare badge carrello se necessario
    return false;
  }

  getCartItemsCount(): number {
    // TODO: Implementa conteggio items carrello se necessario
    return 0;
  }
}
