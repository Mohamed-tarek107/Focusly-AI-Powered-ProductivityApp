import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Authservice } from '../../../services/AuthService/auth';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {

  message = ''
  errormessage = ''
  email = ''
  password = ''
  company = ''
  type = ''
  confirmpass = ''
  phone_number = ''
  fname = ''
  lname = ''

  //Register(fname: string,lname:string,email: string,password: string,confirmpass: string,phone_number: string, type: string,company: string){
    //   return this.http.post(`${this.AuthApi}/register`,{
    //     fname,
    //     lname,
    //     email,
    //     password,
    //     confirmpass,
    //     phone_number,
    //     type,
    //     company
    //   })
    // }

  constructor(private auth: Authservice){}

  onRegister(){
    this.auth.Register(
      this.fname,
      this.lname,
      this.email,
      this.password,
      this.confirmpass,
      this.phone_number,
      this.type,
      this.company
    ).subscribe({
      next: (res: any) => {
        console.log('Registered Successful:', res)
        this.message = 'Register Successful'
        this.errormessage = ''
      },
      error: (err) => {
        this.message = ''
        this.errormessage = err.error?.message || 'Register failed'
      }
    })
  }
}
