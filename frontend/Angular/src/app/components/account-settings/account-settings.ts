import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Navbar } from '../navbar/navbar';
import { Authservice } from '../../services/AuthService/auth';
import { AccountSettingsService } from '../../services/AccountSettings/account-settings';
import { Router } from '@angular/router';

interface UserData {
  username: string;
  email: string;
  fname: string;
  lname: string;
  phone_number: string;
  bio: string;
  created_at: string;
}

interface Update {
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
  styleUrls: ['./account-settings.css']
})
export class AccountSettings implements OnInit {

  constructor(
     private auth: Authservice,
     private setting: AccountSettingsService,
     private cdr: ChangeDetectorRef,
     private router: Router) {}

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
    this.auth.current<UserData>().subscribe({
      next: (data) => {
       console.log('User data received:', data); // Debug 
          this.userData = data;
          this.originalData = { ...data };
          this.cdr.detectChanges();
      },
      error: (err) => {
          console.error('Error fetching user data:', err); // Debug
          this.errorMessage = 'Failed to fetch user data';
          this.cdr.detectChanges();
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
      
    const updates: Partial<Update> = {};

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
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = 'Failed to update profile';
          console.error(err);
          this.cdr.detectChanges();
        }
    });
  }
  
  
  changePassword(currentPass: string, NewPass: string, confirmPass:string) {
    if (!currentPass || !NewPass || !confirmPass) {
      this.errorMessage = 'Please fill in all password fields';
      return;
    }

    if (NewPass.length < 8) {
      this.errorMessage = 'Password must be at least 8 characters long';
      return;
    }

    if (!/[A-Z]/.test(NewPass)) {
      this.errorMessage = 'Password must contain at least one uppercase letter';
      return;
    }

    if (!/[0-9]/.test(NewPass)) {
      this.errorMessage = 'Password must contain at least one number';
      return;
    }

    if (NewPass !== confirmPass) {
      this.errorMessage = 'Passwords do not match';
      return;
    }
    
    this.isLoading = true;
    
    console.log('Sending password change request...'); // ✅ Debug

    this.setting.changePass(currentPass, NewPass, confirmPass).subscribe({
      next: (response) => {
        console.log('Password change response:', response); // ✅ Debug
        this.successMessage = 'Password changed successfully!';
        this.isChangingPassword = false;
        this.passwordData = { currentPass: '', NewPass: '', confirmPass: ''}
        this.isLoading = false;
        setTimeout(() => this.clearMessages(), 3000);
        this.cdr.detectChanges();
      },
    error: (error) => {
      console.error('Password change error:', error); // ✅ Debug
      this.errorMessage = error?.error?.message || 'Failed to change password';
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  });
}

deleteAccount() {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }
    const confirmText = prompt('Type "DELETE" to confirm account deletion:');
    if (confirmText !== 'DELETE') return;

    this.isLoading = true;

    this.setting.deleteAccount().subscribe({
      next: () => {
        alert('Account deleted successfully');
        this.isLoading = false;
        this.auth.logout().subscribe({
          next: () => this.router.navigate(['/Login']),
          error: () => this.router.navigate(['/Login']) // navigate even on error
        });
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = err?.error?.message || 'Failed to delete account';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
}


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
