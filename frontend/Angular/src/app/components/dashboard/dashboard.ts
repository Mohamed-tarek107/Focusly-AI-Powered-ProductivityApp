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

  tasks: any[] = [];
  doneTasks: any[] = [];


ngOnInit(): void {
    this.user.current().subscribe({
      next: (data) => {
        this.currentUser = data.fullname;
      }
    })


    this.loadTasks();
    this.calcuateProgress();
    this.setCurrentMonth();
    this.loadDoneTasks()
    this.cdr.detectChanges();
  }

calcuateProgress(){
    const total = this.tasks.length + this.doneTasks.length; ;
    const completed = this.doneTasks.length;
    
    if(total > 0){
      this.progressPercentage = Math.round((completed / total) * 100) 
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
            task_id: task.task_id || task.id,
            timeLeft: this.calculateTimeLeft(task.due_date),
            title: task.title,
            task_description: task.task_description,
            priority: task.priority,
            secondaryTag: task.task_status || null,
            start_date: task.start_date,
            task_status: task.task_status,
            due_date: this.formatDate(task.due_date),
            time: this.formatTime(task.due_date),
            is_done: task.is_done == 1 || task.is_done === true,
          }));
          console.log('✅ Tasks loaded:', this.tasks);
          
          this.cdr.detectChanges();
        }else {
          console.log('⚠️ No tasks found or invalid response');
          this.tasks = [];
        }
      },
      error: (err) => {
        console.error('❌ Error fetching tasks:', err);
        this.tasks = [];
      }
    })
  }


loadDoneTasks(): void {
    this.task.getDoneTasks().subscribe({
      next: (res: any) => {
        if(res && res.length > 0){
          this.doneTasks = res.slice(0, 2).map((task: any) => ({
            task_id: task.task_id || task.id,
            timeLeft: this.calculateTimeLeft(task.due_date),
            title: task.title,
            task_description: task.task_description,
            priority: task.priority,
            secondaryTag: task.task_status || null,
            start_date: task.start_date,
            task_status: task.task_status,
            due_date: this.formatDate(task.due_date),
            time: this.formatTime(task.due_date),
            is_done: true,
          }));
          console.log('✅ Done tasks loaded:', this.doneTasks);
          this.calcuateProgress();
          this.cdr.detectChanges();
        } else {
          console.log('⚠️ No done tasks found');
          this.doneTasks = [];
        }
      },
      error: (err) => {
        console.error('❌ Error fetching done tasks:', err);
        this.doneTasks = [];
      }
    });
  }

  markTaskDone(taskId: number): void {
    if (!taskId) {
      console.error('❌ No task ID provided');
      return;
    }
  }

  calculateTimeLeft(dueDate: string): string {
    if (!dueDate) return 'No deadline';
    
    const due = new Date(dueDate);
    const now = new Date();
    const diff = due.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days < 0) return 'Overdue';
    if (days === 0) return 'Today';
    if (days === 1) return '1 day';
    return `${days} days`;
  }


  formatDate(dateString: string): string {
    if (!dateString) return 'No date';
    
    const date = new Date(dateString);
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const day = date.getDate();
    return `${month} ${day}`;
  }

  formatTime(dateString: string): string {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  }
}