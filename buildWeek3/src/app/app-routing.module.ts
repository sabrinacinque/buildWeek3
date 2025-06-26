import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { GuestGuard } from './auth/guest.guard';
import { AuthGuard } from './auth/auth.guard';
import { MenuChoiceComponent } from './pages/menu-choice/menu-choice.component';
import { StoricoOrdiniComponent } from './shared/storico-ordini/storico-ordini.component';

const routes: Routes = [
  { path: '', component: MenuChoiceComponent },
  { path: 'homepage', component: HomepageComponent },
  { path: 'storico-ordini', component: StoricoOrdiniComponent }, // 🆕 AGGIUNGI QUESTA RIGA
  {
    path: 'menu',
    loadChildren: () =>
      import('./pages/menu/menu.module').then((m) => m.MenuModule),
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
    canActivate: [GuestGuard],
    canActivateChild: [GuestGuard],
  },
  {
    path: 'reviews',
    loadChildren: () =>
      import('./pages/reviews/reviews.module').then((m) => m.ReviewsModule),
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./pages/dashboard/dashboard.module').then(
        (m) => m.DashboardModule
      ),
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
  },
  {
    path: '**',
    loadChildren: () =>
      import('./pages/page404/page404.module').then((m) => m.Page404Module),
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'top',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
