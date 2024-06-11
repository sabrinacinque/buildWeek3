import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { iMenu } from './Models/i-menu';


@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItemsSubject = new BehaviorSubject<iMenu[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable();

  get cartItems(): iMenu[] {
    return this.cartItemsSubject.value;
  }

  addToCart(item: iMenu) {
    const currentItems = this.cartItems;
    const cartItem = currentItems.find(ci => ci.id === item.id);
    if (cartItem) {
      cartItem.quantity += item.quantity;
    } else {
      currentItems.push({ ...item });
    }
    this.cartItemsSubject.next(currentItems);
  }

  removeFromCart(item: iMenu) {
    const currentItems = this.cartItems;
    const index = currentItems.findIndex(ci => ci.id === item.id);
    if (index !== -1) {
      currentItems.splice(index, 1);
    }
    this.cartItemsSubject.next(currentItems);
  }

  clearCart() {
    this.cartItemsSubject.next([]);
  }

  getTotalCost(): number {
    return this.cartItems.reduce((total, item) => total + item.prezzo * item.quantity, 0);
  }
}
