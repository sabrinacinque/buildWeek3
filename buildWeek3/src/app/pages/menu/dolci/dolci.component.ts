import { Component, OnInit } from '@angular/core';
import { iMenu } from '../../../Models/i-menu';
import { MenuService } from '../../../menu.service';

@Component({
  selector: 'app-dolci',
  templateUrl: './dolci.component.html',
  styleUrl: './dolci.component.scss'
})
export class DolciComponent implements OnInit {
  ngOnInit() {
    window.scrollTo(0, 0); // Forza scroll in cima
  }

}

