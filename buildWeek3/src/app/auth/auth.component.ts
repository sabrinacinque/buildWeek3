import { Component } from '@angular/core';
import { AuthService } from './auth-service.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject } from 'rxjs';
import { User } from '../Models/user';
import { Router } from '@angular/router';
import { iLogin } from '../Models/ilogin';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent {
  constructor(private authService: AuthService, private router: Router) {}
  newUser: Partial<User> = {};
  userLogged: iLogin = {
    email: 'hita@mailinator.com',
    password: 'Pa$$w0rd!',
  };

  register() {
    return this.authService.register(this.newUser).subscribe();
  }

  login() {
    this.authService.login(this.userLogged).subscribe(() => {
      this.router.navigate(['/dashboard']);
    });
  }
}
