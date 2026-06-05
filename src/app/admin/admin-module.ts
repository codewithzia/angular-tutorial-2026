import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TourList } from './tour-list/tour-list';

export const adminRoutes:Routes = [
  {
    path: 'tour-list',
    loadComponent: () => import('./tour-list/tour-list').then(m => m.TourList),
  },
  {
    path: '',
    redirectTo: 'tour-list',
    pathMatch: 'full',
  },
];


@NgModule({
  declarations: [],
  imports: [CommonModule,RouterModule.forChild(adminRoutes),TourList],
})

export class AdminModule {}
