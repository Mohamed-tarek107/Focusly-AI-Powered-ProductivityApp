import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Navbar } from '../navbar/navbar';
import { Authservice } from '../../services/AuthService/auth';
import { AccountSettingsService } from '../../services/AccountSettings/account-settings';
import { Priority, Status, TasksService } from '../../services/TasksService/tasks-service';



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
  imports: [Navbar, CommonModule, FormsModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit{

  constructor(private user: Authservice, private cdr: ChangeDetectorRef, private setting: AccountSettingsService, private task: TasksService){}
  currentUser = '';
  progressPercentage = 0;
  currentMonth = '';
  dayHeaders = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
  calendarDates = [0, 0, 0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];
  isCalendarOpen = false;

  tasks = [
    {
      timeLeft: '',
      title: '',
      task_description: '',
      priority: '',
      secondaryTag: null,
      due_date: '',
      time: '',
      is_done: false
    }
  ];

  Todos = [
    { name: '', is_done: true }
  ];



  ngOnInit(): void {
    this.user.current().subscribe({
      next: (data) => {
        this.currentUser = data.fullname;
      }
    })
    this.loadTasks();
    this.calcuateProgress();
    this.setCurrentMonth();
  }

calcuateProgress(){
    const total = this.tasks.length + this.Todos.length;
    const completedtasks = this.tasks.filter(task => task.is_done).length;
    const completeTodos = this.Todos.filter(task => task.is_done).length;
    const completed = completeTodos + completedtasks
    
    
    if(total > 0){
      this.progressPercentage = Math.round(( completed / total) * 100) 
    }else{
      this.progressPercentage = 0;
    }
  }
  setCurrentMonth(): void {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                    'July', 'August', 'September', 'October', 'November', 'December'];
    const currentDate = new Date();
    this.currentMonth = months[currentDate.getMonth()];
  }

  toggleCalendar(): void {
    this.isCalendarOpen = !this.isCalendarOpen;
  }

  loadTasks() {
    this.task.getAllTasks().subscribe({
      next: (res: any) => {
        if(res && res.length > 0){
          this.tasks = res.slice(0,2).map((task: any) => ({
            title: task.title,
            task_description: task.task_description,
            priority: task.priority,
            start_date: task.start_date,
            task_status: task.task_status,
            due_date: task.due_date,
            is_done: task.is_done == 1,
          }))
          console.log('✅ Tasks loaded:', this.tasks);
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        console.error('❌ Error fetching tasks:', err);
      }
    })
  }

}