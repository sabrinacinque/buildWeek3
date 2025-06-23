import { User } from './../Models/user';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { iAuth } from '../Models/iauth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { iLogin } from '../Models/ilogin';
import { environment } from '../../environments/environment';

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

  loginUrl = `${environment.apiUrl}/auth/login`;
  registerUrl = `${environment.apiUrl}/auth/register`;

  constructor(
    private http: HttpClient,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.restoreUser();
  }

  userForm!: FormGroup;

  getUserLogin(): FormGroup {
    this.userForm = this.fb.group({
      email: this.fb.control(null, [Validators.required, Validators.email]),
      password: this.fb.control(null, Validators.required),
    });
    return this.userForm;
  }

  register(newUser: Partial<User>) {
    return this.http.post<iAuth>(this.registerUrl, newUser);
  }

  // 🔧 SISTEMATO: Tipizzazione corretta per Spring Boot
  login(user: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(this.loginUrl, user).pipe(
      tap((response) => {
        console.log('Risposta Spring Boot:', response);

        // 🔧 ADATTATO: Spring Boot restituisce direttamente l'oggetto user
        const userData: User = {
          id: response.id,
          name: response.name,
          email: response.email,
          password: '' // Non salviamo la password per sicurezza
        };

        this.authSubject.next(userData);

        // 🔧 SALVIAMO DATI SENZA JWT per ora
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('isLoggedIn', 'true');
      })
    );
  }

  logout() {
    this.authSubject.next(null);
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
  }

  // 🔧 SISTEMATO: Senza JWT per ora
  getAccessToken() {
    const user = localStorage.getItem('user');
    const isLoggedIn = localStorage.getItem('isLoggedIn');

    if (!user || !isLoggedIn || isLoggedIn !== 'true') return null;

    return {
      user: JSON.parse(user),
      isLoggedIn: true
    };
  }

  getAllUsers(): Observable<User> {
    return this.http.get<User>(this.loginUrl);
  }

  createNew(user: Partial<iLogin>, formData: FormGroup) {
    user.email = formData.value.email;
    user.password = formData.value.password;
  }

  // 🔧 SISTEMATO: Senza JWT per ora
  restoreUser() {
    const userData = this.getAccessToken();
    if (!userData) return;

    this.authSubject.next(userData.user);
  }

  // 🔧 COMMENTATO: Non serve per ora senza JWT
  autoLogout() {
    // Implementeremo quando aggiungeremo JWT
    console.log('AutoLogout non implementato - per ora login persistente');
  }
}
