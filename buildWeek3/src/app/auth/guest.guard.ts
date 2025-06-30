import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  GuardResult,
  MaybeAsync,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from './auth-service.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GuestGuard {
  constructor(private authSvc: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {

    console.log('🚪 GuestGuard: Checking if user can access guest area (login)');

    // 🔧 SISTEMATO: Usa isAuthenticated() invece di isLogged
    const isAuthenticated = this.authSvc.isAuthenticated();

    console.log('🔍 GuestGuard: Authentication status:', isAuthenticated);

    if (isAuthenticated) {
      console.log('❌ GuestGuard: User already logged in, redirecting to dashboard');
      // L'utente è già loggato, reindirizza alla dashboard
      this.router.navigate(['/dashboard']);
      return false;
    } else {
      console.log('✅ GuestGuard: User not logged in, allowing access to login');
      // L'utente NON è loggato, può accedere al login
      return true;
    }
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): MaybeAsync<GuardResult> {
    console.log('🚪 GuestGuard: Checking child route access');
    return this.canActivate(childRoute, state);
  }
}
