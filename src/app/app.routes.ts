import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { BandComponent } from './band/band.component';
import { TourComponent } from './tour/tour.component';
import { ContactComponent } from './contact/contact.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'band', component: BandComponent },
  { path: 'tour', component: TourComponent },
  { path: 'contact', component: ContactComponent },
];
