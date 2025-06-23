import { Component, OnInit } from '@angular/core';
import { MenuService } from '../../../menu.service';
import { iMenu } from '../../../Models/i-menu';

@Component({
  selector: 'app-bibite',
  templateUrl: './bibite.component.html',
  styleUrl: './bibite.component.scss'
})

export class BibiteComponent implements OnInit {
   ngOnInit() {
    window.scrollTo(0, 0); // Forza scroll in cima
  }
}
