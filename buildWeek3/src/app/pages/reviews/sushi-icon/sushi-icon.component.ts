import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-sushi-icon',
  templateUrl: './sushi-icon.component.html',
  styleUrls: ['./sushi-icon.component.scss']
})
export class SushiIconComponent {
  rating = 0;
  emoji: string = '';
  @Input() categoryId!: 'food' | 'service' | 'atmosphere' | 'waitTime' | 'cleanliness'; 
  @Output() ratingSelected = new EventEmitter<{ category: 'food' | 'service' | 'atmosphere' | 'waitTime' | 'cleanliness', rating: number }>();

  setRating(value: number): void {
    this.rating = value;
    this.updateEmoji();
    this.ratingSelected.emit({ category: this.categoryId, rating: this.rating });
  }

  updateEmoji(): void {
    switch (this.rating) {
      case 1:
        this.emoji = '😞'; 
        break;
      case 2:
        this.emoji = '😕'; 
        break;
      case 3:
        this.emoji = '😐'; 
        break;
      case 4:
        this.emoji = '😊'; 
        break;
      case 5:
        this.emoji = '😍'; 
        break;
      default:
        this.emoji = '';
    }
  }
}
