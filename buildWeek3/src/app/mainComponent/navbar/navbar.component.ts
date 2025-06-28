// sidebar.component.ts - CON LOGICA MODAL HOME + MODAL CONTO
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth-service.service';
import { TavoloService, TavoloState } from '../../tavolo-service.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  isLogged: boolean = false;

  // 🆕 NUOVO: Observable dello stato tavolo
  tavoloState$: Observable<TavoloState>;

  // 🎯 MODAL HOME CONFIRMATION
  showHomeConfirmModal: boolean = false;

  // 🎯 NUOVO: MODAL CONTO CONFIRMATION
  showContoConfirmModal: boolean = false;

  constructor(
    private AuthService: AuthService,
    public router: Router,
    public tavoloService: TavoloService
  ) {
    // Inizializza l'observable dello stato tavolo
    this.tavoloState$ = this.tavoloService.getTavoloState();
  }

  ngOnInit() {
    this.AuthService.logged$.subscribe(
      (isLogged) => (this.isLogged = isLogged)
    );
  }

  logout() {
    this.AuthService.logout();
    this.router.navigate(['']);
  }

  // ===== 🎯 GESTIONE HOME MODAL =====

  /**
   * Gestisce il click sul logo home
   */
  onHomeClick(): void {
    // Se non è loggato E ha un tavolo attivo o modalità menu
    if (!this.isLogged && (this.isTavoloAttivo() || this.isInMenuMode())) {
      console.log('🏠 Richiesta conferma home - tavolo attivo');
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
    console.log('✅ Confermato: navigazione alla home');
  }

  /**
   * Cancella: rimani qui
   */
  onCancelHome(): void {
    this.showHomeConfirmModal = false;
    console.log('❌ Annullato: rimango nella pagina corrente');
  }

  /**
   * Naviga effettivamente alla home
   */
  private navigateToHome(): void {
    this.router.navigate(['']);
  }

  /**
   * Verifica se siamo in modalità menu (per icone sempre visibili)
   */
  private isInMenuMode(): boolean {
    const currentRoute = this.router.url;
    return currentRoute.includes('/menu/');
  }

  // ===== 🎯 GESTIONE CONTO MODAL =====

  /**
   * Mostra modal di conferma per richiesta conto
   */
  confermaRichiestaConto(): void {
    console.log('🎯 Sidebar: apertura modal conferma conto');
    this.showContoConfirmModal = true;
  }

  /**
   * Conferma richiesta conto
   */
  onConfirmConto(): void {
    this.showContoConfirmModal = false;
    this.tavoloService.richiediConto();
    console.log('✅ Conto richiesto dalla sidebar');

    // Naviga allo storico ordini per vedere il risultato
    this.router.navigate(['/storico-ordini']);
  }

  /**
   * Cancella richiesta conto
   */
  onCancelConto(): void {
    this.showContoConfirmModal = false;
    console.log('❌ Richiesta conto annullata dalla sidebar');
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
   * Reset del tavolo per il prossimo cliente
   */
  resetTavolo(): void {
    // Conferma prima del reset
    const conferma = confirm('Sei sicuro di voler resettare il tavolo? Tutti i dati verranno cancellati.');

    if (conferma) {
      this.tavoloService.resetTavolo();
      this.router.navigate(['/']); // Torna alla scelta menu
      console.log('🔄 Tavolo resettato, torno alla home');
    }
  }
}