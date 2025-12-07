import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Navbar } from '../navbar/navbar';
import { Authservice } from '../../services/AuthService/auth';
import { AccountSettingsService } from '../../services/AccountSettings/account-settings';


interface UserData {
  username: string;
  email: string;
  fname: string;
  lname: string;
  phone_number: string;
  bio: string;
  created_at: string;
}

@Component({
  selector: 'app-account-settings',
  imports: [CommonModule, Navbar, FormsModule],
  templateUrl: './account-settings.html',
  styleUrl: './account-settings.css'
})
export class AccountSettings implements OnInit{

  constructor(private user: Authservice){}

  userData: UserData = {
    username: '',
    email: '',
    fname: '',
    lname: '',
    phone_number: '',
    bio: '',
    created_at: ''
  };



  // Backup of original data
  originalData: UserData = { ...this.userData };

  // Password data
  passwordData = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  // UI states
  isEditingProfile = false;
  isChangingPassword = false;
  isLoading = false;
  successMessage = '';
  errorMessage = '';


  ngOnInit() {
    this.user.current<UserData>().subscribe({
  next: (data) => {
    this.userData = data;
    this.originalData = { ...data };
  },
  error: (err) => {
    this.errorMessage = 'Failed to fetch user data';
    console.error(err);
      }
    });
  }


  // Toggle edit mode for profile
  toggleEditProfile() {
    this.isEditingProfile = !this.isEditingProfile;
    this.clearMessages();
    if (!this.isEditingProfile) {
      // Reset to original data if cancelled
      this.userData = { ...this.originalData };
    }
  }

  // Toggle password change form
  toggleChangePassword() {
    this.isChangingPassword = !this.isChangingPassword;
    this.clearMessages();
    this.passwordData = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    };
  }

  // Update profile - implement your API call here
  updateProfile() {
    this.clearMessages();
    
    // Basic validation
    if (!this.userData.username || !this.userData.email) {
      this.errorMessage = 'Username and email are required';
      return;
    }

    this.isLoading = true;

    // TODO: Add your API call here
    // Example: this.authService.updateProfile(this.userData).subscribe(...)
    
    // Simulate API call
    setTimeout(() => {
      this.successMessage = 'Profile updated successfully!';
      this.originalData = { ...this.userData };
      this.isEditingProfile = false;
      this.isLoading = false;
      setTimeout(() => this.clearMessages(), 3000);
    }, 1000);
  }

  // Change password - implement your API call here
  changePassword() {
    this.clearMessages();

    // Validation
    if (!this.passwordData.currentPassword || !this.passwordData.newPassword) {
      this.errorMessage = 'Please fill in all password fields';
      return;
    }

    if (this.passwordData.newPassword.length < 6) {
      this.errorMessage = 'New password must be at least 6 characters';
      return;
    }

    if (this.passwordData.newPassword !== this.passwordData.confirmPassword) {
      this.errorMessage = 'New passwords do not match';
      return;
    }

    this.isLoading = true;

    // TODO: Add your API call here
    // Example: this.authService.changePassword(...).subscribe(...)

    // Simulate API call
    setTimeout(() => {
      this.successMessage = 'Password changed successfully!';
      this.isChangingPassword = false;
      this.isLoading = false;
      this.passwordData = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      };
      setTimeout(() => this.clearMessages(), 3000);
    }, 1000);
  }

  // Delete account - implement your API call here
  deleteAccount() {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    const confirmText = prompt('Type "DELETE" to confirm account deletion:');
    if (confirmText !== 'DELETE') {
      return;
    }

    this.isLoading = true;

    // TODO: Add your API call here
    // Example: this.authService.deleteAccount().subscribe(...)

    // Simulate API call
    setTimeout(() => {
      alert('Account deleted successfully');
      // TODO: Navigate to login or logout
      // Example: this.router.navigate(['/login']);
      this.isLoading = false;
    }, 1000);
  }

  // Clear success/error messages
  clearMessages() {
    this.successMessage = '';
    this.errorMessage = '';
  }

  // Format date for display
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }
}

