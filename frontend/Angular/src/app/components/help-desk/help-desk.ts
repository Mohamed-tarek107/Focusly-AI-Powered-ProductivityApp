import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Navbar } from "../navbar/navbar";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Rating } from '../../services/AccountSettings/account-settings';
import { Authservice } from '../../services/AuthService/auth';

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

  constructor(private user: Authservice, private cdr: ChangeDetectorRef){}

  
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
    // Call your service here: this.yourService.takeFeedback(this.feedback, this.ratingText as Rating)
  }
}
