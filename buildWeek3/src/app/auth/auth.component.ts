import { Component } from '@angular/core';
import { AuthService } from './auth-service.service';
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

  isLogged:boolean = this.authService.isLogged

  
  register() {
    return this.authService.register(this.newUser).subscribe(()=> {
      this.router.navigate(['/auth'])
    });
  }

  login() {
    this.authService.login(this.userLogged).subscribe(() => {
      this.router.navigate(['/dashboard']);
    });
  }

  logout() {
    this.authService.logout();
  }
}
