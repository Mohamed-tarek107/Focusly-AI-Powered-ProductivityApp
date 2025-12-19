import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Authservice } from '../../../services/AuthService/auth';


@Component({
  selector: 'app-Login',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  email: string = ''
  password: string = ''
  message: string = ''
  errorMessage: string = ''


  constructor(private Auth: Authservice, private router: Router){}
  
  onLogin(){
      this.Auth.login(this.email,this.password).subscribe({
            next: () => {
              this.message = 'login successful!'
              this.errorMessage = ''
              this.router.navigate(['/Dashboard']);
            },
            error: (err) => {
              console.log('Login Failed', err)
              this.message = ''
              this.errorMessage = 'Invalid Login'
            }
        })
  }

  onLogout() {
    this.Auth.logout().subscribe({
      next: () => this.router.navigate(['/Login']),
      error: () => this.router.navigate(['/Login']) // navigate even on error
    });
    this.message = 'Logged out';
  }
}
