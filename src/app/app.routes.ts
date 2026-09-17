import { Routes } from '@angular/router';
import { Verwaltung } from './verwaltung/verwaltung';
import { Shop } from './shop/shop';
import { Startseite } from './startseite/startseite';

export const routes: Routes = [
    { path: '', redirectTo: 'startseite', pathMatch: 'full' },
    { path: 'shop', component: Shop },
    { path: 'verwaltung', component: Verwaltung },
    { path: 'startseite', component: Startseite },
    { path: '**', redirectTo: 'startseite' }
];
