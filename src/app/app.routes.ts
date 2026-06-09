import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guards';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
    },
    {
        path: 'home',
        loadComponent: () => import('./home/home').then(m => m.Home)
    },
    {
        path: 'contact',
        loadComponent: () => import('./contact/contact').then(m => m.Contact)
    },
    {
        path: 'band',
        loadComponent: () => import('./band/band').then(m => m.Band)
    },
    {
        path: 'tour',
        loadComponent: () => import('./tour/tour').then(m => m.TourComponent)
    },
    {
        path: 'admin',
        canActivate: [AuthGuard],
        loadChildren: () => import('./admin/admin-module').then(m => m.adminRoutes)
    },
    {
        path: 'login',
        loadComponent: () => import('./login.component/login.component').then(m => m.LoginComponent)
    }
];
