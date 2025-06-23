import { Component, OnInit } from '@angular/core';
import { MenuService } from '../../../menu.service';
import { iMenu } from '../../../Models/i-menu';

@Component({
  selector: 'app-secondi',
  templateUrl: './secondi.component.html',
  styleUrl: './secondi.component.scss'
})
export class SecondiComponent implements OnInit{
  ngOnInit() {
    window.scrollTo(0, 0); // Forza scroll in cima
  }

}
