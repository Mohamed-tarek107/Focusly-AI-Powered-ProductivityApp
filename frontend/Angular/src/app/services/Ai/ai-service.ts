import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AiService {


  private chatApi = 'http://localhost:5000/api/ai';
  

    constructor(private http: HttpClient){}

    chat(msg: string, history: any []){ 
      return this.http.post(`${this.chatApi}/chat`, 
          {msg, history},
        { withCredentials: true }
      )
    }
  }
