import { Component, OnInit } from '@angular/core';
import { iMenu } from '../../../Models/i-menu';
import { MenuService } from '../../../menu.service';

@Component({
  selector: 'app-hosomaki',
  templateUrl: './hosomaki.component.html',
  styleUrl: './hosomaki.component.scss'
})
export class HosomakiComponent implements OnInit {
  ngOnInit() {
    window.scrollTo(0, 0); // Forza scroll in cima
  }
}
