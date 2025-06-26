import {
  AfterViewInit,
  Component,
  ElementRef,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { Router } from '@angular/router'; // 👈 Import separato

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
})
export class HomepageComponent implements AfterViewInit {
  //Utilizzo di ViewChildren per ottenere una QueryList di elementi
  @ViewChildren('animatedElementRight')
  animatedElementsRight!: QueryList<ElementRef>;
  @ViewChildren('animatedElementLeft')
  animatedElementsLeft!: QueryList<ElementRef>;
  @ViewChildren('animatedElementRotate')
  animatedElementsRotate!: QueryList<ElementRef>;

  // 👈 CONSTRUCTOR DENTRO LA CLASSE
  constructor(private router: Router) {}

  ngAfterViewInit() {
    // Per ogni elemento nella QueryList, osservare l'elemento e aggiungere la classe di animazione
    this.animatedElementsRight.forEach((elementRef) => {
      this.observeElement(elementRef.nativeElement, 'fade-in-right');
    });

    this.animatedElementsLeft.forEach((elementRef) => {
      this.observeElement(elementRef.nativeElement, 'fade-in-left');
    });
    this.animatedElementsRotate.forEach((elementRef) => {
      this.observeElement(elementRef.nativeElement, 'img-sushilight');
    });
  }

  // Funzione per osservare un elemento e aggiungere una classe di animazione
  observeElement(element: Element, animationClass: string) {
    const observer = new IntersectionObserver((entries) => {
      // Per ogni entry, se l'elemento è visibile, aggiungere la classe di animazione e smettere di osservare l'elemento
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add(animationClass);
          observer.unobserve(entry.target);
        }
      });
    });

    observer.observe(element);
  }

  // 👈 METODI AGGIUNTI DENTRO LA CLASSE
  navigateToMenuChoice() {
    this.router.navigate(['/menu-choice']);
  }

  navigateToLogin() {
    this.router.navigate(['/auth']);
  }
}
