import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Authservice } from './auth';
import { catchError, Observable, throwError, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Interceptors implements HttpInterceptor {
  constructor(private auth: Authservice) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const isAuthEndpoint = req.url.includes('/api/auth/refresh-token') || req.url.includes('/api/auth/logout');
    const alreadyRetried = req.headers.has('x-refresh-retry');

    // Always send cookies for cookie-based auth
    const authReq = req.clone({ withCredentials: true });

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        // Try refresh only once, and never for auth endpoints (prevents loops)
        if (error.status === 401 && !alreadyRetried && !isAuthEndpoint) {
          return this.auth.refreshtoken().pipe(
            switchMap(() => {
              // Retry original request once
              return next.handle(
                req.clone({
                  withCredentials: true,
                  setHeaders: { 'x-refresh-retry': '1' }
                })
              );
            }),
            catchError(() => {
              this.auth.logout().subscribe();
              return throwError(() => error);
            })
          );
        }
        return throwError(() => error);
      })
    );
  }
}
