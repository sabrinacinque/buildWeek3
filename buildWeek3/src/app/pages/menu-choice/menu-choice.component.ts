// menu-choice.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuService } from '../../menu.service';

@Component({
  selector: 'app-menu-choice',
  templateUrl: './menu-choice.component.html',
  styleUrls: ['./menu-choice.component.scss']
})
export class MenuChoiceComponent {

  // Per il menu AYCE
  aycePersone: number = 2;
  aycePrezzo: number = 24.90;

  constructor(
    private router: Router,
    private menuService: MenuService
  ) {}

  selectMenuType(type: 'carta' | 'ayce') {
    if (type === 'ayce') {
      // Salva le impostazioni AYCE
      this.menuService.setAyceSettings(this.aycePersone);
    }

    // Salva il tipo di menu
    this.menuService.setMenuType(type);

    console.log(`Menu ${type} selezionato per ${this.aycePersone} persone`);

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

  // 🆕 NUOVO METODO - Naviga all'area riservata
  navigateToLogin(): void {
    this.router.navigate(['/auth']);
  }
}
