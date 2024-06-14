import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-page404',
  templateUrl: './page404.component.html',
  styleUrl: './page404.component.scss',
})
export class Page404Component {
  constructor(private router: Router) {}

  ngOnInit(): void {
    // Dopo un ritardo di 5 secondi, reindirizza l'utente alla homepage
    setTimeout(() => {
      this.router.navigate(['']);
    }, 8000);
  }
}
