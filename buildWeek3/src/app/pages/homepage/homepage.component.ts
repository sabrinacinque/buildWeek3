import {
  AfterViewInit,
  Component,
  ElementRef,
  QueryList,
  ViewChildren,
  viewChild,
} from '@angular/core';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
})
export class HomepageComponent implements AfterViewInit {
  @ViewChildren('animatedElementRight')
  animatedElementsRight!: QueryList<ElementRef>;
  @ViewChildren('animatedElementLeft')
  animatedElementsLeft!: QueryList<ElementRef>;
  @ViewChildren('animatedElementRotate')
  animatedElementsRotate!: QueryList<ElementRef>;

  ngAfterViewInit() {
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

  observeElement(element: Element, animationClass: string) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          console.log('Element is intersecting:', entry.target);
          entry.target.classList.add(animationClass);
          observer.unobserve(entry.target);
        }
      });
    });

    observer.observe(element);
  }
}
