import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Authservice } from './auth';
import { catchError, Observable, throwError, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Interceptors implements HttpInterceptor{
  constructor(private auth: Authservice){}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    //get token 
    const token = this.auth.getaccessToken()

    if(token){
        req = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        })
    }
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if(error.status === 401){
          
          return this.auth.refreshtoken().pipe(
            switchMap((res) => {
              this.auth.saveAccessToken(res.newaccesstoken);
              const newReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${res.newaccesstoken}`
                }
              });
              return next.handle(newReq);
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
