import { Component, OnInit, Input } from '@angular/core';
import { MenuService } from '../../menu.service';
import { iMenu } from '../../Models/i-menu';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent implements OnInit {
  @Input()
  category!: string;
  menu: iMenu[] = [];

  constructor(private menuSvc: MenuService) {}

  ngOnInit() {
    if (this.category) {
      this.menuSvc.getByCategory(this.category).subscribe((items) => {
        this.menu = items;
      });
    }
  }
}
