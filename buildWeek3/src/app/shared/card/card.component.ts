import {
  Component,
  OnInit,
  Input,
  ViewChild,
  TemplateRef,
} from '@angular/core';
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
      this.menuSvc
        .getByCategoryAndAvailability(this.category, this.availability)
        .subscribe((items) => {
          this.menu = items.map((item) => ({ ...item, quantity: 1 }));
        });
    }
    this.cartSvc.cartItems$.subscribe((items) => {
      this.cartItems = items;
    });
  }

  sendOrder() {
    // Prepara l'ordine con gli elementi nel carrello e il costo totale
    const order = {
      items: this.cartItems,
      totalCost: this.cartSvc.getTotalCost(),
    };
    this.http.post(this.apiUrl, order).subscribe(() => {
      this.cartSvc.clearCart(); // Svuota il carrello
      this.modalService.dismissAll(); // Chiude tutti i modali aperti

      // Mostra l'alert con SweetAlert
      Swal.fire({
        title: 'Ordine Inviato',
        text: 'Il tuo ordine è stato inviato con successo!',
        icon: 'success',
        confirmButtonText: 'OK',
      }).then(() => {
        // Reindirizza alla homepage dopo aver chiuso l'alert
        this.router.navigate(['/homepage']);
      });
    });
  }

  incrementQuantity(item: iMenu) {
    item.quantity++;
  }

  decrementQuantity(item: iMenu) {  // Metodo per decrementare la quantità di un piatto.
    if (item.quantity > 0) {
      item.quantity--;
    }
  }

  addToCart(item: iMenu) {  //Metodo per aggiungere un piatto al carrello. Se la quantità è maggiore di 0, aggiunge il piatto al carrello, reimposta la quantità a 1 e mostra una notifica.
    if (item.quantity > 0) {
      this.cartSvc.addToCart(item);
      item.quantity = 1;
      this.showToastMessage();
    }
  }

  openCart(content: TemplateRef<any>) {
    // Apre il modal del carrello
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  getTotalCost(): number {  //Metodo per ottenere il costo totale degli articoli nel carrello.
    return this.cartSvc.getTotalCost();
  }

  clearCart() { // Metodo per svuotare il carrello.
    this.cartSvc.clearCart();
  }

  removeFromCart(item: iMenu) {  //Metodo per rimuovere un piatto dal carrello.
    this.cartSvc.removeFromCart(item);
  }

  showToastMessage() {
    // Mostra un messaggio toast per 3 secondi
    this.showToast = true;
    setTimeout(() => {
      this.showToast = false;
    }, 3000);
  }

  hideToast() {
    // Nasconde il messaggio toast
    this.showToast = false;
  }
}
