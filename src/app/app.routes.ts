import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { Shop } from './shop/shop';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'shop', component: Shop },
  { path: '**', redirectTo: 'home' },
];
