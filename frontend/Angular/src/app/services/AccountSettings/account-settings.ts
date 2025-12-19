import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

export enum Rating {
    Perfect = 'Perfect',
    Very_good = 'Very Good',
    Average = 'Average',
    Below_average = 'Below Average',
    Horrible = 'Horrible'
}


@Injectable({
  providedIn: 'root'
})
export class AccountSettingsService {
  private envApi = `${environment.apiUrl}/accountSettings`

  constructor(private http: HttpClient){}


  editInfo(updates: Partial<{
        username: string,
        fname: string,
        lname: string,
        email: string,
        phone_number: string
  }>){
  return this.http.patch(`${this.envApi}/editAccount`,
    updates,
    { withCredentials: true }
  );
  }
  
changePass(currentPass: string, NewPass: string, ConfirmPass: string){
return this.http.patch(`${this.envApi}/changePassword`,
  { currentPass, NewPass, ConfirmPass },
  { withCredentials: true }
);
}

  deleteAccount(){
  return this.http.delete(`${this.envApi}/deleteAccount`, { withCredentials: true });
  }


  takeFeedback(feedback: string, rating: Rating){
    return this.http.post(`${this.envApi}/feedback`,
      {feedback, rating},
      { withCredentials: true }
    )
  }
}
