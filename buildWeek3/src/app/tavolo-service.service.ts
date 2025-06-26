// tavolo.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { iCartItem } from './Models/i-cart-item';
import { MenuService, MenuType, AyceSettings } from './menu.service';

export interface OrdineStorico {
  id: string;
  timestamp: Date;
  items: iCartItem[];
  totaleOrdine: number;
  menuType: MenuType;
  ayceSettings?: AyceSettings;
}

export interface TavoloState {
  numeroTavolo?: number;
  menuType: MenuType;
  ayceSettings?: AyceSettings;
  ordiniStorico: OrdineStorico[];
  totaleComplessivo: number;
  statoTavolo: 'vuoto' | 'attivo' | 'conto_richiesto';
}

@Injectable({
  providedIn: 'root'
})
export class TavoloService {

  private tavoloState$ = new BehaviorSubject<TavoloState>({
    menuType: 'carta',
    ordiniStorico: [],
    totaleComplessivo: 0,
    statoTavolo: 'vuoto'
  });

  constructor(private menuService: MenuService) {}

  // ===== GESTIONE STATO TAVOLO =====

  /**
   * Inizializza un nuovo tavolo con tipo menu
   */
  iniziaTavolo(menuType: MenuType, ayceSettings?: AyceSettings, numeroTavolo?: number): void {
    const newState: TavoloState = {
      numeroTavolo,
      menuType,
      ayceSettings,
      ordiniStorico: [],
      totaleComplessivo: menuType === 'ayce' ? (ayceSettings?.costoTotale || 0) : 0, // 🔧 SISTEMATO: AYCE inizia con costo base
      statoTavolo: 'attivo'
    };

    this.tavoloState$.next(newState);
    console.log('🍽️ Tavolo iniziato:', newState);
  }

  /**
   * Aggiungi un nuovo ordine al tavolo
   */
  aggiungiOrdine(items: iCartItem[]): void {
    const currentState = this.tavoloState$.value;

    if (currentState.statoTavolo === 'conto_richiesto') {
      console.warn('⚠️ Conto già richiesto, impossibile aggiungere ordini');
      return;
    }

    // Calcola il totale di questo ordine specifico
    const totaleOrdine = this.menuService.calculateFinalTotal(items);

    // Crea nuovo ordine
    const nuovoOrdine: OrdineStorico = {
      id: this.generateOrderId(),
      timestamp: new Date(),
      items: [...items], // Copia degli items
      totaleOrdine,
      menuType: currentState.menuType,
      ayceSettings: currentState.ayceSettings
    };

    // Aggiorna stato
    const updatedState: TavoloState = {
      ...currentState,
      ordiniStorico: [...currentState.ordiniStorico, nuovoOrdine],
      totaleComplessivo: this.calcolaTotaleComplessivo([...currentState.ordiniStorico, nuovoOrdine]),
      statoTavolo: 'attivo'
    };

    this.tavoloState$.next(updatedState);
    console.log('📝 Nuovo ordine aggiunto:', nuovoOrdine);
    console.log('💰 Totale tavolo:', updatedState.totaleComplessivo);
  }

  /**
   * Richiedi il conto finale
   */
  richiediConto(): void {
    const currentState = this.tavoloState$.value;

    if (currentState.ordiniStorico.length === 0) {
      console.warn('⚠️ Nessun ordine presente per richiedere il conto');
      return;
    }

    const updatedState: TavoloState = {
      ...currentState,
      statoTavolo: 'conto_richiesto'
    };

    this.tavoloState$.next(updatedState);
    console.log('🧾 Conto richiesto per tavolo:', updatedState);
  }

  /**
   * Reset completo del tavolo (per il prossimo cliente)
   */
  resetTavolo(): void {
    const emptyState: TavoloState = {
      menuType: 'carta',
      ordiniStorico: [],
      totaleComplessivo: 0,
      statoTavolo: 'vuoto'
    };

    this.tavoloState$.next(emptyState);
    console.log('🔄 Tavolo resettato per il prossimo cliente');
  }

  // ===== GETTERS =====

  /**
   * Ottieni lo stato del tavolo
   */
  getTavoloState(): Observable<TavoloState> {
    return this.tavoloState$.asObservable();
  }

  /**
   * Ottieni lo stato corrente (sincrono)
   */
  getCurrentTavoloState(): TavoloState {
    return this.tavoloState$.value;
  }

  /**
   * Verifica se il tavolo è attivo
   */
  isTavoloAttivo(): boolean {
    const state = this.tavoloState$.value;
    return state.statoTavolo === 'attivo' && state.ordiniStorico.length > 0;
  }

  /**
   * Verifica se il conto è stato richiesto
   */
  isContoRichiesto(): boolean {
    return this.tavoloState$.value.statoTavolo === 'conto_richiesto';
  }

  /**
   * Ottieni il numero di ordini
   */
  getNumeroOrdini(): number {
    return this.tavoloState$.value.ordiniStorico.length;
  }

  /**
   * Ottieni il totale complessivo
   */
  getTotaleComplessivo(): number {
    return this.tavoloState$.value.totaleComplessivo;
  }

  // ===== UTILITY METHODS =====

  /**
   * Calcola il totale complessivo di tutti gli ordini
   */
  private calcolaTotaleComplessivo(ordini: OrdineStorico[]): number {
    const currentState = this.tavoloState$.value;

    if (currentState.menuType === 'ayce') {
      // Per AYCE: costo base + somma di bibite/dolci di tutti gli ordini
      const costoBaseAyce = currentState.ayceSettings?.costoTotale || 0;

      const totaleBibiteDolci = ordini.reduce((total, ordine) => {
        const extraOrdine = ordine.items
          .filter(item => item.categoria === 'Bibite' || item.categoria === 'Dolci')
          .reduce((sum, item) => sum + (item.prezzo * item.quantity), 0);
        return total + extraOrdine;
      }, 0);

      console.log('💰 Calcolo AYCE:', {
        costoBase: costoBaseAyce,
        extraBibiteDolci: totaleBibiteDolci,
        totale: costoBaseAyce + totaleBibiteDolci
      });

      return costoBaseAyce + totaleBibiteDolci;
    } else {
      // Per menu alla carta: somma totale di tutti gli ordini
      const totaleCarta = ordini.reduce((total, ordine) => total + ordine.totaleOrdine, 0);
      console.log('💰 Calcolo Carta:', { totaleCarta });
      return totaleCarta;
    }
  }

  /**
   * Genera ID univoco per l'ordine
   */
  private generateOrderId(): string {
    return `ORD_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Formatta il timestamp dell'ordine
   */
  formatOrderTime(timestamp: Date): string {
    return timestamp.toLocaleTimeString('it-IT', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Ottieni riepilogo per categoria (utile per il conto finale)
   */
  getRiepilogoPerCategoria(): { [categoria: string]: { quantita: number, totale: number } } {
    const ordini = this.tavoloState$.value.ordiniStorico;
    const riepilogo: { [categoria: string]: { quantita: number, totale: number } } = {};

    ordini.forEach(ordine => {
      ordine.items.forEach(item => {
        if (!riepilogo[item.categoria]) {
          riepilogo[item.categoria] = { quantita: 0, totale: 0 };
        }

        riepilogo[item.categoria].quantita += item.quantity;

        // Per AYCE, bibite e dolci contano nel totale
        if (this.tavoloState$.value.menuType === 'carta' ||
            item.categoria === 'Bibite' || item.categoria === 'Dolci') {
          riepilogo[item.categoria].totale += (item.prezzo * item.quantity);
        }
      });
    });

    return riepilogo;
  }
}
