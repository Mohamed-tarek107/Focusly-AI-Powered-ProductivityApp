import { Routes } from '@angular/router';
import { Register } from './components/Auth/register/register';
import { Login } from './components/Auth/login/login';
import { ForgetPage } from './components/Auth/forget-page/forget-page';
import { Dashboard } from './components/dashboard/dashboard';
import { TasksComponent } from './components/tasks-component/tasks-component';
import { AiAssistant } from './components/AiAssistant/ai-assistant';
import { AccountSettings } from './components/account-settings/account-settings';
import { HelpDesk } from './components/help-desk/help-desk';
import { NotfoundPage } from './components/notfound-page/notfound-page';
import { authGuard } from './guards/auth.guard'

export const routes: Routes = [
    { path: '', redirectTo: 'Login', pathMatch: 'full' },
    { path: 'Login', component: Login },
    { path: 'Register', component: Register },
    { path: 'Forget', component: ForgetPage},
    { path: 'Dashboard', component: Dashboard, canActivate: [authGuard]},
    { path: 'Tasks', component: TasksComponent, canActivate: [authGuard]},
    { path: 'AiAssistant', component: AiAssistant, canActivate: [authGuard]},
    { path: 'settings', component: AccountSettings, canActivate: [authGuard]},
    { path: 'help', component: HelpDesk, canActivate: [authGuard]},
    { path: '**', component: NotfoundPage }
];
