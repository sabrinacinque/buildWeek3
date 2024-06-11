import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../Models/user';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { iAuth } from '../Models/iauth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  jwtToken: JwtHelperService = new JwtHelperService();
  authSubject = new BehaviorSubject<null | User>(null);
  user$ = this.authSubject.asObservable();

  isLogged: boolean = false;
  logged$ = this.user$.pipe(
    map((user) => !!user),
    tap((user) => (this.isLogged = user))
  );

  loginUrl = 'http://localhost:3000/login';
  registerUrl = 'http://localhost:3000/register'; // URL del tuo server JSON

  constructor(private http: HttpClient, private router: Router) {}

  register(newUser: Partial<User>) {
    return this.http.post<iAuth>(this.registerUrl, newUser);
  }

  login(user: Partial<User>) {
    return this.http.post<iAuth>(this.loginUrl, user).pipe(
      tap((res) => {
        this.authSubject.next(res.user);
        localStorage.setItem('token', JSON.stringify(res));
      })
    );
  }

  logout () {
    this.authSubject.next(null);
    localStorage.removeItem('token');

  }

  getAccessToken() {
    const token = localStorage.getItem('token');
    if (!token) return null;

    const tokenParsed = JSON.parse(token);

    return tokenParsed;
  }
}
