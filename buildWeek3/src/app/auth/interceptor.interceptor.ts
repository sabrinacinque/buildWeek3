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

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const token = this.authSvc.getAccessToken();

    // 🔧 LOGICA CORRETTA: Se NON c'è token, passa la richiesta senza modifiche
    if (!token || !token.isLoggedIn) {
      return next.handle(request);
    }

    // 🔧 Se c'è un token valido, aggiungilo alla richiesta
    const newReq = request.clone({
      headers: request.headers.append(
        'Authorization',
        `Bearer admin-session-token` // Per ora token fittizio
      ),
    });

    return next.handle(newReq);
  }
}
