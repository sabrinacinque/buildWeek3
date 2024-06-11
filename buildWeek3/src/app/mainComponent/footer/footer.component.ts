import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent  {
  starIcon = '../../../assets/image/sushi icon.svg';
  rating: number = 0;
  hoverRating: number = 0;

  setRating(rating: number): void {
    this.rating = rating;
  }

  setTemporaryRating(rating: number): void {
    this.hoverRating = rating;
  }

  clearTemporaryRating(): void {
    this.hoverRating = 0;
  }

  onSubmit(): void {
    console.log(`Rated ${this.rating} stars`);
  }
}
