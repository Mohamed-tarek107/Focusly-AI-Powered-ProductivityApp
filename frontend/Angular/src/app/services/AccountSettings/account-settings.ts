import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AccountSettingsService {
  
  private SettingAPI = 'http://localhost:5000/accountSettings'

  constructor(private http: HttpClient){}


  private getToken(): string | null {
    return localStorage.getItem('accessToken');
}

  editInfo(updates: Partial<{
        username: string,
        fname: string,
        lname: string,
        email: string,
        phone_number: string
  }>){
    return this.http.patch(`${this.SettingAPI}/editAccount`, updates,
    {
      headers:{
        Authorization: `Bearer ${this.getToken()}`
      }
    })
  }
  
  changePass(currentPass: string, NewPass: string, ConfirmPass: string){
  return this.http.patch(`${this.SettingAPI}/changePassword`,
    { currentPass, NewPass, ConfirmPass },
    {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${this.getToken()}`
      }
    }
  );
}

  deleteAccount(){
  return this.http.delete(`${this.SettingAPI}/deleteAccount`, {
    headers:{
      Authorization: `Bearer ${this.getToken()}`
      }
    });
  }
}
