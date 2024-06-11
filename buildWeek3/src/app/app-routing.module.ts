import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { MenuComponent } from './pages/menu/menu.component';


const routes: Routes = [
  { path: 'homepage', component: HomepageComponent },
  { path: 'menu', loadChildren: () => import('./pages/menu/menu.module').then(m => m.MenuModule) },
  { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },
  { path: 'page404', loadChildren: () => import('./pages/page404/page404.module').then(m => m.Page404Module) },
  { path: '**', redirectTo: '/homepage' },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
