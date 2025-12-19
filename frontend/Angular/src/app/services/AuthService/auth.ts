import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class Authservice {
    private AuthApi = 'http://localhost:5000/api/auth';
    isLoggedIn = false


    constructor(private http: HttpClient){}
    
    Register(fname: string,lname:string,email: string,password: string,confirmpass: string,phone_number: string, type: string,company: string){
      return this.http.post(`${this.AuthApi}/register`,{
        fname,
        lname,
        email,
        password,
        confirmpass,
        phone_number,
        type,
        company
      })
    }

    login(email: string, password: string): Observable<any> {
    return this.http.post(
      `${this.AuthApi}/login`,
      { email, password },
      { withCredentials: true } // send cookies
    ).pipe(
      tap(() => {
        this.isLoggedIn = true; // set flag on successful login
      })
    );
  }

    refreshtoken(){
      return this.http.post(
        `${this.AuthApi}/refresh-token`,
        {},
        {withCredentials: true}
      );
    }

    current<T = { fullname: string }>(): Observable<T> {
  return this.http.get<T>(`${this.AuthApi}/current`, 
    { withCredentials: true }
  );
}
    
      emailVerification(email: string) {
        return this.http.post(
          `${this.AuthApi}/forgot-password`,
          { email }
        );
      }

      codeVerification(code: string, token: string) {
        return this.http.post(
          `${this.AuthApi}/verify-reset`,
          { code, token }
        );
      }

      resetPass(token: string, newPass: string, confirmPass: string) {
        return this.http.post(
          `${this.AuthApi}/reset-password`,
          {
            token,
            NewPass: newPass,
            ConfirmPass: confirmPass
          },
          { withCredentials: true }
        );
      }

    logout(): Observable<any> {
    return this.http.post(
      `${this.AuthApi}/logout`,
      {},
      { withCredentials: true }
    ).pipe(
      tap(() => {
        this.isLoggedIn = false; // reset flag on logout
      })
    );
  }
}

