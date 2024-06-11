import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrl: './reviews.component.scss'
})
export class ReviewsComponent {

  
  rating = 0;
  showError = false;

  constructor(private router: Router) { }

  onRatingSelected(rating: number) {
    this.rating = rating;
    this.showError = false;
  }

  submitReview() {
    if (this.rating === 0) {
      this.showError = true;
    } else {
      alert('Grazie per la tua recensione!');
      this.router.navigate(['/home']);
    }
  }
}

