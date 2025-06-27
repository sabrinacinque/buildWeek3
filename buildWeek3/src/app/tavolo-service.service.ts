// tavolo.service.ts - CON PERSISTENZA LOCALSTORAGE + MODAL COMMUNICATION
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
  // 🆕 NUOVO: Per tracciare se siamo in modalità menu (icone sempre visibili)
  modalitaMenuAttiva: boolean;
  oraInizioTavolo?: Date;
  oraRichiestaConto?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class TavoloService {

  // 🔑 CHIAVE LOCALSTORAGE
  private readonly STORAGE_KEY = 'episushi_tavolo_state';

  // 📊 STATO INIZIALE
  private initialState: TavoloState = {
    menuType: 'carta',
    ordiniStorico: [],
    totaleComplessivo: 0,
    statoTavolo: 'vuoto',
    modalitaMenuAttiva: false
  };

  private tavoloState$ = new BehaviorSubject<TavoloState>(this.initialState);

  // ===== 🆕 MODAL COMMUNICATION =====

  /**
   * 🎯 NUOVO: Subject per comunicazione modal richiesta conto
   */
  private showContoModalSubject = new BehaviorSubject<boolean>(false);
  public showContoModal$ = this.showContoModalSubject.asObservable();

  constructor(private menuService: MenuService) {
    // 🔄 CARICA STATO DA LOCALSTORAGE ALL'AVVIO
    this.loadFromLocalStorage();
    console.log('🍽️ TavoloService inizializzato con persistenza');
  }

  // ===== 🆕 MODAL METHODS =====

  /**
   * 🚀 NUOVO: Apre il modal luxury per richiesta conto
   * Chiamato da bottom-nav e sidebar
   */
  openContoModal(): void {
    console.log('🎯 Apertura modal richiesta conto');
    this.showContoModalSubject.next(true);
  }

  /**
   * 🔒 NUOVO: Chiude il modal luxury
   */
  closeContoModal(): void {
    console.log('❌ Chiusura modal richiesta conto');
    this.showContoModalSubject.next(false);
  }

  /**
   * 🎯 NUOVO: Conferma richiesta conto dal modal
   * Chiamato quando l'utente conferma nel modal luxury
   */
  confermaRichiestaConto(): void {
    this.richiediConto(); // Chiama il metodo esistente
    this.closeContoModal(); // Chiude il modal
    console.log('✅ Richiesta conto confermata tramite modal luxury');
  }

  // ===== 🔄 PERSISTENZA LOCALSTORAGE =====

  /**
   * Salva stato corrente in localStorage
   */
  private saveToLocalStorage(): void {
    try {
      const currentState = this.tavoloState$.value;
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(currentState));
      console.log('💾 Stato tavolo salvato in localStorage');
    } catch (error) {
      console.error('❌ Errore nel salvare stato tavolo:', error);
    }
  }

  /**
   * Carica stato da localStorage
   */
  private loadFromLocalStorage(): void {
    try {
      const savedState = localStorage.getItem(this.STORAGE_KEY);
      if (savedState) {
        const parsedState: TavoloState = JSON.parse(savedState);

        // 🔍 Converti le date da string a Date
        if (parsedState.oraInizioTavolo) {
          parsedState.oraInizioTavolo = new Date(parsedState.oraInizioTavolo);
        }
        if (parsedState.oraRichiestaConto) {
          parsedState.oraRichiestaConto = new Date(parsedState.oraRichiestaConto);
        }
        if (parsedState.ordiniStorico) {
          parsedState.ordiniStorico.forEach(ordine => {
            ordine.timestamp = new Date(ordine.timestamp);
          });
        }

        this.tavoloState$.next(parsedState);
        console.log('📥 Stato tavolo caricato da localStorage:', parsedState);
      }
    } catch (error) {
      console.error('❌ Errore nel caricare stato tavolo:', error);
      this.resetTavolo(); // Reset in caso di errore
    }
  }

  /**
   * Cancella stato da localStorage
   */
  private clearLocalStorage(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
      console.log('🗑️ Stato tavolo rimosso da localStorage');
    } catch (error) {
      console.error('❌ Errore nel cancellare localStorage:', error);
    }
  }

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
      totaleComplessivo: menuType === 'ayce' ? (ayceSettings?.costoTotale || 0) : 0,
      statoTavolo: 'attivo',
      modalitaMenuAttiva: true, // 🆕 NUOVO: Attiva modalità menu
      oraInizioTavolo: new Date()
    };

    this.tavoloState$.next(newState);
    this.saveToLocalStorage(); // 💾 SALVA SUBITO
    console.log('🍽️ Tavolo iniziato:', newState);
  }

  /**
   * 🆕 NUOVO: Attiva modalità menu automaticamente (per icone sempre visibili)
   */
  attivaModalitaMenu(menuType: MenuType = 'carta', ayceSettings?: AyceSettings): void {
    const currentState = this.tavoloState$.value;

    // Se il tavolo è vuoto, attivalo automaticamente
    if (currentState.statoTavolo === 'vuoto') {
      this.iniziaTavolo(menuType, ayceSettings);
      return;
    }

    // Altrimenti attiva solo la modalità menu per mostrare le icone
    const updatedState: TavoloState = {
      ...currentState,
      modalitaMenuAttiva: true,
      statoTavolo: currentState.statoTavolo,
    };

    this.tavoloState$.next(updatedState);
    this.saveToLocalStorage();
    console.log('🍱 Modalità menu attivata automaticamente');
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
      statoTavolo: 'attivo',
      modalitaMenuAttiva: true
    };

    this.tavoloState$.next(updatedState);
    this.saveToLocalStorage(); // 💾 SALVA DOPO OGNI ORDINE
    console.log('📝 Nuovo ordine aggiunto:', nuovoOrdine);
    console.log('💰 Totale tavolo:', updatedState.totaleComplessivo);
  }

  /**
   * Richiedi il conto finale
   */
  richiediConto(): void {
    const currentState = this.tavoloState$.value;

    // 🆕 NUOVO: Permetti richiesta conto anche senza ordini (per tavoli vuoti)
    // if (currentState.ordiniStorico.length === 0) {
    //   console.warn('⚠️ Nessun ordine presente per richiedere il conto');
    //   return;
    // }

    const updatedState: TavoloState = {
      ...currentState,
      statoTavolo: 'conto_richiesto',
      oraRichiestaConto: new Date()
    };

    this.tavoloState$.next(updatedState);
    this.saveToLocalStorage(); // 💾 SALVA RICHIESTA CONTO
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
      statoTavolo: 'vuoto',
      modalitaMenuAttiva: false
    };

    this.tavoloState$.next(emptyState);
    this.clearLocalStorage(); // 🗑️ CANCELLA STORAGE
    this.closeContoModal(); // 🆕 NUOVO: Chiude anche il modal se aperto
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
   * 🔧 SISTEMATO: Verifica se il tavolo è attivo (anche senza ordini per icone sempre visibili)
   */
  isTavoloAttivo(): boolean {
    const state = this.tavoloState$.value;
    return state.statoTavolo === 'attivo' || state.modalitaMenuAttiva;
  }

  /**
   * 🆕 NUOVO: Verifica se siamo in modalità menu (per icone sempre visibili)
   */
  isModalitaMenuAttiva(): boolean {
    return this.tavoloState$.value.modalitaMenuAttiva;
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

  // ===== 🆕 GESTIONE MODALITÀ REFRESH =====

  /**
   * Controlla se siamo in una pagina menu e attiva automaticamente
   */
  checkAndActivateMenuMode(currentRoute: string): void {
    if (currentRoute.includes('/menu/')) {
      const state = this.tavoloState$.value;

      // Se il tavolo non è attivo, attivalo automaticamente
      if (state.statoTavolo === 'vuoto' && !state.modalitaMenuAttiva) {
        console.log('🔄 Refresh rilevato in pagina menu, attivo modalità automatica');
        this.attivaModalitaMenu();
      }
    }
  }

  /**
   * 🆕 NUOVO: Preserva modalità AYCE dopo refresh
   */
  preserveAYCEMode(): void {
    const state = this.tavoloState$.value;
    if (state.menuType === 'ayce' && state.ayceSettings) {
      console.log('🍱 Modalità AYCE preservata dopo refresh');
      // Lo stato è già salvato in localStorage, non serve fare nulla
    }
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

  // ===== 🆕 DEBUG E MONITORAGGIO =====

  /**
   * Debug stato completo
   */
  debugCurrentState(): void {
    const state = this.tavoloState$.value;
    console.log('🔍 DEBUG TAVOLO STATE:', {
      numeroTavolo: state.numeroTavolo,
      menuType: state.menuType,
      statoTavolo: state.statoTavolo,
      modalitaMenuAttiva: state.modalitaMenuAttiva,
      numeroOrdini: state.ordiniStorico.length,
      totaleComplessivo: state.totaleComplessivo,
      ayceSettings: state.ayceSettings,
      oraInizio: state.oraInizioTavolo,
      oraRichiestaConto: state.oraRichiestaConto,
      modalContoAperto: this.showContoModalSubject.value // 🆕 NUOVO DEBUG
    });
  }

  /**
   * Forza salvataggio stato (per debug)
   */
  forceSave(): void {
    this.saveToLocalStorage();
    console.log('💾 Stato salvato forzatamente');
  }
}
