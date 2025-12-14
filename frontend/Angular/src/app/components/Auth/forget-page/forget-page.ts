import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Authservice } from '../../../services/AuthService/auth';

@Component({
  selector: 'app-forget-page',
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './forget-page.html',
  styleUrl: './forget-page.css'
})
export class ForgetPage {

  // step control
  currentStep: 'email' | 'code' | 'reset' = 'email';

  // form values
  email = '';
  code = '';
  newPass = '';
  confirmPass = '';

  // token (memory only)
  verificationToken: string | null = null;

  // code step messages
  codeMessage = '';
  codeError = false;
  codeSuccess = false;

  // reset step messages
  resetMessage = '';
  resetError = false;
  resetSuccess = false;

  constructor(private auth: Authservice, private router: Router) {}

  // STEP 1: email
  onEmailSubmit() {
    this.auth.emailVerification(this.email).subscribe({
      next: (res: any) => {
        this.verificationToken = res.resetToken;
        this.currentStep = 'code';
        this.clearCodeMessages();
      },
      error: (err) => {
        const message = err.error?.message || 'Failed to send verification code';
        this.showCodeError(message);
      }
    });
  }

  // STEP 2: code
  onCodeSubmit() {
    if (!this.verificationToken) {
      this.showCodeError('Missing verification token');
      return;
    }

    this.clearCodeMessages();

    this.auth.codeVerification(this.code, this.verificationToken).subscribe({
      next: () => {
        this.showCodeSuccess('Code verified successfully');
        setTimeout(() => {
          this.currentStep = 'reset';
          this.clearCodeMessages();
        }, 1000);
      },
      error: (err) => {
        const message = err.error?.message || 'Invalid verification code';
        this.showCodeError(message);
      }
    });
  }

  // STEP 3: reset
  onResetSubmit() {
    if (!this.verificationToken) {
      this.showResetError('Missing verification token');
      return;
    }

    if (this.newPass !== this.confirmPass) {
      this.showResetError('Passwords do not match');
      return;
    }

    if (this.newPass.length < 8) {
      this.showResetError('Password must be at least 8 characters');
      return;
    }

    this.clearResetMessages();

    this.auth.resetPass(this.verificationToken, this.newPass, this.confirmPass).subscribe({
      next: () => {
        this.showResetSuccess('Password reset successfully! Redirecting...');
        setTimeout(() => {
          this.router.navigate(['/Login']);
        }, 2000);
      },
      error: (err) => {
        const message = err.error?.message || 'Failed to reset password';
        this.showResetError(message);
      }
    });
  }

  // -------- Code message helpers --------
  showCodeError(message: string) {
    this.codeMessage = message;
    this.codeError = true;
    this.codeSuccess = false;
  }

  showCodeSuccess(message: string) {
    this.codeMessage = message;
    this.codeSuccess = true;
    this.codeError = false;
  }

  clearCodeMessages() {
    this.codeMessage = '';
    this.codeError = false;
    this.codeSuccess = false;
  }

  // -------- Reset message helpers --------
  showResetError(message: string) {
    this.resetMessage = message;
    this.resetError = true;
    this.resetSuccess = false;
  }

  showResetSuccess(message: string) {
    this.resetMessage = message;
    this.resetSuccess = true;
    this.resetError = false;
  }

  clearResetMessages() {
    this.resetMessage = '';
    this.resetError = false;
    this.resetSuccess = false;
  }

  // navigation helper
  backToEmail() {
    this.currentStep = 'email';
    this.code = '';
    this.clearCodeMessages();
    this.clearResetMessages();
  }
}