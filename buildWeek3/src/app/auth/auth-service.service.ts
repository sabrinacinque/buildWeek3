import { User } from './../Models/user';
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { iAuth } from '../Models/iauth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { iLogin } from '../Models/ilogin';
import { environment } from '../../environments/environment';
import { isPlatformBrowser } from '@angular/common';

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
    private fb: FormBuilder,
    @Inject(PLATFORM_ID) private platformId: Object  // 🔧 AGGIUNTO per SSR
  ) {
    this.restoreUser();
  }

  userForm!: FormGroup;

  // 🔧 METODI SICURI PER STORAGE (SSR COMPATIBLE)
  private setLocalStorage(key: string, value: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(key, value);
    }
  }

  private getLocalStorage(key: string): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(key);
    }
    return null;
  }

  private removeLocalStorage(key: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(key);
    }
  }

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

  // 🔧 SISTEMATO: Login con gestione corretta
  login(user: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(this.loginUrl, user).pipe(
      tap((response) => {
        console.log('✅ Login successful:', response);

        const userData: User = {
          id: response.id,
          name: response.name,
          email: response.email,
          password: '' // Non salviamo la password per sicurezza
        };

        // 🔧 AGGIUNTO: Timestamp per gestire scadenza
        const loginData = {
          user: userData,
          timestamp: new Date().getTime(),
          expiresIn: 24 * 60 * 60 * 1000 // 24 ore in millisecondi
        };

        this.authSubject.next(userData);
        this.setLocalStorage('authData', JSON.stringify(loginData));
        this.setLocalStorage('isLoggedIn', 'true');

        console.log('💾 User data saved to localStorage');
      })
    );
  }

  logout() {
    console.log('🚪 Logout triggered');
    this.authSubject.next(null);
    this.removeLocalStorage('authData');
    this.removeLocalStorage('isLoggedIn');
    this.isLogged = false;
    this.router.navigate(['/']); // 🔧 REDIRECT ALLA HOME
  }

  // 🔧 NUOVO: Logout silenzioso (senza redirect)
  logoutSilent() {
    console.log('🤫 Silent logout triggered');
    this.authSubject.next(null);
    this.removeLocalStorage('authData');
    this.removeLocalStorage('isLoggedIn');
    this.isLogged = false;
    // Non fa redirect - per passare da admin a cliente
  }

  // 🔧 SISTEMATO: Controllo token con scadenza
  getAccessToken() {
    const authDataString = this.getLocalStorage('authData');
    const isLoggedIn = this.getLocalStorage('isLoggedIn');

    if (!authDataString || !isLoggedIn || isLoggedIn !== 'true') {
      console.log('❌ No auth data found');
      return null;
    }

    try {
      const authData = JSON.parse(authDataString);
      const now = new Date().getTime();

      // 🔧 CONTROLLO SCADENZA
      if (now > authData.timestamp + authData.expiresIn) {
        console.log('⏰ Token expired, auto logout');
        this.logout();
        return null;
      }

      console.log('✅ Valid token found');
      return {
        user: authData.user,
        isLoggedIn: true
      };
    } catch (error) {
      console.error('❌ Error parsing auth data:', error);
      this.logout();
      return null;
    }
  }

  getAllUsers(): Observable<User> {
    return this.http.get<User>(this.loginUrl);
  }

  createNew(user: Partial<iLogin>, formData: FormGroup) {
    user.email = formData.value.email;
    user.password = formData.value.password;
  }

  // 🔧 SISTEMATO: Restore user con controlli
  restoreUser() {
    const authData = this.getAccessToken();
    if (!authData) {
      console.log('🔄 No user to restore');
      return;
    }

    console.log('🔄 Restoring user:', authData.user);
    this.authSubject.next(authData.user);
    this.isLogged = true;
  }

  // 🔧 NUOVO: Metodo per verificare se è veramente loggato
  isAuthenticated(): boolean {
    const token = this.getAccessToken();
    const hasUser = !!this.authSubject.value;

    console.log('🔍 Authentication check:', {
      token: !!token,
      hasUser,
      isLoggedFlag: this.isLogged
    });

    return !!token && hasUser;
  }

  // 🔧 IMPLEMENTATO: Auto logout funzionante
  autoLogout() {
    const authData = this.getAccessToken();
    if (!authData) return;

    const authDataString = this.getLocalStorage('authData');
    if (!authDataString) return;

    try {
      const data = JSON.parse(authDataString);
      const timeLeft = (data.timestamp + data.expiresIn) - new Date().getTime();

      if (timeLeft > 0) {
        setTimeout(() => {
          console.log('⏰ Session expired - auto logout');
          this.logout();
        }, timeLeft);
      }
    } catch (error) {
      console.error('❌ Error in autoLogout:', error);
    }
  }
}
