import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './mainComponent/navbar/navbar.component';
import { FooterComponent } from './mainComponent/footer/footer.component';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { NgbCarouselConfig, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { InterceptorInterceptor } from './auth/interceptor.interceptor';
import { CucinaComponent } from './pages/dashboard/cucina/cucina.component';
import { NavbarSmallComponent } from './mainComponent/navbar-small/navbar-small.component';
import { FormsModule } from '@angular/forms';
import { BottomNavComponent } from './shared/bottom-nav/bottom-nav.component';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    BottomNavComponent,
    HomepageComponent,
    CucinaComponent,
    NavbarSmallComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule, NgbModule, FormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(config: NgbCarouselConfig) {
    // customize default values of carousels used by this module here,
    // if required (see https://ng-bootstrap.github.io/#/components/carousel/api)
    config.interval = 1000;
    config.wrap = false;
    config.keyboard = false;
  }
}
