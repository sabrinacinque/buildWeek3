import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { CucinaComponent } from './cucina/cucina.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  {
    path: 'cucina',
    component: CucinaComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
