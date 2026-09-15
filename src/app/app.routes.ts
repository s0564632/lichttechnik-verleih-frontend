import { Routes } from '@angular/router';
import { Verwaltung } from './verwaltung/verwaltung';
import { Shop } from './shop/shop';

export const routes: Routes = [
  { path: 'verwaltung', component: Verwaltung },
  { path: 'shop', component: Shop }
];
