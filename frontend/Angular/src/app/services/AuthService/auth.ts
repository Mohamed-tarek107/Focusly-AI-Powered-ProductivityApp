import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Auth {
    private AuthApi = 'http://localhost:5000/api/auth';

    constructor(private http: HttpClient){}

    // fname,
    // lname,
    // email,
    // password,
    // confirmpass,
    // phone_number,
    // company,
    // type,

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

    login(email: string,password: string){
      return this.http.post(`${this.AuthApi}/login`,{
        email,
        password,
      })
    }

    current(){
      const accessToken = localStorage.getItem('accessToken')
      return this.http.get(`${this.AuthApi}/current`,{
        headers:{
          Authorization: `Bearer ${accessToken}`
          }
      })
    }
}
