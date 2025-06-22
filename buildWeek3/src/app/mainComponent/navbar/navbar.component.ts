import { Router } from '@angular/router';
import { AuthService } from './../../auth/auth-service.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  isLogged: boolean = false;

  constructor(
    private AuthService: AuthService, 
    public router: Router // ✅ CORRETTO: router minuscolo e public
  ) {}

  logout() {
    this.AuthService.logout();
    this.router.navigate(['']); // ✅ CORRETTO: router minuscolo
  }

  ngOnInit() {
    this.AuthService.logged$.subscribe(
      (isLogged) => (this.isLogged = isLogged)
    );
  }
}