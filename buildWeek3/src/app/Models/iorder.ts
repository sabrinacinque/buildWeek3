import { iMenu } from './i-menu';

export interface iOrder {
  id: number;
  titolo: string;
  ingredienti: string;
  img: string;
  categoria: string;
  prezzo: number;
  disponibile: boolean;
  quantity: number;
  totalCost: number;
}
