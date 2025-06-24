// menu.service.ts - VERSIONE ENHANCED
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

  // 🆕 NUOVO: Gestione tipo menu
  private menuType$ = new BehaviorSubject<MenuType>('carta');
  private ayceSettings$ = new BehaviorSubject<AyceSettings>({
    persone: 2,
    prezzoPersona: 24.90,
    costoTotale: 49.80
  });

  constructor(private http: HttpClient) {}

  // ========================================
  // METODI ESISTENTI (invariati)
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
  // 🆕 NUOVI METODI PER AYCE
  // ========================================

  /**
   * Imposta il tipo di menu (carta o ayce)
   */
  setMenuType(type: MenuType): void {
    this.menuType$.next(type);
  }

  /**
   * Ottiene il tipo di menu corrente
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

    this.ayceSettings$.next({
      persone,
      prezzoPersona,
      costoTotale
    });
  }

  /**
   * Ottiene le impostazioni AYCE
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

  /**
   * Calcola il prezzo di un prodotto in base al tipo menu
   * @param item - Il prodotto del menu
   * @returns Il prezzo da mostrare
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
   * (da usare nel carrello)
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

  /**
   * Reset delle impostazioni (utile per testing)
   */
  resetToDefaults(): void {
    this.setMenuType('carta');
    this.setAyceSettings(2);
  }
}
