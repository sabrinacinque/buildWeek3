// profile.component.ts
import { Component } from '@angular/core';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  providers: [NgbCarouselConfig]
})
export class ProfileComponent {
  constructor(config: NgbCarouselConfig) {
    // customize default values of carousels used by this component here,
    // if not specified, values from defaults would be used.
    config.interval = 2000;
    config.wrap = true;
    config.keyboard = false;
    config.pauseOnHover = true;
  }
}
