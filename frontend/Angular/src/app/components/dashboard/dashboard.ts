import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild, AfterViewInit, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Navbar } from '../navbar/navbar';
import { Authservice } from '../../services/AuthService/auth';
import { AccountSettingsService } from '../../services/AccountSettings/account-settings';
import { Priority, Status, TasksService } from '../../services/TasksService/tasks-service';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

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
  currentYear = 0;
  dayHeaders = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
  calendarDates: Array<{ day: number; isCurrentMonth: boolean; isToday: boolean; hasDeadline: boolean }> = [];
  today = new Date();
  isCalendarOpen = false;
  

  isUserDropdownOpen = false;

  tasks: any[] = [];
  doneTasks: any[] = [];
  allDoneTasks: any[] = []; 
  allTasks: any[] = []; 
  weeklyTaskData: number[] = [0, 0, 0, 0, 0, 0, 0];

  constructor(
    private auth: Authservice,
    private cdr: ChangeDetectorRef,
    private task: TasksService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cdr.detectChanges();
    this.auth.current().subscribe({
      next: (data) => {
        this.currentUser = data.fullname;
      },
    });

    this.loadDoneTasks();
    this.setCurrentMonth();
    this.generateCalendar();
  }

  ngAfterViewInit(): void {}

  // ----------------- User Dropdown -----------------
  toggleUserDropdown() {
    this.isUserDropdownOpen = !this.isUserDropdownOpen;
  }

  // Close dropdown when clicking outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const clickedInside = target.closest('.user-menu') || target.closest('.user-dropdown');
    
    if (!clickedInside && this.isUserDropdownOpen) {
      this.isUserDropdownOpen = false;
    }
  }

// Logout handler
handleLogout() {
  console.log('Logout clicked');
  try {
      this.isUserDropdownOpen = false;
      this.auth.logout().subscribe({
        next: () => this.router.navigate(['/Login']),
        error: () => this.router.navigate(['/Login']) 
    });
      this.cdr.detectChanges();
  } catch (error) {
    console.log("Error logging out", error)
  }

}

  // ----------------- Charts -----------------
  createProductivityChart(): void {
    if (!this.productivityChart) return;

    const ctx = this.productivityChart.nativeElement.getContext('2d');

    // Destroy existing chart if it exists
    if (this.barChart) {
      this.barChart.destroy();
    }

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
    
    const completed = this.allDoneTasks.length;
    const inProgress = this.allTasks.filter(t => !t.is_done).length;

    // Ensure no negative values
    const completedCount = Math.max(0, completed);
    const inProgressCount = Math.max(0, inProgress);

    // Destroy existing chart if it exists
    if (this.pieChart) {
      this.pieChart.destroy();
    }

    this.pieChart = new Chart(ctx!, {
      type: 'doughnut',
      data: {
        labels: ['Completed', 'In Progress'],
        datasets: [
          {
            data: [completedCount, inProgressCount],
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
      const completed = this.allDoneTasks.length;
      const inProgress = this.allTasks.filter(t => !t.is_done).length;
      
      const completedCount = Math.max(0, completed);
      const inProgressCount = Math.max(0, inProgress);
      
      this.pieChart.data.datasets[0].data = [completedCount, inProgressCount];
      this.pieChart.update();
    }
  }

  // ----------------- Task Data -----------------
  loadTasks(): void {
    this.task.getAllTasks().subscribe({
      next: (res: any) => {
        if (res && res.length > 0) {
          const incompleteTasks = res.map((task: any) => ({
            task_id: task.task_id || task.id,
            title: task.title,
            task_description: task.task_description,
            priority: task.priority,
            task_status: task.task_status,
            start_date: task.start_date,
            due_date: task.due_date,
            is_done: false,
          }));
          
          // Merge with done tasks to get all tasks
          this.allTasks = [...incompleteTasks, ...this.allDoneTasks];
          
          // Only show first 3 incomplete tasks
          this.tasks = incompleteTasks.slice(0, 3);
        } else {
          this.tasks = [];
          // Keep done tasks in allTasks
          this.allTasks = [...this.allDoneTasks];
        }
        
        this.calculateProgress();
        this.generateCalendar(); // Regenerate calendar with updated tasks
        
        // Create or update charts after all data is loaded
        setTimeout(() => {
          if (!this.barChart) {
            this.createProductivityChart();
          } else {
            this.updateCharts();
          }
          if (!this.pieChart) {
            this.createCompletionChart();
          } else {
            this.updateCharts();
          }
        }, 100);
        
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.tasks = [];
        this.allTasks = [...this.allDoneTasks];
        this.calculateProgress();
        this.generateCalendar(); // Regenerate calendar with updated tasks
        
        // Still create charts even on error
        setTimeout(() => {
          if (!this.barChart) {
            this.createProductivityChart();
          }
          if (!this.pieChart) {
            this.createCompletionChart();
          }
        }, 100);
      },
    });
  }

  loadDoneTasks(): void {
    this.task.getDoneTasks().subscribe({
      next: (res: any) => {
        if (res && res.length > 0) {
          this.allDoneTasks = res.map((task: any) => ({
            task_id: task.task_id || task.id,
            title: task.title,
            task_description: task.task_description,
            priority: task.priority,
            task_status: task.task_status,
            start_date: task.start_date,
            due_date: task.due_date,
            is_done: true,
          }));
          
          // Show first 3 done tasks in UI
          this.doneTasks = this.allDoneTasks.slice(0, 3);
        } else {
          this.doneTasks = [];
          this.allDoneTasks = [];
        }
        
        // Calculate weekly data from all done tasks
        this.calculateWeeklyData(this.allDoneTasks);
        
        // Now load incomplete tasks (which will merge with done tasks)
        this.loadTasks();
      },
      error: (err) => {
        console.error(err);
        this.doneTasks = [];
        this.allDoneTasks = [];
        // Still load incomplete tasks even if done tasks fail
        this.loadTasks();
      },
    });
  }

  calculateWeeklyData(allDoneTasks: any[]): void {
    // Initialize all days to 0
    this.weeklyTaskData = [0, 0, 0, 0, 0, 0, 0];

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Get start of week (Monday)
    const startOfWeek = new Date(today);
    const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Convert Sunday (0) to 6
    startOfWeek.setDate(today.getDate() - daysToMonday);
    startOfWeek.setHours(0, 0, 0, 0);

    // Get end of week (Sunday)
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    allDoneTasks.forEach((task) => {
      // Use due_date as completion date (since we don't have a completion_date field)
      // If due_date is in the future, use today's date instead
      let completionDate: Date;
      if (task.due_date) {
        const dueDate = new Date(task.due_date);
        if (!isNaN(dueDate.getTime())) {
          dueDate.setHours(0, 0, 0, 0);
          // If due date is in the future, use today as completion date
          completionDate = dueDate > today ? today : dueDate;
        } else {
          completionDate = today;
        }
      } else {
        completionDate = today;
      }

      // Check if task was completed this week
      if (completionDate >= startOfWeek && completionDate <= endOfWeek) {
        const diffDays = Math.floor(
          (completionDate.getTime() - startOfWeek.getTime()) / (1000 * 60 * 60 * 24)
        );
        if (diffDays >= 0 && diffDays < 7) {
          this.weeklyTaskData[diffDays]++;
        }
      }
    });
  }

  calculateProgress(): void {
    const total = this.allTasks.length;
    const completedTasks = this.allTasks.filter(task => task.is_done === true || task.is_done === 1).length;
    
    if (total > 0) {
      this.progressPercentage = Math.round((completedTasks / total) * 100);
    } else {
      this.progressPercentage = 0;
    }
  }

  get inProgressTasksCount(): number {
    return this.allTasks.filter(t => !t.is_done).length;
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
    this.currentYear = currentDate.getFullYear();
  }

  generateCalendar(): void {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    
    // Get first day of the month
    const firstDay = new Date(year, month, 1);
    // Get last day of the month
    const lastDay = new Date(year, month + 1, 0);
    
    // Get the day of the week for the first day (0 = Sunday, 1 = Monday, etc.)
    // Convert to Monday = 0 format
    let firstDayOfWeek = firstDay.getDay();
    firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1; // Convert Sunday (0) to 6, Monday (1) to 0, etc.
    
    // Get number of days in the month
    const daysInMonth = lastDay.getDate();
    
    // Get number of days in previous month (for padding)
    const prevMonth = new Date(year, month, 0);
    const daysInPrevMonth = prevMonth.getDate();
    
    // Create a set of days that have deadlines
    const daysWithDeadlines = new Set<number>();
    this.allTasks.forEach(task => {
      if (task.due_date) {
        const dueDate = new Date(task.due_date);
        // Only mark if the deadline is in the current month
        if (dueDate.getFullYear() === year && dueDate.getMonth() === month) {
          daysWithDeadlines.add(dueDate.getDate());
        }
      }
    });
    
    // Clear previous calendar dates
    this.calendarDates = [];
    
    // Add days from previous month (if needed to fill the first week)
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      this.calendarDates.push({
        day: daysInPrevMonth - i,
        isCurrentMonth: false,
        isToday: false,
        hasDeadline: false
      });
    }
    
    // Add days of current month
    const today = new Date();
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = 
        day === today.getDate() &&
        month === today.getMonth() &&
        year === today.getFullYear();
      
      this.calendarDates.push({
        day: day,
        isCurrentMonth: true,
        isToday: isToday,
        hasDeadline: daysWithDeadlines.has(day)
      });
    }
    
    // Add days from next month to fill the last week (if needed)
    const totalCells = this.calendarDates.length;
    const remainingCells = 42 - totalCells; // 6 weeks * 7 days = 42 cells
    for (let day = 1; day <= remainingCells; day++) {
      this.calendarDates.push({
        day: day,
        isCurrentMonth: false,
        isToday: false,
        hasDeadline: false
      });
    }
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
    // Find the task in the tasks array
    const taskIndex = this.tasks.findIndex(t => t.task_id === taskId);
    if (taskIndex === -1) return;

    const task = this.tasks[taskIndex];

    // Call the service to mark task as done
    this.task.markDone(taskId).subscribe({
      next: () => {
        // Update the task in allTasks
        const allTaskIndex = this.allTasks.findIndex(t => t.task_id === taskId);
        if (allTaskIndex !== -1) {
          this.allTasks[allTaskIndex].is_done = true;
        }

        // Remove from tasks array with animation
        this.tasks.splice(taskIndex, 1);

        // Add to done tasks (at beginning, limit to 3)
        task.is_done = true;
        this.doneTasks.unshift(task);
        if (this.doneTasks.length > 3) {
          this.doneTasks.pop();
        }

        // Regenerate calendar after marking task as done
        this.generateCalendar();
        this.loadDoneTasks();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error marking task as done:', err);
      },
    });
  }
}