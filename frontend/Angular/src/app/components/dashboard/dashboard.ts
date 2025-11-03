import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Navbar } from '../navbar/navbar';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [Navbar, CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {
  currentUser = 'Mohamed Tarek';
  progressPercentage = 89;
  currentMonth = 'March 2024';

  dayHeaders = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
  calendarDates = [0, 0, 0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];

  upcomingTasks = [
    {
      timeLeft: '10 Min Left',
      title: 'Brainstorming',
      description: 'Brainstorming with team on slothy app',
      priority: 'Medium',
      secondaryTag: null,
      date: '23 Mar 2024',
      time: '12:45 pm'
    },
    {
      timeLeft: '58 Min Left',
      title: 'Re-branding Discussion',
      description: 'Discussion on re-branding of dermo Brand',
      priority: 'High',
      secondaryTag: 'Medium',
      date: '23 Mar 2024',
      time: '1:30 pm'
    }
  ];

  taskList = [
    { name: 'Schedule post Dusk&Dawn', completed: true },
    { name: 'Design post for Holi', completed: true },
    { name: 'Brainstorming new project', completed: false },
    { name: 'Re-Branding Discussion', completed: false },
    { name: 'User Research', completed: false }
  ];
}