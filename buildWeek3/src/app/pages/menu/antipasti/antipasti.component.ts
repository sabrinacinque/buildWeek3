import { Component,OnInit } from '@angular/core';

@Component({
  selector: 'app-antipasti',
  templateUrl: './antipasti.component.html',
  styleUrls: ['./antipasti.component.scss']
})
export class AntipastiComponent implements OnInit {
   ngOnInit() {
    window.scrollTo(0, 0); // Forza scroll in cima
  }
}
