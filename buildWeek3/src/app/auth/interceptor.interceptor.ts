import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth-service.service';

@Injectable()
export class InterceptorInterceptor implements HttpInterceptor {
  constructor(private authSvc: AuthService) {}
  // Questo metodo intercetta tutte le richieste HTTP e aggiunge il token JWT alle intestazioni di autorizzazione.
  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const token = this.authSvc.getAccessToken();
    // Se non c'è token, ritorna la richiesta senza modifiche
    if (token) return next.handle(request);
    // Se c'è un token, clona la richiesta e aggiunge il token alle intestazioni di autorizzazione
    const newReq = request.clone({
      headers: request.headers.append(
        'Authorization',
        `Bearer ${token.accessToken}`
      ),
    });
    return next.handle(newReq);
  }
}
