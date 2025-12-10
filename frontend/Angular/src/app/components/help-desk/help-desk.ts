import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Navbar } from "../navbar/navbar";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AccountSettingsService } from '../../services/AccountSettings/account-settings';
import { Authservice } from '../../services/AuthService/auth';
import { Rating } from '../../services/AccountSettings/account-settings';

@Component({
  selector: 'app-help-desk',
  imports: [Navbar,CommonModule,FormsModule],
  templateUrl: './help-desk.html',
  styleUrl: './help-desk.css'
})
export class HelpDesk implements OnInit{
  currentUser: string = '';
  rating: number = 0;
  feedback: string = '';
  ratingText: string = '';
  ratingClass: string = '';
  errorMessage: string = ''

  constructor(private user: Authservice, private cdr: ChangeDetectorRef, private setting: AccountSettingsService){}

  
  ngOnInit() {
    this.user.current().subscribe({
      next: (data) => {
          console.log('User data received:', data); // Debug 
          this.currentUser = data.fullname
          this.cdr.detectChanges();
      },
      error: (err) => {
          console.error('Error fetching user data:', err); // Debug
          this.errorMessage = 'Failed to fetch user data';
          this.cdr.detectChanges();
      }
    });
  }
  setRating(star: number): void {
    this.rating = star;

    const ratings: { [key: number]: { text: string, class: string } } = {
      5: { text: 'Perfect', class: 'perfect' },
      4: { text: 'Very Good', class: 'very-good' },
      3: { text: 'Average', class: 'average' },
      2: { text: 'Below Average', class: 'below-average' },
      1: { text: 'Horrible', class: 'horrible' },
    };

    if (ratings[star]) {
      this.ratingText = ratings[star].text;
      this.ratingClass = ratings[star].class;
    }
  }

  submitFeedback(): void {
    if(this.rating == 0){
      alert('Please select a rating before submitting!');
      return;
    }

    this.setting.takeFeedback(this.feedback, this.rating as unknown as Rating).subscribe({
      next: (res) => {
        console.log('Feedback submitted successfully:', res)
        alert('Thank you for your feedback!');


         // Reset form
        this.rating = 0;
        this.feedback = '';
        this.ratingText = '';
        this.ratingClass = '';
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error submitting feedback:', error);
        alert('Failed to submit feedback. Please try again.');
        this.cdr.detectChanges();
      }
    })
  }
}
