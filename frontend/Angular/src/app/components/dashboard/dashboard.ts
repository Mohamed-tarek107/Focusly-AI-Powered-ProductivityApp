import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Navbar } from '../navbar/navbar';
import { Authservice } from '../../services/AuthService/auth';
import { AccountSettingsService } from '../../services/AccountSettings/account-settings';
import { Priority, Status, TasksService } from '../../services/TasksService/tasks-service';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

interface Task {
  task_id?: number;
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
  styleUrls: ['./dashboard.css'],
})
export class Dashboard implements OnInit, AfterViewInit {
  @ViewChild('productivityChart') productivityChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('completionChart') completionChart!: ElementRef<HTMLCanvasElement>;

  private barChart: Chart | null = null;
  private pieChart: Chart | null = null;

  currentUser = '';
  progressPercentage = 0;
  currentMonth = '';
  dayHeaders = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
  calendarDates = [
    0, 0, 0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23,
    24, 25, 26, 27, 28, 29, 30, 31,
  ];
  isCalendarOpen = false;

  tasks: any[] = [];
  doneTasks: any[] = [];
  weeklyTaskData: number[] = [0, 0, 0, 0, 0, 0, 0];

  constructor(
    private user: Authservice,
    private cdr: ChangeDetectorRef,
    private setting: AccountSettingsService,
    private task: TasksService
  ) {}

  ngOnInit(): void {
    this.user.current().subscribe({
      next: (data) => {
        this.currentUser = data.fullname;
      },
    });

    this.loadTasks();
    this.loadDoneTasks();
    this.setCurrentMonth();
  }

  ngAfterViewInit(): void {
    // Initialize charts with empty data first
    this.createProductivityChart();
    this.createCompletionChart();
  }

  // ----------------- Charts -----------------
  createProductivityChart(): void {
    if (!this.productivityChart) return;

    const ctx = this.productivityChart.nativeElement.getContext('2d');

    this.barChart = new Chart(ctx!, {
      type: 'bar',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
          {
            label: 'Tasks Completed',
            data: this.weeklyTaskData,
            backgroundColor: 'rgba(91, 92, 255, 0.6)',
            borderColor: 'rgba(91, 92, 255, 1)',
            borderWidth: 1,
            borderRadius: 8,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: { stepSize: 1 },
          },
        },
        plugins: { legend: { display: false } },
      },
    });
  }

  createCompletionChart(): void {
    if (!this.completionChart) return;

    const ctx = this.completionChart.nativeElement.getContext('2d');

    this.pieChart = new Chart(ctx!, {
      type: 'doughnut',
      data: {
        labels: ['Completed', 'In Progress'],
        datasets: [
          {
            data: [this.doneTasks.length, this.tasks.length - this.doneTasks.length],
            backgroundColor: ['rgba(76, 175, 80, 0.8)', 'rgba(91, 92, 255, 0.8)'],
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: { padding: 15, font: { size: 12 } },
          },
        },
      },
    });
  }

  updateCharts(): void {
    if (this.barChart) {
      this.barChart.data.datasets[0].data = this.weeklyTaskData;
      this.barChart.update();
    }

    if (this.pieChart) {
      this.pieChart.data.datasets[0].data = [
        this.doneTasks.length,
        this.tasks.length - this.doneTasks.length,
      ];
      this.pieChart.update();
    }
  }

  // ----------------- Task Data -----------------
  loadTasks(): void {
    this.task.getAllTasks().subscribe({
      next: (res: any) => {
        if (res && res.length > 0) {
          this.tasks = res.map((task: any) => ({
            task_id: task.task_id || task.id,
            title: task.title,
            task_description: task.task_description,
            priority: task.priority,
            task_status: task.task_status,
            start_date: task.start_date,
            due_date: task.due_date, // keep raw date for calculations
            is_done: task.is_done == 1 || task.is_done === true,
          }));
          this.calculateWeeklyData(this.tasks.filter((t) => t.is_done));
          this.calcuateProgress();
          this.updateCharts();
          this.cdr.detectChanges();
        } else {
          this.tasks = [];
        }
      },
      error: (err) => {
        console.error(err);
        this.tasks = [];
      },
    });
  }

  loadDoneTasks(): void {
    this.task.getDoneTasks().subscribe({
      next: (res: any) => {
        if (res && res.length > 0) {
          this.doneTasks = res.map((task: any) => ({
            task_id: task.task_id || task.id,
            title: task.title,
            task_description: task.task_description,
            priority: task.priority,
            task_status: task.task_status,
            start_date: task.start_date,
            due_date: task.due_date, // raw date
            is_done: true,
          }));
          this.calculateWeeklyData(this.doneTasks);
          this.calcuateProgress();
          this.updateCharts();
          this.cdr.detectChanges();
        } else {
          this.doneTasks = [];
        }
      },
      error: (err) => {
        console.error(err);
        this.doneTasks = [];
      },
    });
  }

  calculateWeeklyData(allDoneTasks: any[]): void {
    this.weeklyTaskData = [0, 0, 0, 0, 0, 0, 0];

    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + 1); // Monday

    allDoneTasks.forEach((task) => {
      if (task.due_date) {
        const taskDate = new Date(task.due_date);
        if (isNaN(taskDate.getTime())) return;

        const diffDays = Math.floor(
          (taskDate.getTime() - startOfWeek.getTime()) / (1000 * 60 * 60 * 24)
        );
        if (diffDays >= 0 && diffDays < 7) {
          this.weeklyTaskData[diffDays]++;
        }
      }
    });
  }

  calcuateProgress(): void {
    const total = this.tasks.length;
    const completed = this.doneTasks.length;
    this.progressPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  }

  // ----------------- Utilities -----------------
  setCurrentMonth(): void {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    const currentDate = new Date();
    this.currentMonth = months[currentDate.getMonth()];
  }

  toggleCalendar(): void {
    this.isCalendarOpen = !this.isCalendarOpen;
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
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  }

  markTaskDone(taskId: number): void {
    if (!taskId) {
      console.error('❌ No task ID provided');
      return;
    }
  }
}
