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
import { Observable, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(private authSvc: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    // Se l'utente è loggato, ritorna true
    const isLogged = !this.authSvc.isLogged;
    if (isLogged) {
      // Se l'utente non è loggato, reindirizza alla pagina di login
      this.router.navigate(['**']);
      // impedisci la navigazione
      return false;
    }
    //permette la navigazione
    return true;
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): MaybeAsync<GuardResult> {
    // Riutilizza il metodo canActivate per controllare la navigazione dei figli
    return this.canActivate(childRoute, state);
  }
}
