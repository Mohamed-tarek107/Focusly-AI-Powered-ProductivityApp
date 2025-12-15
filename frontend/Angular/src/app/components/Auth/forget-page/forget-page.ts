import { Component, ChangeDetectorRef } from '@angular/core';
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

  // email step messages
  emailMessage = '';
  emailError = false;
  emailSuccess = false;

  // code step messages
  codeMessage = '';
  codeError = false;
  codeSuccess = false;

  // reset step messages
  resetMessage = '';
  resetError = false;
  resetSuccess = false;

  // loading states to prevent double submissions
  isEmailSubmitting = false;
  isCodeSubmitting = false;
  isResetSubmitting = false;

  constructor(
    private auth: Authservice, 
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  // STEP 1: email
  onEmailSubmit() {
    console.log('=== EMAIL SUBMIT CALLED ===');
    console.log('Current step:', this.currentStep);
    console.log('Is submitting:', this.isEmailSubmitting);
    console.log('Email value:', this.email);
    
    if (this.isEmailSubmitting) {
      console.log('Already submitting, returning');
      return;
    }
    
    this.isEmailSubmitting = true;
    this.clearEmailMessages();
    console.log('Making API call...');

    this.auth.emailVerification(this.email).subscribe({
      next: (res: any) => {
        console.log('=== EMAIL SUCCESS ===');
        console.log('Response:', res);
        console.log('Reset token:', res.resetToken);
        
        this.verificationToken = res.resetToken;
        this.isEmailSubmitting = false;
        this.currentStep = 'code';
        
        console.log('Step changed to:', this.currentStep);
        
        // Force change detection
        this.cdr.detectChanges();
        
        console.log('Change detection triggered');
        this.clearEmailMessages();
      },
      error: (err) => {
        console.error('=== EMAIL ERROR ===');
        console.error('Error:', err);
        console.error('Error message:', err.error?.message);
        
        const message = err.error?.message || 'Failed to send verification code';
        this.showEmailError(message);
        this.isEmailSubmitting = false;
        this.cdr.detectChanges();
      }
    });
  }

  // STEP 2: code
  onCodeSubmit() {
    console.log('=== CODE SUBMIT CALLED ===');
    console.log('Current step:', this.currentStep);
    console.log('Is submitting:', this.isCodeSubmitting);
    console.log('Code value:', this.code);
    console.log('Verification token:', this.verificationToken);
    
    if (this.isCodeSubmitting) {
      console.log('Already submitting, returning');
      return;
    }
    
    if (!this.verificationToken) {
      console.log('No verification token!');
      this.showCodeError('Missing verification token');
      return;
    }

    this.isCodeSubmitting = true;
    this.clearCodeMessages();
    console.log('Making API call...');

    this.auth.codeVerification(this.code, this.verificationToken).subscribe({
      next: () => {
        console.log('=== CODE SUCCESS ===');
        
        this.showCodeSuccess('Code verified successfully');
        this.isCodeSubmitting = false;
        
        setTimeout(() => {
          this.currentStep = 'reset';
          console.log('Step changed to:', this.currentStep);
          
          this.clearCodeMessages();
          this.cdr.detectChanges();
          console.log('Change detection triggered');
        }, 1000);
      },
      error: (err) => {
        console.error('=== CODE ERROR ===');
        console.error('Error:', err);
        console.error('Error message:', err.error?.message);
        
        const message = err.error?.message || 'Invalid verification code';
        this.showCodeError(message);
        this.isCodeSubmitting = false;
        this.cdr.detectChanges();
      }
    });
  }

  // STEP 3: reset
  onResetSubmit() {
    console.log('=== RESET SUBMIT CALLED ===');
    console.log('Current step:', this.currentStep);
    console.log('Is submitting:', this.isResetSubmitting);
    console.log('Verification token:', this.verificationToken);
    
    if (this.isResetSubmitting) {
      console.log('Already submitting, returning');
      return;
    }
    
    if (!this.verificationToken) {
      console.log('No verification token!');
      this.showResetError('Missing verification token');
      return;
    }

    if (this.newPass !== this.confirmPass) {
      console.log('Passwords do not match');
      this.showResetError('Passwords do not match');
      return;
    }

    if (this.newPass.length < 8) {
      console.log('Password too short');
      this.showResetError('Password must be at least 8 characters');
      return;
    }

    this.isResetSubmitting = true;
    this.clearResetMessages();
    console.log('Making API call...');

    this.auth.resetPass(this.verificationToken, this.newPass, this.confirmPass).subscribe({
      next: () => {
        console.log('=== RESET SUCCESS ===');
        
        this.showResetSuccess('Password reset successfully! Redirecting...');
        this.cdr.detectChanges();
        
        setTimeout(() => {
          console.log('Navigating to login...');
          this.router.navigate(['/Login']);
          this.isResetSubmitting = false;
        }, 2000);
      },
      error: (err) => {
        console.error('=== RESET ERROR ===');
        console.error('Error:', err);
        console.error('Error message:', err.error?.message);
        
        const message = err.error?.message || 'Failed to reset password';
        this.showResetError(message);
        this.isResetSubmitting = false;
        this.cdr.detectChanges();
      }
    });
  }

  // -------- Email message helpers --------
  showEmailError(message: string) {
    this.emailMessage = message;
    this.emailError = true;
    this.emailSuccess = false;
  }

  showEmailSuccess(message: string) {
    this.emailMessage = message;
    this.emailSuccess = true;
    this.emailError = false;
  }

  clearEmailMessages() {
    this.emailMessage = '';
    this.emailError = false;
    this.emailSuccess = false;
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
    this.clearEmailMessages();
    this.clearCodeMessages();
    this.clearResetMessages();
  }
}