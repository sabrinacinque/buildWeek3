import { iCartItem } from  './i-cart-item';

export interface iOrder {
  id: number;
  items: iCartItem[]; // 🔧 Ora usa iCartItem che include quantity
  totalCost: number;
  orderDate?: string; // 🆕 Aggiunto per compatibilità con Spring Boot
  evaso?: boolean;    // 🆕 Aggiunto per compatibilità con Spring Boot
}
