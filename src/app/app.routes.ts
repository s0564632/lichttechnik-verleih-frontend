import { Routes } from '@angular/router';
import { HomeComponent } from './HomeComponent/home.component';
import { Verwaltung } from './verwaltung/verwaltung';
import { Shop } from './shop/shop';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'shop', component: Shop },
  { path: 'verwaltung', component: Verwaltung },
  { path: '**', redirectTo: 'home' },
];
