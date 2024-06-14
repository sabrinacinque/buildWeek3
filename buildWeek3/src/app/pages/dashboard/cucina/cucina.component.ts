import { Component } from '@angular/core';

import { MenuService } from '../../../menu.service';
import { iOrder } from '../../../Models/iorder';
import { CartService } from '../../../cart.service';

@Component({
  selector: 'app-cucina',
  templateUrl: './cucina.component.html',
  styleUrl: './cucina.component.scss',
})
export class CucinaComponent {
  // Determina se mostrare o meno alcuni elementi dell'interfaccia
  show: boolean = false;
  // Array per tenere traccia degli ordini ricevuti
  orders: iOrder[] = [];
  // Array utilizzato per tenere traccia dello stato di verifica di ciascun ordine
  verificatoProperty: boolean[] = [];
  // Stili dinamici applicati a certi elementi dell'interfaccia
  dynamicStyles = {
    'background-color': '#99735e',
  };

  constructor(private CartSvc: CartService) {}

  ngOnInit() {
    this.CartSvc.getAll().subscribe((data: any[]) => {
      this.orders = data;
      console.log(this.orders);
    });
  }
  // Metodo per gestire la verifica di un ordine
  verificatoMethod(id: number) {
    // Controlla se l'ordine con l'ID specificato è già stato verificato
    if (this.verificatoProperty[id]) {
      // Se è già verificato, ne inverte lo stato (verificato/non verificato)
      this.verificatoProperty[id] = !this.verificatoProperty[id];
    } else {
      // Se non è ancora verificato, lo imposta come verificato
      this.verificatoProperty[id] = true;
    }
  }
}
