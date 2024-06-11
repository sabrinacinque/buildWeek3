
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-sushi-icon',
  templateUrl: './sushi-icon.component.html',
  styleUrl: './sushi-icon.component.scss'
})
export class SushiIconComponent {

  rating:number = 0 ; 
  emoji: string = '';
  @Output() ratingSelected = new EventEmitter<number>();


  setRating(value:number){
    this.rating = value; 
    this.updateEmoji();
    this.ratingSelected.emit(this.rating);
  }

  updateEmoji() {
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
    }}

  }