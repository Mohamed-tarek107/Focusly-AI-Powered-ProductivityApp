import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Navbar } from '../navbar/navbar';
import { Authservice } from '../../services/AuthService/auth';
import { AccountSettingsService } from '../../services/AccountSettings/account-settings';
import { Priority, Status } from '../../services/TasksService/tasks-service';



interface Task {
  task_id?: number
  id?: number;
  title?: string;
  task_description?: string;
  priority?: Priority;
  task_status?: Status;
  assigned_to?: string;
  start_date?: string;
  due_date?: string;
  is_done?: boolean;
  user_id?: number;
}


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [Navbar, CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit{

  constructor(private user: Authservice, private cdr: ChangeDetectorRef, private setting: AccountSettingsService){}
  currentUser = '';
  progressPercentage = 0;
  currentMonth = '';
  tasks: Task[] = [];
  dayHeaders = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
  calendarDates = [0, 0, 0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];

  upcomingTasks = [
    {
      timeLeft: '',
      title: '',
      description: '',
      priority: '',
      secondaryTag: null,
      date: '',
      time: ''
    }
  ];

  taskList = [
    { name: '', completed: true }
  ];
  ngOnInit(): void {
    this.user.current().subscribe({
      next: (data) => {
        this.currentUser = data.fullname;
      }
    })
  }


  calcuateProgress(){
    const total = this.taskList.length;
    const completed = this.taskList.filter(task => task.completed).length;

    if(total > 0){
      this.progressPercentage = Math.round(( completed / total) * 100) 
    }else{
      this.progressPercentage = 0;
    }
  }
}