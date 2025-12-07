import { Component } from '@angular/core';
import { Navbar } from "../navbar/navbar";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Rating } from '../../services/AccountSettings/account-settings';

@Component({
  selector: 'app-help-desk',
  imports: [Navbar,CommonModule,FormsModule],
  templateUrl: './help-desk.html',
  styleUrl: './help-desk.css'
})
export class HelpDesk {
  currentUser: string = 'User Name';
  rating: number = 0;
  feedback: string = '';
  ratingText: string = '';
  ratingClass: string = '';

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
