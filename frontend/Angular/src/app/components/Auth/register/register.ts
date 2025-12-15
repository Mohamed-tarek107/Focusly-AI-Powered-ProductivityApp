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
      next: () => {
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
