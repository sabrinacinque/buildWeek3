import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './../../auth/auth-service.service';

@Component({
  selector: 'app-navbar-small',
  templateUrl: './navbar-small.component.html',
  styleUrl: './navbar-small.component.scss',
})
export class NavbarSmallComponent {
  show: boolean = false;

  isLogged: boolean = false;

  constructor(private AuthService: AuthService, private Router: Router) {}

  logout() {
    this.AuthService.logout();
    this.Router.navigate(['']);
  }

  ngOnInit() {
    this.AuthService.logged$.subscribe(
      (isLogged) => (this.isLogged = isLogged)
    );
  }

}
