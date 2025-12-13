import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Navbar } from '../navbar/navbar';
import { Authservice } from '../../services/AuthService/auth';
import { TasksService } from '../../services/TasksService/tasks-service';
import { Status, Priority } from '../../services/TasksService/tasks-service';
import { FormsModule } from '@angular/forms';



interface Task {
  task_id?: number
  id: number;
  title: string;
  task_description: string;
  priority: Priority;
  task_status: Status;
  assigned_to: string;
  start_date: string;
  due_date: string;
  is_done?: boolean;
  user_id?: number;
}

interface update {
  priority?: Priority;
  task_status?: Status;
  title?: string;
  task_description?: string;
  assigned_to?: string;
}

@Component({
  selector: 'app-tasks-component',
  imports: [CommonModule, Navbar,FormsModule],
  standalone: true,
  templateUrl: './tasks-component.html',
  styleUrls: ['./tasks-component.css']
})
export class TasksComponent implements OnInit {
  isNavbarCollapsed = false;
  tasks: Task[] = [];
  showAddModal = false;
  currentUser = '';
  title  = '';
  task_description = '';
  priority = 'Medium';
  task_status = 'In Progress';
  assigned_to = '';
  start_date = '';
  due_date = '';

  constructor(private auth: Authservice, private task: TasksService,private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    console.log('✅ TasksComponent ngOnInit called');
    this.auth.current().subscribe({
      next: (res: any) => {
      this.currentUser  = res.fullname
      this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
      }
    });
    this.loadTasks();
    
  }

  loadTasks() {
    this.task.getAllTasks().subscribe({
      next: (res: any) => {
        if(res && res.length > 0){
          this.tasks = res.map((task: any) => ({
            id: task.task_id,
            title: task.title,
            task_description: task.task_description,
            priority: task.priority,
            start_date: task.start_date,
            task_status: task.task_status,
            assigned_to: task.assigned_to,
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

  toggleNavbar() {
    this.isNavbarCollapsed = !this.isNavbarCollapsed;
  }

  editTask(taskId: number, updates: update) {
    this.task.editTask(taskId, updates).subscribe({
      next: (updatedTask: any) => {
          const index = this.tasks.findIndex(t => t.id === taskId);

          if(index !== -1){
            this.tasks[index] = {
              id: updatedTask.task_id,
              title: updatedTask.title,
              task_description: updatedTask.task_description,
              priority: updatedTask.priority,
              task_status: updatedTask.task_status,
              assigned_to: updatedTask.assigned_to,
              start_date: updatedTask.start_date,
              due_date: updatedTask.due_date,
            }
            this.cdr.detectChanges();
          }
      },
      error: (error) => console.log(error)
    })
  }


  deleteTask(taskId: number) {
    this.task.deleteTask(taskId).subscribe({
      next: (res: any) => {
        console.log('🗑️ Task deleted', res.message);
        this.tasks = this.tasks.filter((task) => task.id !== taskId);
        this.cdr.detectChanges();
      },
      error:(err) => {
        console.log("Error Deleting Task:", err)
      }
    })
  }


  addTask(title: string, task_description: string, priority:Priority,task_status: Status,assigned_to:string, start_date:string, due_date: string) {
    this.task.createTask(title, task_description,priority,task_status,assigned_to,start_date,due_date)
    .subscribe({
      next: (res: any) => {
        console.log('Task Created')

        this.tasks.push({
          id: res.task.task_id, 
          title: res.task.title,
          task_description: res.task.task_description,
          priority: res.task.priority,
          task_status: res.task.task_status,
          assigned_to: res.task.assigned_to,
          start_date: res.task.start_date,
          due_date: res.task.due_date,
        })
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.log("Adding Failed: ", error.message)
      }
    })
  }


  markDone(taskId: number) {
      this.task.markDone(taskId).subscribe({
        next: (res) => {
          setTimeout(() => {
            this.tasks = this.tasks.filter((task) => task.id !== taskId);
            this.cdr.detectChanges();
          },1000)
          console.log(`Marked Done: ${taskId}`)
        }
      })
  }


  openAddModal(){
    this.showAddModal = true;
  }

  closeAddModal(){
    this.showAddModal = false;
    this.resetForm();
  }

  resetForm(){
    this.title = '';
    this.task_description = '';
    this.priority = 'Medium';
    this.task_status = 'In Progress';
    this.assigned_to = '';
    this.start_date = '';
    this.due_date = '';
  }

  submitTask(){
    if(!this.title || !this.task_description || !this.start_date || !this.due_date){
      alert('Please fill in all required fields');
      return;
    }
  this.addTask(
    this.title,
    this.task_description,
    this.priority as Priority,
    this.task_status as Status,
    this.assigned_to,
    this.start_date,
    this.due_date
  );

  this.closeAddModal();
}

  formatDate(dateString: string): string {
    if (!dateString) return 'No date';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid date';
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  }

  calculateTimeLeft(dueDate: string): string {
    if (!dueDate) return 'No deadline';
    const due = new Date(dueDate);
    if (isNaN(due.getTime())) return 'Invalid date';
    const now = new Date();
    const diff = due.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days < 0) return 'Overdue';
    if (days === 0) return 'Today';
    if (days === 1) return '1 day left';
    return `${days} days left`;
  }

}

