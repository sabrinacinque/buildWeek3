// bottom-nav.component.ts - PULITO E CORRETTO
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

        // 🆕 NUOVO: Controlla modalità menu dopo navigazione
        this.checkMenuMode();
      }
    });

    // 🆕 NUOVO: Controlla modalità menu all'avvio
    this.checkMenuMode();
  }

  // ===== 🆕 GESTIONE MODALITÀ MENU =====

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

  // ===== METODI TAVOLO (AGGIORNATI PER TUO SERVICE) =====

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

  // ===== 🆕 CONFERMA RICHIESTA CONTO =====

  /**
   * Richiedi il conto con conferma personalizzata
   */
  /**
 * Richiedi il conto - versione semplificata per bottom nav
 */
confermaRichiestaConto() {
  this.tavoloService.openContoModal(); // 🎯 Apre modal luxury
}
  /**
   * 🆕 GESTIONE CONFERMA MODAL
   */

  /**
   * Mostra notifica conto richiesto
   */
 /*private showContoRichiestoNotification(): void {
    // Notifica immediata
    setTimeout(() => {
      const totale = this.getTotaleComplessivo();
      const numeroOrdini = this.getNumeroOrdini();

      let message = '✅ Conto richiesto con successo!\n\n';

      if (numeroOrdini > 0) {
        message += `💰 Totale: €${totale.toFixed(2)}\n`;
        message += `📝 Ordini: ${numeroOrdini}\n\n`;
      }

      message += '👨‍💼 Il personale verrà al vostro tavolo a breve per il pagamento.\n\n';
      message += '⏱️ Tempo stimato: 2-5 minuti';

      alert(message);
    }, 500);
  }*/ 

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
   * Navigazione al logo home con controllo tavolo
   */
  navigateToHome() {
    // 🏠 CONTROLLO SPECIFICO PER LOGO HOME
    if (this.isTavoloAttivo() || this.isInMenuMode()) {
      const conferma = confirm('Sei sicuro di voler tornare alla home?\n\nGli ordini del tavolo attuale rimarranno salvati ma dovrai riattivare il tavolo per continuare.');
      if (!conferma) return;
    }

    this.closeMenuDropdown();
    this.router.navigate(['']);
  }

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
