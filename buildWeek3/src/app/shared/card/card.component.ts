import { Component, OnInit, Input, ViewChild, TemplateRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MenuService } from '../../menu.service';
import { iMenu } from '../../Models/i-menu';
import { HttpClient } from '@angular/common/http';
import { CartService } from '../../cart.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';


@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent implements OnInit {
  @Input() category!: string;
  @Input() availability!: boolean;

  menu: iMenu[] = [];
  showToast: boolean = false;
  apiUrl: string = 'http://localhost:3000/orders';

  cartItems: iMenu[] = []; // Aggiungi questa linea

  @ViewChild('cartModal') cartModal!: TemplateRef<any>;


  constructor(
    private menuSvc: MenuService,
    private modalService: NgbModal,
    private cartSvc: CartService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    if (this.category) {
      this.menuSvc.getByCategoryAndAvailability(this.category, this.availability).subscribe((items) => {
        this.menu = items.map(item => ({ ...item, quantity: 1 }));
      });
    }
    this.cartSvc.cartItems$.subscribe(items => {
      this.cartItems = items;
    });
  }

  sendOrder() {
    const order = { items: this.cartItems, totalCost: this.cartSvc.getTotalCost() };
    this.http.post(this.apiUrl, order).subscribe(() => {
      this.cartSvc.clearCart();
      this.modalService.dismissAll();

      // Mostra l'alert con SweetAlert
      Swal.fire({
        title: 'Ordine Inviato',
        text: 'Il tuo ordine è stato inviato con successo!',
        icon: 'success',
        confirmButtonText: 'OK'
      }).then(() => {
        // Reindirizza alla homepage dopo aver chiuso l'alert
        this.router.navigate(['/homepage']);
      });
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
      this.cartSvc.addToCart(item);
      item.quantity = 1;
      this.showToastMessage();
    }
  }

  openCart(content: TemplateRef<any>) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  getTotalCost(): number {
    return this.cartSvc.getTotalCost();
  }

  clearCart() {
    this.cartSvc.clearCart();
  }

  removeFromCart(item: iMenu) {
    this.cartSvc.removeFromCart(item);
  }

  showToastMessage() {
    this.showToast = true;
    setTimeout(() => {
      this.showToast = false;
    }, 3000);
  }

  hideToast() {
    this.showToast = false;
  }
}
