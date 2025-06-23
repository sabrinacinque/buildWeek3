import { Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-temaki',
  templateUrl: './temaki.component.html',
  styleUrl: './temaki.component.scss'
})
export class TemakiComponent implements OnInit{
  ngOnInit() {
    window.scrollTo(0, 0); // Forza scroll in cima
  }

}
