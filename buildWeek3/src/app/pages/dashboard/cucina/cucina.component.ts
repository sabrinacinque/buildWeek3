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
  show: boolean = false;
  orders: iOrder[] = [];

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
}
