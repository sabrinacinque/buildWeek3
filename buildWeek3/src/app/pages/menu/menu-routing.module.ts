import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuComponent } from './menu.component';
import { AntipastiComponent } from './antipasti/antipasti.component';
import { ZuppeComponent } from './zuppe/zuppe.component';
import { PrimiComponent } from './primi/primi.component';
import { HosomakiComponent } from './hosomaki/hosomaki.component';
import { UramakiComponent } from './uramaki/uramaki.component';
import { TemakiComponent } from './temaki/temaki.component';
import { SushiComponent } from './sushi/sushi.component';
import { SecondiComponent } from './secondi/secondi.component';
import { BibiteComponent } from './bibite/bibite.component';
import { DolciComponent } from './dolci/dolci.component';

const routes: Routes = [
  { path: '', component: MenuComponent },
  { path: 'antipasti', component: AntipastiComponent },
  { path: 'zuppe', component: ZuppeComponent },
  { path: 'primi', component: PrimiComponent },
  { path: 'hosomaki', component: HosomakiComponent },
  { path: 'uramaki', component: UramakiComponent },
  { path: 'temaki', component: TemakiComponent },
  { path: 'sushi', component: SushiComponent },
  { path: 'secondi', component: SecondiComponent },
  { path: 'bibite', component: BibiteComponent },
  { path: 'dolci', component: DolciComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class MenuRoutingModule { }
