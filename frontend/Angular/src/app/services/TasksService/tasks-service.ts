import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

export enum Priority {
      Low = 'Low',
      Medium = 'Medium',
      High = 'High',
      Critical = 'Critical'
    }

export enum Status {
      InProgress = 'In Progress',
      Done = 'Done',
      Overdue = 'Overdue',
      Postponed = 'Postponed'
    }

@Injectable({
  providedIn: 'root'
})
export class TasksService {

    private readonly tasksApi = `${environment.apiUrl}/tasks`;

    constructor(private http: HttpClient){}

    getAllTasks(){
      
      return this.http.get(`${this.tasksApi}/getAllTasks`,
        { withCredentials: true }
      );
    
    }

    getTask(id: number){
      return this.http.get(`${this.tasksApi}/getTask/${id}`)
    } 
    
    createTask(
        title : string, 
        task_description : string,
        priority : Priority,
        task_status: Status,
        assigned_to : string, 
        start_date: string, 
        due_date: string
      ){
        
        return this.http.post(`${this.tasksApi}/createTask`, 
        { title, task_description, priority, task_status, assigned_to, start_date, due_date },
        { withCredentials: true }
      )
    } 
    


    editTask(id: number, updates: Partial<{
      priority: Priority;
      task_status: Status;
      title: string;
      task_description: string;
      assigned_to: string;
    }> 
  ){
      
      return this.http.put(`${this.tasksApi}/editTask/${id}`, updates,
        { withCredentials: true }
      )
    } 


    
    deleteTask(id: number){
      return this.http.delete(`${this.tasksApi}/deleteTask/${id}`,
        { withCredentials: true }
      )
    }

    markDone(id: number){
      return this.http.put(`${this.tasksApi}/markDone/${id}`, {}, 
        { withCredentials: true }
      )
    }


    getDoneTasks(){
      return this.http.get(`${this.tasksApi}/getDoneTasks`,
        { withCredentials: true }
      )
    }
}
