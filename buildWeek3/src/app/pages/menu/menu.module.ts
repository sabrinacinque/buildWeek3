import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MenuRoutingModule } from './menu-routing.module';
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


@NgModule({
  declarations: [
    MenuComponent,
    AntipastiComponent,
    ZuppeComponent,
    PrimiComponent,
    HosomakiComponent,
    UramakiComponent,
    TemakiComponent,
    SushiComponent,
    SecondiComponent,
    BibiteComponent
  ],
  imports: [
    CommonModule,
    MenuRoutingModule
  ]
})
export class MenuModule { }
