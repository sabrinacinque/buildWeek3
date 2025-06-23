import { Component,OnInit} from '@angular/core';


@Component({
  selector: 'app-zuppe',
  templateUrl: './zuppe.component.html',
  styleUrl: './zuppe.component.scss'
})
export class ZuppeComponent implements OnInit{

  ngOnInit() {
    window.scrollTo(0, 0); // Forza scroll in cima
  }
}
