import { Component, OnInit, Input } from '@angular/core';
import { MenuService } from '../../menu.service';
import { CartService } from '../../cart.service';
import { iMenu } from '../../Models/i-menu';
import { iCartItem } from '../../Models/i-cart-item';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {

  // 🆕 NUOVO: Input per filtrare per categoria e disponibilità
  @Input() category?: string;
  @Input() availability?: boolean;

  menu: iMenu[] = [];
  cartItems: iCartItem[] = [];

  // 🆕 NUOVO: Map per gestire quantità temporanee nell'UI
  tempQuantities: { [menuId: number]: number } = {};

  showToast = false;
  showSuccessToast = false;
  showErrorToast = false;

  constructor(
    private menuSvc: MenuService,
    private cartSvc: CartService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    // Carica il menu dal backend Spring Boot
    this.menuSvc.getAll().subscribe({
      next: (data) => {
        // 🔧 FILTRO: Applica filtri per categoria e disponibilità se presenti
        this.menu = data.filter(item => {
          let match = true;

          if (this.category) {
            match = match && item.categoria === this.category;
          }

          if (this.availability !== undefined) {
            match = match && item.disponibile === this.availability;
          }

          return match;
        });

        // Inizializza quantità temporanee a 1 per ogni item
        this.menu.forEach(item => {
          this.tempQuantities[item.id] = 1;
        });
      },
      error: (error) => {
        console.error('Errore nel caricamento del menu:', error);
      }
    });

    // Sottoscrivi al carrello per aggiornamenti in tempo reale
    this.cartSvc.cartItems$.subscribe(items => {
      this.cartItems = items;
    });
  }

  // 🔧 AGGIORNATO: Usa tempQuantities per l'UI
  incrementQuantity(item: iMenu): void {
    this.tempQuantities[item.id]++;
  }

  // 🔧 AGGIORNATO: Usa tempQuantities per l'UI
  decrementQuantity(item: iMenu): void {
    if (this.tempQuantities[item.id] > 1) {
      this.tempQuantities[item.id]--;
    }
  }

  // 🔧 AGGIORNATO: Aggiungi al carrello con quantità temporanea
  addToCart(item: iMenu): void {
    const quantity = this.tempQuantities[item.id];
    this.cartSvc.addToCart(item, quantity);

    // Reset quantità temporanea a 1 dopo l'aggiunta
    this.tempQuantities[item.id] = 1;

    // Mostra toast di conferma
    this.showToastMessage();
  }

  // 🆕 NUOVO: Gestione quantità nel carrello (per il modal)
  incrementCartQuantity(cartItem: iCartItem): void {
    console.log('🔼 Incremento:', cartItem.titolo, 'da', cartItem.quantity, 'a', cartItem.quantity + 1);
    this.cartSvc.updateQuantity(cartItem.id, cartItem.quantity + 1);
  }

  // 🆕 NUOVO: Gestione quantità nel carrello (per il modal) - CON DEBUG
  decrementCartQuantity(cartItem: iCartItem): void {
    console.log('🔽 Decremento chiamato per:', cartItem.titolo);
    console.log('📊 Quantità attuale:', cartItem.quantity);
    console.log('🆔 ID item:', cartItem.id);

    if (cartItem.quantity > 1) {
      console.log('✅ Condizione OK, decremento da', cartItem.quantity, 'a', cartItem.quantity - 1);
      this.cartSvc.updateQuantity(cartItem.id, cartItem.quantity - 1);
    } else {
      console.log('❌ Quantità già al minimo (1), non posso decrementare');
    }
  }

  // ✅ RIMANE UGUALE: Rimuovi dal carrello
  removeFromCart(item: iCartItem): void {
    this.cartSvc.removeFromCart(item);
  }

  // ✅ RIMANE UGUALE: Svuota carrello
  clearCart(): void {
    this.cartSvc.clearCart();
  }

  // ✅ RIMANE UGUALE: Calcola totale
  getTotalCost(): number {
    return this.cartSvc.getTotalCost();
  }

  // 🆕 NUOVO: Invia ordine al backend
  sendOrder(): void {
    if (this.cartItems.length > 0) {
      this.cartSvc.createOrder(this.cartItems).subscribe({
        next: (order) => {
          console.log('Ordine inviato con successo:', order);
          this.clearCart();
          // 🎉 AGGIUNTO: Mostra conferma di successo
          this.showSuccessToastMessage();
        },
        error: (error) => {
          console.error('Errore nell\'invio dell\'ordine:', error);
          // 🚨 AGGIUNTO: Mostra errore
          this.showErrorToastMessage();
        }
      });
    }
  }

  // ✅ RIMANE UGUALE: Gestione toast
  showToastMessage(): void {
    this.showToast = true;
    setTimeout(() => {
      this.showToast = false;
    }, 3000);
  }

  hideToast(): void {
    this.showToast = false;
  }

  // 🆕 NUOVO: Toast di successo ordine
  showSuccessToastMessage(): void {
    this.showSuccessToast = true;
    setTimeout(() => {
      this.showSuccessToast = false;
    }, 5000); // 5 secondi per il successo
  }

  hideSuccessToast(): void {
    this.showSuccessToast = false;
  }

  // 🆕 NUOVO: Toast di errore ordine
  showErrorToastMessage(): void {
    this.showErrorToast = true;
    setTimeout(() => {
      this.showErrorToast = false;
    }, 5000);
  }

  hideErrorToast(): void {
    this.showErrorToast = false;
  }

  // ✅ RIMANE UGUALE: Apri modal carrello
  openCart(content: any): void {
    this.modalService.open(content, { size: 'lg' });
  }

  // 🆕 HELPER: Ottieni quantità temporanea per l'UI
  getTempQuantity(item: iMenu): number {
    return this.tempQuantities[item.id] || 1;
  }
}
