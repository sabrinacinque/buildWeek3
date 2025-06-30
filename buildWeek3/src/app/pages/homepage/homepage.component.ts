import {
  AfterViewInit,
  Component,
  ElementRef,
  QueryList,
  ViewChildren,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth-service.service'; // 🔧 AGGIUNTO

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
})
export class HomepageComponent implements AfterViewInit, OnInit {
  //Utilizzo di ViewChildren per ottenere una QueryList di elementi
  @ViewChildren('animatedElementRight')
  animatedElementsRight!: QueryList<ElementRef>;
  @ViewChildren('animatedElementLeft')
  animatedElementsLeft!: QueryList<ElementRef>;
  @ViewChildren('animatedElementRotate')
  animatedElementsRotate!: QueryList<ElementRef>;

  // 🔧 AGGIUNTO: Stato per il debug
  wasLoggedIn: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService // 🔧 AGGIUNTO
  ) {}

  ngOnInit(): void {
    // 🔧 NUOVO: Gestisce l'accesso alla homepage
    this.handleHomepageAccess();
  }

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

  // 🔧 NUOVO: Gestisce l'accesso alla homepage
  private handleHomepageAccess(): void {
    const isAuthenticated = this.authService.isAuthenticated();

    if (isAuthenticated) {
      console.log('🏠 Homepage: Admin loggato rilevato - attivo modalità cliente');
      this.wasLoggedIn = true;

      // Il logout viene già gestito dall'AppComponent, ma possiamo aggiungere logica specifica
      console.log('👥 Homepage: Interfaccia ottimizzata per clienti del ristorante');
    } else {
      console.log('🏠 Homepage: Modalità cliente già attiva');
      this.wasLoggedIn = false;
    }
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

  // Naviga alla scelta del menu
  navigateToMenuChoice() {
    console.log('🍽️ Navigazione verso scelta menu');
    this.router.navigate(['/menu-choice']);
  }

  // Naviga al login (per admin)
  navigateToLogin() {
    console.log('🔐 Navigazione verso login admin');
    this.router.navigate(['/auth']);
  }
}
