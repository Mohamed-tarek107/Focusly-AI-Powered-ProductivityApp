import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Authservice } from '../../../services/AuthService/auth';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule],
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

  constructor(private auth: Authservice, private router: Router){}

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
        console.log('✅ Registered Successfully:', res);
        this.message = '✅ Successfully registered! Redirecting to login...';
        this.errormessage = '';

        // Wait 2 seconds, then redirect to login
        setTimeout(() => {
          this.router.navigate(['/Login']);
        }, 2000);
      },
      error: (err) => {
        console.error('❌ Register Error:', err);
        this.message = '';
        this.errormessage = err.error?.message || 'Registration failed. Please try again.';
      }
    });
  }
}
