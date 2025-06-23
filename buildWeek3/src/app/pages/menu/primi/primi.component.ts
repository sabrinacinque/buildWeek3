import { Component, OnInit } from '@angular/core';
import { iMenu } from '../../../Models/i-menu';
import { MenuService } from '../../../menu.service';

@Component({
  selector: 'app-primi',
  templateUrl: './primi.component.html',
  styleUrl: './primi.component.scss'
})
export class PrimiComponent implements OnInit {
  ngOnInit() {
    window.scrollTo(0, 0); // Forza scroll in cima
  }
}
