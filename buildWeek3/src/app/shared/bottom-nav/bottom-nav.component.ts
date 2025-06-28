// bottom-nav.component.ts - CON MODAL HOME E MODAL CONTO
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

  // Observable dello stato tavolo
  tavoloState$: Observable<TavoloState>;

  // 🎯 MODAL HOME CONFIRMATION
  showHomeConfirmModal: boolean = false;

  // 🎯 NUOVO: MODAL CONTO CONFIRMATION (IDENTICO A SIDEBAR)
  showContoConfirmModal: boolean = false;

  constructor(
    private router: Router,
    private AuthService: AuthService,
    public tavoloService: TavoloService
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
        this.checkMenuMode();
      }
    });

    this.checkMenuMode();
  }

  // ===== 🎯 GESTIONE HOME MODAL (IDENTICA A SIDEBAR) =====

  /**
   * Gestisce il click sul logo home
   */
  onHomeClick(): void {
    // Se non è loggato E ha un tavolo attivo o modalità menu
    if (!this.isLogged && (this.isTavoloAttivo() || this.isInMenuMode())) {
      console.log('🏠 Bottom Nav: Richiesta conferma home - tavolo attivo');
      this.showHomeConfirmModal = true;
    } else {
      // Vai direttamente alla home
      this.navigateToHome();
    }
  }

  /**
   * Conferma: vai alla home
   */
  onConfirmHome(): void {
    this.showHomeConfirmModal = false;
    this.navigateToHome();
    console.log('✅ Bottom Nav: Confermato - navigazione alla home');
  }

  /**
   * Cancella: rimani qui
   */
  onCancelHome(): void {
    this.showHomeConfirmModal = false;
    console.log('❌ Bottom Nav: Annullato - rimango nella pagina corrente');
  }

  /**
   * Naviga effettivamente alla home
   */
  private navigateToHome(): void {
    this.closeMenuDropdown();
    this.router.navigate(['']);
  }

  // ===== 🎯 GESTIONE CONTO MODAL (IDENTICA A SIDEBAR) =====

  /**
   * Mostra modal di conferma per richiesta conto
   */
  confermaRichiestaConto(): void {
    console.log('🎯 Bottom Nav: apertura modal conferma conto');
    this.showContoConfirmModal = true;
  }

  /**
   * Conferma richiesta conto
   */
  onConfirmConto(): void {
    this.showContoConfirmModal = false;
    this.tavoloService.richiediConto();
    console.log('✅ Conto richiesto dalla bottom nav');

    // Naviga allo storico ordini per vedere il risultato
    this.router.navigate(['/storico-ordini']);
  }

  /**
   * Cancella richiesta conto
   */
  onCancelConto(): void {
    this.showContoConfirmModal = false;
    console.log('❌ Richiesta conto annullata dalla bottom nav');
  }

  // ===== GESTIONE MODALITÀ MENU =====

  /**
   * Controlla se siamo in modalità menu e attiva automaticamente
   */
  checkMenuMode(): void {
    const currentRoute = this.getCurrentRoute();

    // Se siamo in una pagina menu, attiva modalità automaticamente
    if (currentRoute.includes('/menu/')) {
      this.tavoloService.checkAndActivateMenuMode(currentRoute);
    }
  }

  /**
   * Verifica se siamo in modalità menu (per icone sempre visibili)
   */
  isInMenuMode(): boolean {
    const currentRoute = this.getCurrentRoute();
    return currentRoute.includes('/menu/') || this.tavoloService.isModalitaMenuAttiva();
  }

  // ===== NAVIGAZIONE E ROUTING =====

  navigateTo(route: string) {
    this.closeMenuDropdown();

    // 🆕 CONTROLLO SPECIFICO PER NAVIGAZIONE HOME
    if (route === '' && (this.isTavoloAttivo() || this.isInMenuMode())) {
      const conferma = confirm('Sei sicuro di voler tornare alla home? Gli ordini del tavolo attuale rimarranno salvati ma dovrai riattivare il tavolo per continuare.');
      if (!conferma) return;
    }

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

  // ===== MENU DROPDOWN =====

  toggleMenuDropdown() {
    this.showMenuDropdown = !this.showMenuDropdown;
  }

  closeMenuDropdown() {
    this.showMenuDropdown = false;
  }

  onBackdropClick() {
    this.closeMenuDropdown();
  }

  // ===== AUTH =====

  logout() {
    this.closeMenuDropdown();
    this.AuthService.logout();
    this.router.navigate(['']);
  }

  // ===== METODI TAVOLO (IDENTICI A SIDEBAR) =====

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
   * Reset del tavolo per il prossimo cliente
   */
  resetTavolo(): void {
    const conferma = confirm('Nuovo tavolo? Tutti i dati attuali verranno cancellati definitivamente.');

    if (conferma) {
      this.tavoloService.resetTavolo();
      this.router.navigate(['/']); // Torna alla scelta menu
      console.log('🔄 Tavolo resettato dalla bottom nav');

      // Notifica reset
      setTimeout(() => {
        alert('🆕 Tavolo resettato!\n\nPuoi iniziare un nuovo ordine.');
      }, 300);
    }
  }

  // ===== METODI AGGIUNTIVI MOBILI =====

  /**
   * Verifica se mostrare il badge carrello
   */
  showCartBadge(): boolean {
    return (this.isTavoloAttivo() || this.isInMenuMode()) && this.getNumeroOrdini() > 0;
  }

  /**
   * Ottieni conteggio items carrello per badge
   */
  getCartItemsCount(): number {
    return this.getNumeroOrdini();
  }

  // ===== DEBUG METHODS =====

  /**
   * Log stato tavolo per debug
   */
  debugTavoloState(): void {
    this.tavoloService.debugCurrentState();
  }

  /**
   * Forza salvataggio (per debug)
   */
  forceSaveState(): void {
    this.tavoloService.forceSave();
  }
}