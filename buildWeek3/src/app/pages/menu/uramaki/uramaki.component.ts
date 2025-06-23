import { Component, OnInit} from '@angular/core';


@Component({
  selector: 'app-uramaki',
  templateUrl: './uramaki.component.html',
  styleUrl: './uramaki.component.scss'
})
export class UramakiComponent implements OnInit{

  ngOnInit() {
    window.scrollTo(0, 0); // Forza scroll in cima
  }
}
