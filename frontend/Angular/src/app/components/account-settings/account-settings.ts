import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
export class AccountSettings implements OnInit {

  constructor(private user: Authservice, private setting: AccountSettingsService, private cdr: ChangeDetectorRef) {}

  userData: UserData = {
    username: '',
    email: '',
    fname: '',
    lname: '',
    phone_number: '',
    bio: '',
    created_at: ''
  };

  originalData: UserData = { ...this.userData };

  passwordData = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

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

  // Toggle edit mode
  toggleEditProfile() {
    this.isEditingProfile = !this.isEditingProfile;
    this.clearMessages();
    if (!this.isEditingProfile) {
      this.userData = { ...this.originalData };
    }
  }
  
  toggleChangePassword() {
    this.isChangingPassword = !this.isChangingPassword;
    this.clearMessages();
    this.passwordData = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    };
  }

  // Empty placeholders ready for logic
  updateProfile() {}
  changePassword() {}
  deleteAccount() {}



  clearMessages() {
    this.successMessage = '';
    this.errorMessage = '';
  }
  
  
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }

}
