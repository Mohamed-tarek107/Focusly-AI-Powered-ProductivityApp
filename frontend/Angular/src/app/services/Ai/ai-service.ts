import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AiService {


  private chatApi = 'http://localhost:5000/api/ai';
  private token: string | null = null;

    constructor(private http: HttpClient){
      this.token = localStorage.getItem('accessToken');
    }

    chat(msg: string, history: any []){ 
      return this.http.post(`${this.chatApi}/chat`, 
          {msg, history},
        {
          headers:{
            Authorization: `Bearer ${this.token}`
          }
        }
      )
    }
  }
