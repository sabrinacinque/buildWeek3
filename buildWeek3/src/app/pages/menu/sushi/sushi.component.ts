import { Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-sushi',
  templateUrl: './sushi.component.html',
  styleUrl: './sushi.component.scss'
})
export class SushiComponent implements OnInit {
  ngOnInit() {
    window.scrollTo(0, 0); // Forza scroll in cima
  }
}
