// menu.service.ts - VERSIONE ENHANCED CON PERSISTENZA
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { iMenu } from './Models/i-menu';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../environments/environment';

export type MenuType = 'carta' | 'ayce';

export interface AyceSettings {
  persone: number;
  prezzoPersona: number;
  costoTotale: number;
}

@Injectable({
  providedIn: 'root',
})
export class MenuService {

  apiUrl: string = `${environment.apiUrl}/menu`;

  // 🆕 GESTIONE TIPO MENU CON PERSISTENZA
  private menuType$ = new BehaviorSubject<MenuType>('carta');
  private ayceSettings$ = new BehaviorSubject<AyceSettings>({
    persone: 2,
    prezzoPersona: 24.90,
    costoTotale: 49.80
  });

  // 🔑 CHIAVE LOCALSTORAGE
  private readonly MENU_STORAGE_KEY = 'episushi_menu_state';

  constructor(private http: HttpClient) {
    // 🆕 CARICA STATO MENU DA LOCALSTORAGE ALL'AVVIO
    this.loadMenuStateFromStorage();
  }

  // ========================================
  // 🆕 PERSISTENZA LOCALSTORAGE
  // ========================================

  /**
   * Salva stato menu in localStorage
   */
  private saveMenuStateToStorage(): void {
    try {
      const menuState = {
        menuType: this.menuType$.value,
        ayceSettings: this.ayceSettings$.value
      };
      localStorage.setItem(this.MENU_STORAGE_KEY, JSON.stringify(menuState));
      console.log('💾 Menu state salvato:', menuState);
    } catch (error) {
      console.error('❌ Errore nel salvare menu state:', error);
    }
  }

  /**
   * Carica stato menu da localStorage
   */
  private loadMenuStateFromStorage(): void {
    try {
      const savedState = localStorage.getItem(this.MENU_STORAGE_KEY);
      if (savedState) {
        const menuState = JSON.parse(savedState);
        
        // Imposta il tipo menu
        const menuType = menuState.menuType || 'carta';
        this.menuType$.next(menuType);
        
        // Imposta le impostazioni AYCE se presenti
        if (menuState.ayceSettings) {
          this.ayceSettings$.next(menuState.ayceSettings);
        }
        
        console.log('📥 Menu state caricato:', menuState);
      }
    } catch (error) {
      console.error('❌ Errore nel caricare menu state:', error);
    }
  }

  // ========================================
  // METODI API ESISTENTI (invariati)
  // ========================================

  getAll(): Observable<iMenu[]> {
    return this.http.get<iMenu[]>(this.apiUrl);
  }

  getByCategoryAndAvailability(
    category: string,
    availability: boolean
  ): Observable<iMenu[]> {
    return this.http.get<iMenu[]>(this.apiUrl);
  }

  getById(id: number): Observable<iMenu> {
    return this.http.get<iMenu>(`${this.apiUrl}/${id}`);
  }

  create(newMenuItem: Partial<iMenu>): Observable<iMenu> {
    return this.http.post<iMenu>(this.apiUrl, newMenuItem);
  }

  update(item: iMenu): Observable<iMenu> {
    return this.http.put<iMenu>(`${this.apiUrl}/${item.id}`, item);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/count`);
  }

  exists(id: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/exists/${id}`);
  }

  // ========================================
  // 🆕 METODI PER GESTIONE MENU TYPE
  // ========================================

  /**
   * Imposta il tipo di menu (carta o ayce) con persistenza
   */
  setMenuType(type: MenuType, ayceSettings?: AyceSettings): void {
    this.menuType$.next(type);
    
    if (ayceSettings) {
      this.ayceSettings$.next(ayceSettings);
    }
    
    // 🆕 SALVA STATO AUTOMATICAMENTE
    this.saveMenuStateToStorage();
    
    console.log('🍱 Menu type impostato:', type, ayceSettings);
  }

  /**
   * Ottiene il tipo di menu corrente (Observable)
   */
  getMenuType(): Observable<MenuType> {
    return this.menuType$.asObservable();
  }

  /**
   * Ottiene il tipo di menu corrente (valore sincrono)
   */
  getCurrentMenuType(): MenuType {
    return this.menuType$.value;
  }

  /**
   * Imposta le impostazioni AYCE (persone e costo)
   */
  setAyceSettings(persone: number): void {
    const prezzoPersona = 24.90;
    const costoTotale = persone * prezzoPersona;

    const newSettings: AyceSettings = {
      persone,
      prezzoPersona,
      costoTotale
    };

    this.ayceSettings$.next(newSettings);
    
    // 🆕 SALVA STATO AUTOMATICAMENTE
    this.saveMenuStateToStorage();
    
    console.log('🍱 AYCE settings aggiornate:', newSettings);
  }

  /**
   * Ottiene le impostazioni AYCE (Observable)
   */
  getAyceSettings(): Observable<AyceSettings> {
    return this.ayceSettings$.asObservable();
  }

  /**
   * Ottiene le impostazioni AYCE correnti (valore sincrono)
   */
  getCurrentAyceSettings(): AyceSettings {
    return this.ayceSettings$.value;
  }

  // ========================================
  // 🆕 METODI PER CALCOLI PREZZI
  // ========================================

  /**
   * Calcola il prezzo di un prodotto in base al tipo menu
   */
  getDisplayPrice(item: iMenu): number {
    const menuType = this.getCurrentMenuType();

    if (menuType === 'ayce') {
      // Nel menu AYCE, solo bibite e dolci hanno prezzo
      if (item.categoria === 'Bibite' || item.categoria === 'Dolci') {
        return item.prezzo;
      }
      return 0; // Tutto il resto è gratis
    }

    return item.prezzo; // Menu alla carta: prezzo normale
  }

  /**
   * Verifica se un prodotto è gratuito nel menu AYCE
   */
  isItemFreeInAyce(item: iMenu): boolean {
    const menuType = this.getCurrentMenuType();
    return menuType === 'ayce' &&
           item.categoria !== 'Bibite' &&
           item.categoria !== 'Dolci';
  }

  /**
   * Calcola il costo aggiuntivo per bibite/dolci in AYCE
   */
  calculateAyceExtras(cartItems: any[]): number {
    if (this.getCurrentMenuType() !== 'ayce') {
      return 0;
    }

    return cartItems
      .filter(item => item.categoria === 'Bibite' || item.categoria === 'Dolci')
      .reduce((total, item) => total + (item.prezzo * item.quantity), 0);
  }

  /**
   * Calcola il totale finale del carrello considerando AYCE
   */
  calculateFinalTotal(cartItems: any[]): number {
    if (this.getCurrentMenuType() === 'carta') {
      // Menu alla carta: somma normale
      return cartItems.reduce((total, item) => total + (item.prezzo * item.quantity), 0);
    } else {
      // Menu AYCE: costo base + extra (bibite/dolci)
      const ayceBaseCost = this.getCurrentAyceSettings().costoTotale;
      const extrasTotal = this.calculateAyceExtras(cartItems);
      return ayceBaseCost + extrasTotal;
    }
  }

  // ========================================
  // 🆕 UTILITY METHODS
  // ========================================

  /**
   * Reset delle impostazioni (utile per testing)
   */
  resetToDefaults(): void {
    this.setMenuType('carta');
    this.setAyceSettings(2);
    console.log('🔄 Menu service resettato ai valori di default');
  }

  /**
   * Cancella stato da localStorage
   */
  clearMenuState(): void {
    try {
      localStorage.removeItem(this.MENU_STORAGE_KEY);
      this.resetToDefaults();
      console.log('🗑️ Menu state cancellato da localStorage');
    } catch (error) {
      console.error('❌ Errore nel cancellare menu state:', error);
    }
  }

  /**
   * Debug: stampa stato corrente
   */
  debugCurrentState(): void {
    console.log('🔍 DEBUG MENU STATE:', {
      menuType: this.getCurrentMenuType(),
      ayceSettings: this.getCurrentAyceSettings(),
      localStorage: localStorage.getItem(this.MENU_STORAGE_KEY)
    });
  }
}