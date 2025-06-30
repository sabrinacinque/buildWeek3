import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  GuardResult,
  MaybeAsync,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { AuthService } from './auth-service.service';
import { Observable, of, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(private authSvc: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {

    console.log('🛡️ AuthGuard: Checking authentication for route:', state.url);

    // 🔧 SISTEMATO: Usa il nuovo metodo isAuthenticated()
    const isAuthenticated = this.authSvc.isAuthenticated();

    console.log('🔍 AuthGuard: Authentication status:', isAuthenticated);

    if (isAuthenticated) {
      console.log('✅ AuthGuard: User authenticated, allowing access');
      // L'utente è loggato, permetti l'accesso
      return true;
    } else {
      console.log('❌ AuthGuard: User not authenticated, redirecting to login');
      // L'utente NON è loggato, reindirizza al login
      this.router.navigate(['/auth']);
      return false;
    }
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): MaybeAsync<GuardResult> {
    console.log('🛡️ AuthGuard: Checking child route access');
    // Riutilizza il metodo canActivate per controllare la navigazione dei figli
    return this.canActivate(childRoute, state);
  }
}

// 🔧 BONUS: Se vuoi anche controllare in modo reattivo (opzionale)
export class AuthGuardReactive {
  constructor(private authSvc: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {

    console.log('🛡️ AuthGuardReactive: Checking authentication reactively');

    return this.authSvc.user$.pipe(
      map(user => {
        const isAuthenticated = !!user && this.authSvc.isAuthenticated();

        console.log('🔍 AuthGuardReactive: User state:', { user: !!user, isAuthenticated });

        if (isAuthenticated) {
          console.log('✅ AuthGuardReactive: Access granted');
          return true;
        } else {
          console.log('❌ AuthGuardReactive: Access denied, redirecting');
          this.router.navigate(['/auth']);
          return false;
        }
      })
    );
  }
}
