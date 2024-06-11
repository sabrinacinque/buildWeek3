import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './mainComponent/navbar/navbar.component';
import { FooterComponent } from './mainComponent/footer/footer.component';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { HttpClientModule } from '@angular/common/http';
import { RegistrationComponent } from './auth/registration/registration.component';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    HomepageComponent,
    RegistrationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
