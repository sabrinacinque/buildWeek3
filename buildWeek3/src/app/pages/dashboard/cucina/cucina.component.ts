import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { iOrder } from '../../../Models/iorder';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-cucina',
  templateUrl: './cucina.component.html',
  styleUrl: './cucina.component.scss',
})
export class CucinaComponent implements OnInit {
  // Determina se mostrare o meno alcuni elementi dell'interfaccia
  show: boolean = false;
  // Array per tenere traccia degli ordini ricevuti
  orders: iOrder[] = [];
  // Array utilizzato per tenere traccia dello stato di verifica di ciascun ordine
  verificatoProperty: { [key: number]: boolean } = {};
  // Stili dinamici applicati a certi elementi dell'interfaccia
  dynamicStyles = {
    'background-color': '#99735e',
  };

  // Filtro per gli ordini
  filtroOrdini: 'da_evadere' | 'completati' | 'tutti' = 'da_evadere';
  loading: boolean = false;
  error: string = '';

  private readonly API_URL = `${environment.apiUrl}/orders`;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadOrdersByFilter();
    // Auto-refresh ogni 30 secondi
    setInterval(() => {
      this.loadOrdersByFilter();
    }, 30000);
  }

  /**
   * Carica gli ordini in base al filtro selezionato
   */
  loadOrdersByFilter() {
    this.loading = true;
    this.error = '';

    let endpoint = '';

    switch (this.filtroOrdini) {
      case 'da_evadere':
        endpoint = `${this.API_URL}/pending`;
        break;
      case 'completati':
        endpoint = `${this.API_URL}/completed`;
        break;
      case 'tutti':
        endpoint = `${this.API_URL}`;
        break;
    }

    this.http.get<iOrder[]>(endpoint).subscribe({
      next: (data) => {
        this.orders = data;
        console.log(`Ordini caricati (${this.filtroOrdini}):`, this.orders);
        this.loading = false;
      },
      error: (error) => {
        console.error('Errore nel caricamento ordini:', error);
        this.error = 'Errore nel caricamento degli ordini dal server';
        this.loading = false;
      }
    });
  }

  /**
   * Metodo chiamato quando cambia il filtro
   */
  onFiltroChange() {
    this.loadOrdersByFilter();
  }

  /**
   * Metodo aggiornato per gestire la verifica/completamento di un ordine
   * Ora fa chiamata al backend per marcare come evaso
   */
  verificatoMethod(orderId: number): void {
    // Controlla se l'ordine è già stato verificato
    if (this.verificatoProperty[orderId]) {
      return; // Evita double-click
    }

    // Marca come verificato localmente
    this.verificatoProperty[orderId] = true;

    // Chiamata al backend per marcare come evaso
    this.http.put(`${this.API_URL}/${orderId}/complete`, {}).subscribe({
      next: (response) => {
        console.log(`Ordine ${orderId} marcato come evaso`);

        // Se stiamo visualizzando "da evadere", rimuovi l'ordine dalla lista
        if (this.filtroOrdini === 'da_evadere') {
          setTimeout(() => {
            this.orders = this.orders.filter(order => order.id !== orderId);
            delete this.verificatoProperty[orderId];
          }, 2000);
        } else {
          // Altrimenti aggiorna l'ordine per mostrarlo come completato
          const orderIndex = this.orders.findIndex(order => order.id === orderId);
          if (orderIndex !== -1) {
            this.orders[orderIndex].evaso = true;
          }
        }
      },
      error: (error) => {
        console.error('Errore nel completare ordine:', error);
        this.error = `Errore nel completare l'ordine ${orderId}`;

        // Reset dello stato locale in caso di errore
        this.verificatoProperty[orderId] = false;
      }
    });
  }

  /**
   * Refresh manuale degli ordini
   */
  refreshOrders(): void {
    this.loadOrdersByFilter();
  }

  /**
   * Restituisce il badge del contatore con il colore appropriato
   */
  getBadgeClass(): string {
    switch (this.filtroOrdini) {
      case 'da_evadere':
        return 'bg-warning';
      case 'completati':
        return 'bg-success';
      case 'tutti':
        return 'bg-warning';
      default:
        return 'bg-warning';
    }
  }

  /**
   * Restituisce il titolo della pagina in base al filtro
   */
  getPageTitle(): string {
    switch (this.filtroOrdini) {
      case 'da_evadere':
        return 'Ordini da Evadere';
      case 'completati':
        return 'Ordini Completati';
      case 'tutti':
        return 'Tutti gli Ordini';
      default:
        return 'Ordini';
    }
  }

  /**
   * Determina se mostrare il toggle di completamento
   */
  shouldShowToggle(order: iOrder): boolean {
    return this.filtroOrdini !== 'completati' && !order.evaso;
  }

  /**
   * Formatta il prezzo per la visualizzazione
   */
  formatPrice(price: number): string {
    return `€${price.toFixed(2)}`;
  }

  /**
   * Formatta la data per la visualizzazione
   */
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Calcola il tempo trascorso dall'ordine
   */
  getTimeElapsed(orderDate: string): string {
    const now = new Date();
    const orderTime = new Date(orderDate);
    const diffMs = now.getTime() - orderTime.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Appena ricevuto';
    if (diffMins < 60) return `${diffMins} min fa`;

    const diffHours = Math.floor(diffMins / 60);
    return `${diffHours}h ${diffMins % 60}m fa`;
  }

  /**
   * Determina la classe CSS per l'urgenza dell'ordine
   */
  getOrderUrgencyClass(orderDate: string): string {
    const now = new Date();
    const orderTime = new Date(orderDate);
    const diffMs = now.getTime() - orderTime.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins > 20) return 'urgent';
    if (diffMins > 10) return 'warning';
    return 'normal';
  }

  /**
   * TrackBy function per migliorare le performance del *ngFor
   */
  trackByOrderId(index: number, order: iOrder): number {
    return order.id;
  }
}
