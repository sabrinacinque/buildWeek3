// menu-choice.component.ts - VERSIONE CON INTEGRAZIONE TAVOLO CORRETTA
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuService } from '../../menu.service';
import { AuthService } from '../../auth/auth-service.service'; // 🔧 CORRETTO: Path giusto
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
    private authService: AuthService, // 🔧 CORRETTO: Nome minuscolo
    private tavoloService: TavoloService
  ) {}

  ngOnInit(): void {
    // Reset tavolo quando si arriva alla scelta menu
    this.tavoloService.resetTavolo();

    // 🔧 CORRETTO: Usa logged$ invece di isAuthenticated()
    this.authService.logged$.subscribe(
      isAuth => this.isLogged = isAuth
    );
  }

  selectMenuType(type: 'carta' | 'ayce') {
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
    } else {
      // Inizializza tavolo CARTA nel TavoloService
      this.tavoloService.iniziaTavolo('carta');
    }

    // Salva il tipo di menu nel MenuService
    this.menuService.setMenuType(type);

    console.log(`🍽️ Menu ${type} selezionato per ${this.aycePersone} persone`);
    console.log('🏁 Tavolo inizializzato:', this.tavoloService.getCurrentTavoloState());

    // Naviga alla homepage
    this.router.navigate(['/homepage']);
}

  // Metodi per gestire il numero di persone
  incrementPersone(): void {
    if (this.aycePersone < 10) {
      this.aycePersone++;
    }
  }

  decrementPersone(): void {
    if (this.aycePersone > 1) {
      this.aycePersone--;
    }
  }

  getTotalAyce(): number {
    return this.aycePersone * this.aycePrezzo;
  }

  // Naviga al login
  navigateToLogin(): void {
    this.router.navigate(['/auth']);
  }
}
