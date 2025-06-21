// Models/iorder.ts
export interface iOrderItem {
  id: number;
  titolo: string;
  quantity: number;
  prezzo: number;
  menu?: {
    id: number;
    titolo: string;
    ingredienti: string;
    img: string;
    categoria: string;
    prezzo: number;
    disponibile: boolean;
  };
}

export interface iOrder {
  id: number;
  items: iOrderItem[];
  totalCost: number;
  orderDate: string;
  evaso: boolean;
}
