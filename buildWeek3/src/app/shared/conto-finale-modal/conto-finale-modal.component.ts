// conto-finale-modal.component.ts - FIXED
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { TavoloService } from '../../tavolo-service.service';

@Component({
  selector: 'app-conto-finale-modal',
  templateUrl: './conto-finale-modal.component.html',
  styleUrls: ['./conto-finale-modal.component.scss']
})
export class ContoFinaleModalComponent implements OnInit, OnDestroy {

  isVisible = false;
  countdown = 10; // 🎯 SEMPRE 10 secondi
  totaleFinale = 0;
  menuType: 'carta' | 'ayce' = 'carta';
  aycePersone = 0;

  // 🔧 NUOVO: Timer reference per cleanup (browser compatible)
  private countdownTimer?: ReturnType<typeof setInterval>;

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

  ngOnDestroy(): void {
    // 🔧 CLEANUP: Pulisci timer se componente viene distrutto
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
    }
  }

  private showModal(tavoloState: any): void {
    console.log('🧾 ContoFinaleModal: Apertura modal conto');
    
    this.totaleFinale = tavoloState.totaleComplessivo;
    this.menuType = tavoloState.menuType;
    this.aycePersone = tavoloState.ayceSettings?.persone || 0;
    this.countdown = 10; // 🎯 RESET sempre a 10
    this.isVisible = true;

    // 🎯 FIXED: Avvia countdown di 10 secondi FISSI
    this.startCountdown();
  }

  private startCountdown(): void {
    console.log('⏱️ ContoFinaleModal: Avvio countdown di 10 secondi');
    
    // 🔧 CLEANUP: Pulisci timer esistente
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
    }

    this.countdownTimer = setInterval(() => {
      this.countdown--;
      console.log(`⏱️ ContoFinaleModal: Countdown = ${this.countdown}`);

      if (this.countdown <= 0) {
        console.log('🏁 ContoFinaleModal: Countdown terminato, chiudo modal');
        if (this.countdownTimer) {
          clearInterval(this.countdownTimer);
        }
        this.closeAndRedirect();
      }
    }, 1000);
  }

  closeAndRedirect(): void {
    console.log('🔄 ContoFinaleModal: Chiusura e redirect');
    
    // 🔧 CLEANUP: Pulisci timer
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
    }

    this.isVisible = false;

    // Reset tavolo e redirect con delay
    setTimeout(() => {
      console.log('🏠 ContoFinaleModal: Reset tavolo e redirect home');
      this.tavoloService.resetTavolo();
      this.router.navigate(['/']);
    }, 1000);
  }

  // Metodo per chiusura manuale
  closeManually(): void {
    console.log('👆 ContoFinaleModal: Chiusura manuale');
    this.countdown = 0;
    this.closeAndRedirect();
  }
}