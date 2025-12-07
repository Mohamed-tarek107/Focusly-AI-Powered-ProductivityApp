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

interface update {
    username?: string,
    fname?: string,
    lname?: string,
    email?: string,
    phone_number?: string,
    bio?:string,
}

@Component({
  selector: 'app-account-settings',
  imports: [CommonModule, Navbar, FormsModule],
  templateUrl: './account-settings.html',
  styleUrl: './account-settings.css'
})
export class AccountSettings implements OnInit {

  constructor(private user: Authservice, private setting: AccountSettingsService) {}

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
    currentPass: '',
    NewPass: '',
    confirmPass: ''
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
      currentPass: '',
      NewPass: '',
      confirmPass: ''
    };
  }

  // Empty placeholders ready for logic
  updateProfile() {
      
    const updates: Partial<update> = {};

    if (this.userData.username !== this.originalData.username) updates.username = this.userData.username;
    if (this.userData.email !== this.originalData.email) updates.email = this.userData.email;
    if (this.userData.fname !== this.originalData.fname) updates.fname = this.userData.fname;
    if (this.userData.lname !== this.originalData.lname) updates.lname = this.userData.lname;
    if (this.userData.phone_number !== this.originalData.phone_number) updates.phone_number = this.userData.phone_number;
    if (this.userData.bio !== this.originalData.bio) updates.bio = this.userData.bio;

    if (Object.keys(updates).length === 0) {
      this.errorMessage = 'No changes to save';
      return;
    }

    this.isLoading = true;
      
    this.setting.editInfo(updates).subscribe({
        next: (data: any) => {
          this.originalData = { ...data }; // update the backup
          this.userData = {...data}
          this.isEditingProfile = false;
          this.isLoading = false;
          this.successMessage = 'Profile updated successfully!';
          setTimeout(() => this.clearMessages(), 3000);
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = 'Failed to update profile';
          console.error(err);
        }
    });
  }
  changePassword(currentPass: string, NewPass: string, confirmPass:string) {
      
    
    if (!currentPass || !NewPass || !confirmPass) {
      this.errorMessage = 'Please fill in all password fields';
      return;
    }

    // Check minimum length
    if (NewPass.length < 8) {
      this.errorMessage = 'Password must be at least 8 characters long';
      return;
    }

    // Check for at least one uppercase letter
    if (!/[A-Z]/.test(NewPass)) {
      this.errorMessage = 'Password must contain at least one uppercase letter';
      return;
    }

    // Check for at least one number
    if (!/[0-9]/.test(NewPass)) {
      this.errorMessage = 'Password must contain at least one number';
      return;
    }

    // Check if new password matches confirmation
    if (NewPass !== confirmPass) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    this.isLoading = true;


    this
  }
  
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
