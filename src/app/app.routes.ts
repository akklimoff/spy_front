import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { StartComponent } from './components/start/start.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { AuthGuard } from './services/auth.guard';
// import { DashboardComponent } from './dashboard/dashboard.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'start', component: StartComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '**', redirectTo: '' },
  // {
  //   path: '',
  //   component: DashboardComponent,
  //   canActivate: [AuthGuard]   // ← только для авторизованных
  // }
];
