import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


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

  private taskApi = 'http://localhost:3000/api/tasks';

    constructor(private http: HttpClient){}


    getAllTasks(){
      return this.http.get(`${this.taskApi}/getAllTasks`)
    }

    getTask(id: number){
      return this.http.get(`${this.taskApi}/getTask/${id}`)
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
        return this.http.post(`${this.taskApi}/createTask`, 
        { title, task_description, priority, task_status, assigned_to, start_date, due_date }
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
      return this.http.put(`${this.taskApi}/editTask/${id}`, updates)
    } 


    
    deleteTask(id: number){
      return this.http.delete(`${this.taskApi}/deleteTask/${id}`)
    }

    markDone(id: number){
      return this.http.put(`${this.taskApi}/markDone/${id}`, {})
    }


    getDoneTasks(){
      return this.http.get(`${this.taskApi}/getDoneTasks`)
    }
}
