import { Component } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

// Definisci un tipo per le categorie di valutazione
type RatingCategory = 'food' | 'service' | 'atmosphere' | 'waitTime' | 'cleanliness';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss']
})
export class ReviewsComponent {

  // Definisci l'oggetto delle valutazioni usando il tipo RatingCategory
  ratings: Record<RatingCategory, number> = {
    food: 0,
    service: 0,
    atmosphere: 0,
    waitTime: 0,
    cleanliness: 0
  };
  showError = false;

  constructor(private router: Router) { }

  // Usa il tipo RatingCategory per il parametro category
  onRatingSelected(event: { category: RatingCategory, rating: number }) {
    this.ratings[event.category] = event.rating;
    this.showError = false;
  }

  submitReview(): void {
    if (Object.values(this.ratings).some(rating => rating === 0)) {
      this.showError = true;
      // Mostra l'alert di errore con SweetAlert2
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Per favore, dai una valutazione per ogni categoria prima di inviare la recensione.',
       
      });
    } else {
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Grazie per la tua recensione!',
        showConfirmButton: false,
        timer: 1500
      });
    }
  }
}