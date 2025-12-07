import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AccountSettings {
  
  private SettingAPI = 'http://localhost:5000/accountSettings'
  private token: string | null = null;

  constructor(private http: HttpClient){
    this.token = localStorage.getItem('accessToken')
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
        Authorization: `Bearer ${this.token}`
      }
    })
  }
  changePass(currentPass: string, NewPass: string, ConfirmPass: string){
      return this.http.patch(`${this.SettingAPI}/changePassword`,
        {currentPass,NewPass,ConfirmPass}),
        { withCredentials: true },
        {
          headers:{
              Authorization: `Bearer ${this.token}`
          } 
        }
  }

  deleteAccount(){
    return this.http.delete(`${this.SettingAPI}/deleteAccount`)
  }
}
