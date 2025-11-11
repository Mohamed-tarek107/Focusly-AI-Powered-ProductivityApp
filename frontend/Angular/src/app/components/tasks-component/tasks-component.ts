import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Navbar } from '../navbar/navbar';
import { Authservice } from '../../services/AuthService/auth';
import { TasksService } from '../../services/TasksService/tasks-service';
import { Status, Priority } from '../../services/TasksService/tasks-service';



interface Task {
  id: number;
  title: string;
  task_description: string;
  priority: Priority;
  task_status: Status;
  assigned_to: string;
  startdate: string;
  due_date: string;
  is_done?: boolean;
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
  imports: [CommonModule, Navbar],
  standalone: true,
  templateUrl: './tasks-component.html',
  styleUrls: ['./tasks-component.css'],
})
export class TasksComponent implements OnInit {
  isNavbarCollapsed = false;
  tasks: Task[] = [];
  currentUser = '';
  title  = '';
  task_description = '';
  priority = '';
  task_status = '';
  assigned_to = '';
  start_date = '';
  due_date = '';

  constructor(private auth: Authservice, private task: TasksService) {}

  ngOnInit() {
    console.log('✅ TasksComponent ngOnInit called');
    this.auth.current().subscribe({
      next: (res) => {
      this.currentUser  = res.fullname
      },
      error: (err) => {
        console.error(err);
      }
    });
    this.loadTasks();
    console.log('✅ Tasks loaded:', this.tasks);
  }

  loadTasks() {
    this.task.getAllTasks().subscribe({
      next: (res: any) => {
        if(res && res.length > 0){
          this.tasks = res.map((task: any) => ({
            id: task.task_id,
            title: task.title,
            description: task.task_description,
            priority: task.priority,
            startdate: task.start_date,
            task_status: task.task_status,
            assigned_to: task.assigned_to,
            is_done: task.is_done == 1,
          }))
          console.log('✅ Tasks loaded:', this.tasks);
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
              startdate: updatedTask.start_date,
              due_date: updatedTask.due_date,
            }
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
      },
      error:(err) => {
        console.log("Error Deleting Task:", err)
      }
    })
  }


  addTask(title: string, task_description: string, priority:Priority,task_status: Status,assigned_to:string, start_date:string, due_date: string) {
    this.task.createTask(title, task_description,priority,task_status,assigned_to,start_date,due_date)
    .subscribe({
      next: (res) => {
        console.log('Task Created')

        this.tasks.push({
          id: res.insertId,
          title: title,
          task_description: task_description,
          priority: priority,
          task_status: task_status,
          assigned_to: assigned_to,
          startdate: start_date,
          due_date: due_date,
        })
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
          },1000)
          console.log(`Marked Done: ${taskId}`)
        }
      })
}

    markInProgress(taskId: number) {}
  //   const task = this.tasks.find((task) => task.id === taskId);
  //   if (task) {
  //     console.log('Task marked as In Progress:', task.title);
  //   }
  // }
  

}

