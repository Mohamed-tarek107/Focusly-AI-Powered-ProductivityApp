import { Routes } from '@angular/router';
import { Register } from './components/Auth/register/register';
import { Login } from './components/Auth/login/login';
import { ForgetPage } from './components/Auth/forget-page/forget-page';
import { Dashboard } from './components/dashboard/dashboard';
import { TasksComponent } from './components/tasks-component/tasks-component';


export const routes: Routes = [
    { path: '', redirectTo: 'Login', pathMatch: 'full' },
    { path: 'Login', component: Login },
    { path: 'Register', component: Register },
    { path: 'Forget', component: ForgetPage},
    { path: 'Dashboard', component: Dashboard},
    { path: 'Tasks', component: TasksComponent}
];
