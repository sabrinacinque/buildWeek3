// menu-choice.component.ts - CON AUTO LOGOUT PER CLIENTI
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuService } from '../../menu.service';
import { AuthService } from '../../auth/auth-service.service';
import { TavoloService } from '../../tavolo-service.service';

@Component({
  selector: 'app-menu-choice',
  templateUrl: './menu-choice.component.html',
  styleUrls: ['./menu-choice.component.scss']
})
export class MenuChoiceComponent implements OnInit {

  // Per il menu AYCE
  aycePersone: number = 2;
  aycePrezzo: number = 24.90;

  // Stato login
  isLogged: boolean = false;

  constructor(
    private router: Router,
    private menuService: MenuService,
    private authService: AuthService,
    private tavoloService: TavoloService
  ) {}

  ngOnInit(): void {
    // 🔧 NUOVO: Auto logout quando accedi come cliente
    this.handleClientAccess();

    // Reset tavolo quando si arriva alla scelta menu
    this.tavoloService.resetTavolo();

    // Monitora lo stato di login
    this.authService.logged$.subscribe(
      isAuth => this.isLogged = isAuth
    );
  }

  // 🔧 NUOVO: Gestisce l'accesso come cliente
  private handleClientAccess(): void {
    // Controlla se l'utente è loggato come admin
    if (this.authService.isAuthenticated()) {
      console.log('👤 Admin loggato rilevato - effettuo logout per accesso cliente');

      // Effettua logout silenzioso (senza redirect)
      this.authService.logoutSilent();

      console.log('🍽️ Modalità cliente attivata - navbar e menu ottimizzati per ordini');
    } else {
      console.log('👥 Accesso cliente - modalità corretta già attiva');
    }
  }

  selectMenuType(type: 'carta' | 'ayce') {
    console.log(`🍽️ Cliente ha selezionato menu: ${type.toUpperCase()}`);

    if (type === 'ayce') {
      // Salva le impostazioni AYCE nel MenuService
      this.menuService.setAyceSettings(this.aycePersone);

      // Inizializza tavolo AYCE nel TavoloService
      this.tavoloService.iniziaTavolo(
        'ayce',
        {
          persone: this.aycePersone,
          prezzoPersona: this.aycePrezzo,
          costoTotale: this.aycePersone * this.aycePrezzo
        }
      );

      console.log(`🥢 Tavolo AYCE inizializzato per ${this.aycePersone} persone - Totale: €${this.getTotalAyce()}`);
    } else {
      // Inizializza tavolo CARTA nel TavoloService
      this.tavoloService.iniziaTavolo('carta');
      console.log('📋 Tavolo ALLA CARTA inizializzato');
    }

    // Salva il tipo di menu nel MenuService
    this.menuService.setMenuType(type);

    console.log('🏁 Stato tavolo completo:', this.tavoloService.getCurrentTavoloState());

    // Naviga al menu antipasti
    this.router.navigate(['/menu/antipasti']);
  }

  // Metodi per gestire il numero di persone AYCE
  incrementPersone(): void {
    if (this.aycePersone < 10) {
      this.aycePersone++;
      console.log(`👥 Persone AYCE: ${this.aycePersone} - Nuovo totale: €${this.getTotalAyce()}`);
    }
  }

  decrementPersone(): void {
    if (this.aycePersone > 1) {
      this.aycePersone--;
      console.log(`👥 Persone AYCE: ${this.aycePersone} - Nuovo totale: €${this.getTotalAyce()}`);
    }
  }

  getTotalAyce(): number {
    return this.aycePersone * this.aycePrezzo;
  }

  // Naviga al login (per admin)
  navigateToLogin(): void {
    console.log('🔐 Reindirizzamento a login admin');
    this.router.navigate(['/auth']);
  }

  // Torna alla homepage
  navigateToHomepage(): void {
    console.log('🏠 Ritorno alla homepage');
    this.router.navigate(['/']);
  }
}
