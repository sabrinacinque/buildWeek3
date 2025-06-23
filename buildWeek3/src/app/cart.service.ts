import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { iMenu } from './Models/i-menu';
import { iCartItem } from './Models/i-cart-item';
import { HttpClient } from '@angular/common/http';
import { iOrder } from './Models/iorder';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  // 🔧 AGGIORNATO: Usa iCartItem invece di iMenu
  private cartItemsSubject = new BehaviorSubject<iCartItem[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable();

  get cartItems(): iCartItem[] {
    return this.cartItemsSubject.value;
  }

  // 🔧 AGGIORNATO: Accetta iMenu e quantity separati
  addToCart(menuItem: iMenu, quantity: number = 1) {
    const currentItems = this.cartItems;
    const cartItem = currentItems.find((ci) => ci.id === menuItem.id);

    if (cartItem) {
      // Se già presente, incrementa la quantità
      cartItem.quantity += quantity;
    } else {
      // Se nuovo, crea iCartItem aggiungendo quantity
      const newCartItem: iCartItem = {
        ...menuItem,
        quantity: quantity
      };
      currentItems.push(newCartItem);
    }
    this.cartItemsSubject.next(currentItems);
  }

  removeFromCart(item: iCartItem) {
    const currentItems = this.cartItems;
    const index = currentItems.findIndex((ci) => ci.id === item.id);
    if (index !== -1) {
      currentItems.splice(index, 1);
    }
    this.cartItemsSubject.next(currentItems);
  }

  // 🆕 NUOVO: Aggiorna quantità di un item specifico
  updateQuantity(itemId: number, quantity: number) {
    const currentItems = this.cartItems;
    const cartItem = currentItems.find((ci) => ci.id === itemId);
    if (cartItem) {
      if (quantity <= 0) {
        // Se quantità 0 o negativa, rimuovi l'item
        this.removeFromCart(cartItem);
      } else {
        cartItem.quantity = quantity;
        this.cartItemsSubject.next(currentItems);
      }
    }
  }

  clearCart() {
    this.cartItemsSubject.next([]);
  }

  getTotalCost(): number {
    return this.cartItems.reduce(
      (total, item) => total + item.prezzo * item.quantity,
      0
    );
  }

  // 🚀 AGGIORNATO: URL per Spring Boot
  orderUrl = `${environment.apiUrl}/orders`;

  constructor(private http: HttpClient) {}

  orderSubject = new BehaviorSubject<null | iOrder[]>(null);
  order$ = this.orderSubject.asObservable();

  // ✅ Pronto per Spring Boot
  getAll(): Observable<iOrder[]> {
    return this.http.get<iOrder[]>(this.orderUrl);
  }

  // 🆕 NUOVO: Crea ordine (per quando implementeremo gli ordini)
  createOrder(items: iCartItem[]): Observable<iOrder> {
    const orderData = {
      items: items.map(item => ({
        menuId: item.id,
        quantity: item.quantity
      }))
    };
    return this.http.post<iOrder>(this.orderUrl, orderData);
  }
}
