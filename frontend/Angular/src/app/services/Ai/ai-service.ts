import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AiService {


  private envApi = `${environment.apiUrl}/ai`
  

    constructor(private http: HttpClient){}

    chat(msg: string, history: any []){ 
      return this.http.post(`${this.envApi}/chat`, 
          {msg, history},
        { withCredentials: true }
      )
    }
  }
