import { Component, OnInit, Input } from '@angular/core';
import { MenuService, MenuType } from '../../menu.service';
import { CartService } from '../../cart.service';
import { iMenu } from '../../Models/i-menu';
import { iCartItem } from '../../Models/i-cart-item';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TavoloService } from '../../tavolo-service.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {

  @Input() category?: string;
  @Input() availability?: boolean;

  menu: iMenu[] = [];
  cartItems: iCartItem[] = [];

  // Map per gestire quantità temporanee nell'UI
  tempQuantities: { [menuId: number]: number } = {};

  // 🆕 NUOVO: Tipo menu corrente
  currentMenuType: MenuType = 'carta';

  showToast = false;
  showSuccessToast = false;
  showErrorToast = false;

  constructor(
    public menuSvc: MenuService,  // ✅ PUBLIC come nel tuo
    private cartSvc: CartService,
    private modalService: NgbModal,
    private tavoloService: TavoloService // ✅ AGGIUNTO
  ) {}

  // 🆕 AGGIUNTO: Getter per accedere alle impostazioni AYCE nel template
  getCurrentAyceSettings() {
    return this.menuSvc.getCurrentAyceSettings();
  }

  ngOnInit(): void {
    console.log('🔍 API URL usato:', this.menuSvc.apiUrl);

    // 🆕 NUOVO: Sottoscrivi ai cambiamenti del tipo menu
    this.menuSvc.getMenuType().subscribe(type => {
      this.currentMenuType = type;
      console.log('📋 Tipo menu cambiato a:', type);
    });

    // Carica il menu dal backend Spring Boot
    this.menuSvc.getAll().subscribe({
      next: (data) => {
        console.log('✅ Dati ricevuti:', data);

        // Applica filtri per categoria e disponibilità se presenti
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

  // 🆕 NUOVO: Ottieni il prezzo da mostrare (AYCE vs Carta)
  getDisplayPrice(item: iMenu): number {
    return this.menuSvc.getDisplayPrice(item);
  }

  // 🆕 NUOVO: Verifica se un item è gratuito nel menu AYCE
  isItemFreeInAyce(item: iMenu): boolean {
    return this.menuSvc.isItemFreeInAyce(item);
  }

  // Incrementa quantità temporanea
  incrementQuantity(item: iMenu): void {
    this.tempQuantities[item.id]++;
  }

  // Decrementa quantità temporanea
  decrementQuantity(item: iMenu): void {
    if (this.tempQuantities[item.id] > 1) {
      this.tempQuantities[item.id]--;
    }
  }

  // Aggiungi al carrello con quantità temporanea
  addToCart(item: iMenu): void {
    const quantity = this.tempQuantities[item.id];
    this.cartSvc.addToCart(item, quantity);

    // Reset quantità temporanea a 1 dopo l'aggiunta
    this.tempQuantities[item.id] = 1;

    // Mostra toast di conferma
    this.showToastMessage();
  }

  // Gestione quantità nel carrello (per il modal)
  incrementCartQuantity(cartItem: iCartItem): void {
    console.log('🔼 Incremento:', cartItem.titolo, 'da', cartItem.quantity, 'a', cartItem.quantity + 1);
    this.cartSvc.updateQuantity(cartItem.id, cartItem.quantity + 1);
  }

  // Gestione quantità nel carrello (per il modal)
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

  // Rimuovi dal carrello
  removeFromCart(item: iCartItem): void {
    this.cartSvc.removeFromCart(item);
  }

  // Svuota carrello
  clearCart(): void {
    this.cartSvc.clearCart();
  }

  // 🔧 SISTEMATO: Calcola totale carrello (solo items correnti, senza base AYCE)
  getTotalCost(): number {
    const currentMenuType = this.menuSvc.getCurrentMenuType();

    if (currentMenuType === 'ayce') {
      // Per AYCE: mostra solo il costo di bibite e dolci nel carrello
      return this.cartItems
        .filter(item => item.categoria === 'Bibite' || item.categoria === 'Dolci')
        .reduce((total, item) => total + (item.prezzo * item.quantity), 0);
    } else {
      // Per menu alla carta: totale normale
      return this.cartItems.reduce((total, item) => total + (item.prezzo * item.quantity), 0);
    }
  }

  // 🔧 SISTEMATO: Invia ordine al backend E al TavoloService
  sendOrder(): void {
    if (this.cartItems.length > 0) {
      console.log('📦 Invio ordine:', this.cartItems);
      console.log('🍽️ Stato tavolo PRIMA dell\'ordine:', this.tavoloService.getCurrentTavoloState());

      // 1. Invia ordine al backend (come prima)
      this.cartSvc.createOrder(this.cartItems).subscribe({
        next: (order) => {
          console.log('✅ Ordine inviato con successo al backend:', order);

          // 2. 🆕 NUOVO: Aggiungi ordine al TavoloService per lo storico
          this.tavoloService.aggiungiOrdine([...this.cartItems]); // Copia degli items

          console.log('🍽️ Stato tavolo DOPO aggiunta ordine:', this.tavoloService.getCurrentTavoloState());

          // 3. Svuota il carrello
          this.clearCart();

          // 4. Mostra conferma di successo
          this.showSuccessToastMessage();
        },
        error: (error) => {
          console.error('❌ Errore nell\'invio dell\'ordine:', error);
          this.showErrorToastMessage();
        }
      });
    } else {
      console.warn('⚠️ Carrello vuoto, nessun ordine da inviare');
    }
  }

  // Gestione toast
  showToastMessage(): void {
    this.showToast = true;
    setTimeout(() => {
      this.showToast = false;
    }, 1500);
  }

  hideToast(): void {
    this.showToast = false;
  }

  // Toast di successo ordine
  showSuccessToastMessage(): void {
    this.showSuccessToast = true;
    setTimeout(() => {
      this.showSuccessToast = false;
    }, 5000);
  }

  hideSuccessToast(): void {
    this.showSuccessToast = false;
  }

  // Toast di errore ordine
  showErrorToastMessage(): void {
    this.showErrorToast = true;
    setTimeout(() => {
      this.showErrorToast = false;
    }, 5000);
  }

  hideErrorToast(): void {
    this.showErrorToast = false;
  }

  // Apri modal carrello
  openCart(content: any): void {
    this.modalService.open(content, { size: 'lg' });
  }

  // Helper: Ottieni quantità temporanea per l'UI
  getTempQuantity(item: iMenu): number {
    return this.tempQuantities[item.id] || 1;
  }
}
