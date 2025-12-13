import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface ForgotPasswordPayload {
  email: string;
}

interface CodeVerificationPayload {
  code: string;
  token: string;
}

interface ChangePasswordPayload {
  token: string;
  NewPass: string;
  ConfirmPass: string;
}

@Component({
  selector: 'app-forget-page',
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './forget-page.html',
  styleUrl: './forget-page.css'
})
export class ForgetPage {
  // Current step tracking
  currentStep: 'email' | 'code' | 'reset' = 'email';
  
  // Token storage
  verificationToken: string | null = null;
  
  // Form data
  emailData: ForgotPasswordPayload = { email: '' };
  codeData: CodeVerificationPayload = { code: '', token: '' };
  resetData: ChangePasswordPayload = { token: '', NewPass: '', ConfirmPass: '' };
  
  // Code step state
  codeMessage: string = '';
  codeError: boolean = false;
  codeSuccess: boolean = false;
  codeVerified: boolean = false;
  
  // Reset step state
  resetMessage: string = '';
  resetError: boolean = false;
  resetSuccess: boolean = false;

  constructor(private router: Router) {}

  // Step 1: Email Submission
  async onEmailSubmit() {
    // TODO: Call your service here
    // Example:
    // try {
    //   const response = await this.authService.emailVerification(this.emailData).toPromise();
    //   this.verificationToken = response.token;
    //   this.currentStep = 'code';
    // } catch (error) {
    //   console.error('Email verification failed', error);
    // }
    
    // Temporary simulation
    this.verificationToken = 'temp-token-123';
    this.currentStep = 'code';
  }

  // Step 2: Code Submission
  async onCodeSubmit() {
    // If already verified, move to next step
    if (this.codeVerified) {
      this.currentStep = 'reset';
      this.clearCodeMessages();
      this.codeVerified = false;
      return;
    }

    this.codeData.token = this.verificationToken!;
    
    // TODO: Call your service here
    // Example:
    // try {
    //   const response = await this.authService.codeVerification(this.codeData).toPromise();
    //   this.verificationToken = response.newToken; // Update if needed
    //   this.showCodeSuccess('Code verified successfully! Click Continue to proceed.');
    //   this.codeVerified = true;
    // } catch (error) {
    //   this.showCodeError('Invalid code. Please try again.');
    // }
    
    // Temporary simulation
    if (this.codeData.code.length === 6) {
      this.showCodeSuccess('Code verified successfully! Click Continue to proceed.');
      this.codeVerified = true;
    } else {
      this.showCodeError('Invalid code. Please try again.');
    }
  }

  // Step 3: Password Reset Submission
  async onResetSubmit() {
    // Clear any previous messages
    this.resetMessage = '';
    this.resetError = false;
    this.resetSuccess = false;
    
    // Client-side validation
    if (this.resetData.NewPass !== this.resetData.ConfirmPass) {
      this.showResetError('Passwords do not match!');
      return;
    }
    
    if (this.resetData.NewPass.length < 8) {
      this.showResetError('Password must be at least 8 characters!');
      return;
    }
    
    this.resetData.token = this.verificationToken!;
    
    // TODO: Call your service here
    // Example:
    // try {
    //   const response = await this.authService.ResetPass(this.resetData).toPromise();
    //   this.showResetSuccess('Password reset successful! Redirecting...');
    //   setTimeout(() => this.router.navigate(['/Login']), 2000);
    // } catch (error) {
    //   this.showResetError('Failed to reset password. Please try again.');
    // }
    
    // Temporary simulation
    this.showResetSuccess('Password reset successful! Redirecting...');
    setTimeout(() => this.router.navigate(['/Login']), 2000);
  }

  // Helper methods
  backToEmail() {
    this.currentStep = 'email';
    this.clearCodeMessages();
    this.codeVerified = false;
  }

  showCodeError(message: string) {
    this.codeMessage = message;
    this.codeError = true;
    this.codeSuccess = false;
    this.codeVerified = false;
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
}