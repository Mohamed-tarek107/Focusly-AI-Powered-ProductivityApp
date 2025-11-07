import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Authservice {
    private AuthApi = 'http://localhost:3000/api/auth';

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
      return this.http.post(`${this.AuthApi}/login`,
        { email, password },
        { withCredentials: true }
      )
    }

    refreshtoken(){
      return this.http.post<{ newaccesstoken: string} >(
        `${this.AuthApi}/refresh-token`,
        {},
        {withCredentials: true}
      );
    }

    current(){
      const accessToken = localStorage.getItem('accessToken')
      return this.http.get(`${this.AuthApi}/current`,{
        headers:{
          Authorization: `Bearer ${accessToken}`
          }
      })
    }
    
    saveAccessToken(token: string){
      return localStorage.setItem('accessToken', token)
    }


    getaccessToken(): string | null{
      return localStorage.getItem("accessToken")
    }

    logout(){
      localStorage.removeItem('accessToken')
    }

    isloggedin(): boolean {
      return !!localStorage.getItem('accessToken') 
      }
    }


