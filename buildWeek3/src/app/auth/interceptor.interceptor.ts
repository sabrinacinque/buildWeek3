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
    if (token) return next.handle(request);

    const newReq = request.clone({
      headers: request.headers.append(
        'Authorization',
        `Bearer ${token.accessToken}`
      ),
    });
    return next.handle(newReq);
  }
}
