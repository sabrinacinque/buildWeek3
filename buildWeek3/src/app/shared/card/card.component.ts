import { Component, OnInit, Input, ViewChild, TemplateRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MenuService } from '../../menu.service';
import { iMenu } from '../../Models/i-menu';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent implements OnInit {
  @Input() category!: string;
  menu: iMenu[] = [];
  cartItems: iMenu[] = [];
  showToast: boolean = false;
  apiUrl: string = 'http://localhost:3000/orders';

  @ViewChild('cartModal') cartModal!: TemplateRef<any>; // Referenza al template del modal

  constructor(private menuSvc: MenuService, private modalService: NgbModal , private http: HttpClient) {}

  ngOnInit() {
    if (this.category) {
      this.menuSvc.getByCategory(this.category).subscribe((items) => {
        this.menu = items.map(item => ({ ...item, quantity: 1 })); // Aggiungiamo la proprietà quantity
      });
    }
  }

  sendOrder() {
    const order = { items: this.cartItems, totalCost: this.getTotalCost() };
    this.http.post(this.apiUrl, order).subscribe(() => {
      // Rimuovi gli articoli dal carrello dopo l'invio dell'ordine
      this.clearCart();
      // Chiudi il modal
      this.modalService.dismissAll();
    });
  }

  incrementQuantity(item: iMenu) {
    item.quantity++;
  }

  decrementQuantity(item: iMenu) {
    if (item.quantity > 0) {
      item.quantity--;
    }
  }

  addToCart(item: iMenu) {
    if (item.quantity > 0) {
      const cartItem = this.cartItems.find(ci => ci.id === item.id);
      if (cartItem) {
        cartItem.quantity += item.quantity;
      } else {
        this.cartItems.push({ ...item });
      }
      item.quantity = 1; // Reset della quantità dopo aver aggiunto al carrello
      this.showToastMessage();
    }
  }

  openCart(content: TemplateRef<any>) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  getTotalCost(): number {
    return this.cartItems.reduce((total, item) => total + item.prezzo * item.quantity, 0);
  }

  clearCart() {
    this.cartItems = [];
  }

  removeFromCart(item: iMenu) {
    const index = this.cartItems.findIndex(ci => ci.id === item.id);
    if (index !== -1) {
      this.cartItems.splice(index, 1);
    }
  }
  showToastMessage() {
    this.showToast = true;
    setTimeout(() => {
      this.showToast = false;
    }, 3000); // Il toast scompare dopo 3 secondi
  }

  hideToast() {
    this.showToast = false;
  }
}
