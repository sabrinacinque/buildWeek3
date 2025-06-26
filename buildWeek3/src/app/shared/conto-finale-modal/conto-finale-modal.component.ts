// conto-finale-modal.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TavoloService } from '../../tavolo-service.service';

@Component({
  selector: 'app-conto-finale-modal',
  templateUrl: './conto-finale-modal.component.html',
  styleUrls: ['./conto-finale-modal.component.scss']
})
export class ContoFinaleModalComponent implements OnInit {

  isVisible = false;
  countdown = 3;
  totaleFinale = 0;
  menuType: 'carta' | 'ayce' = 'carta';
  aycePersone = 0;

  constructor(
    private router: Router,
    private tavoloService: TavoloService
  ) {}

  ngOnInit(): void {
    // Sottoscrivi ai cambiamenti di stato tavolo
    this.tavoloService.getTavoloState().subscribe(state => {
      if (state.statoTavolo === 'conto_richiesto') {
        this.showModal(state);
      }
    });
  }

  private showModal(tavoloState: any): void {
    this.totaleFinale = tavoloState.totaleComplessivo;
    this.menuType = tavoloState.menuType;
    this.aycePersone = tavoloState.ayceSettings?.persone || 0;
    this.isVisible = true;

    // Avvia countdown di 3 secondi
    this.startCountdown();
  }

  private startCountdown(): void {
    const timer = setInterval(() => {
      this.countdown--;

      if (this.countdown <= 0) {
        clearInterval(timer);
        this.closeAndRedirect();
      }
    }, 1000);
  }

  closeAndRedirect(): void {
    this.isVisible = false;

    // Reset tavolo e redirect
    setTimeout(() => {
      this.tavoloService.resetTavolo();
      this.router.navigate(['/']);
    }, 300);
  }

  // Metodo per chiusura manuale (se vogliamo un pulsante)
  closeManually(): void {
    this.countdown = 0;
    this.closeAndRedirect();
  }
}
