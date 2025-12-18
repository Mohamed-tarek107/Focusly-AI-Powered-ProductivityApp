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
    //get token 
    const authReq = req.clone({ withCredentials: true })

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if(error.status === 401){
          // (backend reads refresh token cookie)
          return this.auth.refreshtoken().pipe(
            switchMap(() => {
              // (cookies are automatically sent)
              return next.handle(authReq);
            }),
            catchError(() => {
              this.auth.logout();
              return throwError(() => error);
            })
          );
          
        }
          return throwError(() => error);
      })
    );
  }
}
