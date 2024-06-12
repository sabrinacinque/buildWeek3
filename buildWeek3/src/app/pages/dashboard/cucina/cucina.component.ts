import { Component } from '@angular/core';

import { MenuService } from '../../../menu.service';
import { iOrder } from '../../../Models/iorder';

@Component({
  selector: 'app-cucina',
  templateUrl: './cucina.component.html',
  styleUrl: './cucina.component.scss',
})
export class CucinaComponent {
  items: iOrder[] = [];

  constructor(private MenuSvc: MenuService) {}

  ngOnInit() {
    this.MenuSvc.getAll().subscribe((data: any[]) => {
      this.items = data;
    });
  }
}
