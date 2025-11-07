import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Navbar } from '../navbar/navbar';

interface Task {
  id: number;
  title: string;
  description: string;
  priority: string;
  date: string;
  time: string;
  timeLeft: string;
}

@Component({
  selector: 'app-tasks-component',
  imports: [CommonModule, Navbar],
  standalone: true,
  templateUrl: './tasks-component.html',
  styleUrls: ['./tasks-component.css'],
})
export class TasksComponent implements OnInit {
  isNavbarCollapsed = false;
  tasks: Task[] = [];
  currentUser = 'Mohamed Tarek';

  constructor() {
    console.log('✅ TasksComponent CONSTRUCTOR called');
  }

  ngOnInit() {
    console.log('✅ TasksComponent ngOnInit called');
    this.loadTasks();
    console.log('✅ Tasks loaded:', this.tasks);
  }

  loadTasks() {
    this.tasks = [
      {
        id: 1,
        title: 'Design System Update',
        description:
          'Create and document a comprehensive design system for the Focusly application with color palettes, typography, and component guidelines.',
        priority: 'High',
        date: '2024-01-15',
        time: '2:30 PM',
        timeLeft: '2h 30m',
      },
      {
        id: 2,
        title: 'Meow',
        description:
          'Meow Meow Meow Meow MeowMeow MeowMeowMeowMeowMeowMeowMeowMeowMeow Meow',
        priority: 'Meow',
        date: '2026-01-15',
        time: '10:30 PM',
        timeLeft: '10h 30m',
      },
      {
        id: 3,
        title: 'Tarek bs title test',
        description:
          'Tarek bs description-Tarek bs description-Tarek bs description-Tarek bs description-Tarek bs description-Tarek bs description-Tarek bs description',
        priority: 'Tarek bs priority',
        date: '2026-01-15',
        time: '10:30 PM',
        timeLeft: '9h 30m',
      },
      {
        id: 4,
        title: 'TEST',
        description:
          'TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST',
        priority: 'low',
        date: '2026-01-15',
        time: '10:30 PM',
        timeLeft: '18h 30m',
      },
      {
        id: 5,
        title: 'tarek test 6',
        description:
          'TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST',
        priority: 'medium',
        date: '2026-01-15',
        time: '10:30 PM',
        timeLeft: '5h 30m',
      },
      {
        id: 5,
        title: 'tarek test 6',
        description:
          'TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST',
        priority: 'Low',
        date: '2026-01-15',
        time: '10:30 PM',
        timeLeft: '1h 30m',
      }
    ];
  }

  toggleNavbar() {
    this.isNavbarCollapsed = !this.isNavbarCollapsed;
  }

  editTask(taskId: number) {
    console.log('Editing task:', taskId);
  }

  deleteTask(taskId: number) {
    this.tasks = this.tasks.filter((task) => task.id !== taskId);
  }

  addTask(newTask: Task) {
    this.tasks.push(newTask);
  }


  markInProgress(taskId: number) {
    const task = this.tasks.find((task) => task.id === taskId);
    if (task) {
      console.log('Task marked as In Progress:', task.title);
    }
  }
  
  markDone(taskId: number) {
    const task = this.tasks.find((task) => task.id === taskId);
    if (task) {
      console.log('Task marked as Done:', task.title);
    }
  }
}

