// sidebar.component.ts - CON LOGICA TAVOLO
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

  constructor(
    private AuthService: AuthService,
    public router: Router,
    public tavoloService: TavoloService // 🆕 NUOVO: Inietta TavoloService
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
  // 🎯 DOPO (NUOVO - usa modal luxury):
richiediConto(): void {
  console.log('🎯 Sidebar: apertura modal conto luxury');
  this.tavoloService.openContoModal(); // 🆕 NUOVO: Apre modal invece di confermare direttamente
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
